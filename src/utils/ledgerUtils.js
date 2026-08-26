export function processSheetRecords(records) {
  const correctedRecords = (records || []).map(row => {
    if (!row) return row;
    
    // Fix shifted data from Apps Script API for early records
    // We can detect this if a PAN is appearing in the 'Company Name' column
    const isShifted = /^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(String(row['Company Name'] || '').trim());
    if (isShifted) {
      const fixed = { ...row };
      fixed['Email'] = row['Mobile'];
      fixed['Mobile'] = row['Aadhar'];
      fixed['Aadhar'] = row['GST'];
      fixed['GST'] = row['Address'];
      fixed['Address'] = row['PAN'];
      fixed['PAN'] = row['Company Name'];
      fixed['Company Name'] = row['Client Name'];
      fixed['Client Name'] = row['Document Type'];
      // The older shifted records were from Dwarka Template
      fixed['Document Type'] = 'Dwarka Template'; 
      return fixed;
    }
    return row;
  });

  const remapped = correctedRecords.map(row => {
    let docType = (row['Document Type'] || '').trim();
    let partnerName = (row['Partner Name'] || '').trim();
    
    // Remap if missing or defaulted to Admin/Self
    if (!partnerName || partnerName === 'Admin/Self') {
       if (docType.toLowerCase().includes('dwarka')) {
         partnerName = 'JupiterSpace';
       } else if (docType.toLowerCase().includes('gurgaon') || docType === 'Ultraview Hospitality' || docType === 'true-work-lounge') {
         partnerName = 'Ultraview Hospitality';
       } else if (docType.toLowerCase().includes('asset sense')) {
         partnerName = 'Asset Sense';
       } else {
         partnerName = 'Admin/Self';
       }
    }
    
    return { ...row, 'Partner Name': partnerName, 'Document Type': docType };
  });

  const uniqueRecords = {};
  for (const row of remapped) {
    let key = '';
    const clientName = String(row['Client Name'] || '').trim().toLowerCase();
    const companyName = String(row['Company Name'] || '').trim().toLowerCase();
    const pan = String(row['PAN'] || '').trim().toLowerCase();

    if (clientName && clientName !== 'n/a') {
      key = clientName;
    } else if (companyName && companyName !== 'n/a') {
      key = companyName;
    } else if (pan && pan !== 'n/a') {
      key = pan;
    }
    
    if (!key) {
       uniqueRecords[Math.random().toString()] = row;
       continue;
    }

    if (!uniqueRecords[key]) {
      uniqueRecords[key] = row;
    } else {
      const existing = uniqueRecords[key];
      let existingScore = 0;
      let newScore = 0;
      
      const checkFields = ['Company Name', 'Address', 'GST', 'Aadhar', 'Mobile', 'Email'];
      checkFields.forEach(f => {
        if (existing[f] && String(existing[f]).trim() !== '' && String(existing[f]).trim() !== 'N/A') existingScore++;
        if (row[f] && String(row[f]).trim() !== '' && String(row[f]).trim() !== 'N/A') newScore++;
      });

      let winner = existing;
      if (newScore > existingScore) {
        winner = row;
      } else if (newScore === existingScore) {
        const dateNew = new Date(row['Timestamp'] || 0);
        const dateOld = new Date(existing['Timestamp'] || 0);
        if (dateNew > dateOld) {
          winner = row;
        }
      }

      // Merge the fields so we don't lose Document Type or Partner Name
      // when combining an incomplete duplicate with a complete one.
      const merged = { ...existing, ...row, ...winner };
      const allFields = ['Document Type', 'Client Name', 'Company Name', 'PAN', 'Address', 'GST', 'Aadhar', 'Mobile', 'Email', 'Partner Name', 'Payment Status'];
      for (const f of allFields) {
        if (!merged[f] || merged[f] === 'Admin/Self' || merged[f] === 'N/A') {
            if (existing[f] && existing[f] !== 'Admin/Self' && existing[f] !== 'N/A') {
                merged[f] = existing[f];
            } else if (row[f] && row[f] !== 'Admin/Self' && row[f] !== 'N/A') {
                merged[f] = row[f];
            }
        }
      }
      uniqueRecords[key] = merged;
    }
  }

  const recordsToHide = ['AWVPK5125B', 'ABTFA6324M'];
  const finalRecords = Object.values(uniqueRecords).filter(row => {
    const pan = String(row['PAN'] || '').trim().toUpperCase();
    return !recordsToHide.includes(pan);
  });

  return finalRecords.sort((a, b) => {
    return new Date(b['Timestamp'] || 0) - new Date(a['Timestamp'] || 0);
  });
}
