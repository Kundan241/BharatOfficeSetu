import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, useLocation, Link, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/ToastContext';
import { 
  LogOut, Search, FileText, ChevronRight, 
  ArrowLeft, Plus, Check, Trash2, LayoutDashboard, 
  Users, UserPlus, Menu, X as XIcon, UploadCloud, Eye, EyeOff, MoreVertical,
  AlertTriangle, Pencil
} from 'lucide-react';
import { SERVICE_STEPS } from '../services/services';
import { auth, db } from '../firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, 
  deleteDoc, onSnapshot, query, orderBy, limit, serverTimestamp, 
  where 
} from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { createClientAccount } from '../services/auth';
import { updateServiceStatus, addService } from '../services/services';
import { uploadDocument, deleteDocument } from '../services/documents';
import { uploadFile } from '../services/cloudinary';
import AdminBlog from './AdminBlog';
import emailjs from '@emailjs/browser';
import { 
  createPartner, 
  getAllPartners, 
  getPartner, 
  addReferral, 
  updateReferralStatus, 
  getPartnerReferrals 
} from '../services/partners';
import { processSheetRecords } from '../utils/ledgerUtils';

const ADMIN_GATE_PASSWORD = 'BOS@Admin2026';

// --- Toast & Confirm components (Mocked globally or handled here) ---
// Toast is from useToast
// We need a Confirmation Dialog Component
function ConfirmDialog({ isOpen, options, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" onClick={onClose}></div>
      <div className="bg-white rounded-[16px] p-7 w-full max-w-[360px] relative z-10 scale-100 opacity-100 transition-all duration-200">
        {options.type === 'danger' ? (
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mb-4">
            <Trash2 size={24} />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
        )}
        <h3 className="text-[17px] font-bold text-[#111110]">{options.title}</h3>
        <p className="text-[14px] text-[rgba(17,17,16,0.55)] mt-1.5 mb-6">{options.message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 h-10 rounded-full font-semibold text-[14px] text-[rgba(17,17,16,0.55)] hover:bg-[rgba(17,17,16,0.05)] transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => { options.onConfirm(); onClose(); }} 
            className={`px-5 h-10 rounded-full font-semibold text-[14px] text-white transition-colors ${options.type === 'danger' ? 'bg-[#DC2626] hover:bg-red-700' : 'bg-[#1B6B2F] hover:bg-[#145324]'}`}
          >
            {options.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Admin Component ---
export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ isOpen: false, options: {} });
  const showConfirm = (options) => setConfirmState({ isOpen: true, options });
  const closeConfirm = () => setConfirmState({ isOpen: false, options: {} });

  // Auth & Session Check
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (!isAdmin) {
        navigate('/login');
        return;
      }
      
      const verified = localStorage.getItem('bos_admin_verified');
      if (verified === 'true') {
        setAdminAuthenticated(true);
      }
      setAuthChecked(true);
    }
  }, [user, isAdmin, loading, navigate]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_GATE_PASSWORD) {
      localStorage.setItem('bos_admin_verified', 'true');
      setAdminAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('bos_admin_verified');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] flex items-center justify-center px-4 font-sans relative">
        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>
        <div className="bg-white p-10 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-[400px] relative z-10 fade-up-enter">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-[#111110]">Admin Gate</h2>
            <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Enter admin password to continue</p>
          </div>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[13px] font-semibold text-[#111110]">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className={`w-full h-12 bg-[#F9F8F5] border rounded-[10px] pl-4 pr-10 text-[14px] outline-none transition-colors duration-200
                    ${passwordError ? 'border-[#DC2626] shake-animation' : 'border-[rgba(17,17,16,0.1)] focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <span className="text-[12px] text-[#DC2626] mt-1">Incorrect password</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-[48px] mt-2 bg-[#1B6B2F] text-white rounded-[100px] font-bold text-[15px] hover:bg-[#145324] transition-all hover:-translate-y-[1px]"
            >
              Enter Admin Panel
            </button>
          </form>
        </div>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .shake-animation {
            animation: shake 0.3s ease-in-out;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0 }
            100% { background-position: -200% 0 }
          }
          .skeleton-shimmer {
            background: linear-gradient(90deg, #f0ede8 0%, #e8e4de 50%, #f0ede8 100%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
        `}</style>
      </div>
    );
  }

  const getActiveTab = () => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') return 'dashboard';
    if (location.pathname.startsWith('/admin/blog')) return 'blog';
    if (location.pathname.startsWith('/admin/cases')) return 'cases';
    if (location.pathname.startsWith('/admin/clients/add')) return 'add-client';
    if (location.pathname.startsWith('/admin/clients')) return 'clients';
    if (location.pathname.startsWith('/admin/partners/add')) return 'add-partner';
    if (location.pathname.startsWith('/admin/partners')) return 'partners';
    return 'dashboard';
  };
  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-[#F4F3EE] flex font-sans">
      <ConfirmDialog isOpen={confirmState.isOpen} options={confirmState.options} onClose={closeConfirm} />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-[220px] bg-[#111110] flex flex-col z-50 transform transition-transform duration-300 md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-[64px] px-5 flex items-center border-b border-[rgba(255,255,255,0.06)]">
          <img src="/logo.png" alt="BOS Logo" className="h-7 object-contain brightness-0 invert" />
        </div>

        <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-5 pb-1">
          MENU
        </div>

        <nav className="flex flex-col">
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'dashboard' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          
          <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-4 pb-1">
            CLIENTS
          </div>
          <Link to="/admin/clients" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'clients' && !location.pathname.includes('/add') ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <Users size={16} /> Clients
          </Link>
          <Link to="/admin/clients/add" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'add-client' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <UserPlus size={16} /> Add New Client
          </Link>

          <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-4 pb-1">
            CASES
          </div>
          <Link to="/admin/cases" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'cases' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <FileText size={16} /> Cases & Drafts
          </Link>

          <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-4 pb-1">
            PARTNERS
          </div>
          <Link to="/admin/partners" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'partners' && !location.pathname.includes('/add') ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <Users size={16} /> Partners
          </Link>
          <Link to="/admin/partners/add" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'add-partner' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <UserPlus size={16} /> Add New Partner
          </Link>

          <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-4 pb-1">
            CONTENT
          </div>
          <Link to="/admin/blog" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'blog' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <Pencil size={16} /> Blog
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 pb-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="text-[11px] text-[rgba(255,255,255,0.3)] px-3 mb-2 truncate">
            {user.email}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[13px] font-[500] text-[rgba(255,255,255,0.35)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)] transition-all text-left"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[220px] min-h-screen flex flex-col w-full">
        <div className="md:hidden h-14 bg-white border-b border-[rgba(17,17,16,0.06)] flex items-center px-4 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-[#111110]">
            <Menu size={24} />
          </button>
          <img src="/logo.png" alt="BOS Logo" className="h-5 object-contain ml-2" />
        </div>

        <div className="p-4 md:p-8 flex-1">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/clients" element={<AdminClients showConfirm={showConfirm} />} />
            <Route path="/clients/add" element={<AddClientForm showConfirm={showConfirm} />} />
            <Route path="/clients/:uid" element={<ClientDetailView showConfirm={showConfirm} />} />
            <Route path="/cases" element={<AdminCases />} />
            <Route path="/partners" element={<AdminPartners showConfirm={showConfirm} />} />
            <Route path="/partners/add" element={<AddPartnerForm />} />
            <Route path="/partners/:uid" element={<PartnerDetailView showConfirm={showConfirm} />} />
            <Route path="/blog/*" element={<AdminBlog showConfirm={showConfirm} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 1: Dashboard
// -------------------------------------------------------------
function AdminDashboard() {
  const [stats, setStats] = useState({ totalClients: 0, activeServices: 0, completedThisMonth: 0, docsUploaded: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const clientsSnap = await getDocs(collection(db, 'clients'));
        const totalClients = clientsSnap.size;
        let docsCount = 0;
        let activeServ = 0;
        let completedMonth = 0;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        for (const cDoc of clientsSnap.docs) {
          const srvSnap = await getDocs(collection(db, 'clients', cDoc.id, 'services'));
          srvSnap.forEach(s => {
            const data = s.data();
            if (data.status !== 'completed' && !data.completedDate) {
              activeServ++;
            } else if (data.completedDate && data.completedDate.toMillis() >= startOfMonth) {
              completedMonth++;
            }
          });
          const docSnap = await getDocs(collection(db, 'clients', cDoc.id, 'documents'));
          docsCount += docSnap.size;
        }

        setStats({ totalClients, activeServices: activeServ, completedThisMonth: completedMonth, docsUploaded: docsCount });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();

    // Listen to activity log
    const q = query(collection(db, 'activity_log'), orderBy('timestamp', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setActivities(arr);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const seconds = Math.floor((new Date() - dateStr.toDate()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getDotColor = (type) => {
    if (type === 'client_created') return 'bg-[#1B6B2F]';
    if (type === 'document_uploaded') return 'bg-[#3B82F6]';
    return 'bg-[#F4831F]'; // status update
  };

  return (
    <div className="fade-up-enter max-w-[1000px]">
      <div className="mb-7 flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">Dashboard</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Overview of all client activity</p>
        </div>
      </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[14px] p-5 h-[120px] skeleton-shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "TOTAL CLIENTS", value: stats.totalClients, icon: <Users size={20} className="text-[rgba(17,17,16,0.2)]" />, trend: "Total active accounts" },
              { label: "ACTIVE SERVICES", value: stats.activeServices, icon: <FileText size={20} className="text-[rgba(17,17,16,0.2)]" />, trend: "Currently in progress" },
              { label: "COMPLETED THIS MONTH", value: stats.completedThisMonth, icon: <Check size={20} className="text-[rgba(17,17,16,0.2)]" />, trend: "Successfully delivered" },
              { label: "DOCUMENTS UPLOADED", value: stats.docsUploaded, icon: <UploadCloud size={20} className="text-[rgba(17,17,16,0.2)]" />, trend: "Across all clients" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[14px] p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">{stat.label}</span>
                  {stat.icon}
                </div>
                <span className="text-[36px] font-[800] text-[#111110] leading-none mb-3">{stat.value}</span>
                <span className="text-[12px] text-[rgba(17,17,16,0.4)]">{stat.trend}</span>
              </div>
            ))}
          </div>
        )}

      <h2 className="text-[16px] font-[700] text-[#111110] mb-4">Recent Activity</h2>
      <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[13px] text-[rgba(17,17,16,0.4)]">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="p-10 text-center text-[13px] text-[rgba(17,17,16,0.4)]">No recent activity.</div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="px-5 py-3.5 border-b border-[rgba(17,17,16,0.05)] last:border-0 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getDotColor(act.type)} shrink-0`}></div>
              <div className="text-[14px] text-[#111110] flex-1">{act.description}</div>
              <div className="text-[12px] text-[rgba(17,17,16,0.35)] shrink-0">{timeAgo(act.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: Clients
// -------------------------------------------------------------
function AdminClients({ showConfirm }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, Active, Completed
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleDeleteClient = (clientId, e) => {
    e.stopPropagation();
    showConfirm({
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'clients', clientId));
          addToast('success', 'Client deleted successfully');
        } catch (err) {
          addToast('error', 'Failed to delete client');
        }
      }
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'clients'), async (snap) => {
      const arr = [];
      for (const d of snap.docs) {
        const clientData = { id: d.id, ...d.data() };
        // Fetch their services to determine status & list
        const srvSnap = await getDocs(collection(db, 'clients', d.id, 'services'));
        const srvs = [];
        let isActive = false;
        srvSnap.forEach(s => {
          srvs.push(s.data().type);
          if (s.data().status !== 'completed' && !s.data().completedDate) isActive = true;
        });
        clientData.serviceList = srvs;
        clientData.status = srvs.length === 0 ? 'No Services' : (isActive ? 'Active' : 'Completed');
        arr.push(clientData);
      }
      setClients(arr);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = clients.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = c.name?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.phone?.includes(s);
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const formatDate = (ts) => {
    if (!ts) return '';
    return ts.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fade-up-enter max-w-[1200px] h-full flex flex-col">
      <div className="mb-7 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">All Clients</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Manage client accounts and services</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.3)]" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] pl-10 pr-4 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>
          <button onClick={() => navigate('/admin/clients/add')} className="h-[44px] px-5 rounded-[100px] bg-[#1B6B2F] text-white text-[13px] font-[600] flex items-center gap-1.5 hover:bg-[#145324] whitespace-nowrap">
            <Plus size={16} /> Add New Client
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['All', 'Active', 'Completed'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-[100px] text-[13px] font-[500] transition-colors border ${filter === f ? 'bg-[rgba(27,107,47,0.08)] border-[rgba(27,107,47,0.35)] text-[#1B6B2F]' : 'bg-white border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.6)] hover:bg-[#F9F8F5]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#F9F8F5] border-b border-[rgba(17,17,16,0.06)] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
          <div className="col-span-5">CLIENT</div>
          <div className="col-span-3">SERVICES</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-1 text-center">JOINED</div>
          <div className="col-span-1 text-right">ACTIONS</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="w-full flex flex-col">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-[70px] w-full border-b border-[rgba(17,17,16,0.05)] skeleton-shimmer"></div>
               ))}
             </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Users size={32} className="text-[rgba(17,17,16,0.15)] mb-3" />
              <div className="text-[15px] font-[500] text-[rgba(17,17,16,0.4)]">No clients found</div>
            </div>
          ) : (
            filtered.map((client) => (
              <div key={client.id} onClick={() => navigate(`/admin/clients/${client.id}`)} className="border-b border-[rgba(17,17,16,0.05)] last:border-0 hover:bg-[rgba(27,107,47,0.02)] transition-colors cursor-pointer">
                {/* Mobile */}
                <div className="md:hidden p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[14px] flex items-center justify-center shrink-0">
                        {client.name?.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-[600] text-[#111110]">{client.name}</div>
                        <div className="text-[12px] text-[rgba(17,17,16,0.45)]">{client.email}</div>
                      </div>
                    </div>
                    <button onClick={(e) => handleDeleteClient(client.id, e)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-[38px] h-[38px] rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[14px] flex items-center justify-center shrink-0">
                      {client.name?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-[14px] font-[600] text-[#111110] truncate">{client.name}</div>
                      <div className="text-[12px] text-[rgba(17,17,16,0.45)] truncate flex gap-2">
                        <span>{client.email}</span>
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex flex-wrap gap-1.5">
                    {client.serviceList.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="bg-[#F4F3EE] text-[rgba(17,17,16,0.6)] px-2 py-0.5 rounded-[100px] text-[11px] font-[500] whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{s}</span>
                    ))}
                    {client.serviceList.length > 2 && (
                      <span className="bg-[#F4F3EE] text-[rgba(17,17,16,0.6)] px-2 py-0.5 rounded-[100px] text-[11px] font-[500]">+{client.serviceList.length - 2} more</span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center gap-1.5 text-[13px]">
                    {client.status === 'Active' ? (
                      <><span className="w-2 h-2 rounded-full bg-[#1B6B2F]"></span> Active</>
                    ) : client.status === 'Completed' ? (
                      <><span className="w-2 h-2 rounded-full bg-[rgba(17,17,16,0.2)]"></span> Completed</>
                    ) : (
                      <><span className="w-2 h-2 rounded-full bg-[rgba(17,17,16,0.1)]"></span> No Services</>
                    )}
                  </div>

                  <div className="col-span-1 text-center text-[13px] text-[rgba(17,17,16,0.45)]">
                    {formatDate(client.createdAt)}
                  </div>

                  <div className="col-span-1 flex justify-end gap-2">
                    <button onClick={(e) => handleDeleteClient(client.id, e)} className="h-[30px] px-2 rounded-[100px] border border-red-200 bg-transparent hover:bg-red-50 text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/clients/${client.id}`); }} className="h-[30px] px-3 rounded-[100px] border border-[rgba(27,107,47,0.2)] bg-transparent hover:bg-[rgba(27,107,47,0.05)] text-[#1B6B2F] text-[12px] font-[600] transition-colors whitespace-nowrap">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: Add Client
// -------------------------------------------------------------
function AddClientForm({ showConfirm }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', serviceType: 'GST Registration', startDate: new Date().toISOString().split('T')[0], notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [shakeFields, setShakeFields] = useState(false);

  const generateTempPassword = (phone) => {
    if (!phone || phone.length < 4) return 'BOS@XXXX';
    return 'BOS@' + phone.slice(-4);
  };

  const currentSteps = SERVICE_STEPS[formData.serviceType] || [];
  const firstStep = currentSteps[0] || 'Order Received';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.serviceType || !formData.startDate) {
      setShakeFields(true);
      setTimeout(() => setShakeFields(false), 500);
      return;
    }
    
    console.log('Form data on submit:', formData);
    console.log('Service type:', formData.serviceType);
    setLoading(true);
    try {
      const tempPassword = generateTempPassword(formData.phone);
      
      // 3. createClientAccount
      const res = await createClientAccount(formData.email, tempPassword);
      if (res.error) {
        addToast('error', res.error);
        setLoading(false);
        return;
      }
      
      const uid = res.user.uid;

      // 4. save client profile
      await setDoc(doc(db, 'clients', uid), {
        name: formData.name,
        phone: '+91' + formData.phone,
        email: formData.email,
        createdAt: serverTimestamp(),
        createdBy: 'admin',
        tempPasswordUsed: true
      });

      // 5. Add service
      const serviceType = formData.serviceType || formData.service || '';
      const steps = SERVICE_STEPS[serviceType] || ['Order Received'];
      const firstStepVal = steps[0];

      console.log('Service being created:', serviceType, firstStepVal);

      await addDoc(collection(db, 'clients', uid, 'services'), {
        type: String(serviceType),
        status: String(firstStepVal),
        statusIndex: 0,
        startDate: serverTimestamp(),
        completedDate: null,
        notes: String(formData.notes || '')
      });

      // 6. Log Activity
      await addDoc(collection(db, 'activity_log'), {
        type: 'client_created',
        clientName: formData.name,
        clientId: uid,
        description: `${formData.name} added — ${formData.serviceType}`,
        timestamp: serverTimestamp()
      });

      // 7. Send Welcome Email via EmailJS
      try {
        await sendPasswordResetEmail(auth, formData.email, {
          url: 'https://bharatofficesetu.com/login'
        });

        await emailjs.send(
          'service_cvv25jk',
          'template_ka458pf',
          {
            type: 'welcome_email',
            name: formData.name,
            email: formData.email,
            phone: '+91' + formData.phone,
            service: formData.serviceType,
            role: 'client',
            temp_password: tempPassword,
            loginUrl: 'https://bharatofficesetu.com/login'
          },
          'WNoyI0WLOcvaOrbX_'
        );
      } catch (emailError) {
        console.error("Database updated successfully, but email dispatch failed:", emailError);
      }

      // 8. Success
      addToast('success', `Client created! Welcome email sent to ${formData.email}`);
      navigate(`/admin/clients/${uid}`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to create client.');
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generateTempPassword(formData.phone));
    addToast('success', 'Copied!');
  };

  return (
    <div className="fade-up-enter max-w-[600px] mx-auto pb-20">
      <div className="mb-7 flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">Add New Client</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Create account and send welcome email automatically</p>
        </div>
      </div>

      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] mb-1">CLIENT DETAILS</div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[600] text-[#111110]">Full Name *</label>
            <input required type="text" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.name ? 'border-[#DC2626] shake-animation' : ''}`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Phone Number *</label>
              <div className={`flex h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] overflow-hidden focus-within:border-[rgba(27,107,47,0.5)] focus-within:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.phone ? 'border-[#DC2626] shake-animation' : ''}`}>
                <div className="px-3 bg-[rgba(17,17,16,0.03)] border-r border-[rgba(17,17,16,0.1)] flex items-center text-[14px] font-[500] text-[rgba(17,17,16,0.5)]">+91</div>
                <input required type="tel" placeholder="10-digit mobile number" minLength={10} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="flex-1 bg-transparent px-3 text-[14px] outline-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Email Address *</label>
              <input required type="email" placeholder="client@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.email ? 'border-[#DC2626] shake-animation' : ''}`} />
            </div>
          </div>

          <div className="h-[1px] bg-[rgba(17,17,16,0.06)] my-2"></div>
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] mb-1">SERVICE DETAILS</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Service Type *</label>
              <select required value={formData.serviceType} onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)]">
                <option value="" disabled>Select a service</option>
                <option value="GST Registration">GST Registration</option>
                <option value="GST Return Filing">GST Return Filing</option>
                <option value="Trademark Registration">Trademark Registration</option>
                <option value="Company Incorporation">Company Incorporation</option>
                <option value="LLP Registration">LLP Registration</option>
                <option value="Virtual Office">Virtual Office</option>
                <option value="Compliance">Compliance</option>
                <option value="Copyright Registration">Copyright Registration</option>
                <option value="FSSAI Registration">FSSAI Registration</option>
                <option value="BIS Registration">BIS Registration</option>
                <option value="Startup India Registration">Startup India Registration</option>
                <option value="Partnership Firm Registration">Partnership Firm Registration</option>
                <option value="Sole Proprietorship Registration">Sole Proprietorship Registration</option>
              </select>
              <div className="mt-1 bg-[#F9F8F5] border-radius-[8px] p-2.5 rounded-[8px] text-[13px] text-[rgba(17,17,16,0.45)]">
                Will start at: <span className="font-[600] text-[#111110]">{firstStep}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Start Date *</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)]" />
            </div>
          </div>

          <div className="h-[1px] bg-[rgba(17,17,16,0.06)] my-2"></div>
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] mb-1">INTERNAL NOTES</div>

          <textarea rows={3} placeholder="Any internal notes about this client..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] p-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] resize-none" />

          <div className="bg-[rgba(27,107,47,0.04)] border border-[rgba(27,107,47,0.12)] rounded-[10px] p-[14px] px-4 mt-2 flex justify-between items-center">
            <div>
              <div className="text-[12px] font-[600] text-[#1B6B2F] mb-1.5">Auto-generated temporary password</div>
              <div className="text-[18px] font-[700] text-[#111110] font-mono tracking-[0.05em]">{generateTempPassword(formData.phone)}</div>
              <div className="text-[11px] text-[rgba(17,17,16,0.4)] mt-1">This password will be included in the welcome email</div>
            </div>
            <button type="button" onClick={copyPassword} className="px-3 py-1.5 bg-white border border-[rgba(27,107,47,0.2)] rounded-full text-[12px] font-[600] text-[#1B6B2F] hover:bg-[#F9F8F5] transition-colors">
              Copy
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-[rgba(17,17,16,0.06)]">
            <button type="button" onClick={() => navigate('/admin/clients')} className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-transparent text-[rgba(17,17,16,0.6)] font-[600] text-[14px] hover:bg-[rgba(17,17,16,0.04)] transition-colors order-2 sm:order-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-[#1B6B2F] text-white font-[600] text-[14px] hover:bg-[#145324] transition-colors ml-auto flex justify-center items-center order-1 sm:order-2 disabled:opacity-70">
              {loading ? (
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                </div>
              ) : 'Create Client & Send Welcome Email →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: Client Detail
// -------------------------------------------------------------
function ClientDetailView({ showConfirm }) {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [client, setClient] = useState(null);
  const [services, setServices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddService, setShowAddService] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const snap = await getDoc(doc(db, 'clients', uid));
        if (snap.exists()) setClient({ id: snap.id, ...snap.data() });
      } catch (e) {
        console.error(e);
      }
    };
    fetchClient();

    const unsubServices = onSnapshot(collection(db, 'clients', uid, 'services'), (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setServices(arr);
      setLoading(false);
    });

    const unsubDocs = onSnapshot(collection(db, 'clients', uid, 'documents'), (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setDocuments(arr);
    });

    return () => { unsubServices(); unsubDocs(); };
  }, [uid]);

  if (loading || !client) {
    return (
      <div className="fade-up-enter max-w-[1000px] mx-auto pb-20">
        <div className="h-[104px] w-full bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] mb-6 skeleton-shimmer"></div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="h-[200px] w-full bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] skeleton-shimmer"></div>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="h-[150px] w-full bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] skeleton-shimmer"></div>
            <div className="h-[120px] w-full bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  const daysActive = client.createdAt ? Math.floor((Date.now() - client.createdAt.toMillis()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="fade-up-enter max-w-[1000px] mx-auto pb-20">
      <div 
        onClick={() => navigate('/admin/clients')} 
        className="mb-5 flex items-center gap-2 text-[13px] text-[rgba(17,17,16,0.5)] hover:text-[#111110] transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft size={16} /> Back to Clients
      </div>

      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] p-6 md:p-7 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-[56px] h-[56px] rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[20px] flex items-center justify-center shrink-0">
            {client.name?.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[20px] font-[800] text-[#111110] leading-none mb-1.5">{client.name}</h1>
            <div className="text-[14px] text-[rgba(17,17,16,0.5)] mb-1.5">{client.email} • {client.phone}</div>
            <div className="text-[12px] text-[rgba(17,17,16,0.35)]">Client since {client.createdAt?.toDate().toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <div className="flex gap-2">
            <span className="bg-[#F4F3EE] rounded-[100px] px-3 py-1 text-[12px] text-[rgba(17,17,16,0.55)]">Services: {services.length}</span>
            <span className="bg-[#F4F3EE] rounded-[100px] px-3 py-1 text-[12px] text-[rgba(17,17,16,0.55)]">Documents: {documents.length}</span>
            <span className="bg-[#F4F3EE] rounded-[100px] px-3 py-1 text-[12px] text-[rgba(17,17,16,0.55)]">Days: {daysActive}</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowAddService(true)} className="h-[36px] px-4 rounded-full border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] text-[13px] font-[600] hover:bg-[#F0F5EA] transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <Plus size={16} /> Add Service
            </button>
            <div className="relative group">
              <button className="h-[36px] px-3 rounded-full border border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.6)] text-[13px] font-[600] hover:bg-[#F9F8F5] transition-colors flex items-center gap-1">
                <MoreVertical size={16} />
              </button>
              <div className="absolute right-0 top-[100%] mt-2 w-48 bg-white border border-[rgba(17,17,16,0.08)] rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-[#111110] hover:bg-[#F9F8F5]">Send Reset Link</button>
                <div className="h-[1px] bg-[rgba(17,17,16,0.05)] w-full"></div>
                <button className="w-full text-left px-4 py-2.5 text-[13px] text-[#DC2626] hover:bg-red-50">Delete Client</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COL */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">SERVICES</div>
          {services.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-8 text-center text-[13px] text-[rgba(17,17,16,0.4)]">No services added yet</div>
          ) : (
            services.map(s => <ServiceCard key={s.id} client={client} service={s} showConfirm={showConfirm} />)
          )}
        </div>

        {/* RIGHT COL */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">DOCUMENTS</div>
          <DocumentsCard client={client} documents={documents} showConfirm={showConfirm} />
          <ClientNotesCard client={client} />
          <PasswordCard client={client} />
        </div>
      </div>

      {showAddService && (
        <AddServiceModal client={client} onClose={() => setShowAddService(false)} />
      )}
    </div>
  );
}

// Service Card Component
function ServiceCard({ client, service, showConfirm }) {
  const { addToast } = useToast();
  const steps = SERVICE_STEPS[service.type] || ['Order Received', 'Completed'];
  const currentIndex = service.statusIndex || 0;
  const isCompleted = service.status === 'completed' || currentIndex === steps.length - 1;

  const [notes, setNotes] = useState(service.notes || '');
  const [notesChanged, setNotesChanged] = useState(false);

  const handleNextStep = async () => {
    const nextIndex = currentIndex + 1;
    const nextStatus = steps[nextIndex];
    try {
      await updateServiceStatus(client.id, service.id, service.type, nextIndex);
      
      const payload = {
        status: nextStatus,
        statusIndex: nextIndex
      };
      if (nextIndex === steps.length - 1) {
        payload.status = 'completed';
        payload.completedDate = serverTimestamp();
      }
      await updateDoc(doc(db, 'clients', client.id, 'services', service.id), payload);

      await addDoc(collection(db, 'activity_log'), {
        type: 'status_updated',
        clientName: client.name,
        clientId: client.id,
        description: `${client.name} — ${service.type} moved to ${nextStatus}`,
        timestamp: serverTimestamp()
      });

      if (nextIndex === steps.length - 1) {
        addToast('success', '🎉 Service marked as Complete!');
      } else {
        addToast('success', `Status updated to ${nextStatus}`);
      }
    } catch (e) {
      addToast('error', 'Failed to update status');
    }
  };

  const handlePrevStep = () => {
    showConfirm({
      title: 'Move back a step?',
      message: `Move back to ${steps[currentIndex - 1]}?`,
      confirmText: 'Confirm',
      type: 'warning',
      onConfirm: async () => {
        try {
          const prevIndex = currentIndex - 1;
          const prevStatus = steps[prevIndex];
          await updateServiceStatus(client.id, service.id, service.type, prevIndex);
          await updateDoc(doc(db, 'clients', client.id, 'services', service.id), {
            status: prevStatus,
            statusIndex: prevIndex,
            completedDate: null
          });
          await addDoc(collection(db, 'activity_log'), {
            type: 'status_updated',
            clientName: client.name,
            clientId: client.id,
            description: `${client.name} — ${service.type} reverted to ${prevStatus}`,
            timestamp: serverTimestamp()
          });
          addToast('success', `Status reverted to ${prevStatus}`);
        } catch (e) {
          addToast('error', 'Failed to update status');
        }
      }
    });
  };

  const saveNotes = async () => {
    await updateDoc(doc(db, 'clients', client.id, 'services', service.id), { notes });
    setNotesChanged(false);
    addToast('success', 'Saved ✓');
  };

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-5 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isCompleted ? 'bg-[#1B6B2F]' : 'bg-[#F4831F]'}`}></div>
      
      <div className="flex justify-between items-start mb-6 pl-1">
        <div className="text-[16px] font-[700] text-[#111110]">{service.type}</div>
        <div className={`px-2.5 py-0.5 rounded-[100px] text-[10px] font-[700] uppercase ${isCompleted ? 'bg-[rgba(27,107,47,0.1)] text-[#1B6B2F]' : 'bg-[rgba(244,131,31,0.1)] text-[#F4831F]'}`}>
          {isCompleted ? 'Completed ✓' : 'In Progress'}
        </div>
      </div>

      <div className="bg-[#F9F8F5] rounded-[12px] p-5 mb-5 pl-1.5">
        <div className="text-[13px] font-[500] text-[rgba(17,17,16,0.55)] mb-3">
          Current Step: <span className="text-[#111110] font-[600]">{isCompleted ? 'Completed' : steps[currentIndex]}</span>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={handlePrevStep} 
            disabled={currentIndex === 0} 
            className="h-[36px] px-4 rounded-[100px] bg-transparent border border-[rgba(17,17,16,0.12)] text-[rgba(17,17,16,0.55)] text-[13px] hover:bg-[rgba(17,17,16,0.03)] disabled:opacity-35 disabled:cursor-not-allowed transition-all"
          >
            ← Previous Step
          </button>
          <button 
            onClick={handleNextStep} 
            disabled={isCompleted} 
            className="h-[36px] px-4 rounded-[100px] bg-[#1B6B2F] text-white text-[13px] font-[600] hover:bg-[#145324] disabled:opacity-35 disabled:cursor-not-allowed transition-all"
          >
            Mark Next Step →
          </button>
        </div>
      </div>

      <div className="pl-1">
        <label className="text-[11px] font-[600] text-[rgba(17,17,16,0.4)]">Internal Notes</label>
        <textarea 
          rows={2} 
          value={notes} 
          onChange={(e) => { setNotes(e.target.value); setNotesChanged(true); }}
          className="w-full mt-1 bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-2.5 text-[13px] outline-none focus:border-[rgba(27,107,47,0.4)] resize-none font-sans"
        />
        {notesChanged && (
          <button onClick={saveNotes} className="mt-2 h-[30px] px-3 rounded-[100px] border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] text-[12px] font-[600] hover:bg-[#F0F5EA] transition-colors">
            Save Notes
          </button>
        )}
      </div>
    </div>
  );
}

// Documents Card Component
function DocumentsCard({ client, documents, showConfirm }) {
  const { addToast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      addToast('error', 'PDF files only');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const downloadURL = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      
      const filePath = `clients/${client.id}/${Date.now()}_${file.name}`;
      
      await addDoc(collection(db, 'clients', client.id, 'documents'), {
        name: file.name,
        url: downloadURL.url,
        path: filePath,
        uploadedAt: serverTimestamp()
      });

      await addDoc(collection(db, 'activity_log'), {
        type: 'document_uploaded',
        clientName: client.name,
        clientId: client.id,
        description: `${client.name} — ${file.name} uploaded`,
        timestamp: serverTimestamp()
      });

      addToast('success', 'Document uploaded successfully');
      setIsUploading(false);
    } catch (error) {
      console.error(error);
      addToast('error', 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleDelete = (docId, path, name) => {
    showConfirm({
      title: `Delete ${name}?`,
      message: 'This cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDocument(client.id, docId, path); // Dummy call
          await deleteDoc(doc(db, 'clients', client.id, 'documents', docId));
          addToast('success', 'Document deleted');
        } catch(e) {
          addToast('error', 'Failed to delete');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-7 text-center text-[14px] text-[rgba(17,17,16,0.4)]">No documents uploaded yet</div>
        ) : (
          documents.map(d => (
            <div key={d.id} className="h-[56px] px-4 flex items-center justify-between border-b border-[rgba(17,17,16,0.05)] last:border-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText size={20} className="text-[#F4831F] shrink-0" />
                <div className="truncate text-[14px] font-[500] text-[#111110]">{d.name}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button onClick={() => window.open(d.url, '_blank')} className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(17,17,16,0.4)] hover:text-[#1B6B2F] hover:bg-[rgba(27,107,47,0.05)] transition-colors">
                  <UploadCloud size={18} className="rotate-180" />
                </button>
                <button onClick={() => handleDelete(d.id, d.path, d.name)} className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(17,17,16,0.25)] hover:text-[#DC2626] hover:bg-red-50 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-[rgba(17,17,16,0.05)]">
        {isUploading ? (
          <div className="border-2 dashed border-[rgba(17,17,16,0.1)] rounded-[12px] p-5 text-center">
            <div className="h-1 bg-[rgba(27,107,47,0.1)] rounded-[100px] mb-2 overflow-hidden">
              <div className="h-full bg-[#1B6B2F] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <div className="text-[12px] text-[rgba(17,17,16,0.5)]">Uploading... {Math.round(uploadProgress)}%</div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[rgba(17,17,16,0.15)] rounded-[12px] p-5 flex flex-col items-center text-center cursor-pointer hover:border-[rgba(27,107,47,0.4)] hover:bg-[rgba(27,107,47,0.02)] transition-all">
            <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
            <UploadCloud size={24} className="text-[rgba(17,17,16,0.25)] mb-1" />
            <div className="text-[13px] text-[rgba(17,17,16,0.45)]">Drop PDF here or click to upload</div>
            <div className="text-[11px] text-[rgba(17,17,16,0.3)] mt-0.5">PDF files only, max 10MB</div>
          </label>
        )}
      </div>
    </div>
  );
}

// Client Notes Card Component
function ClientNotesCard({ client }) {
  const { addToast } = useToast();
  const [notes, setNotes] = useState(client.notes || '');
  const [changed, setChanged] = useState(false);

  const saveNotes = async () => {
    await updateDoc(doc(db, 'clients', client.id), { notes });
    setChanged(false);
    addToast('success', 'Saved ✓');
  };

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-4">
      <div className="text-[13px] font-[600] text-[#111110] mb-2.5">Internal Notes</div>
      <textarea 
        rows={4}
        placeholder="Add private notes about this client. Only admins can see this."
        value={notes}
        onChange={(e) => { setNotes(e.target.value); setChanged(true); }}
        className="w-full bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] p-3 text-[13px] outline-none focus:border-[rgba(27,107,47,0.4)] resize-y font-sans"
      />
      {changed && (
        <button onClick={saveNotes} className="mt-2 h-[32px] px-3 rounded-[100px] border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] text-[12px] font-[600] hover:bg-[#F0F5EA] transition-colors">
          Save Notes
        </button>
      )}
    </div>
  );
}

// Password Card Component
function PasswordCard({ client }) {
  const { addToast } = useToast();
  const [newPass, setNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSendResetLink = async () => {
    console.log('Sending reset to:', client?.email);
    if (!client?.email) {
      addToast('error', 'No email found for this client');
      return;
    }

    setSendingReset(true);

    try {
      await sendPasswordResetEmail(
        auth,
        client.email,
        {
          url: 'https://bharatofficesetu.com/login',
          handleCodeInApp: false
        }
      );

      addToast('success', 'Reset link sent to ' + client.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);

    } catch (error) {
      console.error('Reset error:', error.code, error.message);
      
      // Show specific error based on code
      const messages = {
        'auth/user-not-found': 
          'No account found for ' + client.email,
        'auth/invalid-email': 
          'Invalid email address',
        'auth/too-many-requests': 
          'Too many attempts. Try again later.',
        'auth/unauthorized-continue-uri':
          'Domain not authorized. Check Firebase Console → Authentication → Settings → Authorized domains',
        'auth/network-request-failed':
          'Network error. Check your connection.'
      };

      const message = messages[error.code] 
        || error.message 
        || 'Failed to send reset link';
        
      addToast('error', message);
      
    } finally {
      setSendingReset(false);
    }
  };

  const handleUpdatePass = () => {
    if (newPass.length < 8) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    // We mock the actual update as requested
    addToast('info', 'For security, sending a reset link instead');
    handleSendResetLink();
    setNewPass('');
  };

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-4">
      <div className="text-[13px] font-[600] text-[#111110] mb-3.5">Password Management</div>
      
      <div className="mb-2.5">
        <div className="text-[12px] text-[rgba(17,17,16,0.5)] mb-2.5 leading-snug">
          Send a password reset link to client's email. They can set their own new password.
        </div>
        <button 
          onClick={handleSendResetLink} 
          disabled={sendingReset || resetSent}
          className={`w-full h-[40px] rounded-[100px] border text-[13px] font-[600] transition-colors flex items-center justify-center ${resetSent ? 'bg-[#1B6B2F] border-[#1B6B2F] text-white' : 'bg-transparent border-[rgba(27,107,47,0.25)] text-[#1B6B2F] hover:bg-[#F0F5EA]'}`}
        >
          {resetSent ? 'Reset link sent ✓' : (sendingReset ? 'Sending...' : 'Send Reset Link →')}
        </button>
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-[1px] bg-[rgba(17,17,16,0.1)]"></div>
        <div className="text-[12px] text-[rgba(17,17,16,0.35)]">or</div>
        <div className="flex-1 h-[1px] bg-[rgba(17,17,16,0.1)]"></div>
      </div>

      <div>
        <div className="text-[12px] text-[rgba(17,17,16,0.5)] mb-2.5 leading-snug">
          Set a new password directly. Share it with the client via WhatsApp.
        </div>
        <div className="relative mb-1">
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className={`w-full h-[44px] bg-[#F9F8F5] border rounded-[10px] pl-3 pr-10 text-[14px] outline-none transition-colors duration-200 ${shake ? 'border-[#DC2626] shake-animation' : 'border-[rgba(17,17,16,0.1)] focus:border-[rgba(27,107,47,0.5)]'}`}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110]">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="text-[11px] text-[rgba(17,17,16,0.35)] mb-3">Minimum 8 characters</div>
        
        <button onClick={handleUpdatePass} className="w-full h-[40px] rounded-[100px] bg-[#1B6B2F] text-white text-[13px] font-[600] hover:bg-[#145324] transition-colors mb-3">
          Update Password →
        </button>

        <button 
          onClick={() => window.open(`https://wa.me/${client.phone?.replace('+', '')}?text=${encodeURIComponent(`Hi ${client.name.split(' ')[0]}, your BOS account password has been updated.\nTemporary password: BOS@${client.phone?.slice(-4)}\nPlease login and change it: https://bharatofficesetu.com/login`)}`, '_blank')}
          className="w-full h-[40px] rounded-[100px] bg-[#25D366]/10 text-[#25D366] text-[13px] font-[600] hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-1.5"
        >
          Share via WhatsApp
        </button>
      </div>
    </div>
  );
}

// Add Service Modal
function AddServiceModal({ client, onClose }) {
  const { addToast } = useToast();
  const [type, setType] = useState('GST Registration');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await addService(client.id, type, notes); // dummy
      const steps = SERVICE_STEPS[type] || ['Order Received'];
      await addDoc(collection(db, 'clients', client.id, 'services'), {
        type: String(type),
        status: String(steps[0]),
        statusIndex: 0,
        startDate: serverTimestamp(),
        completedDate: null,
        notes: String(notes || '')
      });
      await addDoc(collection(db, 'activity_log'), {
        type: 'service_added',
        clientName: client.name,
        clientId: client.id,
        description: `${client.name} — Added service: ${type}`,
        timestamp: serverTimestamp()
      });
      addToast('success', 'Service added');
      onClose();
    } catch(e) {
      addToast('error', 'Failed to add service');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" onClick={onClose}></div>
      <div className="bg-white rounded-[16px] p-7 w-full max-w-[440px] relative z-10 fade-up-enter">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-[800] text-[#111110]">Add Service for {client.name.split(' ')[0]}</h3>
          <button onClick={onClose} className="text-[rgba(17,17,16,0.4)] hover:text-[#111110]"><XIcon size={20}/></button>
        </div>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Service Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none">
                <option value="" disabled>Select a service</option>
                <option value="GST Registration">GST Registration</option>
                <option value="GST Return Filing">GST Return Filing</option>
                <option value="Trademark Registration">Trademark Registration</option>
                <option value="Company Incorporation">Company Incorporation</option>
                <option value="LLP Registration">LLP Registration</option>
                <option value="Virtual Office">Virtual Office</option>
                <option value="Compliance">Compliance</option>
                <option value="Copyright Registration">Copyright Registration</option>
                <option value="FSSAI Registration">FSSAI Registration</option>
                <option value="BIS Registration">BIS Registration</option>
                <option value="Startup India Registration">Startup India Registration</option>
                <option value="Partnership Firm Registration">Partnership Firm Registration</option>
                <option value="Sole Proprietorship Registration">Sole Proprietorship Registration</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Start Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Internal Notes</label>
            <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} className="bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] p-3 text-[14px] outline-none resize-none" />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 h-10 rounded-full font-[600] text-[14px] text-[rgba(17,17,16,0.55)] hover:bg-[#F9F8F5]">Cancel</button>
          <button onClick={submit} disabled={loading} className="px-5 h-10 rounded-full bg-[#1B6B2F] text-white font-[600] text-[14px] hover:bg-[#145324] disabled:opacity-70">
            {loading ? 'Adding...' : 'Add Service →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PARTNERS SECTION
// ============================================================================

// 1. ADD NEW PARTNER VIEW
function AddPartnerForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    partnerBusinessName: '', fullName: '', phone: '', email: ''
  });
  const [loading, setLoading] = useState(false);
  const [shakeFields, setShakeFields] = useState(false);

  const generateTempPassword = (phone) => {
    if (!phone) return 'BOS@XXXX';
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 4) return 'BOS@XXXX';
    return 'BOS@' + clean.slice(-4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partnerBusinessName || !formData.fullName || !formData.phone || !formData.email) {
      setShakeFields(true);
      setTimeout(() => setShakeFields(false), 500);
      return;
    }
    
    setLoading(true);
    try {
      const res = await createPartner(formData);
      
      try {
        const tempPassword = generateTempPassword(formData.phone);
        await emailjs.send(
          'service_cvv25jk',
          'template_ka458pf',
          {
            type: 'welcome_email',
            name: formData.fullName,
            email: formData.email,
            phone: '+91' + formData.phone,
            role: 'partner',
            temp_password: tempPassword,
            loginUrl: 'https://bharatofficesetu.com/login'
          },
          'WNoyI0WLOcvaOrbX_'
        );
      } catch (emailError) {
        console.error("Partner created successfully, but welcome email dispatch failed:", emailError);
      }

      addToast('success', `Partner created! Welcome email sent to ${formData.email}`);
      navigate(`/admin/partners/${res.uid}`);
    } catch (err) {
      console.error(err);
      addToast('error', err.message || 'Failed to create partner.');
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generateTempPassword(formData.phone));
    addToast('success', 'Copied!');
  };

  return (
    <div className="fade-up-enter max-w-[600px] mx-auto pb-20">
      <div className="mb-7 flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">Add New Partner</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Create partner account and send welcome email automatically</p>
        </div>
      </div>

      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] mb-1">PARTNER DETAILS</div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[600] text-[#111110]">Partner Business Name *</label>
            <input 
              required 
              type="text" 
              placeholder="e.g., SATYAM FAB" 
              value={formData.partnerBusinessName} 
              onChange={e => setFormData({...formData, partnerBusinessName: e.target.value})} 
              className={`h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.partnerBusinessName ? 'border-[#DC2626] shake-animation' : ''}`} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[600] text-[#111110]">Full Name *</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. Rahul Sharma" 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
              className={`h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.fullName ? 'border-[#DC2626] shake-animation' : ''}`} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Phone Number *</label>
              <div className={`flex h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] overflow-hidden focus-within:border-[rgba(27,107,47,0.5)] focus-within:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.phone ? 'border-[#DC2626] shake-animation' : ''}`}>
                <div className="px-3 bg-[rgba(17,17,16,0.03)] border-r border-[rgba(17,17,16,0.1)] flex items-center text-[14px] font-[500] text-[rgba(17,17,16,0.5)]">+91</div>
                <input 
                  required 
                  type="tel" 
                  placeholder="10-digit mobile number" 
                  minLength={10} 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="flex-1 bg-transparent px-3 text-[14px] outline-none" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Email Address *</label>
              <input 
                required 
                type="email" 
                placeholder="partner@company.com" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className={`h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all ${shakeFields && !formData.email ? 'border-[#DC2626] shake-animation' : ''}`} 
              />
            </div>
          </div>

          <div className="bg-[rgba(27,107,47,0.04)] border border-[rgba(27,107,47,0.12)] rounded-[10px] p-[14px] px-4 mt-2 flex justify-between items-center">
            <div>
              <div className="text-[12px] font-[600] text-[#1B6B2F] mb-1.5">Auto-generated temporary password</div>
              <div className="text-[18px] font-[700] text-[#111110] font-mono tracking-[0.05em]">{generateTempPassword(formData.phone)}</div>
              <div className="text-[11px] text-[rgba(17,17,16,0.4)] mt-1">This password will be used for welcome activation</div>
            </div>
            <button type="button" onClick={copyPassword} className="px-3 py-1.5 bg-white border border-[rgba(27,107,47,0.25)] rounded-full text-[12px] font-[600] text-[#1B6B2F] hover:bg-[#F9F8F5] transition-colors">
              Copy
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-[rgba(17,17,16,0.06)]">
            <button type="button" onClick={() => navigate('/admin/partners')} className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-transparent text-[rgba(17,17,16,0.6)] font-[600] text-[14px] hover:bg-[rgba(17,17,16,0.04)] transition-colors order-2 sm:order-1">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full sm:w-auto h-[44px] px-6 rounded-full bg-[#1B6B2F] text-white font-[600] text-[14px] hover:bg-[#145324] transition-colors ml-auto flex justify-center items-center order-1 sm:order-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                </div>
              ) : 'Create Partner & Send Welcome Email →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. PARTNERS LIST VIEW
function AdminPartners({ showConfirm }) {
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleDeletePartner = (partnerId, e) => {
    e.stopPropagation();
    showConfirm({
      title: 'Delete Partner',
      message: 'Are you sure you want to delete this partner? This cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'partners', partnerId));
          addToast('success', 'Partner deleted successfully');
        } catch (err) {
          addToast('error', 'Failed to delete partner');
        }
      }
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'partners'), (snap) => {
      const arr = [];
      snap.forEach(d => {
        arr.push({ id: d.id, ...d.data() });
      });
      setPartners(arr);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = partners.filter(p => {
    const s = search.toLowerCase();
    return p.name?.toLowerCase().includes(s) || p.email?.toLowerCase().includes(s) || p.phone?.includes(s);
  });

  const formatDate = (ts) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fade-up-enter max-w-[1200px] h-full flex flex-col">
      <div className="mb-7 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">All Partners</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Manage partner accounts and referrals</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.3)]" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] pl-10 pr-4 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>
          <button onClick={() => navigate('/admin/partners/add')} className="h-[44px] px-5 rounded-[100px] bg-[#1B6B2F] text-white text-[13px] font-[600] flex items-center gap-1.5 hover:bg-[#145324] whitespace-nowrap">
            <Plus size={16} /> Add New Partner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] flex-1 flex flex-col overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#F9F8F5] border-b border-[rgba(17,17,16,0.06)] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
          <div className="col-span-4">PARTNER NAME</div>
          <div className="col-span-3">EMAIL</div>
          <div className="col-span-2">PHONE</div>
          <div className="col-span-2 text-center">JOINED</div>
          <div className="col-span-1 text-right">ACTIONS</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="w-full flex flex-col">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-[70px] w-full border-b border-[rgba(17,17,16,0.05)] skeleton-shimmer"></div>
               ))}
             </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Users size={32} className="text-[rgba(17,17,16,0.15)] mb-3" />
              <div className="text-[15px] font-[500] text-[rgba(17,17,16,0.4)]">No partners found</div>
            </div>
          ) : (
            filtered.map((partner) => (
              <div key={partner.id} onClick={() => navigate(`/admin/partners/${partner.id}`)} className="border-b border-[rgba(17,17,16,0.05)] last:border-0 hover:bg-[rgba(27,107,47,0.02)] transition-colors cursor-pointer">
                {/* Mobile */}
                <div className="md:hidden p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[14px] flex items-center justify-center shrink-0">
                        {partner.name?.substring(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-[600] text-[#111110]">{partner.name}</div>
                        <div className="text-[12px] text-[rgba(17,17,16,0.45)]">{partner.email}</div>
                        <div className="text-[12px] text-[rgba(17,17,16,0.45)]">{partner.phone}</div>
                      </div>
                    </div>
                    <button onClick={(e) => handleDeletePartner(partner.id, e)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 items-center">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-[38px] h-[38px] rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[14px] flex items-center justify-center shrink-0">
                      {partner.name?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-[14px] font-[600] text-[#111110] truncate">{partner.name}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 text-[13px] text-[rgba(17,17,16,0.7)] truncate">
                    {partner.email}
                  </div>

                  <div className="col-span-2 text-[13px] text-[rgba(17,17,16,0.7)]">
                    {partner.phone}
                  </div>

                  <div className="col-span-2 text-center text-[13px] text-[rgba(17,17,16,0.45)]">
                    {formatDate(partner.createdAt)}
                  </div>

                  <div className="col-span-1 flex justify-end gap-2">
                    <button onClick={(e) => handleDeletePartner(partner.id, e)} className="h-[30px] px-2 rounded-[100px] border border-red-200 bg-transparent hover:bg-red-50 text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/partners/${partner.id}`); }} className="h-[30px] px-3 rounded-[100px] border border-[rgba(27,107,47,0.2)] bg-transparent hover:bg-[rgba(27,107,47,0.05)] text-[#1B6B2F] text-[12px] font-[600] transition-colors whitespace-nowrap">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 3. PARTNER DETAIL VIEW
function PartnerDetailView({ showConfirm }) {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [partner, setPartner] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const data = await getPartner(uid);
        if (data) {
          setPartner(data);
        } else {
          addToast('error', 'Partner not found');
          navigate('/admin/partners');
        }
      } catch (e) {
        console.error(e);
        addToast('error', 'Error loading partner profile');
      }
    };
    fetchPartnerData();

    // Set up real-time listener for referrals
    const unsubscribe = getPartnerReferrals(uid, (data) => {
      setReferrals(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const [sheetCases, setSheetCases] = useState([]);
  useEffect(() => {
    if (!partner) return;
    const fetchSheet = async () => {
      try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDvmLliVGdBQCvB68D4SbuWpYlWNoUYZIK3QdM6TOGQwmP4kydtWIS1s4NKtR9Hmq3NA/exec';
        const res = await fetch(SCRIPT_URL + '?action=getLedger');
        const data = await res.json();
        let recs = data.records || data || [];
        recs = processSheetRecords(recs);
        const filtered = recs.filter(row => {
          if (!row || !row['Partner Name']) return false;
          return row['Partner Name'].toString().trim().toLowerCase() === partner.name?.toString().trim().toLowerCase();
        });
        setSheetCases(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSheet();
  }, [partner]);

  const mergedReferrals = [...referrals];
  const mergedKeys = new Set(mergedReferrals.map(r => r.pan?.toLowerCase() || r.clientName?.toLowerCase()));

  sheetCases.forEach(sheetCase => {
    const panKey = sheetCase['PAN']?.toLowerCase();
    const nameKey = sheetCase['Client Name']?.toLowerCase();
    if (!mergedKeys.has(panKey) && !mergedKeys.has(nameKey)) {
      mergedReferrals.push({
        id: sheetCase['PAN'] || sheetCase['Client Name'] || Math.random().toString(),
        clientName: sheetCase['Client Name'] || '',
        companyName: sheetCase['Company Name'] || '',
        pan: sheetCase['PAN'] || '',
        arnNumber: sheetCase['ARN Number'] || '',
        gstStatus: 'Pending',
        paymentStatus: sheetCase['Payment Status'] || 'In Process',
        month: sheetCase['Timestamp'] ? new Date(sheetCase['Timestamp']).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'Unknown',
        timestamp: sheetCase['Timestamp'] || new Date().toISOString(),
        remarks: sheetCase['Remarks'] || '',
        isSheet: true
      });
    }
  });
  
  mergedReferrals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


  if (loading || !partner) {
    return (
      <div className="fade-up-enter max-w-[1000px] mx-auto pb-20">
        <div className="h-[104px] w-full bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] mb-6 skeleton-shimmer"></div>
        <div className="h-[300px] w-full bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] skeleton-shimmer"></div>
      </div>
    );
  }

  const formatDate = (ts) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAddClick = () => {
    setSelectedReferral(null);
    setShowAddEditModal(true);
  };

  const handleEditClick = (referral) => {
    setSelectedReferral(referral);
    setShowAddEditModal(true);
  };

  const handleDeleteReferralClick = (referral) => {
    if (referral.isSheet) {
      addToast('error', 'Cannot delete referrals synced from Google Sheets.');
      return;
    }
    showConfirm({
      title: 'Delete Referral',
      message: 'Are you sure you want to delete this referral? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, `partners/${uid}/referrals`, referral.id));
          addToast('success', 'Referral deleted successfully');
        } catch (e) {
          console.error(e);
          addToast('error', 'Failed to delete referral');
        }
      }
    });
  };

  const getGSTPill = (ref) => {
    if (ref.pan && ref.pan !== 'N/A' && ref.pan.trim() !== '') {
      return <span className="bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600] truncate max-w-[120px] inline-block align-bottom" title={ref.pan}>{ref.pan}</span>;
    }
    if (ref.gstStatus === 'Approved') {
      return <span className="bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600]">Approved</span>;
    } else if (ref.gstStatus === 'Rejected') {
      return <span className="bg-red-50 text-[#DC2626] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600]">Rejected</span>;
    }
    return <span className="bg-[rgba(244,131,31,0.1)] text-[#F4831F] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600]">Pending</span>;
  };

  const getPaymentPill = (status) => {
    if (status === 'Paid') {
      return <span className="bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600]">Paid</span>;
    }
    return <span className="bg-[rgba(244,131,31,0.1)] text-[#F4831F] px-2.5 py-0.5 rounded-[100px] text-[12px] font-[600]">Pending</span>;
  };

  return (
    <div className="fade-up-enter max-w-[1000px] mx-auto pb-20">
      <div 
        onClick={() => navigate('/admin/partners')} 
        className="mb-5 flex items-center gap-2 text-[13px] text-[rgba(17,17,16,0.5)] hover:text-[#111110] transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft size={16} /> Back to Partners
      </div>

      {/* Partner Header Card */}
      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] p-6 md:p-7 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-[56px] h-[56px] rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[20px] flex items-center justify-center shrink-0">
            {partner.name?.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[20px] font-[800] text-[#111110] leading-none mb-1.5">{partner.name}</h1>
            <div className="text-[14px] text-[rgba(17,17,16,0.5)] mb-1.5">{partner.email} • {partner.phone}</div>
            <div className="text-[12px] text-[rgba(17,17,16,0.35)]">Joined on {formatDate(partner.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Referrals Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-[700] text-[#111110]">REFERRALS</h2>
        <button 
          onClick={handleAddClick} 
          className="h-[36px] px-4 rounded-full border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] text-[13px] font-[600] hover:bg-[#F0F5EA] transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus size={16} /> Add Referral
        </button>
      </div>

      <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-[1.8fr_1.2fr_1fr_1fr_2.5fr_auto] gap-4 px-5 py-3 bg-[#F9F8F5] border-b border-[rgba(17,17,16,0.06)] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)]">
          <div>CLIENT NAME</div>
          <div>ARN NUMBER</div>
          <div className="text-center">GST STATUS</div>
          <div className="text-center">PAYMENT STATUS</div>
          <div className="text-left">REMARKS</div>
          <div className="text-right w-16">ACTIONS</div>
        </div>

        <div className="divide-y divide-[rgba(17,17,16,0.05)]">
          {mergedReferrals.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Users size={32} className="text-[rgba(17,17,16,0.15)] mb-3" />
              <div className="text-[15px] font-[500] text-[rgba(17,17,16,0.4)]">No referrals added yet</div>
            </div>
          ) : (
            mergedReferrals.map((ref) => (
              <div key={ref.id}>
                {/* Mobile View */}
                <div className="md:hidden p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[14px] font-[600] text-[#111110]">{ref.clientName}</div>
                      {ref.companyName && <div className="text-[12px] font-[500] text-[rgba(17,17,16,0.6)]">{ref.companyName}</div>}
                      <div className="text-[12px] text-[rgba(17,17,16,0.5)] mt-0.5">ARN: {ref.arnNumber || 'N/A'}</div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleEditClick(ref)} 
                        className="p-2 text-[rgba(17,17,16,0.4)] hover:text-[#1B6B2F] transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      {!ref.isSheet && (
                        <button 
                          onClick={() => handleDeleteReferralClick(ref)} 
                          className="p-2 text-[rgba(17,17,16,0.4)] hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1.5 mb-1">
                    {getGSTPill(ref)}
                    {getPaymentPill(ref.paymentStatus)}
                  </div>
                  {ref.remarks && (
                    <div className="text-[12px] text-[rgba(17,17,16,0.7)] p-2 bg-[#F9F8F5] rounded-[8px] border border-[rgba(17,17,16,0.05)]">
                      <span className="font-[600] text-[rgba(17,17,16,0.4)] mr-1">Remarks:</span> {ref.remarks}
                    </div>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-[1.8fr_1.2fr_1fr_1fr_2.5fr_auto] gap-4 px-5 py-4 items-center">
                  <div className="truncate flex flex-col justify-center">
                    <span className="text-[14px] font-[600] text-[#111110] truncate">{ref.clientName}</span>
                    {ref.companyName && <span className="text-[12px] font-[500] text-[rgba(17,17,16,0.5)] truncate mt-0.5">{ref.companyName}</span>}
                  </div>
                  <div className="text-[13px] text-[rgba(17,17,16,0.6)] font-mono truncate">
                    {ref.arnNumber || 'N/A'}
                  </div>
                  <div className="text-center">
                    {getGSTPill(ref)}
                  </div>
                  <div className="text-center">
                    {getPaymentPill(ref.paymentStatus)}
                  </div>
                  <div className="text-[12px] text-[rgba(17,17,16,0.6)] line-clamp-2 leading-relaxed">
                    {ref.remarks || '-'}
                  </div>
                  <div className="flex justify-end gap-1 w-16">
                    <button 
                      onClick={() => handleEditClick(ref)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(17,17,16,0.4)] hover:text-[#1B6B2F] hover:bg-[rgba(27,107,47,0.05)] transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    {!ref.isSheet && (
                      <button 
                        onClick={() => handleDeleteReferralClick(ref)} 
                        className="w-8 h-8 flex items-center justify-center rounded-full text-[rgba(17,17,16,0.4)] hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddEditModal && (
        <AddEditReferralModal 
          partnerUid={uid} 
          referral={selectedReferral} 
          onClose={() => setShowAddEditModal(false)} 
        />
      )}
    </div>
  );
}

// 4. ADD / EDIT REFERRAL MODAL
function AddEditReferralModal({ partnerUid, referral, onClose }) {
  const { addToast } = useToast();
  const today = new Date().toISOString().split('T')[0];
  const [clientName, setClientName] = useState(referral ? referral.clientName : '');
  const [companyName, setCompanyName] = useState(referral ? referral.companyName : '');
  const [pan, setPan] = useState(referral ? referral.pan : '');
  const [arnNumber, setArnNumber] = useState(referral ? (referral.arnNumber || '') : '');
  const [paymentStatus, setPaymentStatus] = useState(referral ? referral.paymentStatus : 'Pending');
  const [manualDate, setManualDate] = useState(referral?.timestamp ? referral.timestamp.split('T')[0] : today);
  const [remarks, setRemarks] = useState(referral ? (referral.remarks || '') : '');
  const [loading, setLoading] = useState(false);

  const isEdit = !!referral;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !pan || !manualDate) {
      addToast('error', 'Client Name, PAN/GST, and Date are required');
      return;
    }

    setLoading(true);
    try {
      const data = {
        clientName,
        companyName,
        pan,
        arnNumber,
        paymentStatus,
        timestamp: manualDate,
        remarks
      };

      if (isEdit && !referral.isSheet) {
        await updateReferralStatus(partnerUid, referral.id, data);
        addToast('success', 'Referral updated successfully');
      } else {
        await addReferral(partnerUid, data);
        addToast('success', referral?.isSheet ? 'Referral saved and ARN updated!' : 'Referral added successfully');
      }
      onClose();
    } catch (e) {
      console.error(e);
      addToast('error', isEdit ? 'Failed to update referral' : 'Failed to add referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" onClick={onClose}></div>
      <div className="bg-white rounded-[16px] p-7 w-full max-w-[440px] relative z-10 fade-up-enter shadow-xl border border-[rgba(17,17,16,0.08)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-[800] text-[#111110]">
            {isEdit ? 'Edit Referral' : 'Add Referral'}
          </h3>
          <button onClick={onClose} className="text-[rgba(17,17,16,0.4)] hover:text-[#111110]">
            <XIcon size={20}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Client Name *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. John Doe Enterprises"
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
              className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. Acme Corp"
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
              className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">PAN/GST Number *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. ABCDE1234F"
              value={pan} 
              onChange={e => setPan(e.target.value)} 
              className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">ARN Number</label>
            <input 
              type="text" 
              placeholder="e.g. ARN-123456"
              value={arnNumber} 
              onChange={e => setArnNumber(e.target.value)} 
              className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Date *</label>
            <input 
              required
              type="date" 
              value={manualDate} 
              onChange={e => setManualDate(e.target.value)} 
              className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-[600] text-[#111110]">Payment Status</label>
              <select 
                value={paymentStatus} 
                onChange={e => setPaymentStatus(e.target.value)} 
                className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)]"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-[600] text-[#111110]">Remarks</label>
            <textarea 
              placeholder="Any additional notes..."
              value={remarks} 
              onChange={e => setRemarks(e.target.value)} 
              className="h-[80px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] p-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-[rgba(17,17,16,0.06)]">
            <button 
              type="button"
              onClick={onClose} 
              className="px-5 h-10 rounded-full font-[600] text-[14px] text-[rgba(17,17,16,0.55)] hover:bg-[#F9F8F5]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading} 
              className="px-5 h-10 rounded-full bg-[#1B6B2F] text-white font-[600] text-[14px] hover:bg-[#145324] disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Saving...' : (isEdit ? 'Save Changes →' : 'Add Referral →')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminCases() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState('All');
  const { addToast } = useToast();

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDvmLliVGdBQCvB68D4SbuWpYlWNoUYZIK3QdM6TOGQwmP4kydtWIS1s4NKtR9Hmq3NA/exec';

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await fetch(SCRIPT_URL + '?action=getLedger');
        const data = await res.json();
        let recs = data.records || data || [];
        recs = processSheetRecords(recs);
        setRecords(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  // Group by partner
  const partners = ['All', ...new Set((records || []).map(r => r?.['Partner Name'] || 'Unknown Partner'))];
  
  const partnerCounts = (records || []).reduce((acc, r) => {
    const p = r['Partner Name'] || 'Unknown Partner';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const displayedRecords = selectedPartner === 'All' 
    ? (records || [])
    : (records || []).filter(r => (r?.['Partner Name'] || 'Unknown Partner') === selectedPartner);

  const handleStatusChange = async (index, pan, newStatus) => {
    if (!pan) {
      addToast('Cannot update status: PAN is missing.', 'error');
      return;
    }
    
    // Optimistic UI
    const originalRecords = [...records];
    const newRecords = [...records];
    
    // Find index in main records array
    const recordIndex = newRecords.findIndex(r => r['PAN'] === pan);
    if (recordIndex !== -1) {
      newRecords[recordIndex] = { ...newRecords[recordIndex], 'Payment Status': newStatus };
      setRecords(newRecords);
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          pan: pan,
          paymentStatus: newStatus
        })
      });
      addToast('Status updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      setRecords(originalRecords); // Revert
      addToast('Failed to update status.', 'error');
    }
  };

  return (
    <div className="fade-up-enter max-w-[1200px] h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar / Summary */}
      <div className="w-full md:w-[260px] bg-white border border-[rgba(17,17,16,0.08)] rounded-[14px] p-4 flex flex-col h-fit">
        <h2 className="text-[16px] font-bold text-[#111110] mb-4">Partner Summary</h2>
        <div className="flex flex-col gap-2">
          {partners.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPartner(p)}
              className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-[500] transition-colors ${
                selectedPartner === p ? 'bg-[rgba(27,107,47,0.08)] text-[#1B6B2F]' : 'hover:bg-[#F9F8F5] text-[rgba(17,17,16,0.6)]'
              }`}
            >
              <span className="truncate">{p}</span>
              <span className="bg-[#F4F3EE] px-2 py-0.5 rounded-full text-[11px]">
                {p === 'All' ? records.length : (partnerCounts[p] || 0)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white border border-[rgba(17,17,16,0.08)] rounded-[14px] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[rgba(17,17,16,0.05)] flex justify-between items-center">
          <h2 className="text-[16px] font-bold text-[#111110]">
            Cases: {selectedPartner}
          </h2>
        </div>
        <div className="flex-1 overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-[13px] text-[rgba(17,17,16,0.4)]">Loading cases...</div>
          ) : (!displayedRecords || displayedRecords.length === 0) ? (
            <div className="p-8 text-center text-[13px] text-[rgba(17,17,16,0.4)]">No cases found.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F9F8F5] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] border-b border-[rgba(17,17,16,0.06)]">
                  <th className="px-5 py-3 font-medium">CLIENT NAME</th>
                  <th className="px-5 py-3 font-medium">COMPANY</th>
                  <th className="px-5 py-3 font-medium">PAN</th>
                  <th className="px-5 py-3 font-medium">PAYMENT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(displayedRecords || []).map((r, i) => (
                  <tr key={i} className="border-b border-[rgba(17,17,16,0.05)] hover:bg-[#F9F8F5] transition-colors text-[13px] text-[#111110]">
                    <td className="px-5 py-3 font-[500]">{r?.['Client Name'] || 'N/A'}</td>
                    <td className="px-5 py-3 text-[rgba(17,17,16,0.6)]">{r?.['Company Name'] || 'N/A'}</td>
                    <td className="px-5 py-3 font-mono text-[rgba(17,17,16,0.45)]">{r?.['PAN'] || 'N/A'}</td>
                    <td className="px-5 py-3">
                      <select 
                        value={r?.['Payment Status'] || 'In Process'}
                        onChange={(e) => handleStatusChange(i, r?.['PAN'], e.target.value)}
                        className={`text-[12px] font-[600] px-3 py-1 rounded-full outline-none border border-transparent hover:border-[rgba(17,17,16,0.1)] transition-colors cursor-pointer appearance-none text-center
                          ${(r?.['Payment Status'] || 'In Process').toLowerCase() === 'payment done' ? 'bg-[#E8F5E9] text-[#1B6B2F]' : 
                            (r?.['Payment Status'] || 'In Process').toLowerCase() === 'client revoked' ? 'bg-[#FFEBEE] text-[#DC2626]' : 
                            'bg-[#FFF3E0] text-[#F4831F]'}`}
                        style={{ paddingRight: '12px' }}
                      >
                        <option value="In Process">In Process</option>
                        <option value="Payment Done">Payment Done</option>
                        <option value="Client Revoked">Client Revoked</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
