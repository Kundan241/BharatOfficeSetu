with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'r') as f:
    content = f.read()

rajasthan_old_end = "    doc.text('FOR Service Provider (M/S SHOP EASY SHOP EASY )', h.margin, h.yPos());\n  };"
rajasthan_noc = """    doc.text('FOR Service Provider (M/S SHOP EASY SHOP EASY )', h.margin, h.yPos());

    // NOC Page
    doc.addPage();
    let py = 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NO OBJECTION CERTIFICATE (NOC)', h.pageWidth / 2, py, { align: 'center' });
    const nocTextWidth = doc.getTextWidth('NO OBJECTION CERTIFICATE (NOC)');
    doc.setLineWidth(0.5);
    doc.line((h.pageWidth - nocTextWidth) / 2, py + 2, (h.pageWidth + nocTextWidth) / 2, py + 2);
    h.setY(py + 20);

    const endDate = new Date(data.startDate);
    endDate.setMonth(endDate.getMonth() + 11);
    const clientName = (data.clientCompanyName || '___________').toUpperCase();

    h.addParagraph(`SHOP EASY SHOP EASY, located at NEEM DA GATE, TILAK NAGAR, BHARATPUR, RAJASTHAN - 321001, confirms that it has entered into a Workspace Service Agreement with ${clientName} dated ${formatDate(data.agreementDate)} for a term from ${formatDate(data.startDate)} to ${formatDate(endDate.toISOString())} ("Term"), for using the premises at the above address ("Premises").`);
    
    h.addParagraph(`We have no objection to ${clientName} conducting its Only Mailing activities from the Premises as per the Workspace Service Agreement and using the above address as its Mailing Address. ${clientName} will provide a copy of the obtained registrations within 3 (Three) days.`);
    
    h.addParagraph('The Member is responsible for complying with all applicable laws. SHOP EASY SHOP EASY is not liable for any actions or omissions of the Member or any third parties.');

    h.addParagraph(`This NOC is valid until the end of the Term or earlier termination of the Workspace Service Agreement or SHOP EASY SHOP EASY agreement with the landlord, whichever comes first. ${clientName} agrees to remove the address from all records 10 (Ten) days prior to termination or expiration and provide proof of the same.`);

    h.setY(h.yPos() + 15);
    doc.setFont('helvetica', 'normal');
    doc.text('For SHOP EASY SHOP EASY', h.margin, h.yPos());
    h.setY(h.yPos() + 15);
    doc.text('Authorized Signatory', h.margin, h.yPos());
  };"""

content = content.replace(rajasthan_old_end, rajasthan_noc)

dwarka_old_end = "    doc.text('For Service Provider (Jupiter SPACE)', h.margin, py);\n  };"
dwarka_noc = """    doc.text('For Service Provider (Jupiter SPACE)', h.margin, py);

    // NOC Page
    doc.addPage();
    h.addOrangeHeaderOnPage();
    py = 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('NO OBJECTION CERTIFICATE (NOC)', h.pageWidth / 2, py, { align: 'center' });
    const nocTextWidthDwarka = doc.getTextWidth('NO OBJECTION CERTIFICATE (NOC)');
    doc.setLineWidth(0.5);
    doc.line((h.pageWidth - nocTextWidthDwarka) / 2, py + 2, (h.pageWidth + nocTextWidthDwarka) / 2, py + 2);
    h.setY(py + 20);

    const clientNameDwarka = (data.clientCompanyName || '___________').toUpperCase();

    h.addParagraph(`JUPITER SPACE, located at PLOT NO. RZ-L-1, SECOND FLOOR, MAIN ROAD, KHASRA NO. 84/12/2, MAHAVIR ENCLAVE, PALAM, OPPOSITE YAMAHA SHOWROOM, NEW DELHI - 110045, confirms that it has entered into a Workspace Service Agreement with ${clientNameDwarka} dated ${formatDate(data.agreementDate)} for a term from ${formatDate(data.startDate)} to ${formatDate(endDate.toISOString())} ("Term"), for using the premises at the above address ("Premises").`);
    
    h.addParagraph(`We have no objection to ${clientNameDwarka} conducting its Only Mailing activities from the Premises as per the Workspace Service Agreement and using the above address as its Mailing Address. ${clientNameDwarka} will provide a copy of the obtained registrations within 3 (Three) days.`);
    
    h.addParagraph('The Member is responsible for complying with all applicable laws. JUPITER SPACE is not liable for any actions or omissions of the Member or any third parties.');

    h.addParagraph(`This NOC is valid until the end of the Term or earlier termination of the Workspace Service Agreement or JUPITER SPACE agreement with the landlord, whichever comes first. ${clientNameDwarka} agrees to remove the address from all records 10 (Ten) days prior to termination or expiration and provide proof of the same.`);

    h.setY(h.yPos() + 15);
    doc.setFont('helvetica', 'normal');
    doc.text('For JUPITER SPACE', h.margin, h.yPos());
    h.setY(h.yPos() + 15);
    doc.text('Authorized Signatory', h.margin, h.yPos());
  };"""

content = content.replace(dwarka_old_end, dwarka_noc)

with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'w') as f:
    f.write(content)

