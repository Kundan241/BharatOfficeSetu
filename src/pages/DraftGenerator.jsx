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
  },
  {
    id: 'dwarka-template',
    name: 'Dwarka Template',
    description: 'Workspace agreement for Jupiter SPACE, Dwarka / New Delhi',
    icon: FileSignature
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
    } else if (templateId === 'dwarka-template') {
      setFormData({
        agreementDate: today,
        clientCompanyName: '',
        companyType: 'Private Limited Company',
        representativeType: 'Director',
        representativeName: '',
        representativeFatherName: '',
        representativeAddress: '',
        panNumber: '',
        mobileNumber: '',
        startDate: today,
        businessNature: ''
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
      'gurgaon-noc': ['clientCompanyName', 'directorName', 'directorAddress', 'aadharNumber'],
      'dwarka-template': ['clientCompanyName', 'representativeName', 'representativeAddress', 'panNumber', 'mobileNumber', 'startDate']
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
      const trackingPayload = {
        documentType: formData.documentType || "Draft",
        "Timestamp": new Date().toISOString(),
        timestamp: new Date().toISOString(),

        // Exact mappings based on user's exact Column requests
        "Document Type": selectedTemplate.name || "",
        "Client Name": formData.clientName || formData.directorName || formData.representativeName || formData.authorizedByName || formData.ownerName || "",
        "Company Name": formData.companyName || formData.clientCompanyName || formData.businessName || "",
        "PAN": formData.pan || formData.panNumber || "",
        "Address": formData.address || formData.directorAddress || formData.representativeAddress || formData.ownerAddress || "",
        "GST": formData.gst || "",
        "Aadhar": formData.aadhar || formData.aadharNumber || "",
        "Mobile": formData.mobile || formData.mobileNumber || "",
        "Email": formData.email || "",

        // camelCase mappings as explicitly requested for variable names
        documentType: selectedTemplate.name || "",
        clientName: formData.clientName || formData.directorName || formData.representativeName || formData.authorizedByName || formData.ownerName || "",
        companyName: formData.companyName || formData.clientCompanyName || formData.businessName || "",
        pan: formData.pan || formData.panNumber || "",
        address: formData.address || formData.directorAddress || formData.representativeAddress || formData.ownerAddress || "",
        gst: formData.gst || "",
        aadhar: formData.aadhar || formData.aadharNumber || "",
        mobile: formData.mobile || formData.mobileNumber || "",
        email: formData.email || ""
      };

      fetch('https://script.google.com/macros/s/AKfycbzDvmLliVGdBQCvB68D4SbuWpYlWNoUYZIK3QdM6TOGQwmP4kydtWIS1s4NKtR9Hmq3NA/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingPayload)
      }).then(() => {
        addToast('success', 'Data saved successfully');
      }).catch(err => console.error('Silent sync error', err));

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
      const headerText = template.id === 'dwarka-template' ? 'WORKSPACE SERVICE AGREEMENT' : template.name.toUpperCase();
      doc.text(headerText, pageWidth / 2, 8, { align: 'center' });
      doc.setTextColor(40, 40, 40);
    };

    addOrangeHeader();

    let yPos = 30;

    if (!isGurgaonTemplate) {
      if (template.id !== 'dwarka-template') {
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
    } else if (template.id === 'dwarka-template') {
      buildDwarkaTemplate(doc, formData, helpers);
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
      ', C/O ' + data.directorFatherName +
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
      ' C/O ' + (data.directorFatherName || '___________') +
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
    doc.text((data.directorName || '___________') + ' C/O ' + (data.directorFatherName || '___________') + ',', h.margin, y);
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



  const buildDwarkaTemplate = (doc, data, h) => {
    let y = h.yPos();
    doc.setTextColor(17, 17, 16);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTIES TO THIS AGREEMENT', h.pageWidth / 2, y, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(h.margin, y + 2, h.pageWidth - h.margin, y + 2);
    h.setY(y + 15);

    h.addParagraph(
      'This Agreement is executed on this ' + formatDate(data.agreementDate) + ', by and between:\n\n' +
      'JUPITER SPACE, having its registered office at PLOT NO. RZ-L-1, SECOND FLOOR, MAIN ROAD, KHASRA NO. 84/12/2, MAHAVIR ENCLAVE, PALAM, OPPOSITE YAMAHA SHOWROOM, NEW DELHI - 110045, hereinafter referred to as the "Service Provider", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include its successors, legal representatives, and permitted assigns.'
    );

    h.addParagraph('AND', { align: 'center' });

    const companyTypeString = data.companyType === 'LLP' ? 'a Limited Liability Partnership' :
      data.companyType === 'Proprietorship' ? 'a Proprietorship firm' :
        data.companyType === 'Trust' ? 'a registered Trust' :
          'a company incorporated under the provisions of the Companies Act, 2013';

    h.addParagraph(
      (data.clientCompanyName || '___________') + ', ' + companyTypeString + ', through its ' + (data.representativeType || 'Director') + ' ' + (data.representativeName || '___________') + ', C/o ' + (data.representativeFatherName || '___________') + ', residing at ' + (data.representativeAddress || '___________') + ', holding PAN ' + (data.panNumber || '___________') + ' and reachable at Mobile Number ' + (data.mobileNumber || '___________') + ', hereinafter referred to as the "Client", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include its successors, legal representatives, and permitted assigns.'
    );

    h.addSectionHeading('SCOPE AND NATURE OF THE AGREEMENT');
    h.addParagraph('The Client hereby expresses its intention to utilize the Mailbox Services as offered by the Service Provider, namely Jupiter SPACE, situated at Plot No. RZ-L-1, Second Floor, Main Road, Khasra No. 84/12/2, Mahavir Enclave, Palam, Opposite Yamaha Showroom, New Delhi - 110045, for the sole and limited purpose of using the said premises as its official communication and correspondence address. The Client expressly acknowledges, affirms, and agrees that the entire premises, including the designated mailbox area and all ancillary facilities, remain the exclusive and absolute property of the Service Provider, who retains complete ownership, possession, control, and managerial authority over the same at all times.');
    h.addParagraph('It is further acknowledged and agreed by the Client that its right of access and usage shall be strictly confined to the specific services expressly agreed upon under this Agreement, and that no tenancy, leasehold interest, license, possessory right, proprietary entitlement, or any other legal or equitable claim of whatsoever nature shall arise or be deemed to arise in favour of the Client by virtue of this arrangement. The Client’s usage shall not, under any circumstances, be construed as granting any legal interest in the said premises, and the Service Provider shall remain at liberty to impose reasonable terms, limitations, or conditions, as it deems appropriate in the due course of business or security.');

    h.addSectionHeading('ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE');
    h.addParagraph('The Client hereby acknowledges that all services provided under this Agreement by Jupiter SPACE (hereinafter referred to as the "Service Provider") are extended strictly in accordance with the terms and conditions as stipulated herein and/or as may be notified from time to time by the Service Provider in writing. The Client’s access to or use of the services shall constitute complete, unqualified, and irrevocable acceptance of all such terms and conditions, and no waiver, deviation, or exception shall be deemed to exist unless explicitly confirmed in writing by the Service Provider.');
    h.addParagraph('It is further acknowledged and agreed that any person executing this Agreement or utilizing the services on behalf of an employer, organization, partnership, or third party does so under express representation and legal assurance that such person is duly authorized and empowered to bind such entity to the obligations set forth herein. The Service Provider shall not be liable to verify such authority, and reliance thereon shall be deemed sufficient. Unless otherwise expressly excluded or modified in writing by the Service Provider, these Terms of Use shall apply uniformly and without limitation to any subsequent, amended, renewed, or additional services availed by the Client under this arrangement. In the event of any violation, breach, or non-compliance with the terms of this Agreement, the Service Provider reserves the absolute and unfettered right to immediately suspend or terminate the Client’s access to the services without prior notice, and to initiate any and all legal, civil, or equitable remedies available under law, including but not limited to recovery of damages, injunctive relief, and enforcement of contractual obligations.');

    h.addSectionHeading('PERMITTED USE OF ADDRESS');
    h.addParagraph('The Client shall be permitted to utilize the address provided by the Service Provider, namely Jupiter SPACE, situated at Plot No. RZ-L-1, Second Floor, Main Road, Khasra No. 84/12/2, Mahavir Enclave, Palam, Opposite Yamaha Showroom, New Delhi - 110045, strictly and exclusively for the purpose of business-related communication and correspondence.');
    h.addParagraph('The Client may, at its sole discretion, risk, and legal responsibility, elect to designate the aforesaid address as its Principal Place of Business for the purposes of registration with the Registrar of Companies (ROC), Goods and Services Tax (GST), opening of bank accounts, or for any other statutory or regulatory filings before central or state government departments or any other competent authorities.');
    h.addParagraph('The Service Provider hereby expressly disclaims any and all responsibility, liability, or accountability, whether civil, criminal, regulatory, or otherwise, that may arise directly or indirectly out of such use of the address by the Client. It is clearly understood and accepted by the Client that no representation, assurance, or legal guarantee is made by the Service Provider regarding the validity, recognition, or acceptability of the address by any governmental or regulatory body. The Client shall remain wholly and exclusively responsible for ensuring that all such use of the address is in strict compliance with applicable laws, rules, regulations, and statutory requirements, and shall indemnify and hold harmless the Service Provider from any claims, liabilities, losses, proceedings, penalties, or demands arising out of or in connection with such usage.');

    h.addSectionHeading('FEE STRUCTURE AND PAYMENT OBLIGATIONS');
    h.addParagraph('The Client hereby agrees and undertakes to remit to the Service Provider, namely Jupiter SPACE, the full and advance payment of the rent and/or subscription fees, for a fixed term of eleven (11) months, calculated as per the mutually agreed rate and scope of services.');
    h.addParagraph('It is expressly understood and acknowledged by the Client that the said payment shall be made prior to the commencement of the service period, and shall cover the entire duration of eleven (11) calendar months, irrespective of the Client\'s actual or continued usage of the services during such period.');
    h.addParagraph('The advance payment made by the Client shall be non-refundable and non-adjustable, except where otherwise mandated by law or specifically agreed to in writing by the Service Provider.');
    h.addParagraph('The Service Provider shall have the unconditional right to suspend or withhold services in the event of any delay, default, or insufficiency in payment, without prejudice to its other legal remedies, including the right to terminate this Agreement and recover outstanding dues with applicable interest and legal costs.');

    h.addSectionHeading('AGREEMENT RENEWAL');
    h.addParagraph('The Client expressly agrees and undertakes to initiate the process of renewal of this Agreement during the eleventh (11th) month from the date of its commencement, should the Client intend to continue availing the services beyond the initial term. It is clearly understood that timely renewal is the sole responsibility of the Client, and the Service Provider shall not be under any obligation to issue reminders, notices, or extensions in this regard. Failure on the part of the Client to effect such renewal within the stipulated period shall entitle the Service Provider, or any entity or representative duly authorized by it, to treat the Agreement as automatically expiring upon the completion of the original term, and to terminate all services forthwith, without requirement of further notice or formal communication.');
    h.addParagraph('The Service Provider shall further retain the right to allocate, reassign, or dispose of the address or facilities assigned to the Client, and the Client shall have no claim, lien, or entitlement thereto post-expiry');

    h.addSectionHeading('TAX INVOICE AND SETTLEMENT');
    h.addParagraph('The Service Provider, namely Jupiter SPACE, shall raise a tax-compliant invoice in accordance with applicable law, reflecting the services rendered to the Client for the preceding billing period or as otherwise agreed in writing. All such invoices shall be deemed valid unless disputed in writing by the Client within seven (7) days from the date of receipt, failing which the same shall be treated as undisputed and fully accepted by the Client. The Client hereby agrees and undertakes to settle all undisputed invoices in full within a period of thirty (30) calendar days from the date of receipt of each such invoice. All payments shall be made without deduction, set-off, or delay, except where required by applicable law or agreed to in writing by the Service Provider.');
    h.addParagraph('In the event of any delay or default in payment beyond the stipulated period, the Service Provider shall be entitled to levy interest at the rate of 22% per annum on the outstanding amount, without prejudice to its right to suspend services, terminate the Agreement, or initiate recovery proceedings as may be warranted in law. All applicable taxes, levies, and statutory charges (including but not limited to GST) shall be borne by the Client and reflected accordingly in each tax invoice.');

    h.addSectionHeading('TERMINATION FOR NON-PAYMENT');
    h.addParagraph('In the event that the Client fails to remit the agreed rent and in accordance with the terms set forth in this Agreement, the Service Provider, namely Jupiter SPACE, shall be entitled, without the requirement of further notice or demand, to terminate the provision of services forthwith upon the expiry of the term originally agreed to at the time of subscription or initial payment. It is expressly agreed that such termination shall become effective automatically upon the expiration date, unless payment is received in full prior thereto, and the Service Provider shall not be under any obligation to provide extensions, grace periods, or continued access to services. Upon such termination, the Service Provider shall have the unrestricted right to revoke access, reassign the Client’s designated address or mailbox, and discontinue any associated services without incurring any liability, obligation, or consequence whatsoever.');
    h.addParagraph('This provision shall be without prejudice to the Service Provider’s right to recover any outstanding dues, interest, damages, or costs, and to exercise all such remedies as may be available in law or equity.');

    h.addSectionHeading('LATE PAYMENT INTEREST');
    h.addParagraph('In the event of any delay by the Client in remitting payments due under this Agreement beyond the stipulated period of thirty (30) days from the date of invoice, the Service Provider, namely Jupiter SPACE, shall be entitled to levy interest on the overdue amount at the rate of twelve percent (12%) per annum, calculated on a pro-rata daily basis, commencing from the date such payment became due and continuing until the date of full and final settlement.');
    h.addParagraph('Such interest shall be deemed an independent contractual obligation, recoverable as a debt due, and the accrual thereof shall in no manner prejudice or restrict the Service Provider’s right to initiate termination or legal proceedings for recovery or other remedies available under law.');

    h.addSectionHeading('COMPLIANCE WITH LAWS');
    h.addParagraph('The Client hereby undertakes and affirms that it shall, at all times during the subsistence of this Agreement, be solely and exclusively responsible for ensuring full and strict compliance with all applicable laws, rules, regulations, notifications, and governmental directives, including but not limited to the provisions of the Companies Act, 2013, the Goods and Services Tax Act, 2017, and all other relevant central, state, and municipal enactments as may be in force from time to time.');
    h.addParagraph('The Service Provider, namely Jupiter SPACE, shall bear no liability or obligation whatsoever in respect of any acts, omissions, filings, declarations, or regulatory affairs conducted by the Client while using the address or services provided under this Agreement.');
    h.addParagraph('The Client expressly agrees to indemnify, defend, and hold harmless the Service Provider, along with its directors, officers, employees, affiliates, and agents, from and against any and all claims, proceedings, penalties, liabilities, losses, damages, costs, and legal expenses that may arise, directly or indirectly, from:\n(a) The Client’s use of the services in violation of any applicable law;\n(b) Any false, incomplete, or misleading declarations made by the Client to any statutory authority;\n(c) Any regulatory action, prosecution, or inquiry initiated due to the Client\'s conduct or omissions;\n(d) Any breach of obligations under this Agreement or under any statute governing the Client’s business operations.');
    h.addParagraph('This indemnity shall remain in full force and effect notwithstanding the expiration or earlier termination of this Agreement.');

    h.addSectionHeading('INDEMNIFICATION');
    h.addParagraph('The Client expressly undertakes not to use the premises address provided under this Agreement for the purpose of applying for any loans, credit facilities, credit cards, or other financial instruments or services from any bank, NBFC, or financial institution.');
    h.addParagraph('The Service Provider, namely Jupiter SPACE, shall be fully indemnified and held harmless from and against any and all claims, liabilities, proceedings, losses, or damages, whether civil or regulatory, arising directly or indirectly from such unauthorized use or from any financial dealings, defaults, or obligations attributable to the Client.');

    h.addSectionHeading('LIMITED SCOPE OF SERVICE');
    h.addParagraph('The Service Provider, Jupiter SPACE, is engaged solely in the provision of mailbox and address services to the Client under this Agreement. It is expressly clarified that the Service Provider bears no responsibility or liability whatsoever for the Client’s business operations, representations, transactions, or activities, and shall not be held accountable for any consequences, claims, or proceedings arising therefrom, whether civil, regulatory, or criminal in nature.');

    h.addSectionHeading('VISITOR RESPONSIBILITY');
    h.addParagraph('The Client shall be solely responsible for ensuring that any visitors, clients, or representatives entering the premises of Jupiter SPACE do so only upon prior notice to the Service Provider and in strict compliance with all rules, policies, and security protocols prescribed by the Service Provider. The Service Provider shall bear no liability whatsoever for the conduct, actions, or omissions of such visitors, nor for any breach of house rules or disruption caused by them.');
    h.addParagraph('It is expressly acknowledged by the Client that it does not possess or occupy any physical space on the premises under this Agreement. For any in-person meetings or use of workspace, the Client shall be required to pre-book a cabin or facility on an hourly basis, as the subscription granted herein is strictly limited to virtual office services.');

    h.addSectionHeading('GUEST POLICY');
    h.addParagraph('The Service Provider, Vselek Co-working and Co-Warehousing Private Limited, permits the Client to host guests for meetings or project-related purposes, subject to prior coordination and availability. The Client shall remain solely responsible for ensuring that all guests strictly adhere to the Service Provider’s workspace rules, code of conduct, and operational policies.');
    h.addParagraph('Any breach or violation of such policies by the Client’s guests shall be deemed a breach by the Client, who shall bear full responsibility and liability for the same.');

    h.addSectionHeading('FINANCIAL TRANSACTIONS');
    h.addParagraph('The Client shall bear sole and exclusive responsibility for all financial transactions, payments, and commercial dealings conducted with its own clients, vendors, or third parties. The Service Provider, Jupiter SPACE, shall have no involvement or liability whatsoever in relation to such financial matters, including but not limited to payment disputes, service defaults, or transactional failures arising therefrom.');

    h.addSectionHeading('PREVENTION OF MONEY LAUNDERING ACT, 2002 (PMLA)');
    h.addParagraph('The Client hereby unequivocally affirms and undertakes that the premises, address, or any service availed under this Agreement shall not, under any circumstances, be utilized for any unlawful, illegitimate, or criminal purpose, including but not limited to activities that constitute offences under the Prevention of Money Laundering Act, 2002 (PMLA), and all other applicable anti-money laundering statutes, regulations, and guidelines in force in India or internationally. Any attempt, whether direct or indirect, to misuse the said services or address for financial fraud, layering, benami transactions, terrorist financing, or any other act that may attract penal consequences under the PMLA shall render this Agreement null and void ab initio, without prejudice to the Service Provider’s right to terminate the Agreement forthwith and report the matter to the competent statutory or enforcement authorities.');
    h.addParagraph('The Client shall be singularly and fully liable for all legal, civil, or penal consequences arising from such misuse and shall unconditionally indemnify and hold harmless the Service Provider, its directors, officers, employees, and agents, against any loss, damage, claim, cost, or liability (including reasonable legal fees) arising therefrom. The Service Provider shall not be under any obligation to provide notice prior to termination or reporting, and any decision taken in this regard shall be final and binding.');

    h.addSectionHeading('DISPUTE RESOLUTION (THIRD-PARTY MATTERS)');
    h.addParagraph('In the event of any dispute, claim, or disagreement arising between the Client and its own clients, customers, or business associates, the Service Provider, Jupiter SPACE, shall bear no responsibility or obligation to intervene, mediate, or resolve such matters. The Client shall remain solely and fully accountable for addressing and resolving any such disputes independently, in a manner that is both timely and professionally appropriate.');

    h.addSectionHeading('WORKSPACE ENVIRONMENT');
    h.addParagraph('The Client and all individuals acting on their behalf, including visitors and guests, shall at all times maintain strict adherence to the rules, policies, and code of conduct prescribed by Jupiter SPACE, with a view to upholding a professional, secure, and disruption-free workspace environment. Any violation of such policies may, at the sole discretion of the Service Provider, result in the levy of penalties, suspension of services, or immediate termination of this Agreement without further notice.');
    h.addParagraph('It is expressly reiterated that the Service Provider is engaged solely in the provision of mailbox and virtual office services, and bears no responsibility or liability for the Client’s business activities or operations. The Client shall be solely responsible for ensuring that all visitors or invitees comply fully with the Service Provider’s guidelines while on the premises.');

    h.addSectionHeading('TERMINATION BY SERVICE PROVIDER');
    h.addParagraph('The Service Provider, Jupiter SPACE, reserves the absolute right to terminate this Agreement at its sole discretion, by providing the Client with no less than thirty (30) days’ prior written notice, without assigning any reason therefore. Upon such termination, and subject to compliance by the Client with all obligations under this Agreement, any security deposit paid shall be refunded in full, net of any lawful deductions.');

    h.addSectionHeading('AUTOMATIC TERMINATION');
    h.addParagraph('Unless duly renewed by the Client prior to the expiry date, all services under this Agreement shall stand automatically terminated upon the conclusion of the subscribed term. The Service Provider, Jupiter SPACE, shall bear no responsibility or liability for any loss, disruption, or inconvenience arising from the Client’s failure to renew the subscription in a timely manner.');

    h.addSectionHeading('OBLIGATIONS UPON TERMINATION');
    h.addParagraph('Upon termination or expiry of this Agreement, the Client shall immediately cease all use of the address and any telephone numbers provided by the Service Provider.');
    h.addParagraph('The Client shall forthwith remove and desist from displaying such address or contact details on all materials, including but not limited to business cards, websites, stationery, advertising collateral, certificates, and any public or private platforms. Failure to comply with these obligations shall render the Client liable for all consequences arising therefrom.');

    h.addSectionHeading('CHANGE OF ADDRESS FOR REGISTRATIONS');
    h.addParagraph('In the event the Client has utilized the provided address for registrations with the Registrar of Companies, GST authorities, banks, or any other governmental or regulatory bodies, the Client shall, within thirty (30) days of termination or expiry of this Agreement, effectuate all necessary updates to reflect an alternate address. The Service Provider expressly reserves the right to initiate appropriate legal proceedings against any Client who fails to comply with this obligation, including for any consequential damages or liabilities arising therefrom.');

    h.addSectionHeading('TERMINATION WITHOUT NOTICE FOR ILLEGAL ACTIVITIES');
    h.addParagraph('The Service Provider reserves the absolute right to terminate this Agreement with immediate effect and without prior notice upon any reasonable suspicion or confirmation that the Client is engaged in illegal activities or is conducting business in a manner detrimental to the Service Provider’s reputation or operations. Such termination shall be without prejudice to the Service Provider’s right to pursue all available legal and equitable remedies.');

    h.addSectionHeading('TERMINATION FOR VIOLATION OR FRAUD');
    h.addParagraph('The Service Provider reserves the right to terminate this Agreement upon thirty (30) days’ prior written notice if the Client is found to have materially violated any provision herein, or if the Client’s conduct is reasonably reported or determined to be fraudulent, unlawful, or detrimental to the interests of the Service Provider. Such termination shall be without prejudice to the Service Provider’s entitlement to seek all applicable remedies under law.');

    h.addSectionHeading('RENEWAL REQUIREMENT');
    h.addParagraph('The Client is expressly obligated to renew the subscription on or before the eleventh (11th) month from the commencement date of this Agreement, irrespective of whether the Client’s engagement is through an aggregator platform or any third-party intermediary. Failure to renew within the stipulated period shall result in automatic termination of the Agreement, rendering it null and void. The Service Provider shall bear no responsibility or liability for any loss, disruption, or adverse consequences arising from such non-renewal. Notwithstanding the involvement of any intermediary, the Service Provider reserves the unequivocal right to directly communicate with the Client to offer renewal opportunities.');

    h.addSectionHeading('NO LIABILITY POST-TERMINATION');
    h.addParagraph('Upon termination of services—whether automatic or initiated by the Service Provider—the Client hereby irrevocably and unconditionally releases and discharges the Service Provider from any and all liability, claims, or demands arising out of or in connection with such termination. The Client shall immediately cease all use of the provided address, removing it from all documents, platforms, communications, and any other media where it was utilized pursuant to this Agreement. Further, the Client shall furnish a written declaration to the Service Provider affirming the cessation of such use. Non-compliance with these obligations shall entitle the Service Provider to initiate appropriate legal proceedings and seek remedies as deemed fit.');

    h.addSectionHeading('CONFIDENTIALITY');
    h.addParagraph('The Client acknowledges that during the course of availing the Services, it may acquire access to certain Confidential and Proprietary Information (“Confidential Information”) of the Service Provider. The Client agrees that, both during the term of this Agreement and thereafter:\n\n• (a) The Client shall exercise no less than a reasonable standard of care—at minimum equivalent to that employed in protecting its own confidential information—to prevent unauthorized disclosure or use of such Confidential Information;\n• (b) The Client shall use Confidential Information solely for purposes strictly related to this Agreement; and\n• (c) The Client shall not disclose Confidential Information to any third party without the prior express written consent of the Service Provider.\n\nReciprocally, the Service Provider acknowledges that it may, in the course of performing its obligations, access Confidential Information of the Client, and undertakes to exercise at least the same level of care in safeguarding such information. In the event of any transfer or sale of the Service Provider’s business or relevant business segment, the Service Provider is expressly authorized to transfer all user information, including Confidential Information, to its lawful successor.');

    h.addSectionHeading('OWNERSHIP');
    h.addParagraph('All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions, and materials constituting the Service are the exclusive property of the Service Provider, except where expressly stated otherwise. This Agreement shall not be construed as a lease or transfer of ownership.');
    h.addParagraph('The Client acknowledges that any phone number assigned by the Service Provider remains the sole property of the Service Provider and is not leased or owned by the Client. Upon termination of the Client’s account for any reason, such phone number may be reassigned at the Service Provider’s sole discretion.\n\nConversely, all intellectual property and proprietary materials of the Client shall remain the sole property of the Client.');

    h.addSectionHeading('NATURE OF BUSINESS');
    h.addParagraph('The Client shall provide a written description of the nature of its business in Annexure-1 to this Agreement. The Client undertakes not to engage in or conduct any business activity that is illegal, defamatory, immoral, obscene, or otherwise unlawful. Furthermore, the Client agrees not to utilize the Service Provider’s address, whether directly or indirectly, for any such prohibited purposes. The Client confirms that the business described in Annexure-1 constitutes the activities to be conducted using the virtual office services under this Agreement. Any subsequent change in the nature of business shall be promptly communicated to the Service Provider in writing.');

    doc.addPage();
    h.addOrangeHeaderOnPage();

    let py = 30;
    doc.setTextColor(17, 17, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT TERM AND TENURE AGREEMENT PERIODS: 11 MONTHS', h.margin, py);
    py += 10;
    doc.text('EFFECTIVE FROM', h.margin, py);
    py += 8;
    const endDate = new Date(data.startDate);
    endDate.setMonth(endDate.getMonth() + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(formatDate(data.startDate) + ' TO ' + formatDate(endDate.toISOString()), h.margin, py);
    py += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('AGREEMENT IS VALID FROM', h.margin, py);
    py += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Service provider’s Address is: C/O Jupiter SPACE, Plot No. RZ-L-1, Second Floor, Main Road, Khasra No. 84/12/2, Mahavir Enclave, Palam, Opposite Yamaha Showroom, New Delhi - 110045.', h.margin, py, { maxWidth: h.contentWidth });
    py += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('THIS IS FORMAL AGREEMENT ON THE CLIENT’S TERMS AND CONDITIONS.', h.margin, py);
    py += 8;
    doc.text('THIS IS NOT A LEASE OR DEED OR CAN NOT BE USED AS LEASE AGREEMENT.', h.margin, py);
    py += 20;

    doc.setFont('helvetica', 'normal');
    doc.text('I AGREE TO ABOVE THESE TERMS AND CONDITIONS', h.margin, py);
    py += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('FOR CLIENT:', h.margin, py);
    py += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Name : ' + (data.representativeName || '___________'), h.margin, py);
    py += 8;
    doc.text('Signature :', h.margin, py);
    py += 8;
    doc.text('Designation/Title : ' + (data.representativeType || 'Authorized Signatory'), h.margin, py);
    py += 8;
    doc.text('Date of Sign : ' + formatDate(data.agreementDate), h.margin, py);
    py += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 1', h.margin, py);
    py += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Name:', h.margin, py);
    py += 8;
    doc.text('Signature :', h.margin, py);
    py += 8;
    doc.text('Aadhaar No :', h.margin, py);
    py += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('WITNESS 2', h.margin, py);
    py += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Name :', h.margin, py);
    py += 8;
    doc.text('Signature :', h.margin, py);
    py += 8;
    doc.text('Aadhaar No :', h.margin, py);
    py += 25;

    doc.text('For Service Provider (Jupiter SPACE)', h.margin, py);
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
            <p>This AGREEMENT made on {formatDate(formData.agreementDate)} between {formData.serviceProviderName || '___________'} herein after referred to as Service Provider having office at {formData.serviceProviderAddress || '___________'} and {formData.clientCompanyName || '___________'} through it’s Director {formData.directorName || '___________'}, C/O {formData.directorFatherName || '___________'}, R/O {formData.directorAddress || '___________'} PAN Number {formData.panNumber || '___________'} with Mobile Number {formData.mobileNumber || '___________'} here in after referred to as "Client".</p>

            <p><strong>THE NATURE OF THE AGREEMENT</strong><br />
              The Client intends to use the Mailbox Services provided by {formData.serviceProviderName || '___________'} , located at {formData.serviceProviderAddress || '___________'}, as their communication and mailing address. The Client acknowledges that the entire premises, including the mailbox, remain the exclusive property of the Service Provider, {formData.serviceProviderName || '___________'}, who retains full possession, control, and authority over the space. The Client further acknowledges that their usage is limited solely to the agreed-upon services, and no rights or claims to the property or its facilities are transferred to them.</p>

            <p><strong>ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE</strong><br />
              The Services are provided to the Client strictly under the terms and conditions set by {formData.serviceProviderName || '___________'} (the "Service Provider"). The Client's use of these Services constitutes full and unconditional acceptance of all terms and conditions outlined in this Agreement, without exception.<br /><br />
              Any individual utilizing the Services or entering a contract, whether in writing or online, on behalf of their employer or a third party, affirms that they have the full legal authority to bind their employer or the third party to these terms. Unless explicitly stated by the Service Provider, these Terms of Service will apply to any new features, services, or resources introduced by {formData.serviceProviderName || '___________'}, including the release of new offerings that augment or enhance the current Services.</p>

            <p><strong>USAGE OF ADDRESS</strong><br />
              The Client may use the provided address solely for business correspondence purposes. The Client may also choose, at their own risk and liability, to designate the address as their "Principal Place of Business for ROC Registration, GST Registrations, opening bank accounts, or dealings with central/state governments or any other authorities.<br /><br />
              The Service Provider, {formData.serviceProviderName || '___________'}, holds no responsibility or liability for any consequences, legal or otherwise, arising from such use. The Client assumes full responsibility for ensuring compliance with all legal and regulatory requirements in connection with the use of the address under this agreement.</p>

            <p><strong>RENT / SUBSCRIPTION FEES</strong><br />
              The Client agrees to pay the rent/subscription fees for a period of 11 months in advance to the Service Provider. This implies that the Client pays upfront for the services to be received over the next 11 months.</p>

            <p><strong>AGREEMENT RENEWAL</strong><br />
              The Client must renew the agreement in the 11th month from the date of commencement. Failure to do so allows the Service Provider or any designated party to terminate the contract.</p>

            <p><strong>TAX INVOICE AND SETTLEMENT</strong><br />
              The Service Provider will issue a tax invoice for the services rendered in the previous month. The Client is required to settle all valid invoices within 30 days of receipt.</p>

            <p><strong>TERMINATION FOR NON-PAYMENT</strong><br />
              Failure to pay the rent/subscription fees will result in the termination of services on the specified expiration date agreed upon during signup or payment.</p>

            <p><strong>LATE PAYMENT INTEREST</strong><br />
              In the case of late payments, the Client/agreement holder may be charged an additional amount as interest. The interest rate for delays exceeding 30 days is set at 12% per annum on a pro-rata basis.</p>

            <p><strong>INDEMNITY</strong><br />
              <strong>1. COMPLIANCE WITH LAWS</strong><br />
              The Client is solely responsible for ensuring full compliance with all applicable laws, including but not limited to the Companies Act, GST, and other relevant regulations. The Client agrees to indemnify and hold {formData.serviceProviderName || '___________'} (the "Service Provider") fully indemnified and harmless against any claims, proceedings, damages, losses, actions, costs, or expenses arising from this agreement or any breach of applicable laws.</p>

            <p><strong>2. INDEMNIFICATION</strong><br />
              The Client agrees not to use the premises address to apply for any loans, credit cards, or financial services. The Service Provider is fully indemnified against any liabilities arising from such use or any claims related to the Client’s financial dealings or obligations.</p>

            <p><strong>3. LIMITED SCOPE OF SERVICE</strong><br />
              {formData.serviceProviderName || '___________'} is only providing mailbox services to the Client. The Service Provider does not hold any responsibility for the Client's business activities, and any consequences arising from those activities are solely the Client's responsibility.</p>

            <p><strong>4. VISITOR RESPONSIBILITY</strong><br />
              The client is responsible for ensuring that any visitors or clients entering {formData.serviceProviderName || '___________'}’s workspace for any purpose must provide prior notice to {formData.serviceProviderName || '___________'} and ensure compliance with the Service Provider's policies and guidelines. {formData.serviceProviderName || '___________'} shall not be held liable for the actions or conduct of the client's visitors, nor for any breaches of workspace rules by them. It is acknowledged that the client does not hold any physical possession of the premises. The client is required to book a cabin on an hourly basis to conduct meetings within the premises, as the client holds only a virtual office subscription.</p>

            <p><strong>5. GUEST POLICY</strong><br />
              While {formData.serviceProviderName || '___________'} welcomes the Client’s guests for meetings or project work, it is the Client’s duty to ensure their guests comply with all workspace policies. Any violations of these policies will be the responsibility of the Client.</p>

            <p><strong>6. FINACIAL TRANSACTIONS</strong><br />
              The Client is solely responsible for all financial transactions conducted with their clients, including payments for services or products. {formData.serviceProviderName || '___________'} assumes no responsibility for any financial dealings between the Client and their clients.</p>

            <p><strong>7. DISPUTE RESOLUTION</strong><br />
              In the event of a dispute between the Client and their clients, {formData.serviceProviderName || '___________'} holds no responsibility for resolving such disputes. The Client is fully responsible for managing and resolving any disputes in a timely and professional manner.</p>

            <p><strong>8. WORKSPACE ENVIRONMENT</strong><br />
              To maintain a professional and productive environment, the Client and their visitors are expected to adhere to {formData.serviceProviderName || '___________'}'s policies at all times. Any failure to comply with these guidelines may result in penalties or termination of services by {formData.serviceProviderName || '___________'}, at its sole discretion.<br /><br />
              Please note that {formData.serviceProviderName || '___________'} is only providing mailbox services to the Client. As such, the Service Provider does not hold any responsibility for the Client’s business activities. It is the Client’s responsibility to ensure that their visitors follow our policies and guidelines while using the workspace.</p>

            <p><strong>TERMINATION OF SERVICE</strong><br />
              <strong>1. TERMINATION BY SERVICE PROVIDER</strong><br />
              The Service Provider reserves the right to terminate the service at any time with at least 30 days' prior written notice. In such cases, any security deposit paid by the Client will be refunded.</p>

            <p><strong>2. AUTOMATIC TERMINATION</strong><br />
              Services will be automatically terminated on the expiry date unless the Client renews the subscription before that date. The Service Provider holds no responsibility for any loss or disruption caused by the Client’s failure to renew.</p>

            <p><strong>3. OBLIGATIONS AFTER TERMINATION</strong><br />
              Upon termination of the service, the Client must immediately cease the use of the provided address and any phone numbers issued by the Service Provider. This includes removing the address from all materials, including but not limited to business cards, websites, stationery, advertising material, certificates, and any public or private platforms.</p>

            <p><strong>4. CHANGE OF ADDRESS FOR REGISTRATIONS</strong><br />
              If the Client has used the address for registrations with the ROC, GST authorities, banks, or any other official purposes, the Client is required to update the address within 30 days of termination. The Service Provider reserves the right to take legal action against any Client found in breach of this requirement.</p>

            <p><strong>5. TERMINATION WITHOUT NOTICE FOR ILLEGAL ACTIVITIES</strong><br />
              The Service Provider reserves the right to terminate the service and agreement immediately, without prior notice, if the Client engages in any illegal activities or conducts business in a manner that could damage the Service Provider's reputation or disrupt its operations.</p>

            <p><strong>6. TERMINATION FOR VIOLATION OR FRAUD</strong><br />
              The Service Provider may terminate the service with 30 days’ written notice if the Client violates any clause in this agreement or if the Client's activities are reported to be fraudulent or harmful to the Service Provider's interests.</p>

            <p><strong>7. RENEWAL REQUIREMENT</strong><br />
              The Client is obligated to renew the subscription by the 11th month from the contract start date. This requirement applies regardless of whether the Client has engaged through an aggregator platform or a third-party intermediary. Failure to renew the subscription within this specified period will result in the automatic termination of the contract, rendering it null and void. In such circumstances, the Service Provider assumes no responsibility or liability for any disruptions, losses, or consequences incurred by the Client due to the lapse in subscription renewal.<br /><br />
              Even if the Client has come through an aggregator platform or a third-party intermediary, the Service Provider reserves the right to directly reach out to the Client and offer them the opportunity to renew the subscription directly as well.</p>

            <p><strong>8. NO LIABILITY POST-TERMINATION</strong><br />
              Upon termination of the service, whether automatically or by action of the Service Provider, the Client fully and irrevocably releases the Service Provider from any and all responsibility, liability, or claims for any consequences, losses, or damages arising from the termination. Furthermore, the Client is required to immediately cease the use of the provided address in all forms and remove it from all platforms, documents, and communications where it was utilized under the valid agreement. The Client must also provide a formal declaration to the Service Provider, affirming that the address is no longer in use. Failure to comply with this requirement may result in legal action and additional penalties as determined by the Service Provider.</p>

            <p><strong>CONFIDENTIALITY</strong><br />
              The Client recognizes that it may, in the course of obtaining or using the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Service Provider. The Client agrees that during the Term of this Agreement and thereafter:<br /><br />
              (a) The Client shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information, but in no event less than a reasonable standard of care.<br />
              (b) The Client will use Confidential Information solely for the purposes of this Agreement; and<br />
              (c) The Client will not disclose Confidential Information to any third party without the express prior written consent of the Service Provider.<br /><br />
              Similarly, the Service Provider recognizes that it may, in the course of providing the Services, come into possession of or learn confidential and proprietary business information ("Confidential Information") about the Client. The Service Provider agrees that during the Term of this Agreement and thereafter, the Service Provider shall provide, at a minimum, the same level of care to avoid disclosure or unauthorized use of Confidential Information as it does with respect to its own similar information. If the Service Provider transfers its business or any business segment that provides services to the Client, the Service Provider is authorized to transfer all user information to the Service Provider’s successor.</p>

            <p><strong>OWNERSHIP</strong><br />
              All programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials comprising the Service are wholly owned by the Service provider. Service provider except where expressly stated otherwise. This is not a lease document. Client agrees that the client is not the service provider of any phone number assigned to them by service provider. Upon termination of account for any reason, such number may be re assigned to another client.<br /><br />
              Similarly, all programs, services, processes, designs, software, technologies, trademarks, trade names, inventions and materials of the client shall be owned by the client only.</p>

            <p><strong>NATURE OF BUSINESS</strong><br />
              The Client must explain the nature of their business in writing in ANNEXURE-1 of this agreement<br /><br />
              The Client agrees not to conduct or engage in any business that could be construed as illegal, defamatory, immoral, or obscene. Additionally, the Client agrees not to use the address of the Service Provider, whether directly or indirectly, for any such purposes.<br /><br />
              The Client has described the nature of the business they plan to conduct at {formData.serviceProviderName || '___________'} as a virtual office in connection with this agreement<br /><br />
              If the Client changes the nature of their business, they are required to notify the Service Provider in writing.</p>

            <p><strong>CONFLICTING BUSINESS</strong><br />
              The client should not directly or indirectly or though agents operate a business that competes with Service provider’s business of providing serviced offices and virtual offices, shared conference rooms and meeting rooms.</p>

            <p><strong>GOVERNING LAW</strong><br />
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
            <p>This LEAVE AND LICENSE AGREEMENT is made on {formatDate(formData.agreementDate)} between True Work Lounge, always be registered office address at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 through its Authorised Signator, Manoj Yadav, hereinafter referred to as "Licensor/ Services Provider", who has leased the premises and {formData.clientCompanyName || '___________'} through its Authorized person, {formData.directorName || '___________'} C/O {formData.directorFatherName || '___________'}, R/O {formData.directorAddress || '___________'} with PAN No. {formData.panNumber || '___________'} and hereinafter referred to as "Client/ Licensee". (KYC is attached)</p>
            <p><strong>EFFECTIVE DATE:</strong> {formatDate(formData.startDate)} <strong>TERM:</strong> 11 Months</p>
            <p><strong>USE OF AND ACCESS TO THE LICENSED PREMISES</strong></p>
            <p>The Client/ Licensee is interested in using the office space (hereinafter referred to as the "Services") from the Licensor at its premise located at 02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102 (hereinafter referred to as the "Premise"). The whole of the Premise remains the property of the Service Provider and remains in the Licensor's possession and control.</p>
            <p><strong>TERMS OF USAGE</strong></p>
            <p>The Client may use the address for its business correspondence. Clients may also use the Office Address for obtaining GST, with the understanding that the client assumes the responsibility for complying with all the required provisions of applicable acts and laws.</p>
            <div style={{ marginTop: '30px' }}>
              <p>For Licensor:<br />Name: Manoj Yadav<br />Designation/Title: Authorised Signatory</p>
            </div>
            <div style={{ marginTop: '30px' }}>
              <p>For Licensee:<br />Name: {formData.directorName || '___________'}<br />Designation/Title: Authorized person</p>
            </div>
          </>
        );
      } else if (selectedTemplate.id === 'gurgaon-noc') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>NO OBJECTION CERTIFICATE</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p>Date: {formatDate(formData.nocDate)}</p>
            <p>To<br />{formData.directorName || '___________'} C/O {formData.directorFatherName || '___________'},<br />Address: R/o {formData.directorAddress || '___________'}<br />Company Name: {formData.clientCompanyName || '___________'}<br />Aadhaar No.: {formData.aadharNumber || '___________'}</p>
            <p>We True Work lounge LLP having its office space at "02-007, 2nd Floor, Emar The Palm Square, Sector 66, Golf Course Road, Extension, Gurugram, Haryana, 122102" hereby declare and confirm that we are the legal lease owner of the above mentioned office premises and hereby allow Company "{formData.clientCompanyName || '___________'}" to use the above-mentioned address as the Registered Office (GST Address office/Office) of Company {formData.clientCompanyName || '___________'}.</p>
            <div style={{ marginTop: '30px' }}>
              <p>For True Work lounge LLP</p>
              <br /><br />
              <p>Authorized Signatory<br />Gurgaon</p>
            </div>
          </>
        );
      } else if (selectedTemplate.id === 'dwarka-template') {
        return (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>WORKSPACE SERVICE AGREEMENT</p>
            <hr style={{ margin: '10px 0 20px 0', borderTop: '1px solid black' }} />
            <p style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline' }}>PARTIES TO THIS AGREEMENT</p>
            <p>This Agreement is executed on this {formatDate(formData.agreementDate)}, by and between:</p>
            <p><strong>JUPITER SPACE</strong>, having its registered office at PLOT NO. RZ-L-1, SECOND FLOOR, MAIN ROAD, KHASRA NO. 84/12/2, MAHAVIR ENCLAVE, PALAM, OPPOSITE YAMAHA SHOWROOM, NEW DELHI - 110045, hereinafter referred to as the "Service Provider".</p>
            <p style={{ textAlign: 'center' }}><strong>AND</strong></p>
            {(() => {
              const companyTypeString = formData.companyType === 'LLP' ? 'a Limited Liability Partnership' :
                formData.companyType === 'Proprietorship' ? 'a Proprietorship firm' :
                  formData.companyType === 'Trust' ? 'a registered Trust' :
                    'a company incorporated under the provisions of the Companies Act, 2013';
              return (
                <p><strong>{formData.clientCompanyName || '___________'}</strong>, {companyTypeString}, through its {formData.representativeType || 'Director'} {formData.representativeName || '___________'}, C/o {formData.representativeFatherName || '___________'}, residing at {formData.representativeAddress || '___________'}, holding PAN {formData.panNumber || '___________'} and reachable at Mobile Number {formData.mobileNumber || '___________'}, hereinafter referred to as the "Client".</p>
              );
            })()}
            <p><strong>SCOPE AND NATURE OF THE AGREEMENT</strong><br />
              The Client hereby expresses its intention to utilize the Mailbox Services as offered by the Service Provider, namely Jupiter SPACE...</p>
            <p><em>(The full preview text is truncated for brevity, but the final PDF will contain all clauses and details.)</em></p>
            <div style={{ marginTop: '30px' }}>
              <p>For Client:<br />Name: {formData.representativeName || '___________'}<br />Designation: {formData.representativeType || 'Authorized Signatory'}</p>
            </div>
            <div style={{ marginTop: '30px' }}>
              <p>For Service Provider (Jupiter SPACE)</p>
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
                    {renderField('Father\'s Name (C/O)', 'directorFatherName', 'text', { placeholder: 'C/O ...' })}
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
                    {renderField('Father\'s Name (C/O)', 'directorFatherName', 'text', { placeholder: 'C/O ...' })}
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
                  {renderField('Father\'s Name (C/O)', 'directorFatherName', 'text', { placeholder: 'C/O ...' })}
                  {renderField('Director\'s Address', 'directorAddress', 'textarea', { rows: 2, placeholder: 'Residential address' })}
                  {renderField('Aadhar Number', 'aadharNumber', 'text', { placeholder: '12-digit aadhar' })}
                </div>
              )}

              {selectedTemplate.id === 'dwarka-template' && (
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Agreement Date', 'agreementDate', 'date')}
                    {renderField('Agreement Start Date', 'startDate', 'date')}
                  </div>
                  {renderField('Client Company Name', 'clientCompanyName', 'text', { placeholder: 'e.g. HAGER STONE INTERNATIONAL PRIVATE LIMITED' })}
                  {renderField('Company Type', 'companyType', 'select', { options: ['Private Limited Company', 'LLP', 'Proprietorship', 'Trust', 'Partnership Firm'] })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Representative Type', 'representativeType', 'select', { options: ['Director', 'Authorized Signatory', 'Partner', 'Proprietor'] })}
                    {renderField('Representative Name', 'representativeName', 'text', { placeholder: 'Name of the representative' })}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Father\'s Name (C/o)', 'representativeFatherName', 'text', { placeholder: 'Father\'s Name' })}
                    {renderField('PAN Number', 'panNumber', 'text', { placeholder: 'e.g. AAGCT7723A' })}
                  </div>
                  {renderField('Residential Address', 'representativeAddress', 'textarea', { rows: 2, placeholder: 'Residential address' })}
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    {renderField('Mobile Number', 'mobileNumber', 'text', { placeholder: '10-digit mobile' })}
                    {renderField('Agreement End Date', 'endDate', 'text', { value: `Auto: ${getCalculatedEndDate()}`, readOnly: true, className: 'bg-[rgba(17,17,16,0.03)] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-[10px_12px] text-[14px] text-[rgba(17,17,16,0.6)] w-full font-sans h-[42px] cursor-not-allowed' })}
                  </div>
                  {renderField('Nature of Business (Annexure-1)', 'businessNature', 'textarea', { rows: 3, placeholder: 'Brief description of client\'s business...' })}
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
