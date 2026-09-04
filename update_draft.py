import re

with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'r') as f:
    content = f.read()

# 1. Add template to TEMPLATES array
template_obj = """  {
    id: 'rajasthan-template',
    name: 'Rajasthan SHOP EASY',
    description: 'Workspace agreement for SHOP EASY, Rajasthan',
    icon: FileSignature
  },
"""
content = re.sub(r'(const TEMPLATES = \[\s*)', r'\1' + template_obj, content)

# 2. Add buildRajasthanTemplate function before buildDwarkaTemplate
rajasthan_func = """  const buildRajasthanTemplate = (doc, data, h) => {
    h.setY(30);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK SPACE SERVICE CONTRACT', h.pageWidth / 2, h.yPos(), { align: 'center' });
    const textWidth = doc.getTextWidth('WORK SPACE SERVICE CONTRACT');
    doc.setLineWidth(0.5);
    doc.line((h.pageWidth - textWidth) / 2, h.yPos() + 1, (h.pageWidth + textWidth) / 2, h.yPos() + 1);
    h.setY(h.yPos() + 15);

    h.addSectionHeading('THE TWO PARTIES TO THE AGREEMENT ARE AS FOLLOWS');
    const repType = data.representativeType ? data.representativeType.toUpperCase() : 'DIRECTOR';
    const repName = data.representativeName ? data.representativeName.toUpperCase() : '___________';
    h.addParagraph(`This AGREEMENT made on ${formatDate(data.agreementDate)} between M/S SHOP EASY SHOP EASY herein after referred to as Service Provider having office at Neem Da Gate, Tilak Nagar, Bharatpur, Rajasthan - 321001 and Company Name : ${data.clientCompanyName || '___________'} through it's ${repType} ${repName}, C/O ${data.representativeFatherName || '___________'}, ${data.representativeAddress || '___________'} PAN Number ${data.panNumber || '___________'} with Mobile Number ${data.mobileNumber || '___________'} here in after referred to as "Client".`);

    h.addSectionHeading('THE NATURE OF THE AGREEMENT');
    h.addParagraph('The Client intends to use the Mailbox Services provided by M/S SHOP EASY SHOP EASY, located at Neem Da Gate, Tilak Nagar, Bharatpur, Rajasthan - 321001, as their communication and mailing address. The Client acknowledges that the entire premises, including the mailbox, remain the exclusive property of the Service Provider, M/S SHOP EASY SHOP EASY, who retains full possession, control, and authority over the space. The Client further acknowledges that their usage is limited solely to the agreed-upon services, and no rights or claims to the property or its facilities are transferred to them.');

    h.addSectionHeading('ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE');
    h.addParagraph('The Services are provided to the Client strictly under conditions set by M/S SHOP EASY SHOP EASY (the "Service Provider"). The Client\\'s use of these Services constitutes full and unconditional acceptance of all terms and conditions outlined in this Agreement, without exception.');
    h.addParagraph('Any individual utilizing the Services or entering a contract, whether in writing or online, on behalf of their employer or a third party, affirms that they have the full legal authority to bind their employer or the third party to these terms. Unless explicitly stated by the Service Provider, these Terms of Service will apply to any new features, services, or resources introduced by M/S SHOP EASY SHOP EASY, including the release of new offerings that augment or enhance the current Services.');
    
    h.addParagraph('In the event of any breach of these terms, the Service Provider reserves the unequivocal right to immediately terminate the Client\\'s access to the Services without prior notice and pursue all available legal and equitable remedies to recover damages and enforce compliance.');

    h.addSectionHeading('USAGE OF ADDRESS');
    h.addParagraph('The Client may use the provided address solely for business correspondence purposes. The Client may also choose, at their own risk and liability, to designate the address as their "Principal Place of Business" for ROC Registration, GST Registrations, opening bank accounts, or dealings with central/state governments or any other authorities.');
    h.addParagraph('The Service Provider, M/S SHOP EASY SHOP EASY, holds no responsibility or liability for any consequences, legal or otherwise, arising from such use. The Client assumes full responsibility for ensuring compliance with all legal and regulatory requirements in connection with the use of the address under this agreement.');

    h.addSectionHeading('RENT / SUBSCRIPTION FEES');
    h.addParagraph('The Client agrees to pay the rent/subscription fees for a period of 11 months in advance to the Service Provider. This implies that the Client pays upfront for the services to be received over the next 11 months.');

    h.addSectionHeading('AGREEMENT RENEWAL');
    h.addParagraph('The Client must renew the agreement in the 11th month from the date of commencement. Failure to do so allows the Service Provider or any designated party to terminate the contract.');

    h.addSectionHeading('TAX INVOICE AND SETTLEMENT');
    h.addParagraph('The Service Provider will issue a tax invoice for the services rendered in the previous month. The Client is required to settle all valid invoices within 30 days of receipt.');

    h.addSectionHeading('TERMINATION FOR NON-PAYMENT');
    h.addParagraph('Failure to pay the rent/subscription fees will result in the termination of services on the specified expiration date agreed upon during signup or payment.');

    h.addSectionHeading('LATE PAYMENT INTEREST');
    h.addParagraph('In the case of late payments, the Client/agreement holder may be charged an additional amount as interest. The interest rate for delays exceeding 30 days is set at 12% per annum on a pro-rata basis.');

    h.addSectionHeading('INDEMNITY');
    h.addSectionHeading('1. COMPLIANCE WITH LAWS');
    h.addParagraph('The Client is solely responsible for ensuring full compliance with all applicable laws, including but not limited to the Companies Act, GST, and other relevant regulations. The Client agrees to indemnify and hold M/S SHOP EASY SHOP EASY (the "Service Provider") fully indemnified and harmless against any claims, proceedings, damages, losses, actions, costs, or expenses arising from this agreement or any breach of applicable laws.');

    h.addSectionHeading('2. INDEMNIFICATION');
    h.addParagraph('The Client agrees not to use the premises address to apply for any loans, credit cards, or financial services. The Service Provider is fully indemnified against any liabilities arising from such use or any claims related to the Client\\'s financial dealings or obligations.');

    h.addSectionHeading('3. LIMITED SCOPE OF SERVICE');
    h.addParagraph('M/S SHOP EASY SHOP EASY is only providing mailbox services to the Client. The Service Provider does not hold any responsibility for the Client\\'s business activities, and any consequences arising from those activities are solely the Client\\'s responsibility.');

    h.addSectionHeading('4. VISITOR RESPONSIBILITY');
    h.addParagraph('The client is responsible for ensuring that any visitors or clients entering M/S SHOP EASY SHOP EASY\\'s workspace for any purpose must provide prior notice to M/S SHOP EASY SHOP EASY and ensure compliance with the Service Provider\\'s policies and guidelines. M/S SHOP EASY SHOP EASY shall not be held liable for the actions or conduct of the client\\'s visitors, nor for any breaches of workspace rules by them. It is acknowledged that the client does not hold any physical possession of the premises. The client is required to book a cabin on an hourly basis to conduct meetings within the premises, as the client holds only a virtual office subscription.');

    h.addSectionHeading('5. GUEST POLICY');
    h.addParagraph('While M/S SHOP EASY SHOP EASY welcomes the Client\\'s guests for meetings or project work, it is the Client\\'s duty to ensure their guests comply with all workspace policies. Any violations of these policies will be the responsibility of the Client.');

    h.addSectionHeading('6. FINANCIAL TRANSACTIONS');
    h.addParagraph('The Client is solely responsible for all financial transactions conducted with their clients, including payments for services or products. M/S SHOP EASY SHOP EASY Coworking assumes no responsibility for any financial dealings between the Client and their clients.');

    h.addSectionHeading('7. DISPUTE RESOLUTION');
    h.addParagraph('In the event of a dispute between the Client and their clients, M/S SHOP EASY SHOP EASY holds no responsibility for resolving such disputes. The Client is fully responsible for managing and resolving any disputes in a timely and professional manner.');

    h.addSectionHeading('8. WORKSPACE ENVIRONMENT');
    h.addParagraph('To maintain a professional and productive environment, the Client and their visitors are expected to adhere to M/S SHOP EASY SHOP EASY\\'s policies at all times. Any failure to comply with these guidelines may result in penalties or termination of services by M/S SHOP EASY SHOP EASY, at its sole discretion.');
    h.addParagraph('Please note that M/S SHOP EASY SHOP EASY is only providing mailbox services to the Client. As such, the Service Provider does not hold any responsibility for the Client\\'s business activities. It is the Client\\'s responsibility to ensure that their visitors follow our policies and guidelines while using the workspace.');

    h.addSectionHeading('TERMINATION OF SERVICE');
    h.addSectionHeading('1. TERMINATION BY SERVICE PROVIDER');
    h.addParagraph('The Service Provider reserves the right to terminate the service at any time with at least 30 days\\' prior written notice. In such cases, any security deposit paid by the Client will be refunded.');

    h.addSectionHeading('2. AUTOMATIC TERMINATION');
    h.addParagraph('Services will be automatically terminated on the expiry date unless the Client renews the subscription before that date. The Service Provider holds no responsibility for any loss or disruption caused by the Client\\'s failure to renew.');

    h.addSectionHeading('3. OBLIGATIONS AFTER TERMINATION');
    h.addParagraph('Upon termination of the service, the Client must immediately cease the use of the provided address and any phone numbers issued by the Service Provider. This includes removing the address from all materials, including but not limited to business cards, websites, stationery, advertising material, certificates, and any public or private platforms.');

    h.addSectionHeading('4. CHANGE OF ADDRESS FOR REGISTRATIONS');
    h.addParagraph('If the Client has used the address for registrations with the ROC, GST authorities, banks, or any other official purposes, the Client is required to update the address within 30 days of termination. The Service Provider reserves the right to take legal action against any Client found in breach of this requirement.');

    h.addSectionHeading('5. TERMINATION WITHOUT NOTICE FOR ILLEGAL ACTIVITIES');
    h.addParagraph('The Service Provider reserves the right to terminate the service and agreement immediately, without prior notice, if the Client engages in any illegal activities or conducts business in a manner that could damage the Service Provider\\'s reputation or disrupt its operations.');

    h.addSectionHeading('6. TERMINATION FOR VIOLATION OR FRAUD');
    h.addParagraph('The Service Provider may terminate the service with 30 days\\' written notice if the Client violates any clause in this agreement or if the Client\\'s activities are reported to be fraudulent or harmful to the Service Provider\\'s interests.');

    h.addSectionHeading('7. RENEWAL REQUIREMENT');
    h.addParagraph('The Client is obligated to renew the subscription by the 11th month from the contract start date. This requirement applies regardless of whether the Client has engaged through an aggregator platform or a third-party intermediary. Failure to renew the subscription within this specified period will result in the automatic termination of the contract, rendering it null and void. In such circumstances, the Service Provider assumes no responsibility or liability for any disruptions, losses, or consequences incurred by the Client due to the lapse in subscription renewal.');
    h.addParagraph('Even if the Client has come through an aggregator platform or a third-party intermediary, the Service Provider reserves the right to directly reach out to the Client and offer them the opportunity to renew the subscription directly as well.');

    h.addSectionHeading('8. NO LIABILITY POST-TERMINATION');
    h.addParagraph('Upon termination of the service, whether automatically or by action of the Service Provider, the Client fully and irrevocably releases the Service Provider from any and all responsibility, liability, or claims for any consequences, losses, or damages arising from the termination. Furthermore, the Client is required to immediately cease the use of the provided address in all forms and remove it from all platforms, documents, and communications where it was utilized under the valid agreement. The Client must also provide a formal declaration to the Service Provider, affirming that the address is no longer in use. Failure to comply with this requirement may result in legal action and additional penalties as determined by the Service Provider.');

    h.addSectionHeading('CONFIDENTIALITY');
    h.addParagraph('The Client recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Service Provider. The Client agrees that during the Term of this Agreement and thereafter:');
    h.addParagraph('(a) The Client shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information, but in no event less than a reasonable standard of care.');
    h.addParagraph('(b) The Client will use Confidential Information solely for the purposes of this Agreement; and');
    h.addParagraph('(c) The Client will not disclose Confidential Information to any third party without the express prior written consent of the Service Provider.');
    h.addParagraph('Similarly, the Service Provider recognizes that it may, in the course of providing the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Client. The Service Provider agrees that during the Term of this Agreement and thereafter, the Service Provider shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information. If the Service Provider transfers its business or any business segment that provides services to the Client, the Service Provider is authorized to transfer all user information to the Service Provider\\'s successor.');

    h.addSectionHeading('OWNERSHIP');
    h.addParagraph('All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials comprising the Service are wholly owned by the Service provider except where expressly stated otherwise.');
    h.addParagraph('This is not a lease document. Client agrees that the client is not the service provider of any phone number assigned to them by service provider. Upon termination of account for any reason, such number may be re-assigned to another client.');
    h.addParagraph('Similarly, all programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials of the client shall be owned by the client only.');

    doc.addPage();
    h.addOrangeHeaderOnPage();
    h.setY(30);

    h.addSectionHeading('NATURE OF BUSINESS');
    h.addParagraph('The Client must explain the nature of their business in writing in ANNEXURE-1 of this agreement.');
    h.addParagraph('The Client agrees not to conduct or engage in any business that could be construed as illegal, defamatory, immoral, or obscene. Additionally, the Client agrees not to use the address of the Service Provider, whether directly or indirectly, for any such purposes.');
    h.addParagraph('The Client has described the nature of the business they plan to conduct at M/S SHOP EASY SHOP EASY as a virtual office in connection with this agreement.');
    h.addParagraph('If the Client changes the nature of their business, they are required to notify the Service Provider in writing.');

    h.addSectionHeading('CONFLICTING BUSINESS');
    h.addParagraph('The client should not directly or indirectly or though agents operate a business that competes with Service provider\\'s business of providing serviced offices and virtual offices, shared conference rooms and meeting rooms.');

    h.addSectionHeading('GOVERNING LAW');
    h.addParagraph('This Agreement shall be governed by the laws of India. The Courts in Bharatpur (Rajasthan) shall have exclusive jurisdiction over the subject matter of this Agreement. In the event of any dispute or differences arising out of or in connection with this agreement, the parties hereto agree that all such disputes shall be resolved exclusively by the Courts in Bharatpur (Rajasthan). The decision of the Courts in Bharatpur (Rajasthan) shall be final and binding on both parties.');

    doc.addPage();
    h.addOrangeHeaderOnPage();
    h.setY(30);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ANNEXURE – 1', h.margin, h.yPos());
    h.setY(h.yPos() + 10);

    h.addParagraph('Client to describe about its nature of Business that it is planning to conduct at the M/S SHOP EASY SHOP EASY\\'s Office in connection with this Agreement (in approx. 200 words):');
    h.addParagraph(data.businessNature || '______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________');

    doc.addPage();
    h.addOrangeHeaderOnPage();
    h.setY(30);

    h.addSectionHeading('PAYMENT TERMS AND TENURE AGREEMENT PERIOD : 11 MONTHS');
    h.addParagraph(`EFFECTIVE FROM ${formatDate(data.startDate)}\\nTo ${formatDate(data.endDate)}`);

    h.addSectionHeading('AGREEMENT IS VALID FORM');
    h.addParagraph('Service provider\\'s Address is: C/O M/S SHOP EASY SHOP EASY Neem Da Gate, Tilak Nagar, Bharatpur, Rajasthan - 321001');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('THIS IS A FORMAL AGREEMENT ON CLIENT\\'s TERMS AND CONDITIONS.', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text('THIS IS NOT A LEASE OR DEED OR CAN NOT BE USED AS LEASE AGREEMENT.', h.margin, h.yPos());
    h.setY(h.yPos() + 10);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('I AGREE TO THE ABOVE TERMS AND CONDITIONS', h.margin, h.yPos());
    h.setY(h.yPos() + 15);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FOR CLIENT :', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature :', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text(`Name : ${data.representativeName || ''}`, h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text(`Designation/Title : ${data.representativeType || ''}`, h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text('Date of Sign :', h.margin, h.yPos());
    h.setY(h.yPos() + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 1', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature :', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text('Name :', h.margin, h.yPos());
    h.setY(h.yPos() + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 2', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Signature :', h.margin, h.yPos());
    h.setY(h.yPos() + 6);
    doc.text('Name :', h.margin, h.yPos());
    h.setY(h.yPos() + 25);

    doc.text('FOR Service Provider (M/S SHOP EASY SHOP EASY )', h.margin, h.yPos());
  };

"""
content = content.replace("const buildDwarkaTemplate = (doc, data, h) => {", rajasthan_func + "\n  const buildDwarkaTemplate = (doc, data, h) => {")

