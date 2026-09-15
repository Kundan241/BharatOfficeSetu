import React, { useState, useMemo } from 'react';

const ACTUAL_DATA = [
  { id: 1, salesName: "AADHYA CREATION MALANI", company: "HETALBEN HIRENBHAI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9311.0 },
  { id: 2, salesName: "AAMO HOMES LLP AAMO", company: "HOMES LLP", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 3, salesName: "ABK Internet ABK INTERNET", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 9676.0 },
  { id: 4, salesName: "AJIT TRIVIAL", company: "GLOBAL LLP", location: "Haryana - Gurugram", relationshipManager: "MD farid", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 5, salesName: "AMOL PAWAR", company: "CHANCHAL SHARMA", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB)", amount: 8856.0 },
  { id: 6, salesName: "AMOL PAWAR", company: "RIYA JAIN", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India", amount: 8856.0 },
  { id: 7, salesName: "ANAIMALAIS COCO", company: "ANAIMALAIS COCO", location: "HR GSTIN + Virtual Office", relationshipManager: "Pooja Prakash Patne", serviceType: "Virtual Office - India", amount: 0.0 },
  { id: 8, salesName: "Aavi Enterprise", company: "VIKAS MULEY", location: "HR GSTIN + Virtual Office", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 9, salesName: "Abhishek tambi", company: "ABHISHEK TAMBI", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 10, salesName: "Aditya UNNIKRISHNAN", company: "ADITYA KRISHNAN", location: "Personal Personal", relationshipManager: "Aishwarya Vijay Danavale", serviceType: "Gazette Name Change -", amount: 11256.0 },
  { id: 11, salesName: "Aniket Yadav", company: "ANIKET YADAV", location: "Rajasthan", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 8856.0 },
  { id: 12, salesName: "Ankit Gupta", company: "Ankit Gupta", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 13, salesName: "Arvind Mathur BYTECHNIK INDIA", company: "PRIVATE LIMITED", location: "Delhi", relationshipManager: "B BHAVESH", serviceType: "Virtual Office - India", amount: 10620.0 },
  { id: 14, salesName: "Avijit", company: "AVIJIT GHOSH", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 15, salesName: "BEVERLY HILLS PRIVATE LIMITED BEVERLY HILLS SALES", company: "PRIVATE LIMITED", location: "Haryana", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India", amount: 0.0 },
  { id: 16, salesName: "Beena Khemka", company: "KIRTI KHEMKA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 17, salesName: "COLORTRADES KAPIL", company: "SUBHASH BHANDARI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 18, salesName: "D Brothers", company: "MITHUN KUMAR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9520.0 },
  { id: 19, salesName: "DEELMO VAGHELA", company: "PARULBEN NARESHBHAI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 10161.0 },
  { id: 20, salesName: "DRUV KOSHARA VENTURES (GUJARAT)", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB)", amount: 0.0 },
  { id: 21, salesName: "Danish Rughwani", company: "DANISH RUGHWANI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 22, salesName: "Darshan Kankotiya DARSHAN", company: "RAMESHBHAI KANKOTIYA", location: "Haryana", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10141.0 },
  { id: 23, salesName: "Deconstruct BAYPURE LIFESTYLE", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 24, salesName: "Dilip yadav", company: "KAMLA YADAV", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 25, salesName: "Divyadevi narayanbhai balani", company: "DIVYABEN BALANI", location: "Haryana - Gurugram", relationshipManager: "Khushi Devendra Lakhmania", serviceType: "Virtual Office - India", amount: 0.0 },
  { id: 26, salesName: "Emart TUSHARBHAI", company: "SHAMBHUBHAI DONDA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 8601.0 },
  { id: 27, salesName: "G jewels RAJENDRA", company: "KESHAWLAL VYAS", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 28, salesName: "GLAM COSMETICS", company: "GLAM21 COSMETICS", location: "HR - Virtual Office Renewal", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 29, salesName: "Gopal Patel GOPAL", company: "BHACHUBHAI PATEL", location: "HR GSTIN + Virtual Office", relationshipManager: "Bhavesh Bhoir", serviceType: "GST Registration - APOB", amount: 10578.0 },
  { id: 30, salesName: "Gopal Patel GOPAL", company: "BHACHUBHAI PATEL", location: "HR GSTIN + Virtual Office", relationshipManager: "Tahaziya Tabassum A", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 31, salesName: "Hinnis Consumer Pvt Ltd HINISS CONSUMER", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10111.0 },
  { id: 32, salesName: "Honey", company: "ANKITA KUMAWAT", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 33, salesName: "IndianFestivals JAYDIPBHAI", company: "NARASHIBHAI GANGANI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9311.0 },
  { id: 34, salesName: "KHUSH ENTERPRISE", company: "KHUSH ENTERPRISE", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 35, salesName: "Kovilampati Naresh", company: "KOVILAMPATI NARESH", location: "Personal Personal", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Gazette Name Change -", amount: 11256.0 },
  { id: 36, salesName: "MAA", company: "TEXTILE ANSI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 37, salesName: "MANLINO", company: "KNIT KINGDOM", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 38, salesName: "MANO KNITTING MILLS", company: "AM GARMENTS", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 39, salesName: "Mallory", company: "MUSIRUL HAQUK", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 40, salesName: "Mohammad Zubair Jan NABSHAR HEALTHTECH", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9811.0 },
  { id: 41, salesName: "Mohit Arora", company: "MOHIT ARORA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9520.0 },
  { id: 42, salesName: "Mr.askcolorfit", company: "ANKUSH AGARWAL", location: "HR - Virtual Office Renewal", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 43, salesName: "Ms.Jinander Jain JINANDER", company: "KUMAR JAIN", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 44, salesName: "NAKUL VOLUME BRANDS", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 45, salesName: "NAMAN BATRA", company: "NAMAN BATRA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 46, salesName: "NIRVIKA E Retail India Pvt Ltd NIRVIKA E-RETAIL INDIA", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 47, salesName: "Nice foto makers pvt.ltd. NICE FOTOMAKERS", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 48, salesName: "Nikhil", company: "HARSHIT BHANDARI", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 49, salesName: "Omnitail", company: "VANEETA RANI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 50, salesName: "PASSION PETALS", company: "SHILPA GUPTA", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 51, salesName: "Pd Cloth Villa GITABEN", company: "DEVRAJBHAI ANGHAN", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 52, salesName: "Raghu chilukoori", company: "RAGHU CHILUKOORI", location: "Personal Personal", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Gazette Name Change -", amount: 11256.0 },
  { id: 53, salesName: "Ravi Verma", company: "Ravi Verma", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 54, salesName: "Reeta WHITE ELEPHANT CLOTHING", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India", amount: 0.0 },
  { id: 55, salesName: "Rohit Tiwari", company: "ROHIT TIWARI", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 7828.0 },
  { id: 56, salesName: "Roshan Singh", company: "MOHAMMAD ZUBAIR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 57, salesName: "SABARI HOMWELL CORPORATION SABARI", company: "HOMWELL CORPORATION", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11830.0 },
  { id: 58, salesName: "SHEYN FASHION", company: "RAHUL KUMAR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 59, salesName: "SURYA TEJA VALA FLUXCHARGE INDIA", company: "PRIVATE LIMITED", location: "Rajasthan", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12354.0 },
  { id: 60, salesName: "SWAMI TRADING COMPANY", company: "GAURAV MANWANI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 61, salesName: "Sai Enterprises", company: "ATIT MAKOL", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 62, salesName: "Sanjeev", company: "Sanjeev SANJEEV", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 63, salesName: "Sarvesh Dhamani", company: "SARVESH DHAMANI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 12578.0 },
  { id: 64, salesName: "Shailesh... HITESH RAMESH", company: "JAIN (HUF)", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 65, salesName: "SharkTribe Fashion India Pvt. Ltd. SHARKTRIBE FASHION (INDIA)", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 66, salesName: "ShreeRAm ENT. PREM", company: "RAMJI VAVIYA", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10311.0 },
  { id: 67, salesName: "Sridhar Sampathirao ZENVOKE LABS", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 68, salesName: "THE LASER ART KAILASHBEN", company: "RAJESHBHAI SHEKHADA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 69, salesName: "TRISHAKTI ALLOYS INDUSTRIES", company: "MAHENDER SINGH", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 70, salesName: "The sky store DEV", company: "PRAVEEN PATEL", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12578.0 },
  { id: 71, salesName: "Tresna Collection", company: "TANYA YADAV", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 72, salesName: "United Denims", company: "UNITED DENIMS", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11830.0 },
  { id: 73, salesName: "Uno Aroma", company: "CASH CHEM", location: "HR - Virtual Office Renewal", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 74, salesName: "Vikash BIOSPHERE NATURE", company: "POOLS LLP", location: "Rajasthan", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 8856.0 },
  { id: 75, salesName: "Wcsenterprise KACHHAD", company: "SAVITRIBEN UMESHBHAI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 76, salesName: "Yogesh Deshmukh VIKRAM TEA PROCESSOR", company: "PRIVATE LIMITED", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 77, salesName: "Yogesh Deshmukh VIKRAM TEA PROCESSOR", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 78, salesName: "krishna collection RABINDRA", company: "KUMAR BHAGAT", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 8311.0 },
  { id: 79, salesName: "priority ingredient MODAMINGLE FASHION", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Khushi Devendra Lakhmania", serviceType: "Virtual Office - India", amount: 0.0 },
  { id: 80, salesName: "raj yogi JAY", company: "RAVINDRA KHATRI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 81, salesName: "sachinbishtcvg", company: "AYUSHI KUSHWAHA", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 82, salesName: "satyamfab", company: "SATYAM FAB", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 83, salesName: "senthil prakash SENTHIL", company: "PRAKASH SEENI", location: "Personal Personal", relationshipManager: "PRATHAP N", serviceType: "Gazette Name Change -", amount: 11256.0 },
  { id: 84, salesName: "shivani Jaiswal VISTAARAI INFOTECH", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Bikash mahato L", serviceType: "Virtual Office - India", amount: 11210.0 },
  { id: 85, salesName: "shivani Jaiswal VISTAARAI INFOTECH", company: "PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB)", amount: 11210.0 },
  { id: 86, salesName: "the table tales EKTA", company: "KRUNAL KAKADIYA", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12578.0 },
  { id: 87, salesName: "yug apparels SALECHA BHARAT", company: "LOONCHAND HUF", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 }
];

const AdminSalesLedger = ({ isAdmin = false, data = ACTUAL_DATA }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      (item.salesName && item.salesName.toLowerCase().includes(lowerSearch)) || 
      (item.company && item.company.toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 1. Access Control (Admin Only)
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">403 Unauthorized</h2>
        <p className="text-gray-600 text-center max-w-md">
          Access Denied. You do not have the necessary permissions to view the Sales Ledger. This area is restricted to administrators only.
        </p>
      </div>
    );
  }

  // 2. The Data Table UI
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header and Search */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">India Filings Sales</h2>
        
        {/* 3. Interactivity: Search Bar at the top right */}
        <div className="relative w-full sm:w-80 ml-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search by Sales Name or Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Sales Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Company/Entity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Service Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Relationship Manager
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.salesName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.relationshipManager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    No records found matching "{searchTerm}"
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesLedger;
