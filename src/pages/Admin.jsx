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
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AdminBlog from './AdminBlog';

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
  const { user, loading } = useAuth();
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
      
      const checkAdmin = async () => {
        try {
          let isAdmin = user.email === 'admin@bos.com';
          
          if (!isAdmin) {
            const adminSnap = await getDoc(doc(db, 'admins', user.uid));
            isAdmin = adminSnap.exists();
          }
          
          if (!isAdmin) {
            navigate('/login');
            return;
          }
          
          const verified = sessionStorage.getItem('bos_admin_verified');
          if (verified === 'true') {
            setAdminAuthenticated(true);
          }
          setAuthChecked(true);
        } catch (err) {
          console.error('Admin check failed:', err);
          navigate('/login');
        }
      };
      checkAdmin();
    }
  }, [user, loading, navigate]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_GATE_PASSWORD) {
      sessionStorage.setItem('bos_admin_verified', 'true');
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
      sessionStorage.removeItem('bos_admin_verified');
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
    if (location.pathname.startsWith('/admin/clients/add')) return 'add-client';
    if (location.pathname.startsWith('/admin/clients')) return 'clients';
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

        <div className="text-[10px] font-[600] tracking-[0.1em] text-[rgba(255,255,255,0.25)] px-5 pt-5 pb-2">
          MENU
        </div>

        <nav className="flex flex-col">
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'dashboard' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/admin/clients" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'clients' && !location.pathname.includes('/add') ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <Users size={16} /> Clients
          </Link>
          <Link to="/admin/clients/add" onClick={() => setMobileMenuOpen(false)} className={`mx-2 my-[2px] px-3 py-2.5 rounded-[8px] text-[13px] font-[500] flex items-center gap-2.5 transition-all
            ${activeTab === 'add-client' ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[rgba(255,255,255,0.75)]'}`}>
            <UserPlus size={16} /> Add New Client
          </Link>
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
            <Route path="/clients" element={<AdminClients />} />
            <Route path="/clients/add" element={<AddClientForm showConfirm={showConfirm} />} />
            <Route path="/clients/:uid" element={<ClientDetailView showConfirm={showConfirm} />} />
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
function AdminClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All, Active, Completed
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] font-[700] text-[14px] flex items-center justify-center shrink-0">
                      {client.name?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-[600] text-[#111110]">{client.name}</div>
                      <div className="text-[12px] text-[rgba(17,17,16,0.45)]">{client.email}</div>
                    </div>
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

                  <div className="col-span-1 flex justify-end">
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

      // 6. Send welcome email (via reset)
      await sendPasswordResetEmail(auth, formData.email, {
        url: 'https://bharatofficesetu.com/login'
      });

      try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJsqakzHd4nbETSSWqscn3baHoEPS3lSFJwRsxvPnuo6OLr9ssPWpr2dGJXv-LCnM5gQ/exec';
        await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            type: 'welcome_email',
            name: formData.name,
            email: formData.email,
            phone: '+91' + formData.phone,
            service: formData.serviceType,
            tempPassword: tempPassword,
            loginUrl: 'https://bharatofficesetu.com/login'
          })
        });
      } catch (e) {
        console.error('Apps Script error', e);
      }

      // 7. Log Activity
      await addDoc(collection(db, 'activity_log'), {
        type: 'client_created',
        clientName: formData.name,
        clientId: uid,
        description: `${formData.name} added — ${formData.serviceType}`,
        timestamp: serverTimestamp()
      });

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
    const storage = getStorage();
    const filePath = `clients/${client.id}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error(error);
        addToast('error', 'Upload failed');
        setIsUploading(false);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await uploadDocument(client.id, file); // Dummy call
        
        await addDoc(collection(db, 'clients', client.id, 'documents'), {
          name: file.name,
          url: downloadURL,
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
      }
    );
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
