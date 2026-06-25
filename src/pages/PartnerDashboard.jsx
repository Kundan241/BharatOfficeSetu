import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { getPartnerReferrals } from '../services/partners';
import { auth } from '../firebase';

export default function PartnerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [referrals, setReferrals] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchReferrals = async () => {
      try {
        const data = await getPartnerReferrals(user.uid);
        setReferrals(data);
      } catch (error) {
        console.error("Failed to load referrals", error);
      } finally {
        setFetching(false);
      }
    };
    
    fetchReferrals();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
    navigate('/login');
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Group referrals by month
  const groupedReferrals = referrals.reduce((acc, ref) => {
    const monthYear = ref.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(ref);
    return acc;
  }, {});

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
            {user?.email}
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
      <main className="max-w-[1000px] mx-auto p-4 md:p-8 pb-20">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#111110] mb-2">
            Your Referrals
          </h1>
          <p className="text-[14px] md:text-[15px] text-[rgba(17,17,16,0.55)]">
            Track the status of clients you've referred.
          </p>
        </div>

        <div className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {referrals.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="text-[15px] font-[500] text-[rgba(17,17,16,0.4)]">
                No referrals found. Share your partner link to get started.
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {Object.entries(groupedReferrals).map(([monthYear, monthReferrals]) => (
                <div key={monthYear}>
                  <div className="px-6 py-3 bg-[#F9F8F5] border-b border-[rgba(17,17,16,0.06)] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
                    {monthYear.toUpperCase()}
                  </div>
                  
                  {/* Table Header (Desktop) */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-[rgba(17,17,16,0.06)] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
                    <div className="col-span-4">CLIENT NAME</div>
                    <div className="col-span-3">ARN NUMBER</div>
                    <div className="col-span-3">GST STATUS</div>
                    <div className="col-span-2">PAYMENT STATUS</div>
                  </div>

                  {/* Referrals List */}
                  {monthReferrals.map((ref) => (
                    <div key={ref.id} className="border-b border-[rgba(17,17,16,0.05)] last:border-0 hover:bg-[rgba(27,107,47,0.02)] transition-colors">
                      {/* Mobile View */}
                      <div className="md:hidden p-4 flex flex-col gap-3">
                        <div className="font-[600] text-[14px] text-[#111110]">{ref.clientName}</div>
                        <div className="text-[13px] font-mono text-[rgba(17,17,16,0.45)]">{ref.arnNumber || 'N/A'}</div>
                        <div className="flex gap-2">
                          <StatusPill type="gst" status={ref.gstStatus} />
                          <StatusPill type="payment" status={ref.paymentStatus} />
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-4 font-[600] text-[14px] text-[#111110] truncate">
                          {ref.clientName}
                        </div>
                        <div className="col-span-3 text-[13px] font-mono text-[rgba(17,17,16,0.45)] truncate">
                          {ref.arnNumber || 'N/A'}
                        </div>
                        <div className="col-span-3">
                          <StatusPill type="gst" status={ref.gstStatus} />
                        </div>
                        <div className="col-span-2">
                          <StatusPill type="payment" status={ref.paymentStatus} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusPill({ type, status }) {
  if (!status) return <span className="text-[12px] text-[rgba(17,17,16,0.3)]">--</span>;
  
  let bgClass = '';
  let textClass = '';
  
  const s = status.toLowerCase();
  
  if (type === 'gst') {
    if (s === 'approved') {
      bgClass = 'bg-[#E8F5E9]';
      textClass = 'text-[#1B6B2F]';
    } else if (s === 'pending') {
      bgClass = 'bg-[#FFF3E0]';
      textClass = 'text-[#F4831F]';
    } else if (s === 'rejected') {
      bgClass = 'bg-[#FFEBEE]';
      textClass = 'text-[#DC2626]';
    } else {
      bgClass = 'bg-[#F4F3EE]';
      textClass = 'text-[rgba(17,17,16,0.6)]';
    }
  } else if (type === 'payment') {
    if (s === 'paid') {
      bgClass = 'bg-[#E8F5E9]';
      textClass = 'text-[#1B6B2F]';
    } else if (s === 'pending') {
      bgClass = 'bg-[#FFEBEE]';
      textClass = 'text-[#DC2626]';
    } else {
      bgClass = 'bg-[#F4F3EE]';
      textClass = 'text-[rgba(17,17,16,0.6)]';
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-[600] ${bgClass} ${textClass}`}>
      {status}
    </span>
  );
}
