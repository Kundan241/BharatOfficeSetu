/**
 * Service to call Cloudflare Pages Function: /api/saveKycDraft
 * 
 * @param {Object} params
 * @param {string} params.companyName - Company name (used to name the folder & log to Sheets)
 * @param {string} params.base64DataUri - Base64 Data URI or raw base64 string of the generated PDF
 * @param {string} [params.fileName] - Name of the file to save in Google Drive
 * @param {string} [params.date] - YYYY-MM-DD date string (defaults to today)
 * @returns {Promise<{success: boolean, folderUrl: string, fileUrl: string}>}
 */
export async function saveKycDraftToCloudflare({
  companyName,
  base64DataUri,
  fileName,
  date,
}) {
  if (!companyName) {
    throw new Error('Company name is required for KYC draft sync.');
  }
  if (!base64DataUri) {
    throw new Error('PDF Base64 data is required for KYC draft sync.');
  }

  // Strip prefix if data URI format (e.g., data:application/pdf;base64,...)
  const cleanBase64 = base64DataUri.replace(/^data:application\/pdf;base64,/, '');
  const formattedDate = date || new Date().toISOString().split('T')[0];

  const response = await fetch('/api/saveKycDraft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companyName: companyName.trim(),
      pdfBase64: cleanBase64,
      fileName: fileName || `${companyName.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_KYC_Draft.pdf`,
      date: formattedDate,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to save KYC Draft to Google Drive & Sheets');
  }

  return data;
}
