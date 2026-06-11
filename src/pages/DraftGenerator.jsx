import React, { useState, useEffect } from 'react';
import { Lock, FileSignature, FileCheck, FileText, Download, X } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const ACCESS_PASSWORD = 'BOS@Drafts2026';

const TEMPLATES = [
  {
    id: 'workspace-agreement',
    name: 'Workspace Service Agreement',
    description: 'Virtual office service contract for GST registration',
    icon: FileSignature
  },
  {
    id: 'noc',
    name: 'No Objection Certificate (NOC)',
    description: 'NOC from property owner for GST / business registration',
    icon: FileCheck
  },
  {
    id: 'authorization',
    name: 'Authorization Letter',
    description: 'Authorize a person to act on behalf of the company',
    icon: FileText
  },
  {
    id: 'gurgaon-workspace-agreement',
    name: 'Gurgaon Workspace Agreement',
    description: 'Workspace agreement for True Work Lounge, Gurugram',
    icon: FileSignature
  },
  {
    id: 'gurgaon-noc',
    name: 'Gurgaon NOC',
    description: 'NOC from True Work Lounge, Gurugram',
    icon: FileCheck
  }
];

export default function DraftGenerator() {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [formData, setFormData] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('drafts_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (enteredPassword === ACCESS_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('drafts_auth', 'true');
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('drafts_auth');
    setIsAuthenticated(false);
    setEnteredPassword('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const initFormData = (templateId) => {
    const today = new Date().toISOString().split('T')[0];
    if (templateId === 'workspace-agreement') {
      setFormData({
        agreementDate: today,
        serviceProviderName: 'Bharat Office Setu Pvt. Ltd.',
        serviceProviderAddress: 'C/O BOS, PARAS TRADE CENTRE, UNIT NO. 124, FIRST FLOOR, GWAL PAHARI, GURUGRAM 122003',
        clientCompanyName: '',
        directorName: '',
        directorFatherName: '',
        directorAddress: '',
        panNumber: '',
        mobileNumber: '',
        startDate: today,
        businessNature: ''
      });
    } else if (templateId === 'noc') {
      setFormData({
        nocDate: today,
        ownerName: '',
        ownerAddress: '',
        businessName: '',
        businessOwnerName: '',
        propertyAddress: '',
        purpose: 'GST Registration',
        state: ''
      });
    } else if (templateId === 'authorization') {
      setFormData({
        letterDate: today,
        companyName: '',
        authorizedByName: '',
        authorizedByDesignation: '',
        authorizedPersonName: '',
        authorizedPersonDesignation: '',
        purpose: '',
        validUntil: ''
      });
    } else if (templateId === 'gurgaon-workspace-agreement') {
      setFormData({
        agreementDate: today,
        clientCompanyName: '',
        directorName: '',
        directorFatherName: '',
        directorAddress: '',
        panNumber: '',
        mobileNumber: '',
        aadharNumber: '',
        startDate: today,
        businessNature: ''
      });
    } else if (templateId === 'gurgaon-noc') {
      setFormData({
        nocDate: today,
        clientCompanyName: '',
        directorName: '',
        directorFatherName: '',
        directorAddress: '',
        aadharNumber: ''
      });
    }
  };

  useEffect(() => {
    initFormData(selectedTemplate.id);
  }, [selectedTemplate]);

  const validateForm = () => {
    const required = {
      'workspace-agreement': ['clientCompanyName', 'directorName', 'directorAddress', 'panNumber', 'mobileNumber', 'startDate'],
      'noc': ['ownerName', 'ownerAddress', 'businessName', 'propertyAddress', 'purpose', 'state'],
      'authorization': ['companyName', 'authorizedByName', 'authorizedPersonName', 'purpose', 'validUntil'],
      'gurgaon-workspace-agreement': ['clientCompanyName', 'directorName', 'directorAddress', 'panNumber', 'mobileNumber', 'aadharNumber', 'startDate'],
      'gurgaon-noc': ['clientCompanyName', 'directorName', 'directorAddress', 'aadharNumber']
    };
    
    const reqFields = required[selectedTemplate.id];
    let isValid = true;
    let firstErrorField = null;

    for (let field of reqFields) {
      if (!formData[field] || formData[field].trim() === '') {
        isValid = false;
        if (!firstErrorField) firstErrorField = field;
        const el = document.getElementById(`field-${field}`);
        if (el) {
          el.style.borderColor = '#DC2626';
          setTimeout(() => el.style.borderColor = 'rgba(17,17,16,0.1)', 3000);
        }
      }
    }

    if (!isValid) {
      addToast('error', 'Please fill all required fields');
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleDownload = () => {
    if (validateForm()) {
      generatePDF(selectedTemplate, formData);
    }
  };

  const generatePDF = (template, formData) => {
    console.log('Form data being used:', formData);
    if (!window.jspdf || !window.jspdf.jsPDF) {
      addToast('error', 'PDF library not loaded yet. Please wait a moment and try again.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const isGurgaonTemplate = template.id.startsWith('gurgaon-');

    const addOrangeHeader = () => {
      if (isGurgaonTemplate) return;
      doc.setFillColor(244, 131, 31);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(template.name.toUpperCase(), pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(40, 40, 40);
    };

    addOrangeHeader();

    let yPos = 30;

    if (!isGurgaonTemplate) {
      doc.setTextColor(17, 17, 16);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(template.name.toUpperCase(), contentWidth);
      doc.text(titleLines, pageWidth / 2, yPos, { align: 'center' });
      yPos += (titleLines.length * 8) + 10;

      doc.setDrawColor(17, 17, 16);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
      yPos += 8;
    }

    const addSectionHeading = (text) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addOrangeHeader();
        yPos = 25;
      }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 17, 16);
      doc.text(text, margin, yPos);
      yPos += 8;
    };

    const addParagraph = (text) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        if (yPos > pageHeight - 25) {
          doc.addPage();
          addOrangeHeader();
          yPos = 25;
        }
        doc.text(line, margin, yPos);
        yPos += 6;
      });
      yPos += 4;
    };

    const helpers = {
      addSectionHeading,
      addParagraph,
      margin,
      pageWidth,
      contentWidth,
      yPos: () => yPos,
      setY: (y) => { yPos = y; },
      addOrangeHeaderOnPage: () => addOrangeHeader()
    };

    if (template.id === 'workspace-agreement') {
      buildWorkspaceAgreement(doc, formData, helpers);
    } else if (template.id === 'noc') {
      buildNOC(doc, formData, helpers);
    } else if (template.id === 'authorization') {
      buildAuthorization(doc, formData, helpers);
    } else if (template.id === 'gurgaon-workspace-agreement') {
      buildGurgaonWorkspaceAgreement(doc, formData, helpers);
    } else if (template.id === 'gurgaon-noc') {
      buildGurgaonNOC(doc, formData, helpers);
    }

    const nameKey = formData.clientCompanyName || formData.businessName || formData.companyName || 'Document';
    const fileName = `${template.id}-${nameKey.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(fileName);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '___________';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const buildWorkspaceAgreement = (doc, data, h) => {
    console.log(`
      Agreement fields used in PDF:
      data.agreementDate ← form field: agreementDate
      data.serviceProviderName ← form field: serviceProviderName  
      data.serviceProviderAddress ← form field: serviceProviderAddress
      data.clientCompanyName ← form field: clientCompanyName
      data.directorName ← form field: directorName
      data.directorFatherName ← form field: directorFatherName
      data.directorAddress ← form field: directorAddress
      data.panNumber ← form field: panNumber
      data.mobileNumber ← form field: mobileNumber
      data.startDate ← form field: startDate
      data.endDate ← auto-calculated from startDate
      data.businessNature ← form field: businessNature
    `);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK SPACE SERVICE CONTRACT', h.pageWidth / 2, h.yPos(), { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(h.margin, h.yPos() + 2, h.pageWidth - h.margin, h.yPos() + 2);
    h.setY(h.yPos() + 15);

    h.addSectionHeading('THE TWO PARTIES TO THE AGREEMENT ARE AS FOLLOWS');
    h.addParagraph(
      'This AGREEMENT made on ' + formatDate(data.agreementDate) +
      ' between ' + data.serviceProviderName +
      ' herein after referred to as Service Provider having office at ' +
      data.serviceProviderAddress +
      ' and ' + data.clientCompanyName +
      ' through it’s Director ' + data.directorName +
      ', S/O ' + data.directorFatherName +
      ', R/O ' + data.directorAddress +
      ' PAN Number ' + data.panNumber +
      ' with Mobile Number ' + data.mobileNumber +
      ' here in after referred to as "Client".'
    );

    h.addSectionHeading('THE NATURE OF THE AGREEMENT');
    h.addParagraph(
      'The Client intends to use the Mailbox Services provided by ' + data.serviceProviderName +
      ' , located at ' + data.serviceProviderAddress +
      ', as their communication and mailing address. The Client acknowledges that the entire premises, including the mailbox, remain the exclusive property of the Service Provider, ' + data.serviceProviderName +
      ', who retains full possession, control, and authority over the space. The Client further acknowledges that their usage is limited solely to the agreed-upon services, and no rights or claims to the property or its facilities are transferred to them.'
    );

    h.addSectionHeading('ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE');
    h.addParagraph(
      'The Services are provided to the Client strictly under the terms and conditions set by ' + data.serviceProviderName +
      ' (the "Service Provider"). The Client\'s use of these Services constitutes full and unconditional acceptance of all terms and conditions outlined in this Agreement, without exception.'
    );
    h.addParagraph(
      'Any individual utilizing the Services or entering a contract, whether in writing or online, on behalf of their employer or a third party, affirms that they have the full legal authority to bind their employer or the third party to these terms. Unless explicitly stated by the Service Provider, these Terms of Service will apply to any new features, services, or resources introduced by ' + data.serviceProviderName + ', including the release of new offerings that augment or enhance the current Services.'
    );

    h.addSectionHeading('USAGE OF ADDRESS');
    h.addParagraph(
      'The Client may use the provided address solely for business correspondence purposes. The Client may also choose, at their own risk and liability, to designate the address as their "Principal Place of Business for ROC Registration, GST Registrations, opening bank accounts, or dealings with central/state governments or any other authorities.'
    );
    h.addParagraph(
      'The Service Provider, ' + data.serviceProviderName + ', holds no responsibility or liability for any consequences, legal or otherwise, arising from such use. The Client assumes full responsibility for ensuring compliance with all legal and regulatory requirements in connection with the use of the address under this agreement.'
    );

    h.addSectionHeading('RENT / SUBSCRIPTION FEES');
    h.addParagraph(
      'The Client agrees to pay the rent/subscription fees for a period of 11 months in advance to the Service Provider. This implies that the Client pays upfront for the services to be received over the next 11 months.'
    );

    h.addSectionHeading('AGREEMENT RENEWAL');
    h.addParagraph(
      'The Client must renew the agreement in the 11th month from the date of commencement. Failure to do so allows the Service Provider or any designated party to terminate the contract.'
    );

    h.addSectionHeading('TAX INVOICE AND SETTLEMENT');
    h.addParagraph('The Service Provider will issue a tax invoice for the services rendered in the previous month. The Client is required to settle all valid invoices within 30 days of receipt.');

    h.addSectionHeading('TERMINATION FOR NON-PAYMENT');
    h.addParagraph('Failure to pay the rent/subscription fees will result in the termination of services on the specified expiration date agreed upon during signup or payment.');

    h.addSectionHeading('LATE PAYMENT INTEREST');
    h.addParagraph('In the case of late payments, the Client/agreement holder may be charged an additional amount as interest. The interest rate for delays exceeding 30 days is set at 12% per annum on a pro-rata basis.');

    h.addSectionHeading('INDEMNITY');
    h.addSectionHeading('1. COMPLIANCE WITH LAWS');
    h.addParagraph('The Client is solely responsible for ensuring full compliance with all applicable laws, including but not limited to the Companies Act, GST, and other relevant regulations. The Client agrees to indemnify and hold ' + data.serviceProviderName + ' (the "Service Provider") fully indemnified and harmless against any claims, proceedings, damages, losses, actions, costs, or expenses arising from this agreement or any breach of applicable laws.');

    h.addSectionHeading('2. INDEMNIFICATION');
    h.addParagraph('The Client agrees not to use the premises address to apply for any loans, credit cards, or financial services. The Service Provider is fully indemnified against any liabilities arising from such use or any claims related to the Client’s financial dealings or obligations.');

    h.addSectionHeading('3. LIMITED SCOPE OF SERVICE');
    h.addParagraph(data.serviceProviderName + ' is only providing mailbox services to the Client. The Service Provider does not hold any responsibility for the Client\'s business activities, and any consequences arising from those activities are solely the Client\'s responsibility.');

    h.addSectionHeading('4. VISITOR RESPONSIBILITY');
    h.addParagraph('The client is responsible for ensuring that any visitors or clients entering ' + data.serviceProviderName + '’s workspace for any purpose must provide prior notice to ' + data.serviceProviderName + ' and ensure compliance with the Service Provider\'s policies and guidelines. ' + data.serviceProviderName + ' shall not be held liable for the actions or conduct of the client\'s visitors, nor for any breaches of workspace rules by them. It is acknowledged that the client does not hold any physical possession of the premises. The client is required to book a cabin on an hourly basis to conduct meetings within the premises, as the client holds only a virtual office subscription.');

    h.addSectionHeading('5. GUEST POLICY');
    h.addParagraph('While ' + data.serviceProviderName + ' welcomes the Client’s guests for meetings or project work, it is the Client’s duty to ensure their guests comply with all workspace policies. Any violations of these policies will be the responsibility of the Client.');

    h.addSectionHeading('6. FINACIAL TRANSACTIONS');
    h.addParagraph('The Client is solely responsible for all financial transactions conducted with their clients, including payments for services or products. ' + data.serviceProviderName + ' assumes no responsibility for any financial dealings between the Client and their clients.');

    h.addSectionHeading('7. DISPUTE RESOLUTION');
    h.addParagraph('In the event of a dispute between the Client and their clients, ' + data.serviceProviderName + ' holds no responsibility for resolving such disputes. The Client is fully responsible for managing and resolving any disputes in a timely and professional manner.');

    h.addSectionHeading('8. WORKSPACE ENVIRONMENT');
    h.addParagraph('To maintain a professional and productive environment, the Client and their visitors are expected to adhere to ' + data.serviceProviderName + '\'s policies at all times. Any failure to comply with these guidelines may result in penalties or termination of services by ' + data.serviceProviderName + ', at its sole discretion.\n\nPlease note that ' + data.serviceProviderName + ' is only providing mailbox services to the Client. As such, the Service Provider does not hold any responsibility for the Client’s business activities. It is the Client’s responsibility to ensure that their visitors follow our policies and guidelines while using the workspace.');

    h.addSectionHeading('TERMINATION OF SERVICE');
    h.addSectionHeading('1. TERMINATION BY SERVICE PROVIDER');
    h.addParagraph('The Service Provider reserves the right to terminate the service at any time with at least 30 days\' prior written notice. In such cases, any security deposit paid by the Client will be refunded.');

    h.addSectionHeading('2. AUTOMATIC TERMINATION');
    h.addParagraph('Services will be automatically terminated on the expiry date unless the Client renews the subscription before that date. The Service Provider holds no responsibility for any loss or disruption caused by the Client’s failure to renew.');

    h.addSectionHeading('3. OBLIGATIONS AFTER TERMINATION');
    h.addParagraph('Upon termination of the service, the Client must immediately cease the use of the provided address and any phone numbers issued by the Service Provider. This includes removing the address from all materials, including but not limited to business cards, websites, stationery, advertising material, certificates, and any public or private platforms.');

    h.addSectionHeading('4. CHANGE OF ADDRESS FOR REGISTRATIONS');
    h.addParagraph('If the Client has used the address for registrations with the ROC, GST authorities, banks, or any other official purposes, the Client is required to update the address within 30 days of termination. The Service Provider reserves the right to take legal action against any Client found in breach of this requirement.');

    h.addSectionHeading('5. TERMINATION WITHOUT NOTICE FOR ILLEGAL ACTIVITIES');
    h.addParagraph('The Service Provider reserves the right to terminate the service and agreement immediately, without prior notice, if the Client engages in any illegal activities or conducts business in a manner that could damage the Service Provider\'s reputation or disrupt its operations.');

    h.addSectionHeading('6. TERMINATION FOR VIOLATION OR FRAUD');
    h.addParagraph('The Service Provider may terminate the service with 30 days’ written notice if the Client violates any clause in this agreement or if the Client\'s activities are reported to be fraudulent or harmful to the Service Provider\'s interests.');

    h.addSectionHeading('7. RENEWAL REQUIREMENT');
    h.addParagraph('The Client is obligated to renew the subscription by the 11th month from the contract start date. This requirement applies regardless of whether the Client has engaged through an aggregator platform or a third-party intermediary. Failure to renew the subscription within this specified period will result in the automatic termination of the contract, rendering it null and void. In such circumstances, the Service Provider assumes no responsibility or liability for any disruptions, losses, or consequences incurred by the Client due to the lapse in subscription renewal.\n\nEven if the Client has come through an aggregator platform or a third-party intermediary, the Service Provider reserves the right to directly reach out to the Client and offer them the opportunity to renew the subscription directly as well.');

    h.addSectionHeading('8. NO LIABILITY POST-TERMINATION');
    h.addParagraph('Upon termination of the service, whether automatically or by action of the Service Provider, the Client fully and irrevocably releases the Service Provider from any and all responsibility, liability, or claims for any consequences, losses, or damages arising from the termination. Furthermore, the Client is required to immediately cease the use of the provided address in all forms and remove it from all platforms, documents, and communications where it was utilized under the valid agreement. The Client must also provide a formal declaration to the Service Provider, affirming that the address is no longer in use. Failure to comply with this requirement may result in legal action and additional penalties as determined by the Service Provider.');

    h.addSectionHeading('CONFIDENTIALITY');
    h.addParagraph('The Client recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Service Provider. The Client agrees that during the Term of this Agreement and thereafter:\n\n(a) The Client shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information, but in no event less than a reasonable standard of care.\n(b) The Client will use Confidential Information solely for the purposes of this Agreement; and\n(c) The Client will not disclose Confidential Information to any third party without the express prior written consent of the Service Provider.\n\nSimilarly, the Service Provider recognizes that it may, in the course of providing the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Client. The Service Provider agrees that during the Term of this Agreement and thereafter, the Service Provider shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information. If the Service Provider transfers its business or any business segment that provides services to the Client, the Service Provider is authorized to transfer all user information to the Service Provider’s successor.');

    h.addSectionHeading('OWNERSHIP');
    h.addParagraph('All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials comprising the Service are wholly owned by the Service provider. Service provider except where expressly stated otherwise. This is not a lease document. Client agrees that the client is not the service provider of any phone number assigned to them by service provider. Upon termination of account for any reason, such number may be re assigned to another client.\n\nSimilarly, all programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials of the client shall be owned by the client only.');

    h.addSectionHeading('NATURE OF BUSINESS');
    h.addParagraph('The Client must explain the nature of their business in writing in ANNEXURE-1 of this agreement\n\nThe Client agrees not to conduct or engage in any business that could be construed as illegal, defamatory, immoral, or obscene. Additionally, the Client agrees not to use the address of the Service Provider, whether directly or indirectly, for any such purposes.\n\nThe Client has described the nature of the business they plan to conduct at ' + data.serviceProviderName + ' as a virtual office in connection with this agreement\n\nIf the Client changes the nature of their business, they are required to notify the Service Provider in writing.');

    h.addSectionHeading('CONFLICTING BUSINESS');
    h.addParagraph('The client should not directly or indirectly or though agents operate a business that competes with Service provider’s business of providing serviced offices and virtual offices, shared conference rooms and meeting rooms.');

    h.addSectionHeading('GOVERNING LAW');
    h.addParagraph('This Agreement shall be governed by the laws of India. The Courts in Gurugram shall have exclusive jurisdiction over the subject matter of this Agreement. In the event of any dispute or differences arising out of or in connection with this agreement, the parties hereto agree that all such disputes shall be resolved exclusively by the Courts in Gurugram. The decision of the Courts in Gurugram shall be final and binding on both parties.');

    doc.addPage();
    h.addOrangeHeaderOnPage();

    let y = 40;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT TERMS AND TENURE AGREEMENT PERIOD : 11 MONTHS', h.margin, y);
    y += 8;
    doc.text('EFFECTIVE FROM', h.margin, y);
    y += 8;
    const endDate = new Date(data.startDate);
    endDate.setMonth(endDate.getMonth() + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      formatDate(data.startDate) + ' To ' + formatDate(endDate.toISOString()),
      h.margin, y
    );
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('AGREEMENT IS VALID FORM', h.margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Service provider’s Address is: ' + data.serviceProviderAddress, h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('THIS IS A FORMAL AGREEMENT ON CLIENT’S TERMS AND CONDITIONS.', h.margin, y);
    y += 6;
    doc.text('THIS IS NOT A LEASE OR DEED OR CAN NOT BE USED AS LEASE AGREEMENT.', h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.text('I AGREE TO THE ABOVE TERMS AND CONDITIONS', h.margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('FOR CLIENT :', h.margin, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    doc.text('Signature :', h.margin, y);
    y += 6;
    doc.text('Name : ' + (data.directorName || '___________'), h.margin, y);
    y += 6;
    doc.text('Designation/Title :', h.margin, y);
    y += 6;
    doc.text('Date of Sign :', h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 1', h.margin, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.text('Signature :', h.margin, y);
    y += 6;
    doc.text('Name :', h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 2', h.margin, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.text('Signature :', h.margin, y);
    y += 6;
    doc.text('Name :', h.margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.text('FOR Service Provider (' + data.serviceProviderName + ' )', h.margin, y);

    doc.addPage();
    h.addOrangeHeaderOnPage();
    y = 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ANNEXURE – 1', h.margin, y);
    y += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Client to describe about its nature of Business that it is planning to conduct at the ' + data.serviceProviderName + '’s Office in connection with this Agreement (in approx. 200 words):',
      h.margin, y, { maxWidth: h.contentWidth }
    );
    y += 15;
    const bizLines = doc.splitTextToSize(
      data.businessNature || '___', h.contentWidth
    );
    doc.text(bizLines, h.margin, y);
  };

  const buildNOC = (doc, data, h) => {
    let y = 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text(
      'NO OBJECTION CERTIFICATE',
      h.pageWidth / 2, y,
      { align: 'center' }
    );
    y += 6;
    doc.setLineWidth(0.5);
    doc.line(h.margin, y, h.pageWidth - h.margin, y);
    y += 14;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Date: ' + formatDate(data.nocDate), h.margin, y);
    y += 14;

    const nocText =
      'I, ' + (data.ownerName || '___________') + ', residing at ' + (data.ownerAddress || '___________') +
      ', being the lawful owner of the property situated at ' +
      (data.propertyAddress || '___________') + ', do hereby give my No Objection ' +
      'to M/s ' + (data.businessName || '___________') + ' represented by ' +
      (data.businessOwnerName || '___________') + ' to use the above mentioned address ' +
      'for the purpose of ' + (data.purpose || '___________') + ' in the state of ' +
      (data.state || '___________') + '.\n\n' +
      'I confirm that I have no objection to the use of the said ' +
      'premises address by the above-mentioned business entity for ' +
      'official registration and compliance purposes.\n\n' +
      'This NOC is issued in good faith and shall remain valid until ' +
      'revoked in writing by the undersigned.';

    const lines = doc.splitTextToSize(nocText, h.contentWidth);
    lines.forEach(line => {
      doc.text(line, h.margin, y);
      y += 7;
    });

    y += 20;
    doc.text('Signature: ___________________________', h.margin, y);
    y += 10;
    doc.text('Name: ' + (data.ownerName || '___________'), h.margin, y);
    y += 8;
    doc.text('Date: ' + formatDate(data.nocDate), h.margin, y);
    y += 8;
    doc.text('Address: ' + (data.ownerAddress ? doc.splitTextToSize(data.ownerAddress, h.contentWidth - 20).join(' ') : '___________'), h.margin, y);
  };

  const buildAuthorization = (doc, data, h) => {
    let y = 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Date: ' + formatDate(data.letterDate), h.margin, y);
    y += 14;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TO WHOMSOEVER IT MAY CONCERN', h.margin, y);
    y += 14;

    const authText =
      'This is to certify that ' + (data.authorizedPersonName || '___________') +
      ', ' + (data.authorizedPersonDesignation || '___________') + ' of ' +
      (data.companyName || '___________') + ', is hereby authorized to act on behalf ' +
      'of our company for the purpose of:\n\n' +
      (data.purpose || '___________') + '\n\n' +
      'This authorization is valid until ' +
      formatDate(data.validUntil) + '. ' +
      (data.authorizedPersonName || '___________') + ' is authorized to sign documents, ' +
      'represent the company, and take all necessary actions in ' +
      'connection with the above-mentioned purpose.\n\n' +
      'We request all concerned parties to extend their full ' +
      'cooperation to the above-named authorized representative.';

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(authText, h.contentWidth);
    lines.forEach(line => {
      doc.text(line, h.margin, y);
      y += 7;
    });

    y += 20;
    doc.text('For ' + (data.companyName || '___________'), h.margin, y);
    y += 20;
    doc.text('Signature: ___________________________', h.margin, y);
    y += 10;
    doc.text('Name: ' + (data.authorizedByName || '___________'), h.margin, y);
    y += 8;
    doc.text('Designation: ' + (data.authorizedByDesignation || '___________'), h.margin, y);
    y += 8;
    doc.text('Date: ' + formatDate(data.letterDate), h.margin, y);
  };

  const buildGurgaonWorkspaceAgreement = (doc, data, h) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('LEAVE AND LICENSE AGREEMENT', h.pageWidth / 2, h.yPos(), { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(h.margin, h.yPos() + 2, h.pageWidth - h.margin, h.yPos() + 2);
    h.setY(h.yPos() + 15);

    h.addParagraph(
      'This LEAVE AND LICENSE AGREEMENT is made on ' + formatDate(data.agreementDate) +
      ' between True Work Lounge, always be registered office address at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 through its Authorised Signator, Manoj Yadav, hereinafter referred to as "Licensor/ Services Provider", who has leased the premises and ' + (data.clientCompanyName || '___________') +
      ' through its Authorized person, ' + (data.directorName || '___________') +
      ' S/O ' + (data.directorFatherName || '___________') +
      ', R/O ' + (data.directorAddress || '___________') +
      ' with PAN No. ' + (data.panNumber || '___________') +
      ' and hereinafter referred to as "Client/ Licensee". (KYC is attached)'
    );

    h.addSectionHeading('WHEREAS');
    h.addParagraph('• The Licensor bearing address 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 has full and unfettered rights to lease/let out the said Premises (or a portion thereof) on such terms and conditions as it may think fit at its sole discretion.\n• The Client/ Licensee desire to take a property on lease so as to use the said property as its registered office for a period of eleven (11) months.\n• That the annually rent of the above said premises has been settled in between both the parties at a sum of Rupees 10,000/per annual in advance.\n• Pursuant thereto, the Licensor has agreed to permit the LICENSEE/ CLIENT to use the Licensed Premises on a Leave and License basis, and the LICENSEE/ CLIENT has agreed to take the Licensed Premises on license subject to the terms, covenants, conditions and agreements hereinafter contained.');

    h.addSectionHeading('EFFECTIVE DATE: ' + formatDate(data.startDate) + '   TERM: 11 Months');
    
    h.addSectionHeading('USE OF AND ACCESS TO THE LICENSED PREMISES');
    h.addParagraph('The Client/ Licensee is interested in using the office space (hereinafter referred to as the "Services") from the Licensor at its premise located at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 (hereinafter referred to as the "Premise").The whole of the Premise remains the property of the Service Provider and remains in the Licensor’s possession and control. The allowed usage for Licensee is mentioned in the clause ‘Terms of Usage’. This Agreement is personal to the Client/ Licensee and cannot be transferred to anyone else.');

    h.addSectionHeading('ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE.');
    h.addParagraph('The Services are offered to Client/ Licensee conditioned on acceptance without modification of the terms and conditions, contained in this Agreement. Client/ Licensee use of the Service constitutes its agreement and consent to the terms and conditions stated in this Agreement. Each person that uses the Premise, or enters into a contract, in writing or online, on behalf of its employer or other third party, represents that such person is authorized to accept these terms on its employer\'s or on third party\'s behalf. Unless explicitly stated otherwise, the Terms of Service will govern the use of any new features that augment or enhance the current Services, including the release of new resources and services. In the case of any violation of these terms, Service Provider reserves the right to cancel Services to Client/ Licensee immediately and seek all remedies available by law and in equity for such violations.');

    h.addSectionHeading('TERMS OF USAGE');
    h.addParagraph('The Client may use the address for its business correspondence.\nClients may also use the Office Address for obtaining GST, with the understanding that the client assumes the responsibility for complying with all the required provisions of applicable acts and laws.\nThe client may use the address of the designated centre as their additional office address.\nThe Licensee/Client is not permitted to avail of any credit facility, whether relating to any loans or any other forms of credit line, at this address.');

    h.addSectionHeading('LICENSE FEES');
    h.addParagraph('License fees are payable in advance. Any dues/delays in the License fees will cause the termination of the Services/Agreement on the expiration date set forth at the time of signup or payment. For late payments of renewals, the Client/ Licensee has to pay an additional INR 500 penalty per day, in addition to renewal license fees, for the delay in payment.');

    h.addSectionHeading('SERVICE RETAINER / DEPOSIT AMOUNT');
    h.addParagraph('If interested, the Client/ Licensee will be required to pay a service retainer/deposit fee of INR 1000+GST, at any time during the agreement, in case it wishes to use the "Courier Forwarding" facility. This amount will be kept separately from Subscription fees. This is an optional service for the Client/ Licensee. The client/ Licensee has to replenish the deposit when it reaches the minimum level. When the Client/ Licensee terminates the service, the entire balance of the deposit amount will be refunded to the Client/ Licensee.');

    h.addSectionHeading('ADDITIONAL SERVICES');
    h.addParagraph('The Client/ Licensee can receive registered and certified mail at the premises.\nService Provider will receive up to 10 letters or packages per month free of charge for the Client/ Licensee. For additional letters or packages, Service Provider will charge a handling fee of Rs.10 per letter/package. The service Provider will not accept packages more than 5 Kg in weight or 1 cubic foot in size. The Client/ Licensee can pick up the mail from the location free of cost. Service Provider shall not be liable for any mail not collected within 30 days from the date of receipt date of the package at the Premise.');

    h.addSectionHeading('TERMINATION OF SERVICE');
    h.addParagraph('The Client/ Licensee may decide to terminate the service at any time. Service will be automatically terminated on the expiry date unless the subscription is renewed. Upon termination of the agreement, the Client/ Licensee must cease the use of the address of the premise for any government registrations, and any Phone Numbers issued by the service provider to the Client/ Licensee immediately, from all places including but not limited to business cards, websites, stationary, advertising material, licenses, certificates etc.\n\nNotwithstanding any other provision under this Agreement, if the Client/ Licensee has used the address of the premise for registration with the registrar of companies, Statutory compliances authority, Banks, or other governmental authorities etc., it has to change the address submitted with such authorities within 30 (Thirty) days after the date of termination or expiry of this Agreement, unless otherwise agreed with the Service Provider. The Licensor reserves the right to take legal action against the Licensee if they are found in breach of this clause.\n\nService Provider reserves the right to terminate the service and this agreement without notice for any Client/ Licensee whose activity might adversely affect Service Provider\'s reputation or Service Provider’s normal operation.\nService Provider will terminate the service anytime (without issuing any termination notice) in case Client/ Licensee violates any clause or provision of this agreement, or Client//Licensee’s activities are reported to be fraudulent.\n\nAs our contract is of automatic renewal in nature, if the licensee is still using the address at end of the agreement term, the payment of the subscription services becomes due immediately. If the Licensee fails to process the renewal payment on time, the Licensor reserves the right to deactivate accounts and cancel subscription benefits of all legal Govt. registrations taken at the address, by informing the concerned government departments.');

    h.addSectionHeading('REFUND POLICY');
    h.addParagraph('Any License fee paid fully or partially non-refundable, unless the Licensor purposely terminates the agreement.');

    h.addSectionHeading('NATURE OF BUSINESS');
    h.addParagraph('Client/ Licensee has to explain its nature of business in writing on this agreement in Annexure 1 hereto. The Client/ Licensee agrees with the Service Provider not to carry on any business, which could be construed illegal, defamatory, immoral or obscene and agrees not to use the address of the premises, whether directly or indirectly for any such purpose or purposes. If the Client/ Licensee carries any business contrary to this understanding, the service provider is at liberty to terminate the agreement and shall not be responsible for any legal issues which may arise because of such illegal business.\n\nIf the Client/ Licensee changes the nature of business, it must notify the Service Provider in writing beforehand.');

    h.addSectionHeading('LIABILITY');
    h.addParagraph('Service Provider will not be liable for any loss sustained as a result of the Service Provider’s failure to provide the services as a result of any Software Glitches, Mechanical breakdown, Strike, Loss of electric power, or termination of the Service Provider\'s interest in the building containing the office. The Service Provider does not accept liability for actions, or services of/by third parties in any way whatsoever, including delays & Non-receipt of messages or communication due to delays or failures in the email, SMS or fax systems, Phone, courier or postal service.\n\nFurther, the Service Provider shall not be responsible or liable to Client/ Licensee for any loss or damage resulting to Client/ Licensee by reason including but not limited to flood, fire, hurricane, riots, explosion, acts of God, war, terror, governmental action, or any other cause which is beyond the reasonable control of the Service Provider.\n\nThe Client/ Licensee shall indemnify and keep and hold the Service provider fully indemnified and harmless from and against all claims, proceedings, damages, losses, actions, costs and expenses arising as a consequence of or out of this agreement or arising from any breach of rules and regulations of any applicable law.\n\nIn case the Client/ Licensee is unable to fulfil the obligations mentioned herein, this Agreement shall be deemed to be terminated therefrom. Apart from that if the Client/ Licensee violates any terms of this agreement, this agreement shall be terminated forthwith.');

    h.addSectionHeading('CONFIDENTIALITY');
    h.addParagraph('Client/ Licensee recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn the confidential information ("Confidential Information") about Service Provider. Client/ Licensee agrees that during the Term of this Agreement and thereafter: (a) Client/ Licensee shall provide, at a minimum, the care to avoid disclosure of unauthorized use of Confidential Information as is provided with respect to Client//Licensee\'s own similar information, but in no event less than a reasonable standard of care; (b) Client/ Licensee will use Confidential Information solely for the purposes of this Agreement; and (c) Client/ Licensee will not disclose Confidential Information to any third party without the express prior written consent of Service Provider unless required to do so under applicable law.\n\nSimilarly, the Service Provider recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Client/ Licensee. Service Provider agrees that during the Term of this Agreement and thereafter Service Provider shall provide, at a minimum, the care to avoid disclosure of unauthorized use of Confidential Information of Client/ Licensee.\n\nIf the Service Provider transfers its business or any business segment that provides services to the Client/ Licensee, Service Provider is authorized to transfer all user information to Service Provider\'s successor.');

    h.addSectionHeading('OWNERSHIP');
    h.addParagraph('All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials comprising the services are wholly owned by the Service Provider and/or its Licensor and service providers except where expressly stated otherwise. This agreement only provides a licensor to the Client/ Licensee to use the Premise and will not provide any leasehold rights to the Client/ Licensee. Client/ Licensee agrees that the Client/ Licensee is not the owner of any phone number assigned to them by the Service Provider. Upon termination of the agreement for any reason, such number may be reassigned to another Client/ Licensee.');

    doc.addPage();
    h.addOrangeHeaderOnPage();
    
    let y = 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('Brief about Company Operations (up to 200 words)', h.margin, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    const bizLines = doc.splitTextToSize(data.businessNature || '___', h.contentWidth);
    bizLines.forEach(line => {
      doc.text(line, h.margin, y);
      y += 6;
    });
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('Client/Licensee’s Address will be:', h.margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(data.clientCompanyName || '___________', h.margin, y);
    y += 6;
    doc.text('02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102', h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('THIS IS A FORMAL AGREEMENT ON Licensee’s TERMS AND CONDITIONS.', h.margin, y);
    y += 6;
    doc.text('I AGREE TO THE ABOVE TERMS AND CONDITIONS.', h.margin, y);
    y += 20;

    doc.text('For Licensor:', h.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    y += 15;
    doc.text('Signature: ___________________________', h.margin, y);
    y += 6;
    doc.text('Name: Manoj Yadav', h.margin, y);
    y += 6;
    doc.text('Designation/Title: Authorised Signatory', h.margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('For Licensee:', h.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    y += 15;
    doc.text('Signature: ___________________________', h.margin, y);
    y += 6;
    doc.text('Name: ' + (data.directorName || '___________'), h.margin, y);
    y += 6;
    doc.text('Designation/Title: Authorized person', h.margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('WITNESS 1', h.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    y += 8;
    doc.text('Name:-', h.margin, y);
    y += 6;
    doc.text('Adhar Number:-', h.margin, y);
    y += 6;
    doc.text('Adhar Linked Mobile No:-', h.margin, y);
    y += 6;
    doc.text('Signature:-', h.margin, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('WITNESS 2', h.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    y += 8;
    doc.text('Name:-', h.margin, y);
    y += 6;
    doc.text('Adhar Number:-', h.margin, y);
    y += 6;
    doc.text('Adhar Linked Mobile No:-', h.margin, y);
    y += 6;
    doc.text('Signature:-', h.margin, y);
  };

  const buildGurgaonNOC = (doc, data, h) => {
    let y = 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text('Date: ' + formatDate(data.nocDate), h.margin, y);
    y += 14;

    doc.text('To', h.margin, y);
    y += 6;
    doc.text((data.directorName || '___________') + ' S/O ' + (data.directorFatherName || '___________') + ',', h.margin, y);
    y += 6;
    doc.text('Address: R/o ' + (data.directorAddress || '___________'), h.margin, y);
    y += 6;
    doc.text('Company Name: ' + (data.clientCompanyName || '___________'), h.margin, y);
    y += 6;
    doc.text('Aadhaar No.: ' + (data.aadharNumber || '___________'), h.margin, y);
    y += 14;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 17, 16);
    doc.text('Subject: No Objection Certificate (NOC)', h.margin, y);
    y += 14;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text('Dear Sir,', h.margin, y);
    y += 10;

    const nocText = 
      'We True Work lounge LLP having its office space at "02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102" hereby declare and confirm that we are the legal lease owner of the above mentioned office premises and hereby allow Company "' + (data.clientCompanyName || '___________') + '" to use the above-mentioned address as the Registered Office (GST Address office/Office) of Company ' + (data.clientCompanyName || '___________') + '.\n\n' +
      'Further, we have no objection if Company "' + (data.clientCompanyName || '___________') + '" carries any business-related activity in the above-mentioned address.\n\n' +
      (data.directorName || '___________') + ', (Aadhar Number : ' + (data.aadharNumber || '___________') + ' ) further agrees that this above address can only be used till the expiry of Office use at this premise including renewal period, if any. On expiry or termination of Registered Office Membership Letter-Terms of Offer ' + (data.directorName || '___________') + ' has to immediately take all steps to remove / de-list the company address ' + (data.clientCompanyName || '___________') + ' of the premises "02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102" from the records of above mentioned appropriate authority and from all registrations / filings etc. with statutory / government authorities and mandatorily shall keep True Work lounge LLP informed of the same in writing and also shall provide a proof of such removal to True Work lounge LLP within 2 weeks prior to termination or expiration of the membership agreement.\n\n' +
      (data.directorName || '___________') + ' shall be solely responsible for the complete compliance of such registration taken and it is furthermore agreed that True Work lounge LLP will have no responsibility whatsoever.';

    const lines = doc.splitTextToSize(nocText, h.contentWidth);
    lines.forEach(line => {
      if (y > h.pageWidth * 1.4) {
        doc.addPage();
        h.addOrangeHeaderOnPage();
        y = 25;
      }
      doc.text(line, h.margin, y);
      y += 6;
    });

    y += 20;
    doc.text('For True Work lounge LLP', h.margin, y);
    y += 30;
    doc.text('Authorized Signatory', h.margin, y);
    y += 10;
    doc.text('Gurgaon', h.margin, y);
  };


  const getCalculatedEndDate = () => {
    if (!formData.startDate) return '';
    const date = new Date(formData.startDate);
    date.setMonth(date.getMonth() + 11);
    return date.toISOString().split('T')[0];
  };

  const renderField = (label, id, type = 'text', props = {}) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="text-[12px] font-[600] text-[rgba(17,17,16,0.5)] tracking-[0.04em] mb-[6px]">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={`field-${id}`}
            value={formData[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className="bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[#111110] w-full font-sans focus:border-[rgba(27,107,47,0.4)] focus:outline-none transition-colors"
            {...props}
          />
        ) : type === 'select' ? (
          <select
            id={`field-${id}`}
            value={formData[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className="bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[#111110] w-full font-sans focus:border-[rgba(27,107,47,0.4)] focus:outline-none transition-colors h-[42px]"
            {...props}
          >
            {props.options && props.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            id={`field-${id}`}
            type={type}
            value={formData[id] || ''}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className="bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[#111110] w-full font-sans focus:border-[rgba(27,107,47,0.4)] focus:outline-none transition-colors h-[42px]"
            {...props}
          />
        )}
      </div>
    );
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    const renderPreviewContent = () => {
      if (selectedTemplate.id === 'workspace-agreement') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>WORK SPACE SERVICE CONTRACT</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            
            <p><strong>THE TWO PARTIES TO THE AGREEMENT ARE AS FOLLOWS</strong></p>
            <p>This AGREEMENT made on {formatDate(formData.agreementDate)} between {formData.serviceProviderName || '___________'} herein after referred to as Service Provider having office at {formData.serviceProviderAddress || '___________'} and {formData.clientCompanyName || '___________'} through it’s Director {formData.directorName || '___________'}, S/O {formData.directorFatherName || '___________'}, R/O {formData.directorAddress || '___________'} PAN Number {formData.panNumber || '___________'} with Mobile Number {formData.mobileNumber || '___________'} here in after referred to as "Client".</p>
            
            <p><strong>THE NATURE OF THE AGREEMENT</strong><br/>
            The Client intends to use the Mailbox Services provided by {formData.serviceProviderName || '___________'} , located at {formData.serviceProviderAddress || '___________'}, as their communication and mailing address. The Client acknowledges that the entire premises, including the mailbox, remain the exclusive property of the Service Provider, {formData.serviceProviderName || '___________'}, who retains full possession, control, and authority over the space. The Client further acknowledges that their usage is limited solely to the agreed-upon services, and no rights or claims to the property or its facilities are transferred to them.</p>
            
            <p><strong>ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE</strong><br/>
            The Services are provided to the Client strictly under the terms and conditions set by {formData.serviceProviderName || '___________'} (the "Service Provider"). The Client's use of these Services constitutes full and unconditional acceptance of all terms and conditions outlined in this Agreement, without exception.<br/><br/>
            Any individual utilizing the Services or entering a contract, whether in writing or online, on behalf of their employer or a third party, affirms that they have the full legal authority to bind their employer or the third party to these terms. Unless explicitly stated by the Service Provider, these Terms of Service will apply to any new features, services, or resources introduced by {formData.serviceProviderName || '___________'}, including the release of new offerings that augment or enhance the current Services.</p>

            <p><strong>USAGE OF ADDRESS</strong><br/>
            The Client may use the provided address solely for business correspondence purposes. The Client may also choose, at their own risk and liability, to designate the address as their "Principal Place of Business for ROC Registration, GST Registrations, opening bank accounts, or dealings with central/state governments or any other authorities.<br/><br/>
            The Service Provider, {formData.serviceProviderName || '___________'}, holds no responsibility or liability for any consequences, legal or otherwise, arising from such use. The Client assumes full responsibility for ensuring compliance with all legal and regulatory requirements in connection with the use of the address under this agreement.</p>

            <p><strong>RENT / SUBSCRIPTION FEES</strong><br/>
            The Client agrees to pay the rent/subscription fees for a period of 11 months in advance to the Service Provider. This implies that the Client pays upfront for the services to be received over the next 11 months.</p>

            <p><strong>AGREEMENT RENEWAL</strong><br/>
            The Client must renew the agreement in the 11th month from the date of commencement. Failure to do so allows the Service Provider or any designated party to terminate the contract.</p>

            <p><strong>TAX INVOICE AND SETTLEMENT</strong><br/>
            The Service Provider will issue a tax invoice for the services rendered in the previous month. The Client is required to settle all valid invoices within 30 days of receipt.</p>

            <p><strong>TERMINATION FOR NON-PAYMENT</strong><br/>
            Failure to pay the rent/subscription fees will result in the termination of services on the specified expiration date agreed upon during signup or payment.</p>

            <p><strong>LATE PAYMENT INTEREST</strong><br/>
            In the case of late payments, the Client/agreement holder may be charged an additional amount as interest. The interest rate for delays exceeding 30 days is set at 12% per annum on a pro-rata basis.</p>

            <p><strong>INDEMNITY</strong><br/>
            <strong>1. COMPLIANCE WITH LAWS</strong><br/>
            The Client is solely responsible for ensuring full compliance with all applicable laws, including but not limited to the Companies Act, GST, and other relevant regulations. The Client agrees to indemnify and hold {formData.serviceProviderName || '___________'} (the "Service Provider") fully indemnified and harmless against any claims, proceedings, damages, losses, actions, costs, or expenses arising from this agreement or any breach of applicable laws.</p>

            <p><strong>2. INDEMNIFICATION</strong><br/>
            The Client agrees not to use the premises address to apply for any loans, credit cards, or financial services. The Service Provider is fully indemnified against any liabilities arising from such use or any claims related to the Client’s financial dealings or obligations.</p>

            <p><strong>3. LIMITED SCOPE OF SERVICE</strong><br/>
            {formData.serviceProviderName || '___________'} is only providing mailbox services to the Client. The Service Provider does not hold any responsibility for the Client's business activities, and any consequences arising from those activities are solely the Client's responsibility.</p>

            <p><strong>4. VISITOR RESPONSIBILITY</strong><br/>
            The client is responsible for ensuring that any visitors or clients entering {formData.serviceProviderName || '___________'}’s workspace for any purpose must provide prior notice to {formData.serviceProviderName || '___________'} and ensure compliance with the Service Provider's policies and guidelines. {formData.serviceProviderName || '___________'} shall not be held liable for the actions or conduct of the client's visitors, nor for any breaches of workspace rules by them. It is acknowledged that the client does not hold any physical possession of the premises. The client is required to book a cabin on an hourly basis to conduct meetings within the premises, as the client holds only a virtual office subscription.</p>

            <p><strong>5. GUEST POLICY</strong><br/>
            While {formData.serviceProviderName || '___________'} welcomes the Client’s guests for meetings or project work, it is the Client’s duty to ensure their guests comply with all workspace policies. Any violations of these policies will be the responsibility of the Client.</p>

            <p><strong>6. FINACIAL TRANSACTIONS</strong><br/>
            The Client is solely responsible for all financial transactions conducted with their clients, including payments for services or products. {formData.serviceProviderName || '___________'} assumes no responsibility for any financial dealings between the Client and their clients.</p>

            <p><strong>7. DISPUTE RESOLUTION</strong><br/>
            In the event of a dispute between the Client and their clients, {formData.serviceProviderName || '___________'} holds no responsibility for resolving such disputes. The Client is fully responsible for managing and resolving any disputes in a timely and professional manner.</p>

            <p><strong>8. WORKSPACE ENVIRONMENT</strong><br/>
            To maintain a professional and productive environment, the Client and their visitors are expected to adhere to {formData.serviceProviderName || '___________'}'s policies at all times. Any failure to comply with these guidelines may result in penalties or termination of services by {formData.serviceProviderName || '___________'}, at its sole discretion.<br/><br/>
            Please note that {formData.serviceProviderName || '___________'} is only providing mailbox services to the Client. As such, the Service Provider does not hold any responsibility for the Client’s business activities. It is the Client’s responsibility to ensure that their visitors follow our policies and guidelines while using the workspace.</p>

            <p><strong>TERMINATION OF SERVICE</strong><br/>
            <strong>1. TERMINATION BY SERVICE PROVIDER</strong><br/>
            The Service Provider reserves the right to terminate the service at any time with at least 30 days' prior written notice. In such cases, any security deposit paid by the Client will be refunded.</p>

            <p><strong>2. AUTOMATIC TERMINATION</strong><br/>
            Services will be automatically terminated on the expiry date unless the Client renews the subscription before that date. The Service Provider holds no responsibility for any loss or disruption caused by the Client’s failure to renew.</p>

            <p><strong>3. OBLIGATIONS AFTER TERMINATION</strong><br/>
            Upon termination of the service, the Client must immediately cease the use of the provided address and any phone numbers issued by the Service Provider. This includes removing the address from all materials, including but not limited to business cards, websites, stationery, advertising material, certificates, and any public or private platforms.</p>

            <p><strong>4. CHANGE OF ADDRESS FOR REGISTRATIONS</strong><br/>
            If the Client has used the address for registrations with the ROC, GST authorities, banks, or any other official purposes, the Client is required to update the address within 30 days of termination. The Service Provider reserves the right to take legal action against any Client found in breach of this requirement.</p>

            <p><strong>5. TERMINATION WITHOUT NOTICE FOR ILLEGAL ACTIVITIES</strong><br/>
            The Service Provider reserves the right to terminate the service and agreement immediately, without prior notice, if the Client engages in any illegal activities or conducts business in a manner that could damage the Service Provider's reputation or disrupt its operations.</p>

            <p><strong>6. TERMINATION FOR VIOLATION OR FRAUD</strong><br/>
            The Service Provider may terminate the service with 30 days’ written notice if the Client violates any clause in this agreement or if the Client's activities are reported to be fraudulent or harmful to the Service Provider's interests.</p>

            <p><strong>7. RENEWAL REQUIREMENT</strong><br/>
            The Client is obligated to renew the subscription by the 11th month from the contract start date. This requirement applies regardless of whether the Client has engaged through an aggregator platform or a third-party intermediary. Failure to renew the subscription within this specified period will result in the automatic termination of the contract, rendering it null and void. In such circumstances, the Service Provider assumes no responsibility or liability for any disruptions, losses, or consequences incurred by the Client due to the lapse in subscription renewal.<br/><br/>
            Even if the Client has come through an aggregator platform or a third-party intermediary, the Service Provider reserves the right to directly reach out to the Client and offer them the opportunity to renew the subscription directly as well.</p>

            <p><strong>8. NO LIABILITY POST-TERMINATION</strong><br/>
            Upon termination of the service, whether automatically or by action of the Service Provider, the Client fully and irrevocably releases the Service Provider from any and all responsibility, liability, or claims for any consequences, losses, or damages arising from the termination. Furthermore, the Client is required to immediately cease the use of the provided address in all forms and remove it from all platforms, documents, and communications where it was utilized under the valid agreement. The Client must also provide a formal declaration to the Service Provider, affirming that the address is no longer in use. Failure to comply with this requirement may result in legal action and additional penalties as determined by the Service Provider.</p>

            <p><strong>CONFIDENTIALITY</strong><br/>
            The Client recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Service Provider. The Client agrees that during the Term of this Agreement and thereafter:<br/><br/>
            (a) The Client shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information, but in no event less than a reasonable standard of care.<br/>
            (b) The Client will use Confidential Information solely for the purposes of this Agreement; and<br/>
            (c) The Client will not disclose Confidential Information to any third party without the express prior written consent of the Service Provider.<br/><br/>
            Similarly, the Service Provider recognizes that it may, in the course of providing the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Client. The Service Provider agrees that during the Term of this Agreement and thereafter, the Service Provider shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information. If the Service Provider transfers its business or any business segment that provides services to the Client, the Service Provider is authorized to transfer all user information to the Service Provider’s successor.</p>

            <p><strong>OWNERSHIP</strong><br/>
            All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials comprising the Service are wholly owned by the Service provider. Service provider except where expressly stated otherwise. This is not a lease document. Client agrees that the client is not the service provider of any phone number assigned to them by service provider. Upon termination of account for any reason, such number may be re assigned to another client.<br/><br/>
            Similarly, all programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials of the client shall be owned by the client only.</p>

            <p><strong>NATURE OF BUSINESS</strong><br/>
            The Client must explain the nature of their business in writing in ANNEXURE-1 of this agreement<br/><br/>
            The Client agrees not to conduct or engage in any business that could be construed as illegal, defamatory, immoral, or obscene. Additionally, the Client agrees not to use the address of the Service Provider, whether directly or indirectly, for any such purposes.<br/><br/>
            The Client has described the nature of the business they plan to conduct at {formData.serviceProviderName || '___________'} as a virtual office in connection with this agreement<br/><br/>
            If the Client changes the nature of their business, they are required to notify the Service Provider in writing.</p>

            <p><strong>CONFLICTING BUSINESS</strong><br/>
            The client should not directly or indirectly or though agents operate a business that competes with Service provider’s business of providing serviced offices and virtual offices, shared conference rooms and meeting rooms.</p>

            <p><strong>GOVERNING LAW</strong><br/>
            This Agreement shall be governed by the laws of India. The Courts in Gurugram shall have exclusive jurisdiction over the subject matter of this Agreement. In the event of any dispute or differences arising out of or in connection with this agreement, the parties hereto agree that all such disputes shall be resolved exclusively by the Courts in Gurugram. The decision of the Courts in Gurugram shall be final and binding on both parties.</p>

            <div style={{ marginTop: '30px' }}>
              <p><strong>PAYMENT TERMS AND TENURE AGREEMENT PERIOD : 11 MONTHS</strong></p>
              <p>EFFECTIVE FROM</p>
              <p>{formatDate(formData.startDate)} To {formatDate(getCalculatedEndDate())}</p>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <p><strong>AGREEMENT IS VALID FORM</strong></p>
              <p>Service provider’s Address is: {formData.serviceProviderAddress || '___________'}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <p><strong>THIS IS A FORMAL AGREEMENT ON CLIENT’S TERMS AND CONDITIONS.</strong></p>
              <p>THIS IS NOT A LEASE OR DEED OR CAN NOT BE USED AS LEASE AGREEMENT.</p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <p>I AGREE TO THE ABOVE TERMS AND CONDITIONS</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <div>
                <p><strong>FOR CLIENT :</strong></p>
                <p style={{ marginTop: '20px' }}>Signature : _______________</p>
                <p>Name : {formData.directorName || '___________'}</p>
                <p>Designation/Title : ____________</p>
                <p>Date of Sign : ____________</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <div>
                <p><strong>WITNESS 1</strong></p>
                <p style={{ marginTop: '20px' }}>Signature : _______________</p>
                <p>Name : ___________________</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <div>
                <p><strong>WITNESS 2</strong></p>
                <p style={{ marginTop: '20px' }}>Signature : _______________</p>
                <p>Name : ___________________</p>
              </div>
            </div>
            
            <div style={{ marginTop: '40px' }}>
              <p>FOR Service Provider ({formData.serviceProviderName || '___________'})</p>
            </div>

            <hr style={{ margin: '40px 0' }} />
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>ANNEXURE – 1</p>
            <p>Client to describe about its nature of Business that it is planning to conduct at the {formData.serviceProviderName || '___________'}’s Office in connection with this Agreement (in approx. 200 words):</p>
            <p>{formData.businessNature || '___'}</p>
          </>
        );
      } else if (selectedTemplate.id === 'noc') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>NO OBJECTION CERTIFICATE</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p>Date: {formatDate(formData.nocDate)}</p>
            <p style={{ marginTop: '20px' }}>
              I, {formData.ownerName || '___________'}, residing at {formData.ownerAddress || '___________'}, being the lawful owner of the property situated at {formData.propertyAddress || '___________'}, do hereby give my No Objection to M/s {formData.businessName || '___________'} represented by {formData.businessOwnerName || '___________'} to use the above mentioned address for the purpose of {formData.purpose || '___________'} in the state of {formData.state || '___________'}.
            </p>
            <p>I confirm that I have no objection to the use of the said premises address by the above-mentioned business entity for official registration and compliance purposes.</p>
            <p>This NOC is issued in good faith and shall remain valid until revoked in writing by the undersigned.</p>
            <div style={{ marginTop: '50px' }}>
              <p>Signature: ___________________________</p>
              <p>Name: {formData.ownerName || '___________'}</p>
              <p>Date: {formatDate(formData.nocDate)}</p>
              <p>Address: {formData.ownerAddress || '___________'}</p>
            </div>
          </>
        );
      } else if (selectedTemplate.id === 'authorization') {
        return (
          <>
            <p>Date: {formatDate(formData.letterDate)}</p>
            <p style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '14px' }}>TO WHOMSOEVER IT MAY CONCERN</p>
            <p style={{ marginTop: '20px' }}>
              This is to certify that {formData.authorizedPersonName || '___________'}, {formData.authorizedPersonDesignation || '___________'} of {formData.companyName || '___________'}, is hereby authorized to act on behalf of our company for the purpose of:
            </p>
            <p>{formData.purpose || '___________'}</p>
            <p>
              This authorization is valid until {formatDate(formData.validUntil)}. {formData.authorizedPersonName || '___________'} is authorized to sign documents, represent the company, and take all necessary actions in connection with the above-mentioned purpose.
            </p>
            <p>We request all concerned parties to extend their full cooperation to the above-named authorized representative.</p>
            <div style={{ marginTop: '50px' }}>
              <p>For {formData.companyName || '___________'}</p>
              <p style={{ marginTop: '40px' }}>Signature: ___________________________</p>
              <p>Name: {formData.authorizedByName || '___________'}</p>
              <p>Designation: {formData.authorizedByDesignation || '___________'}</p>
              <p>Date: {formatDate(formData.letterDate)}</p>
            </div>
          </>
        );
      } else if (selectedTemplate.id === 'gurgaon-workspace-agreement') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>LEAVE AND LICENSE AGREEMENT</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p>This LEAVE AND LICENSE AGREEMENT is made on {formatDate(formData.agreementDate)} between True Work Lounge, always be registered office address at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 through its Authorised Signator, Manoj Yadav, hereinafter referred to as "Licensor/ Services Provider", who has leased the premises and {formData.clientCompanyName || '___________'} through its Authorized person, {formData.directorName || '___________'} S/O {formData.directorFatherName || '___________'}, R/O {formData.directorAddress || '___________'} with PAN No. {formData.panNumber || '___________'} and hereinafter referred to as "Client/ Licensee". (KYC is attached)</p>
            <p><strong>EFFECTIVE DATE:</strong> {formatDate(formData.startDate)} <strong>TERM:</strong> 11 Months</p>
            <p><strong>USE OF AND ACCESS TO THE LICENSED PREMISES</strong></p>
            <p>The Client/ Licensee is interested in using the office space (hereinafter referred to as the "Services") from the Licensor at its premise located at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 (hereinafter referred to as the "Premise"). The whole of the Premise remains the property of the Service Provider and remains in the Licensor's possession and control.</p>
            <p><strong>TERMS OF USAGE</strong></p>
            <p>The Client may use the address for its business correspondence. Clients may also use the Office Address for obtaining GST, with the understanding that the client assumes the responsibility for complying with all the required provisions of applicable acts and laws.</p>
            <div style={{ marginTop: '30px' }}>
              <p>For Licensor:<br/>Name: Manoj Yadav<br/>Designation/Title: Authorised Signatory</p>
            </div>
            <div style={{ marginTop: '30px' }}>
              <p>For Licensee:<br/>Name: {formData.directorName || '___________'}<br/>Designation/Title: Authorized person</p>
            </div>
          </>
        );
      } else if (selectedTemplate.id === 'gurgaon-noc') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>NO OBJECTION CERTIFICATE</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p>Date: {formatDate(formData.nocDate)}</p>
            <p>To<br/>{formData.directorName || '___________'} S/O {formData.directorFatherName || '___________'},<br/>Address: R/o {formData.directorAddress || '___________'}<br/>Company Name: {formData.clientCompanyName || '___________'}<br/>Aadhaar No.: {formData.aadharNumber || '___________'}</p>
            <p>We True Work lounge LLP having its office space at "02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102" hereby declare and confirm that we are the legal lease owner of the above mentioned office premises and hereby allow Company "{formData.clientCompanyName || '___________'}" to use the above-mentioned address as the Registered Office (GST Address office/Office) of Company {formData.clientCompanyName || '___________'}.</p>
            <div style={{ marginTop: '30px' }}>
              <p>For True Work lounge LLP</p>
              <br/><br/>
              <p>Authorized Signatory<br/>Gurgaon</p>
            </div>
          </>
        );
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[1000] flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] w-[700px] max-w-[calc(100vw-32px)] max-h-[85vh] flex flex-col overflow-hidden relative fade-up-enter shadow-2xl">
          <div className="p-[16px_24px] border-b border-[rgba(17,17,16,0.08)] flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="text-[15px] font-[700] text-[#111110]">Draft Preview — {selectedTemplate.name}</div>
            <div className="flex gap-2 items-center">
              <button onClick={() => { setShowPreview(false); handleDownload(); }} className="bg-[#1B6B2F] text-white px-4 h-[36px] rounded-[100px] text-[13px] font-[600] hover:bg-[#145324] transition-colors flex items-center gap-2">
                <Download size={14} /> Download PDF
              </button>
              <button onClick={() => setShowPreview(false)} className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[rgba(17,17,16,0.05)] text-[rgba(17,17,16,0.4)] transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-[40px_48px] overflow-y-auto" style={{ fontFamily: '"Times New Roman", serif', fontSize: '13px', lineHeight: '1.8', color: '#111110' }}>
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] flex flex-col items-center justify-center px-4 font-sans pb-10">
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .shake-animation {
            animation: shake 0.3s ease-in-out;
          }
        `}</style>
        <img src="/logo.png" alt="BOS Logo" className="h-[40px] mb-10 object-contain" />
        <div className="bg-white rounded-[20px] border border-[rgba(17,17,16,0.08)] p-[40px] w-[380px] max-w-[calc(100vw-32px)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-center fade-up-enter">
          <Lock className="w-[40px] h-[40px] text-[#1B6B2F] mx-auto mb-[16px]" />
          <h1 className="text-[22px] font-[800] text-[#111110] mb-[6px]">Document Draft Generator</h1>
          <p className="text-[14px] text-[rgba(17,17,16,0.45)] mb-[28px]">Enter the access password to continue</p>
          
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`h-[48px] w-full bg-[#F9F8F5] border rounded-[10px] px-[14px] text-[15px] font-sans mb-[16px] focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] focus:outline-none transition-colors ${passwordError ? 'border-[#DC2626] shake-animation' : 'border-[rgba(17,17,16,0.1)]'}`}
          />
          {passwordError && (
            <div className="text-[#DC2626] text-[12px] mb-3 -mt-2">Incorrect password</div>
          )}
          <button 
            onClick={handlePasswordSubmit}
            className="bg-[#1B6B2F] text-white h-[48px] w-full rounded-[100px] text-[14px] font-[700] hover:bg-[#155526] hover:-translate-y-[1px] transition-all"
          >
            Access Documents →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans">
      <PreviewModal />
      <div className="max-w-[1100px] mx-auto p-[40px_24px] fade-up-enter">
        <div className="flex justify-between items-center mb-[40px]">
          <img src="/logo.png" alt="BOS Logo" className="h-[30px] object-contain" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] font-[600] text-[rgba(17,17,16,0.45)] hover:text-[#111110] transition-colors bg-white px-4 py-2 rounded-full border border-[rgba(17,17,16,0.08)] hover:shadow-sm"
          >
            <Lock size={14} /> Logout
          </button>
        </div>

        <div className="mb-[32px]">
          <span className="inline-block bg-[rgba(27,107,47,0.08)] text-[#1B6B2F] rounded-[100px] px-[12px] py-[4px] text-[10px] font-[600] tracking-[0.1em] mb-[16px]">DOCUMENT DRAFTS</span>
          <h1 className="text-[clamp(28px,4vw,40px)] font-[800] text-[#111110] leading-tight">Generate Document Drafts</h1>
          <p className="text-[15px] text-[rgba(17,17,16,0.45)] mt-[8px]">Select a template, fill in the details, and download your draft instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-[32px] items-start">
          
          <div className="flex flex-col gap-[10px] md:order-1">
            <div className="text-[11px] font-[600] text-[rgba(17,17,16,0.4)] tracking-[0.1em] mb-[6px]">SELECT TEMPLATE</div>
            <div className="flex md:flex-col gap-[10px] overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {TEMPLATES.map(t => {
                const isSelected = selectedTemplate.id === t.id;
                const Icon = t.icon;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`min-w-[240px] md:min-w-0 flex items-start gap-4 p-[16px_18px] rounded-[14px] cursor-pointer transition-all duration-200 ${isSelected ? 'border-[1.5px] border-[#1B6B2F] bg-[rgba(27,107,47,0.02)]' : 'border border-[rgba(17,17,16,0.08)] bg-white hover:border-[rgba(27,107,47,0.2)] hover:translate-x-[2px]'}`}
                  >
                    <Icon className="w-[20px] h-[20px] text-[#F4831F] mt-[2px] shrink-0" />
                    <div>
                      <div className="text-[14px] font-[700] text-[#111110] mb-[2px]">{t.name}</div>
                      <div className="text-[12px] text-[rgba(17,17,16,0.45)] leading-snug">{t.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:order-2">
            <div className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] p-[28px] shadow-sm">
              <h2 className="text-[18px] font-[700] text-[#111110] mb-[20px]">{selectedTemplate.name}</h2>
              
              {selectedTemplate.id === 'workspace-agreement' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Agreement Date', 'agreementDate', 'date')}
                    {renderField('Agreement Start Date', 'startDate', 'date')}
                  </div>
                  {renderField('Service Provider Name', 'serviceProviderName', 'text', { placeholder: 'Bharat Office Setu Pvt. Ltd.' })}
                  {renderField('Service Provider Address', 'serviceProviderAddress', 'textarea', { rows: 2 })}
                  {renderField('Client Company Name', 'clientCompanyName', 'text', { placeholder: 'e.g. TOPMIND COMMUNICATION PRIVATE LIMITED' })}
                  {renderField('Director / Authorized Person Name', 'directorName', 'text', { placeholder: 'e.g. GEORGE THARIAN' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Father\'s Name (S/O)', 'directorFatherName', 'text', { placeholder: 'S/O ...' })}
                    {renderField('PAN Number', 'panNumber', 'text', { placeholder: 'e.g. AAGCT7723A' })}
                  </div>
                  {renderField('Director\'s Residential Address', 'directorAddress', 'textarea', { rows: 2, placeholder: 'Residential address of director' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Mobile Number', 'mobileNumber', 'text', { placeholder: '10-digit mobile' })}
                    {renderField('Agreement End Date (11 months)', 'endDate', 'text', { value: `Auto: ${getCalculatedEndDate()}`, readOnly: true, className: 'bg-[rgba(17,17,16,0.03)] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[rgba(17,17,16,0.6)] w-full font-sans h-[42px] cursor-not-allowed' })}
                  </div>
                  {renderField('Nature of Business (Annexure-1)', 'businessNature', 'textarea', { rows: 3, placeholder: 'Brief description of client\'s business...' })}
                </div>
              )}

              {selectedTemplate.id === 'noc' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('NOC Date', 'nocDate', 'date')}
                    {renderField('State', 'state', 'text', { placeholder: 'e.g. Maharashtra' })}
                  </div>
                  {renderField('Property Owner Name', 'ownerName', 'text', { placeholder: 'Full name of property owner' })}
                  {renderField('Owner\'s Address', 'ownerAddress', 'textarea', { rows: 2 })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Business / Company Name', 'businessName', 'text', { placeholder: 'Company / business name' })}
                    {renderField('Business Owner Name', 'businessOwnerName', 'text', { placeholder: 'Name of business owner' })}
                  </div>
                  {renderField('Property Address (for GST)', 'propertyAddress', 'textarea', { rows: 2, placeholder: 'Full address of the property' })}
                  {renderField('Purpose of NOC', 'purpose', 'select', { options: ['GST Registration', 'Company Registration', 'Bank Account Opening', 'Business Registration', 'Other'] })}
                </div>
              )}

              {selectedTemplate.id === 'authorization' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Letter Date', 'letterDate', 'date')}
                    {renderField('Valid Until Date', 'validUntil', 'date')}
                  </div>
                  {renderField('Company Name', 'companyName', 'text', { placeholder: 'Authorizing company name' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Authorized By (Name)', 'authorizedByName', 'text', { placeholder: 'Name of person giving authority' })}
                    {renderField('Designation', 'authorizedByDesignation', 'text', { placeholder: 'e.g. Managing Director' })}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Name of Authorized Person', 'authorizedPersonName', 'text', { placeholder: 'Name of person being authorized' })}
                    {renderField('Authorized Person\'s Designation', 'authorizedPersonDesignation', 'text', { placeholder: 'e.g. Manager' })}
                  </div>
                  {renderField('Purpose / Scope of Authorization', 'purpose', 'textarea', { rows: 2, placeholder: 'Purpose of authorization...' })}
                </div>
              )}

              {selectedTemplate.id === 'gurgaon-workspace-agreement' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Agreement Date', 'agreementDate', 'date')}
                    {renderField('Agreement Start Date', 'startDate', 'date')}
                  </div>
                  {renderField('Client Company Name', 'clientCompanyName', 'text', { placeholder: 'e.g. COMPANY PRIVATE LIMITED' })}
                  {renderField('Authorized Person Name', 'directorName', 'text', { placeholder: 'e.g. JOHN DOE' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Father\'s Name (S/O)', 'directorFatherName', 'text', { placeholder: 'S/O ...' })}
                    {renderField('PAN Number', 'panNumber', 'text', { placeholder: 'e.g. ABCDE1234F' })}
                  </div>
                  {renderField('Authorized Person\'s Address', 'directorAddress', 'textarea', { rows: 2, placeholder: 'Residential address' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Mobile Number', 'mobileNumber', 'text', { placeholder: '10-digit mobile' })}
                    {renderField('Aadhar Number', 'aadharNumber', 'text', { placeholder: '12-digit aadhar' })}
                  </div>
                  {renderField('Nature of Business', 'businessNature', 'textarea', { rows: 3, placeholder: 'Brief description of client\'s business...' })}
                </div>
              )}

              {selectedTemplate.id === 'gurgaon-noc' && (
                <div className="flex flex-col gap-1">
                  {renderField('NOC Date', 'nocDate', 'date')}
                  {renderField('Company Name', 'clientCompanyName', 'text', { placeholder: 'Company / business name' })}
                  {renderField('Director / Authorized Person', 'directorName', 'text', { placeholder: 'Name' })}
                  {renderField('Father\'s Name (S/O)', 'directorFatherName', 'text', { placeholder: 'S/O ...' })}
                  {renderField('Director\'s Address', 'directorAddress', 'textarea', { rows: 2, placeholder: 'Residential address' })}
                  {renderField('Aadhar Number', 'aadharNumber', 'text', { placeholder: '12-digit aadhar' })}
                </div>
              )}

              <div className="mt-[32px] flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handlePreview}
                  className="flex-1 h-[48px] rounded-[100px] border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] bg-transparent font-[600] text-[14px] hover:bg-[#F0F5EA] transition-colors"
                >
                  Preview Draft
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex-1 h-[48px] rounded-[100px] border-none text-white bg-[#1B6B2F] font-[700] text-[14px] hover:bg-[#145324] transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download PDF →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