# 3. Add to generatePDF logic
gen_pdf_replace = """    } else if (template.id === 'dwarka-template') {
      buildDwarkaTemplate(doc, formData, helpers);
    } else if (template.id === 'rajasthan-template') {
      buildRajasthanTemplate(doc, formData, helpers);
      const nameKey = formData.clientCompanyName || formData.businessName || formData.companyName || 'Document';
      doc.save(`Rajasthan-${nameKey.replace(/\\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      return;"""
content = content.replace("""    } else if (template.id === 'dwarka-template') {
      buildDwarkaTemplate(doc, formData, helpers);""", gen_pdf_replace)

# 4. Add UI form fields
form_fields = """              {selectedTemplate.id === 'rajasthan-template' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Agreement Date', 'agreementDate', 'date')}
                    {renderField('Agreement Start Date', 'startDate', 'date')}
                  </div>
                  {renderField('Client Company Name', 'clientCompanyName', 'text', { placeholder: 'e.g. FLUXCHARGE INDIA PRIVATE LIMITED' })}
                  {renderField('Company Type', 'companyType', 'select', { options: ['Private Limited Company', 'LLP', 'Proprietorship', 'Trust', 'Partnership Firm'] })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Representative Type', 'representativeType', 'select', { options: ['Director', 'Authorized Signatory', 'Partner', 'Proprietor'] })}
                    {renderField('Representative Name', 'representativeName', 'text', { placeholder: 'Name of the representative' })}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Father\\'s Name (C/o)', 'representativeFatherName', 'text', { placeholder: 'Father\\'s Name' })}
                    {renderField('PAN Number', 'panNumber', 'text', { placeholder: 'e.g. AAGCT7723A' })}
                  </div>
                  {renderField('Residential Address', 'representativeAddress', 'textarea', { rows: 2, placeholder: 'Residential address' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Mobile Number', 'mobileNumber', 'text', { placeholder: '10-digit mobile' })}
                    {renderField('Agreement End Date', 'endDate', 'text', { value: `Auto: ${getCalculatedEndDate()}`, readOnly: true, className: 'bg-[rgba(17,17,16,0.03)] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[rgba(17,17,16,0.6)] w-full font-sans h-[42px] cursor-not-allowed' })}
                  </div>
                  {renderField('Nature of Business (Annexure-1)', 'businessNature', 'textarea', { rows: 3, placeholder: 'Brief description of client\\'s business...' })}
                </div>
              )}"""
