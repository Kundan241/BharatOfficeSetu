import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Retrieves the associated Google Drive KYC Folder link for a client from Firestore
 */
export const getClientDriveFolder = async (clientId) => {
  if (!clientId) return null;

  try {
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
 * Saves or updates a Google Drive Folder link for a client in Firestore
 */
export const saveClientDriveFolder = async (clientId, driveFolderUrl) => {
  if (!clientId) return false;

  try {
    await updateDoc(doc(db, 'clients', clientId), {
      driveFolderUrl: (driveFolderUrl || '').trim(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error('Could not update Firestore client driveFolderUrl:', e);
    throw e;
  }
};

/**
 * Automatically link a Google Drive folder to a client by matching email, company name, or client name
 */
export const autoLinkDriveFolderByClientInfo = async ({ companyName, clientName, email, driveUrl }) => {
  if (!driveUrl || !driveUrl.includes('drive.google.com')) return null;

  try {
    const clientsRef = collection(db, 'clients');
    let matchedDoc = null;

    // 1. Try matching by email
    if (email && email.trim()) {
      const q = query(clientsRef, where('email', '==', email.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        matchedDoc = snap.docs[0];
      }
    }

    // 2. Try matching by companyName
    if (!matchedDoc && companyName && companyName.trim()) {
      const q = query(clientsRef, where('companyName', '==', companyName.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        matchedDoc = snap.docs[0];
      }
    }

    // 3. Try matching by name
    if (!matchedDoc && clientName && clientName.trim()) {
      const q = query(clientsRef, where('name', '==', clientName.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        matchedDoc = snap.docs[0];
      }
    }

    if (matchedDoc) {
      await updateDoc(doc(db, 'clients', matchedDoc.id), {
        driveFolderUrl: driveUrl.trim(),
        updatedAt: serverTimestamp()
      });
      return matchedDoc.id;
    }
  } catch (err) {
    console.warn('Could not auto-link Drive folder to client:', err);
  }
  return null;
};

/**
 * Get client documents from Firestore subcollection (if any are stored)
 */
export const getClientDocuments = async (clientId) => {
  if (!clientId) return [];
  try {
    const snap = await getDocs(collection(db, 'clients', clientId, 'documents'));
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      name: d.data().name || d.data().fileName,
      url: d.data().url || d.data().driveUrl
    }));
  } catch (e) {
    console.warn('Error fetching client documents from Firestore:', e);
    return [];
  }
};

export const getDocumentDownloadUrl = async (doc) => {
  return doc?.url || doc?.driveUrl || null;
};

export const deleteClientDocument = async (clientId, documentId) => {
  if (clientId && documentId) {
    await deleteDoc(doc(db, 'clients', clientId, 'documents', documentId));
  }
};

// Aliases for backward compatibility
export const uploadClientDocument = async () => {};
export const uploadDocument = uploadClientDocument;
export const deleteDocument = deleteClientDocument;
