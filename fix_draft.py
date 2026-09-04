with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'r') as f:
    content = f.read()

# 1. Update initFormData
init_form_data = """    } else if (templateId === 'dwarka-template') {
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
    } else if (templateId === 'rajasthan-template') {
      setFormData({
        agreementDate: today,
        clientCompanyName: '',
        companyType: 'Proprietorship',
        representativeType: 'Director',
        representativeName: '',
        representativeFatherName: '',
        representativeAddress: '',
        panNumber: '',
        mobileNumber: '',
        startDate: today,
        businessNature: ''
      });"""
content = content.replace("""    } else if (templateId === 'dwarka-template') {
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
      });""", init_form_data)

# 2. Update validateForm
validate_form = """      'dwarka-template': ['clientCompanyName', 'representativeName', 'representativeAddress', 'panNumber', 'mobileNumber', 'startDate'],
      'rajasthan-template': ['clientCompanyName', 'representativeName', 'representativeAddress', 'panNumber', 'mobileNumber', 'startDate'],"""
content = content.replace("      'dwarka-template': ['clientCompanyName', 'representativeName', 'representativeAddress', 'panNumber', 'mobileNumber', 'startDate'],", validate_form)

with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'w') as f:
    f.write(content)

