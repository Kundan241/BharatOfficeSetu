import { google } from 'googleapis';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

/**
 * Cloudflare Pages Function: /api/saveKycDraft
 * 
 * Workflow:
 * 1. Authenticates via Google Service Account (JWT).
 * 2. Step A: Creates a new folder '[companyName] - KYC' inside GOOGLE_DRIVE_PARENT_FOLDER_ID.
 * 3. Step B: Uploads the Base64 PDF directly into the newly created folder.
 * 4. Step C: Appends a row [Date, Company Name, Folder URL] to the Google Sheet (GOOGLE_SHEET_ID).
 * 5. Returns { success: true, folderUrl, fileUrl }.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { companyName, pdfBase64, fileName, date } = body;

    if (!companyName || !pdfBase64) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: companyName and pdfBase64 are required.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── 1. Authenticate with Google Service Account ──────────────────────────
    const clientEmail = env.GOOGLE_CLIENT_EMAIL;
    // Replace escaped newlines from environment strings (e.g. \\n -> \n)
    const privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const masterFolderId = env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
    const sheetId = env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server misconfiguration: GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY is missing.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    // ── STEP A (Google Drive): Create new folder '[companyName] - KYC' ───────
    const folderMetadata = {
      name: `${companyName.trim()} - KYC`,
      mimeType: 'application/vnd.google-apps.folder',
      ...(masterFolderId ? { parents: [masterFolderId] } : {}),
    };

    const folderRes = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, name, webViewLink',
    });

    const newFolderId = folderRes.data.id;
    const folderUrl = folderRes.data.webViewLink;

    // ── STEP B (Google Drive): Upload PDF into the newly created folder ──────
    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(cleanBase64, 'base64');
    const pdfStream = Readable.from(pdfBuffer);

    const safeFileName = fileName || `${companyName.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_KYC_Draft.pdf`;

    const fileMetadata = {
      name: safeFileName,
      parents: [newFolderId],
    };

    const media = {
      mimeType: 'application/pdf',
      body: pdfStream,
    };

    const fileRes = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    const fileUrl = fileRes.data.webViewLink;

    // ── STEP C (Google Sheets): Append row [Date, Company Name, Folder URL] ──
    const formattedDate = date || new Date().toISOString().split('T')[0];

    if (sheetId) {
      const sheetRange = env.GOOGLE_SHEET_TAB_NAME
        ? `${env.GOOGLE_SHEET_TAB_NAME}!A:C`
        : 'A:C';

      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: sheetRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [formattedDate, companyName, folderUrl]
          ],
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'KYC Draft saved successfully to Google Drive & Google Sheet',
        folderId: newFolderId,
        folderUrl: folderUrl,
        fileId: fileRes.data.id,
        fileUrl: fileUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[saveKycDraft] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal Server Error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle CORS preflight OPTIONS request
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Access-Control-Max-Age': '86400',
    },
  });
}