content = content.replace("              {selectedTemplate.id === 'dwarka-template' && (", form_fields + "\n\n              {selectedTemplate.id === 'dwarka-template' && (")

# 5. Add preview rendering
preview_render = """      } else if (selectedTemplate.id === 'rajasthan-template') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>WORK SPACE SERVICE CONTRACT</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p><strong>THE TWO PARTIES TO THE AGREEMENT ARE AS FOLLOWS</strong></p>
            <p>This AGREEMENT made on {formatDate(formData.agreementDate)} between M/S SHOP EASY SHOP EASY herein after referred to as Service Provider having office at Neem Da Gate, Tilak Nagar, Bharatpur, Rajasthan - 321001 and Company Name : {formData.clientCompanyName || '___________'} through it's {formData.representativeType?.toUpperCase() || 'DIRECTOR'} {formData.representativeName?.toUpperCase() || '___________'}, C/O {formData.representativeFatherName || '___________'}, {formData.representativeAddress || '___________'} PAN Number {formData.panNumber || '___________'} with Mobile Number {formData.mobileNumber || '___________'} here in after referred to as "Client".</p>
            <p><strong>THE NATURE OF THE AGREEMENT</strong><br />
            The Client intends to use the Mailbox Services provided by M/S SHOP EASY SHOP EASY , located at Neem Da Gate, Tilak Nagar, Bharatpur, Rajasthan - 321001, as their communication and mailing address...</p>
            <p><em>(The full preview text is truncated for brevity, but the final PDF will contain all clauses and details.)</em></p>
            <div style={{ marginTop: '30px' }}>
              <p>For Client:<br />Name: {formData.representativeName || '___________'}<br />Designation: {formData.representativeType || 'Authorized Signatory'}</p>
            </div>
            <div style={{ marginTop: '30px' }}>
              <p>For Service Provider (M/S SHOP EASY SHOP EASY)</p>
            </div>
          </>
        );"""
content = content.replace("      } else if (selectedTemplate.id === 'dwarka-template') {", preview_render + "\n      } else if (selectedTemplate.id === 'dwarka-template') {")

with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'w') as f:
    f.write(content)

