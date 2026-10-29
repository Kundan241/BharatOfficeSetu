import { supabase } from './supabaseClient';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Infer the document type based on the file name or mime type
 */
export const detectDocumentType = (fileName = '', mimeType = '') => {
  const lower = fileName.toLowerCase();
  if (lower.includes('aadhar') || lower.includes('adgar') || lower.includes('aadhaar')) return 'Aadhar Card';
  if (lower.includes('pan')) return 'PAN Card';
  if (lower.includes('gst')) return 'GST Certificate';
  if (lower.includes('agreement') || lower.includes('draft')) return 'Agreement Draft';
  if (lower.includes('noc')) return 'NOC';
  if (lower.includes('incorporation') || lower.includes('coi')) return 'Incorporation Certificate';
  if (lower.includes('utility') || lower.includes('bill') || lower.includes('electricity')) return 'Utility Bill';
  if (mimeType === 'application/pdf' || lower.endsWith('.pdf')) return 'PDF Document';
  if (mimeType.startsWith('image/') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) return 'KYC Image';
  return 'KYC Document';
};

/**
 * Uploads a document to the private Supabase bucket 'client_documents'
 * Path structure: {clientId}/{fileName}
 * Saves metadata into 'client_documents' Postgres table
 */
export const uploadClientDocument = async ({ clientId, file, documentType }) => {
  if (!clientId) throw new Error('Client ID is required for upload');
  if (!file) throw new Error('File is required for upload');

  // 1. File Type Validation
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();
  const isTypeValid = ALLOWED_EXTENSIONS.includes(fileExt) || ALLOWED_MIME_TYPES.includes(file.type);
  if (!isTypeValid) {
    throw new Error('Invalid file type. Only .pdf, .jpg, and .png files are accepted.');
  }

  // 2. File Size Validation
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  // 3. Construct file path: {clientId}/{fileName}
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `${Date.now()}_${cleanFileName}`;
  const filePath = `${clientId}/${uniqueName}`;

  // 4. Upload to Supabase Storage Bucket: 'client_documents'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('client_documents')
    .upload(filePath, file, {
      contentType: file.type || 'application/octet-stream',
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('[Supabase Storage Upload Error]:', uploadError);
    throw new Error(uploadError.message || 'Failed to upload document to Supabase storage');
  }

  // 5. Generate Signed URL reference (1-year access for private bucket)
  let fileUrl = '';
  const { data: signedData, error: signedError } = await supabase.storage
    .from('client_documents')
    .createSignedUrl(filePath, 60 * 60 * 24 * 365);

  if (signedData?.signedUrl) {
    fileUrl = signedData.signedUrl;
  } else {
    const { data: publicData } = supabase.storage
      .from('client_documents')
      .getPublicUrl(filePath);
    fileUrl = publicData?.publicUrl || '';
  }

  // 6. Infer or set document type
  const docType = documentType || detectDocumentType(file.name, file.type);

  // 7. Insert Metadata Record into Supabase 'client_documents' Postgres Table
  const { data: insertRecord, error: insertError } = await supabase
    .from('client_documents')
    .insert([
      {
        client_id: String(clientId),
        file_name: file.name,
        file_url: fileUrl,
        file_path: filePath,
        document_type: docType,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('[Supabase DB Metadata Insert Error]:', insertError);
    throw new Error(insertError.message || 'Failed to save document metadata in Supabase table');
  }

  return {
    ...insertRecord,
    name: insertRecord.file_name,
    url: insertRecord.file_url,
    path: insertRecord.file_path,
    documentType: insertRecord.document_type
  };
};

/**
 * Fetch documents for a given client from Supabase 'client_documents' table
 */
export const getClientDocuments = async (clientId) => {
  if (!clientId) return [];

  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', String(clientId))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase Fetch Documents Error]:', error);
    throw error;
  }

  return (data || []).map(doc => ({
    ...doc,
    name: doc.file_name,
    url: doc.file_url,
    path: doc.file_path,
    documentType: doc.document_type
  }));
};

/**
 * Generate a fresh signed download URL for private documents
 */
export const getDocumentDownloadUrl = async (doc) => {
  const filePath = doc.file_path || doc.path;
  if (filePath && !filePath.startsWith('http')) {
    try {
      const { data, error } = await supabase.storage
        .from('client_documents')
        .createSignedUrl(filePath, 3600); // 1-hour fresh link

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (e) {
      console.warn('Could not generate signed URL from Supabase:', e);
    }
  }
  return doc.file_url || doc.url;
};

/**
 * Deletes a document from Supabase storage and Postgres table
 */
export const deleteClientDocument = async (documentId, filePath) => {
  // 1. Remove file from Supabase storage if path exists
  if (filePath && !filePath.startsWith('http')) {
    try {
      await supabase.storage
        .from('client_documents')
        .remove([filePath]);
    } catch (err) {
      console.warn('[Supabase Storage Delete Warning]:', err);
    }
  }

  // 2. Remove row from 'client_documents' table
  if (documentId) {
    const { error } = await supabase
      .from('client_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      console.error('[Supabase DB Delete Error]:', error);
      throw error;
    }
  }
};

/**
 * Retrieves associated Google Drive Folder Link for a client
 * Checks:
 * 1. Supabase 'client_documents' where document_type = 'google_drive_folder' or file_url contains drive.google.com
 * 2. Firestore 'clients/{clientId}' profile for driveUrl / driveFolderUrl / googleDriveLink
 */
export const getClientDriveFolder = async (clientId, clientEmail = '', clientName = '') => {
  if (!clientId) return null;

  try {
    // 1. Check Supabase client_documents table
    const { data: driveDoc } = await supabase
      .from('client_documents')
      .select('file_url')
      .eq('client_id', String(clientId))
      .or('document_type.eq.google_drive_folder,file_url.ilike.%drive.google.com%')
      .limit(1)
      .maybeSingle();

    if (driveDoc?.file_url) {
      return driveDoc.file_url;
    }

    // 2. Check Firestore client document
    const snap = await getDoc(doc(db, 'clients', clientId));
    if (snap.exists()) {
      const data = snap.data();
      const driveLink = data.driveFolderUrl || data.googleDriveLink || data.driveUrl || data.drive_url || data.drive_folder_url;
      if (driveLink && typeof driveLink === 'string' && driveLink.includes('drive.google.com')) {
        return driveLink;
      }
    }
  } catch (err) {
    console.error('Error fetching Google Drive link for client:', err);
  }

  return null;
};

/**
 * Associate/save a Google Drive Folder Link to a client in central database
 */
export const saveClientDriveFolder = async (clientId, driveFolderUrl) => {
  if (!clientId || !driveFolderUrl) return;

  // 1. Save to Firestore client profile
  try {
    await updateDoc(doc(db, 'clients', clientId), {
      driveFolderUrl,
      updatedAt: new Date()
    });
  } catch (e) {
    console.warn('Could not update Firestore client driveFolderUrl:', e);
  }

  // 2. Also record in Supabase client_documents as a folder reference
  try {
    await supabase
      .from('client_documents')
      .upsert([
        {
          client_id: String(clientId),
          file_name: 'Google Drive KYC Folder',
          file_url: driveFolderUrl,
          file_path: 'google_drive_folder',
          document_type: 'google_drive_folder',
          created_at: new Date().toISOString()
        }
      ], { onConflict: 'client_id,document_type' });
  } catch (e) {
    console.warn('Could not upsert Drive folder in Supabase client_documents:', e);
  }
};

// Legacy alias compatibility
export const uploadDocument = uploadClientDocument;
export const deleteDocument = deleteClientDocument;
