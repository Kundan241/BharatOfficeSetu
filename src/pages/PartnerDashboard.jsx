import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { processSheetRecords } from '../utils/ledgerUtils';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDvmLliVGdBQCvB68D4SbuWpYlWNoUYZIK3QdM6TOGQwmP4kydtWIS1s4NKtR9Hmq3NA/exec';

export default function PartnerDashboard() {
  const { user, role, partnerName, loading } = useAuth();
  const navigate = useNavigate();
  
  const [referrals, setReferrals] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('All');

  useEffect(() => {
    if (!loading && (!user || role !== 'partner')) {
      navigate('/login');
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (!user || role !== 'partner' || !partnerName) return;
    
    const fetchLedger = async () => {
      try {
        // 1. Fetch from Firestore
        let firestoreCases = [];
        try {
          const snap = await getDocs(collection(db, 'partners', user.uid, 'referrals'));
          firestoreCases = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            // Map keys to match the Sheets format if needed
            'Client Name': d.data().clientName || d.data()['Client Name'],
            'Company Name': d.data().companyName || d.data()['Company Name'] || 'N/A',
            'PAN': d.data().pan || d.data()['PAN'] || 'N/A',
            'Payment Status': d.data().paymentStatus || d.data()['Payment Status'] || 'In Process',
            'ARN Number': d.data().arnNumber || d.data()['ARN Number']
          }));
        } catch (e) {
          console.error("Failed to fetch Firestore cases", e);
        }

        // 2. Fetch from Google Apps Script Webhook
        let sheetCases = [];
        try {
          const res = await fetch(SCRIPT_URL + '?action=getLedger');
          const data = await res.json();
          let records = data.records || data || [];
          records = processSheetRecords(records);
          sheetCases = records.filter(row => {
            if (!row || !row['Partner Name']) return false;
            return row['Partner Name'].toString().trim().toLowerCase() === partnerName?.toString().trim().toLowerCase();
          });
        } catch (e) {
          console.error("Failed to fetch Google Sheets cases", e);
        }

        // 3. Merge and Deduplicate
        // Use PAN or Client Name to deduplicate (giving priority to Firestore)
        const combined = [...firestoreCases];
        const combinedKeys = new Set(
          combined.map(r => String(r['PAN'] || '').toLowerCase() || String(r['Client Name'] || '').toLowerCase())
        );

        for (const sCase of sheetCases) {
          const key1 = String(sCase['PAN'] || '').toLowerCase();
          const key2 = String(sCase['Client Name'] || '').toLowerCase();
          if ((key1 && combinedKeys.has(key1)) || (key2 && combinedKeys.has(key2))) {
            // Already exists in Firestore data, skip
            continue;
          }
          combined.push(sCase);
          if (key1) combinedKeys.add(key1);
          if (key2) combinedKeys.add(key2);
        }

        setReferrals(combined);
      } catch (error) {
        console.error("Failed to load referrals", error);
      } finally {
        setFetching(false);
      }
    };
    
    fetchLedger();
  }, [user, role, partnerName]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
    navigate('/login');
  };

  // Removed early return to allow shell rendering

  const getMonthString = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString('default', { month: 'long' });
  };

  const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const uniqueMonths = ['All', ...new Set((referrals || []).map(r => getMonthString(r.timestamp || r.Date || r.Timestamp || r.createdAt)).filter(Boolean))];
  
  // If uniqueMonths only has 'All', maybe just show standard months or whatever exists.
  // We will just use uniqueMonths.

  const displayedReferrals = selectedMonth === 'All' 
    ? (referrals || []) 
    : (referrals || []).filter(r => getMonthString(r.timestamp || r.Date || r.Timestamp || r.createdAt) === selectedMonth);

  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans">
      {/* Navbar */}
      <nav className="h-[72px] bg-white border-b border-[rgba(17,17,16,0.06)] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="BOS Logo" className="h-6 object-contain" />
          <div className="h-4 w-[1px] bg-[rgba(17,17,16,0.1)] mx-2"></div>
          <span className="text-[14px] font-[600] text-[#111110]">Partner Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[13px] text-[rgba(17,17,16,0.45)]">
            {partnerName || user?.email}
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[13px] font-[600] text-[rgba(17,17,16,0.6)] hover:text-[#DC2626] transition-colors"
          >
            <LogOut size={16} /> <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto p-4 md:p-8 pb-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[200px] shrink-0">
          <h2 className="text-[14px] font-[700] text-[#111110] mb-4">Filter by Month</h2>
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {uniqueMonths.map(m => (
              <button 
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`whitespace-nowrap text-left px-3 py-2 rounded-[8px] text-[13px] font-[500] transition-colors ${selectedMonth === m ? 'bg-[#1B6B2F] text-white' : 'text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.04)]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111110] mb-2">
              Your Cases
            </h1>
            <p className="text-[14px] md:text-[15px] text-[rgba(17,17,16,0.55)]">
              Track the status of cases you've referred.
            </p>
          </div>

          <div className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
            {(loading || fetching) ? (
              <div className="flex flex-col animate-pulse">
                {/* Skeleton Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[rgba(17,17,16,0.06)] bg-[#F9F8F5]">
                  <div className="col-span-4 h-3 bg-gray-200 rounded"></div>
                  <div className="col-span-4 h-3 bg-gray-200 rounded"></div>
                  <div className="col-span-2 h-3 bg-gray-200 rounded"></div>
                  <div className="col-span-2 h-3 bg-gray-200 rounded"></div>
                </div>
                
                {/* Skeleton Rows */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border-b border-[rgba(17,17,16,0.05)] last:border-0">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      <div className="col-span-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>
                      <div className="col-span-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
                      <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-full"></div></div>
                      <div className="col-span-2"><div className="h-6 bg-gray-200 rounded-full w-20"></div></div>
                    </div>
                    {/* Mobile Skeleton */}
                    <div className="md:hidden p-4 flex flex-col gap-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (!displayedReferrals || displayedReferrals.length === 0) ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="text-[15px] font-[500] text-[rgba(17,17,16,0.4)]">
                  No cases found for {selectedMonth}.
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Table Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[rgba(17,17,16,0.06)] bg-[#F9F8F5] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
                  <div className="col-span-4">CLIENT NAME</div>
                  <div className="col-span-4">COMPANY NAME</div>
                  <div className="col-span-2">PAN</div>
                  <div className="col-span-2">PAYMENT STATUS</div>
                </div>

                {/* Referrals List */}
                {(displayedReferrals || []).map((ref, index) => (
                  <div key={ref?.id || index} className="border-b border-[rgba(17,17,16,0.05)] last:border-0 hover:bg-[rgba(27,107,47,0.02)] transition-colors">
                    {/* Mobile View */}
                    <div className="md:hidden p-4 flex flex-col gap-3">
                      <div className="font-[600] text-[14px] text-[#111110]">{ref?.['Client Name'] || 'N/A'}</div>
                      <div className="text-[13px] font-mono text-[rgba(17,17,16,0.45)]">{ref?.['Company Name'] || 'N/A'}</div>
                      <div className="text-[13px] font-mono text-[rgba(17,17,16,0.45)]">{ref?.['PAN'] || 'N/A'}</div>
                      <div className="flex gap-2">
                        <StatusPill status={ref?.['Payment Status']} />
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      <div className="col-span-4 font-[600] text-[14px] text-[#111110] truncate">
                        {ref?.['Client Name'] || 'N/A'}
                      </div>
                      <div className="col-span-4 text-[13px] text-[rgba(17,17,16,0.6)] truncate">
                        {ref?.['Company Name'] || 'N/A'}
                      </div>
                      <div className="col-span-2 text-[13px] font-mono text-[rgba(17,17,16,0.45)] truncate">
                        {ref?.['PAN'] || 'N/A'}
                      </div>
                      <div className="col-span-2">
                        <StatusPill status={ref?.['Payment Status']} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusPill({ status }) {
  const currentStatus = status || 'In Process';
  const s = currentStatus.toLowerCase();
  
  let bgClass = 'bg-[#F4F3EE]';
  let textClass = 'text-[rgba(17,17,16,0.6)]';
  
  if (s === 'payment done') {
    bgClass = 'bg-[#E8F5E9]';
    textClass = 'text-[#1B6B2F]';
  } else if (s === 'in process') {
    bgClass = 'bg-[#FFF3E0]';
    textClass = 'text-[#F4831F]';
  } else if (s === 'client revoked') {
    bgClass = 'bg-[#FFEBEE]';
    textClass = 'text-[#DC2626]';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-[600] ${bgClass} ${textClass}`}>
      {currentStatus}
    </span>
  );
}
