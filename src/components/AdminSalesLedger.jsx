import React, { useState, useMemo } from 'react';

const ACTUAL_DATA = [
  { id: 1, salesName: "AADHYA CREATION", company: "MALANI HETALBEN HIRENBHAI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9311.0 },
  { id: 2, salesName: "AAMO HOMES LLP", company: "AAMO HOMES LLP", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 3, salesName: "Aarya Creation", company: "GOPI NILESH RADADIYA", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 4, salesName: "Aavi Enterprise", company: "VIKAS MULEY", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 5, salesName: "Abhishek tambi", company: "ABHISHEK TAMBI", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 6, salesName: "ABK Internet", company: "ABK INTERNET PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 9676.0 },
  { id: 7, salesName: "Aditya", company: "UNNIKRISHNAN ADITYA KRISHNAN", location: "Personal", relationshipManager: "Aishwarya Vijay Danavale", serviceType: "Gazette Name Change - Personal", amount: 11256.0 },
  { id: 8, salesName: "Aditya Jayant Salunkhe", company: "ADITYA JAYANT SALUNKHE", location: "Haryana", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 8850.0 },
  { id: 9, salesName: "AJIT", company: "TRIVIAL GLOBAL LLP", location: "Haryana - Gurugram", relationshipManager: "MD farid", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 10, salesName: "Amol", company: "PARMOD", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 11, salesName: "AMOL PAWAR", company: "RIYA JAIN", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India", amount: 8856.0 },
  { id: 12, salesName: "AMOL PAWAR", company: "CHANCHAL SHARMA", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB)", amount: 8856.0 },
  { id: 13, salesName: "Aniket Yadav", company: "ANIKET YADAV", location: "Rajasthan", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 8856.0 },
  { id: 14, salesName: "Ankit Gupta", company: "Ankit Gupta", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 15, salesName: "Arvind Mathur", company: "BYTECHNIK INDIA PRIVATE LIMITED", location: "Delhi", relationshipManager: "B BHAVESH", serviceType: "Virtual Office - India", amount: 10620.0 },
  { id: 16, salesName: "Avijit", company: "AVIJIT GHOSH", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 17, salesName: "Beena Khemka", company: "KIRTI KHEMKA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 18, salesName: "Boat International", company: "RACHIT BHATIA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 19, salesName: "COLORTRADES", company: "KAPIL SUBHASH BHANDARI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 20, salesName: "D Brothers", company: "MITHUN KUMAR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9520.0 },
  { id: 21, salesName: "Danish Rughwani", company: "DANISH RUGHWANI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 22, salesName: "Darshan Kankotiya", company: "DARSHAN RAMESHBHAI KANKOTIYA", location: "Haryana", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10140.0 },
  { id: 23, salesName: "Deconstruct", company: "BAYPURE LIFESTYLE PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 24, salesName: "DEELMO", company: "VAGHELA PARULBEN NARESHBHAI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 10161.0 },
  { id: 25, salesName: "Dilip yadav", company: "KAMLA YADAV", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 26, salesName: "DJSONSCONSUMERGOODSPVT", company: "DJ SONS CONSUMER GOODS PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 9210.0 },
  { id: 27, salesName: "Emart", company: "TUSHARBHAI SHAMBHUBHAI DONDA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 8601.0 },
  { id: 28, salesName: "FASHION RETAIL", company: "SANDEEP BHATIA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 29, salesName: "G jewels", company: "RAJENDRA KESHAWLAL VYAS", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 30, salesName: "GANESH ENT", company: "SHILABEN DIPAKBHAI SUTARIYA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 31, salesName: "GLAM COSMETICS", company: "GLAM21 COSMETICS", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 32, salesName: "Gopal Patel", company: "GOPAL BHACHUBHAI PATEL", location: "Haryana - Gurugram", relationshipManager: "Tahaziya Tabassum A", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
  { id: 33, salesName: "GPN PRINT TECHNOLOGY", company: "NAVIN PREMJI GAMI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 34, salesName: "Hardik Gabani", company: "HARDIK BHARATBHAI GABANI", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 35, salesName: "Hinnis Consumer Pvt Ltd", company: "HINISS CONSUMER PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10111.0 },
  { id: 36, salesName: "Honey", company: "ANKITA KUMAWAT", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 37, salesName: "IndianFestivals", company: "JAYDIPBHAI NARASHIBHAI GANGANI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9311.0 },
  { id: 38, salesName: "Kanhelal Multitrade Pvt Ltd", company: "KANHELAL MULTI TRADE PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 39, salesName: "KHUSH ENTERPRISE", company: "KHUSH ENTERPRISE", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 40, salesName: "Kovilampati Naresh", company: "KOVILAMPATI NARESH", location: "Personal", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Gazette Name Change - Personal", amount: 11256.0 },
  { id: 41, salesName: "krishna collection", company: "RABINDRA KUMAR BHAGAT", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 8311.0 },
  { id: 42, salesName: "LUKHI NEEL NIKULBHAI", company: "LUKHI NEEL NIKULBHAI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 43, salesName: "MAA TEXTILE", company: "ANSI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 44, salesName: "Mallory", company: "MUSIRUL HAQUK", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 45, salesName: "MANLINO", company: "KNIT KINGDOM", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 46, salesName: "MANO KNITTING MILLS", company: "AM GARMENTS", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 47, salesName: "Mohammad Zubair Jan", company: "NABSHAR HEALTHTECH PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9811.0 },
  { id: 48, salesName: "Mohit Arora", company: "MOHIT ARORA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9520.0 },
  { id: 49, salesName: "Mr.askcolorfit", company: "ANKUSH AGARWAL", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 50, salesName: "Ms.Jinander Jain", company: "JINANDER KUMAR JAIN", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 51, salesName: "Ms.Rajesh Khanna", company: "RAJESH ENTERPRISES", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 52, salesName: "NAKUL", company: "VOLUME BRANDS PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 53, salesName: "NAMAN BATRA", company: "NAMAN BATRA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 54, salesName: "Nice foto makers pvt.ltd.", company: "NICE FOTOMAKERS PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 55, salesName: "Nick", company: "ACOFEL INDIA PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 56, salesName: "Nikhil", company: "HARSHIT BHANDARI", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 57, salesName: "NIRVIKA E Retail India Pvt Ltd", company: "NIRVIKA E-RETAIL INDIA PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 58, salesName: "Omnitail", company: "VANEETA RANI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 59, salesName: "Oobs", company: "SANJEEV PURI", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 9600.0 },
  { id: 60, salesName: "PASSION PETALS", company: "SHILPA GUPTA", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 61, salesName: "Pd Cloth Villa", company: "GITABEN DEVRAJBHAI ANGHAN", location: "Haryana", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 62, salesName: "priyanka", company: "PRIYANKA SAHA", location: "Haryana", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 8850.0 },
  { id: 63, salesName: "Raghu chilukoori", company: "RAGHU CHILUKOORI", location: "Personal", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Gazette Name Change - Personal", amount: 11256.0 },
  { id: 64, salesName: "raj yogi", company: "JAY RAVINDRA KHATRI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 65, salesName: "Ravi Verma", company: "Ravi Verma", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 66, salesName: "Rohit Tiwari", company: "ROHIT TIWARI", location: "Rajasthan", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 7828.0 },
  { id: 67, salesName: "Roshan Singh", company: "MOHAMMAD ZUBAIR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 68, salesName: "SABARI HOMWELL CORPORATION", company: "SABARI HOMWELL CORPORATION", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11830.0 },
  { id: 69, salesName: "sachinbishtcvg", company: "AYUSHI KUSHWAHA", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 70, salesName: "Sai Enterprises", company: "ATIT MAKOL", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 71, salesName: "SAnat kumar", company: "SANAT KUMAR", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 72, salesName: "Sanjeev", company: "SANJEEV", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 73, salesName: "SANTRAM ENTERPRISE", company: "JAYKUMAR KIRITBHAI PATEL", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 74, salesName: "Sarvesh Dhamani", company: "SARVESH DHAMANI", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 12578.0 },
  { id: 75, salesName: "satyamfab", company: "SATYAM FAB", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 76, salesName: "senthil prakash", company: "SENTHIL PRAKASH SEENI", location: "Personal", relationshipManager: "PRATHAP N", serviceType: "Gazette Name Change - Personal", amount: 11256.0 },
  { id: 77, salesName: "Shailesh...", company: "HITESH RAMESH JAIN (HUF)", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9521.0 },
  { id: 78, salesName: "SharkTribe Fashion India Pvt. Ltd.", company: "SHARKTRIBE FASHION (INDIA) PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Vishal Shyamkaran Yadav", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 79, salesName: "SHEYN FASHION", company: "RAHUL KUMAR", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 80, salesName: "shivani Jaiswal", company: "VISTAARAI INFOTECH PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Bikash mahato L", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 81, salesName: "SHOPPING STATION", company: "SHOPPING STATION", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 8850.0 },
  { id: 82, salesName: "ShreeRAm ENT.", company: "PREM RAMJI VAVIYA", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10311.0 },
  { id: 83, salesName: "SLNS MARKETING", company: "UGRANARASIMHAPPA DHANANJAYA", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 84, salesName: "SNENTERPRIESES", company: "VISHAL KUMAR", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 85, salesName: "Sridhar Sampathirao", company: "ZENVOKE LABS PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 86, salesName: "staify international", company: "Vasani Yamit Hirabhai", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 9811.0 },
  { id: 87, salesName: "SURYA TEJA VALA", company: "FLUXCHARGE INDIA PRIVATE LIMITED", location: "Rajasthan", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12354.0 },
  { id: 88, salesName: "SWAMI TRADING COMPANY", company: "GAURAV MANWANI", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11830.0 },
  { id: 89, salesName: "THE LASER ART", company: "KAILASHBEN RAJESHBHAI SHEKHADA", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 90, salesName: "The sky store", company: "DEV PRAVEEN PATEL", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12578.0 },
  { id: 91, salesName: "the table tales", company: "EKTA KRUNAL KAKADIYA", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 12578.0 },
  { id: 92, salesName: "Tresna Collection", company: "TANYA YADAV", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11210.0 },
  { id: 93, salesName: "TRISHAKTI ALLOYS INDUSTRIES", company: "MAHENDER SINGH", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 9521.0 },
  { id: 94, salesName: "United Denims", company: "UNITED DENIMS", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 11830.0 },
  { id: 95, salesName: "Uno Aroma", company: "CASH CHEM", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 96, salesName: "Variety bazaar", company: "R K FASHION ACCESSORIES PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 97, salesName: "Varni sales", company: "REENABEN AKSHAY DESAI", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 10311.0 },
  { id: 98, salesName: "Vikash", company: "BIOSPHERE NATURE POOLS LLP", location: "Rajasthan", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 8856.0 },
  { id: 99, salesName: "Wcsenterprise", company: "KACHHAD SAVITRIBEN UMESHBHAI", location: "Haryana - Gurugram", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 100, salesName: "XELECTRON TECHNOLOGIES PRIVATE LIMITED", company: "XELECTRON TECHNOLOGIES PRIVATE LIMITED", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "Virtual Office - India Renewal", amount: 10210.0 },
  { id: 101, salesName: "Yasmin Mollick", company: "JASMIN SARKAR", location: "Haryana - Gurugram", relationshipManager: "Payal Ashok Vishwakarma", serviceType: "Virtual Office - India Renewal", amount: 11210.0 },
  { id: 102, salesName: "Yogesh Deshmukh", company: "VIKRAM TEA PROCESSOR PRIVATE LIMITED", location: "Haryana", relationshipManager: "Rinku Ruparam Prajapati", serviceType: "Virtual Office - India Renewal", amount: 10578.0 },
  { id: 103, salesName: "yug apparels", company: "SALECHA BHARAT LOONCHAND HUF", location: "Haryana - Gurugram", relationshipManager: "Siddhi Rajendra Pawar", serviceType: "GST Registration (APOB + PPOB) + Virtual Office - India", amount: 10578.0 },
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
