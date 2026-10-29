import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Check, FileText, Download, MessageCircle, X as XIcon, FolderOpen, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { SERVICE_STEPS } from '../services/services';
import { auth, db } from '../firebase';
import { getClient } from '../services/clients';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { getClientDriveFolder } from '../services/documents';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' | 'all'
  const [clientProfile, setClientProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [googleDriveUrl, setGoogleDriveUrl] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [whatsAppMsg, setWhatsAppMsg] = useState('');

  const AVAILABLE_SERVICES = [
    'GST Registration',
    'GST Return Filing',
    'Trademark Registration',
    'Company Incorporation',
    'LLP Registration',
    'Virtual Office',
    'Compliance',
    'Copyright Registration',
    'FSSAI Registration',
    'BIS Registration',
    'Startup India Registration',
    'Partnership Firm Registration'
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    
    // Admin user redirects
    if (!loading && user && ['admin@bos.com', 'mu8ndan@gmail.com'].includes(user.email)) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    setFetching(true);
    
    const servicesRef = collection(db, 'clients', user.uid, 'services');
    
    const unsubServices = onSnapshot(
      servicesRef,
      (snapshot) => {
        const services = snapshot?.docs?.map(doc => {
          const data = doc.data();
          const startDateObj = data.startDate?.toDate ? data.startDate.toDate() : (data.startDate ? new Date(data.startDate) : null);
          const expiryDateObj = data.expiryDate?.toDate ? data.expiryDate.toDate() : (data.expiryDate ? new Date(data.expiryDate) : null);
          const now = new Date();
          const daysLeft = expiryDateObj ? Math.ceil((expiryDateObj - now) / (1000 * 60 * 60 * 24)) : null;

          return {
            id: doc.id,
            ...data,
            name: data?.type,
            currentStep: data?.status,
            status: data?.completedDate ? 'completed' : 'active',
            state: data?.state || null,
            startDate: startDateObj ? startDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just now',
            expiryDate: expiryDateObj ? expiryDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null,
            daysLeft,
            completedDate: data?.completedDate?.toDate?.() || null,
            lastUpdated: startDateObj ? Math.floor((now - startDateObj) / (1000 * 60 * 60 * 24)) : 0
          };
        }) || [];
        setServices(services);
        if (services.length > 0) {
          setActiveServiceId(prev => (prev && services.some(s => s.id === prev) ? prev : services[0].id));
        }
        setFetching(false);
      },
      (error) => {
        console.error('Services error:', error);
        setServices([]);
        setFetching(false);
      }
    );

    // Fetch and subscribe to client profile in Firestore for driveFolderUrl and officeState
    const unsubClient = onSnapshot(doc(db, 'clients', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setClientProfile(data);
        const driveLink = data.driveFolderUrl || data.googleDriveLink || data.driveUrl || data.drive_url;
        if (driveLink) {
          setGoogleDriveUrl(driveLink);
        }
      }
    });

    return () => {
      unsubServices();
      unsubClient();
    };
    
  }, [user]);

  // Modal Timer
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            closeRequestModal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submitSuccess]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
    navigate('/login');
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSubmitError('');
      setSelectedService('');
      setDetails('');
      setCountdown(5);
    }, 300);
  };

  const handleRequestSubmit = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    setSubmitError('');
    let fallbackMsg = '';

    try {
      const currentUser = auth.currentUser;
      // Get client name from Firestore as requested
      const { client } = await getClient(currentUser?.uid);
      
      fallbackMsg = `🔔 New Service Request from existing client!\n\n` +
        `👤 Client: ${client?.name || 'Unknown'}\n` +
        `📧 Email: ${client?.email || user?.email || 'Unknown'}\n` +
        `📞 Phone: ${client?.phone || 'Unknown'}\n\n` +
        `🛎️ Requested Service: ${selectedService}\n` +
        `📝 Details: ${details || 'No additional details'}\n\n` +
        `Please add this service to their dashboard.`;
        
      setWhatsAppMsg(fallbackMsg);

      try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyV3FGQHAjeSoeCYm0o4Z_QXQ1f1_W6jSJl4W7yxjUzrqI5bCPs850kTrE-cgYC2Brf_A/exec';

        await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            name: client?.name || 'Unknown',
            phone: client?.phone || 'Unknown',
            email: client?.email || user?.email || 'Unknown',
            services: selectedService,
            state: 'Existing Client — Dashboard Request',
            details: details || ''
          })
        });
      } catch (fetchError) {
        console.error("Apps script fetch failed:", fetchError);
      }

      setSubmitSuccess(true);
      setCountdown(5);
    } catch (error) {
      if (!fallbackMsg) {
         fallbackMsg = `🔔 New Service Request from existing client!\n\n` +
          `📧 Email: ${user?.email || 'Unknown'}\n` +
          `🛎️ Requested Service: ${selectedService}\n` +
          `📝 Details: ${details || 'No additional details'}\n\n` +
          `Please add this service to my dashboard.`;
         setWhatsAppMsg(fallbackMsg);
      }
      setSubmitError('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const url = await getDocumentDownloadUrl(doc);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Could not generate download link for this document.');
      }
    } catch (err) {
      console.error('Error opening document:', err);
      if (doc?.url) window.open(typeof doc.url === 'string' ? doc.url : doc.url?.url, '_blank');
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans pb-20">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpMobile {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        .modal-card {
          animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        @media (max-width: 480px) {
          .modal-card {
            animation: slideUpMobile 0.35s cubic-bezier(0.16,1,0.3,1);
          }
        }
        .animated-check-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: checkStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .animated-check-tick {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkStroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
        }
        @keyframes checkStroke {
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      
      <div className="h-16 bg-white border-b border-[rgba(17,17,16,0.06)] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/logo.png" alt="BOS Logo" className="h-6 object-contain" />
        </div>
        <div className="text-[14px] font-semibold text-[#111110] absolute left-1/2 -translate-x-1/2 hidden sm:block">My Dashboard</div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-[#111110] truncate max-w-[120px] sm:max-w-none">
            Hi, {user.email?.split('@')[0] || 'Client'}
          </span>
          <button 
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-[#F9F8F5] flex items-center justify-center text-[rgba(17,17,16,0.5)] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-5 pt-8">
        
        {/* Section 1 - MY SERVICES */}
        <div className="mb-10 fade-up-enter" style={{ animationDelay: '0s' }}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.08em] text-[rgba(17,17,16,0.4)] uppercase">MY SERVICES</div>
              {services.length > 1 && (
                <div className="text-[12px] text-[rgba(17,17,16,0.55)] font-medium mt-0.5">
                  You have <span className="font-bold text-[#1B6B2F]">{services.length} services</span> active with Bharat Office Setu
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {services.length > 1 && (
                <div className="inline-flex bg-white border border-[rgba(17,17,16,0.1)] rounded-full p-0.5 shadow-xs">
                  <button
                    onClick={() => setViewMode('tabs')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                      viewMode === 'tabs' ? 'bg-[#1B6B2F] text-white shadow-xs' : 'text-[rgba(17,17,16,0.6)] hover:text-[#111110]'
                    }`}
                  >
                    Focus Tab
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                      viewMode === 'all' ? 'bg-[#1B6B2F] text-white shadow-xs' : 'text-[rgba(17,17,16,0.6)] hover:text-[#111110]'
                    }`}
                  >
                    View All ({services.length})
                  </button>
                </div>
              )}

              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-transparent border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] rounded-[100px] px-3.5 py-1.5 text-[12px] font-semibold hover:bg-[rgba(27,107,47,0.04)] hover:border-[rgba(27,107,47,0.4)] transition-all cursor-pointer shrink-0"
              >
                + Request a Service
              </button>
            </div>
          </div>

          {/* Service Switcher Tabs (Shown when > 1 service and in 'tabs' mode) */}
          {services.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
              {services.map((s, idx) => {
                const isSelected = viewMode === 'tabs' ? activeServiceId === s.id : false;
                const isComplete = s.status === 'completed';
                const sState = s.state || (s.name === 'Virtual Office' ? clientProfile?.officeState : null);
                return (
                  <button
                    key={s.id || idx}
                    onClick={() => {
                      setActiveServiceId(s.id);
                      if (viewMode !== 'tabs') setViewMode('tabs');
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1B6B2F] text-white border-[#1B6B2F] shadow-sm'
                        : 'bg-white border-[rgba(17,17,16,0.1)] text-[#111110] hover:bg-[#FAF9F5] hover:border-[rgba(17,17,16,0.2)]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isComplete ? 'bg-[#25D366]' : isSelected ? 'bg-amber-300' : 'bg-[#F4831F]'}`}></span>
                    <span>{s.name}</span>
                    {sState && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F4F3EE] text-[#1B6B2F]'}`}>
                        📍 {sState}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {(!services || (services?.length || 0) === 0) ? (
            <div className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] p-10 flex flex-col items-center justify-center text-center">
              <FileText className="text-[rgba(17,17,16,0.2)] mb-3" size={32} />
              <div className="text-[14px] font-medium text-[rgba(17,17,16,0.5)]">Your services will appear here</div>
              <div className="text-[13px] text-[rgba(17,17,16,0.4)] mt-1">Our team is setting up your account</div>
            </div>
          ) : (
            (viewMode === 'tabs' && services.length > 1
              ? (services.filter(s => s.id === activeServiceId).length ? services.filter(s => s.id === activeServiceId) : [services[0]])
              : services
            ).map((service) => {
              const steps = (service?.name && SERVICE_STEPS[service.name]) || ['Order Received', 'In Progress', 'Completed'];
              const currentIndex = (steps || []).indexOf(service?.currentStep);
              const effectiveState = service.state || (service.name === 'Virtual Office' ? clientProfile?.officeState : null);
              
              return (
                <div key={service?.id || service?.name} className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] p-6 mb-4 relative overflow-hidden card-lift">
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] 
                    ${service?.status === 'active' ? 'bg-[#F4831F]' : 'bg-[#1B6B2F]'}`}
                  ></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[16px] font-bold text-[#111110] mb-0.5 flex items-center gap-2 flex-wrap">
                        <span>{service?.name}</span>
                        {effectiveState && (
                          <span className="bg-[#FAF9F5] border border-[rgba(17,17,16,0.1)] text-[#111110] text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <MapPin size={11} className="text-[#1B6B2F]" />
                            {effectiveState}
                          </span>
                        )}
                      </div>
                      <div className="text-[12px] text-[rgba(17,17,16,0.45)]">Started {service?.startDate}</div>
                    </div>
                    
                    {service?.status === 'active' ? (
                      <div className="bg-[rgba(244,131,31,0.1)] text-[#F4831F] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        In Progress
                      </div>
                    ) : (
                      <div className="bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                        Completed <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Virtual Office Details Bar */}
                  {(service?.name === 'Virtual Office' || service?.type === 'Virtual Office' || effectiveState || service?.expiryDate) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-3.5 bg-[#FAF9F5] border border-[rgba(17,17,16,0.06)] rounded-[12px]">
                      <div>
                        <div className="text-[10px] font-bold text-[rgba(17,17,16,0.4)] uppercase tracking-wider">Office State</div>
                        <div className="text-[13px] font-bold text-[#111110] mt-0.5">
                          {effectiveState ? `📍 ${effectiveState}` : 'State Not Set'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[rgba(17,17,16,0.4)] uppercase tracking-wider">Purchased On</div>
                        <div className="text-[13px] font-semibold text-[#111110] mt-0.5">
                          {service.startDate || '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[rgba(17,17,16,0.4)] uppercase tracking-wider">Valid Till / Expiry</div>
                        <div className="text-[13px] font-semibold text-[#1B6B2F] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          {service.expiryDate ? (
                            <>
                              <span>{service.expiryDate}</span>
                              {service.daysLeft != null && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${service.daysLeft > 30 ? 'bg-[#EBF7EE] text-[#1B6B2F]' : 'bg-red-50 text-red-600'}`}>
                                  {service.daysLeft > 0 ? `(${service.daysLeft}d left)` : '(Expired)'}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[rgba(17,17,16,0.4)] font-normal">1 Year Validity</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative pt-2 pb-6 overflow-x-auto no-scrollbar">
                    <div className="min-w-[500px] flex items-center justify-between relative px-4">
                      {/* Lines */}
                      <div className="absolute left-8 right-8 top-[13px] h-[2px] -z-10 flex">
                        {(steps?.slice(0, -1) || []).map((_, i) => (
                          <div key={i} className="flex-1 h-full">
                            <div className={`h-full w-full 
                              ${i < currentIndex ? 'bg-[#1B6B2F]' : 'border-t-2 border-dashed border-[rgba(17,17,16,0.1)]'}
                            `}></div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Circles */}
                      {(steps || []).map((step, i) => {
                        const isCompleted = i < currentIndex || service?.status === 'completed';
                        const isCurrent = i === currentIndex && service?.status === 'active';
                        const isPending = i > currentIndex && service?.status === 'active';
                        
                        return (
                          <div key={i} className="flex flex-col items-center relative w-16">
                            <div className="relative flex items-center justify-center w-7 h-7 mb-2">
                              {isCurrent && (
                                <div className="absolute inset-0 rounded-full border-2 border-[#F4831F] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-60"></div>
                              )}
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 relative transition-colors duration-300
                                ${isCompleted ? 'bg-[#1B6B2F] text-white' : ''}
                                ${isCurrent ? 'bg-[#F4831F] text-white' : ''}
                                ${isPending ? 'bg-white border-2 border-[rgba(17,17,16,0.2)]' : ''}
                              `}>
                                {isCompleted && <Check size={14} strokeWidth={3} />}
                              </div>
                            </div>
                            <div className={`text-[11px] text-center w-24 absolute top-10
                              ${isCompleted ? 'text-[#1B6B2F] font-medium' : ''}
                              ${isCurrent ? 'text-[#F4831F] font-bold' : ''}
                              ${isPending ? 'text-[rgba(17,17,16,0.3)] font-medium' : ''}
                            `}>
                              {step}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 text-[12px] text-[rgba(17,17,16,0.35)]">
                    Last updated {service?.lastUpdated || 0} days ago
                  </div>
                </div>
              );
            })
          )}

          {/* Quick Switch Tray when in Focus Tab view */}
          {viewMode === 'tabs' && services.length > 1 && (
            <div className="p-3 bg-white border border-[rgba(17,17,16,0.08)] rounded-[12px] flex items-center justify-between flex-wrap gap-2 text-[12px] shadow-xs">
              <span className="text-[rgba(17,17,16,0.5)] font-medium">Other Active Services:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {services.filter(s => s.id !== activeServiceId).map(other => (
                  <button
                    key={other.id}
                    onClick={() => setActiveServiceId(other.id)}
                    className="px-2.5 py-1 bg-[#FAF9F5] hover:bg-[#F0F5EA] text-[#111110] border border-[rgba(17,17,16,0.08)] hover:border-[rgba(27,107,47,0.3)] rounded-full font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{other.name}</span>
                    {other.state && <span className="text-[#1B6B2F]">({other.state})</span>}
                    <span className="text-[rgba(17,17,16,0.4)]">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2 - MY DOCUMENTS */}
        <div className="mb-12 fade-up-enter" style={{ animationDelay: '0.1s' }}>
          <div className="text-[11px] font-semibold tracking-[0.08em] text-[rgba(17,17,16,0.4)] mb-3">MY DOCUMENTS</div>
          
          <div className="bg-white rounded-[16px] border border-[rgba(17,17,16,0.08)] p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#EBF7EE] border border-[rgba(27,107,47,0.15)] flex items-center justify-center text-[#1B6B2F] shrink-0">
                  <FolderOpen size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[17px] font-bold text-[#111110]">Google Drive KYC & Agreement Documents</h3>
                    <span className="bg-[#EBF7EE] text-[#1B6B2F] border border-[rgba(27,107,47,0.2)] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      All Files in One Place
                    </span>
                  </div>
                  <p className="text-[13px] text-[rgba(17,17,16,0.55)] mt-1.5 max-w-[520px] leading-relaxed">
                    All your agreement drafts, GST registration certificates, rent agreements, NOCs, and KYC verifications are organized and stored in your dedicated Google Drive folder.
                  </p>
                </div>
              </div>

              {googleDriveUrl ? (
                <a
                  href={googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-[46px] px-6 rounded-[100px] bg-[#1B6B2F] hover:bg-[#145324] text-white font-bold text-[14px] flex items-center justify-center gap-2.5 transition-all hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(27,107,47,0.25)] shrink-0"
                >
                  <FolderOpen size={18} />
                  <span>Open Google Drive Folder</span>
                  <ExternalLink size={15} />
                </a>
              ) : (
                <div className="text-[12px] text-[rgba(17,17,16,0.45)] italic bg-[#FAF9F5] px-4 py-2.5 rounded-[8px] border border-[rgba(17,17,16,0.06)] shrink-0">
                  Folder being prepared by admin
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 - NEED HELP? */}
        <div className="flex justify-center fade-up-enter" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={() => window.open('https://wa.me/917683002685', '_blank')}
            className="bg-[#25D366] text-white rounded-[100px] px-6 py-3 flex items-center gap-2 font-bold text-[14px] hover:bg-[#20bd5a] transition-all hover:-translate-y-[1px] shadow-[0_4px_12px_rgba(37,211,102,0.2)]"
          >
            <MessageCircle size={18} />
            WhatsApp Our Team
          </button>
        </div>
      </div>

      {/* REQUEST SERVICE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-[4px] z-[100] flex items-end sm:items-center justify-center modal-overlay sm:p-4 pb-0">
          <div className="bg-white w-full sm:w-[480px] sm:max-w-[calc(100vw-32px)] sm:rounded-[20px] rounded-t-[20px] rounded-b-none p-8 pb-10 sm:pb-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] modal-card max-h-[90vh] overflow-y-auto relative">
            
            {/* Mobile drag handle */}
            <div className="w-8 h-[3px] bg-[rgba(17,17,16,0.15)] rounded-[100px] mx-auto mb-4 sm:hidden"></div>

            {!submitSuccess ? (
              <>
                <button 
                  onClick={closeRequestModal}
                  className="absolute top-6 sm:top-8 right-6 sm:right-8 w-6 h-6 text-[rgba(17,17,16,0.35)] hover:text-[#111110] transition-colors flex items-center justify-center"
                >
                  <XIcon size={24} />
                </button>

                <div className="mb-6">
                  <h2 className="text-[20px] font-[800] text-[#111110]">Request a New Service</h2>
                  <p className="text-[14px] text-[rgba(17,17,16,0.45)] mt-1.5 leading-snug">
                    Our team will reach out within 48 hours to confirm and get started
                  </p>
                </div>
                
                <div className="h-[1px] bg-[rgba(17,17,16,0.06)] w-full mb-6"></div>

                <div className="mb-5">
                  <label className="block text-[12px] font-[600] text-[rgba(17,17,16,0.5)] tracking-[0.06em] mb-2.5">
                    Which service do you need?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(AVAILABLE_SERVICES || []).map(srv => {
                      const isSelected = selectedService === srv;
                      return (
                        <button
                          key={srv}
                          onClick={() => setSelectedService(isSelected ? '' : srv)}
                          className={`rounded-[100px] px-3.5 py-1.5 text-[13px] transition-all duration-150 inline-flex items-center gap-1.5
                            ${isSelected 
                              ? 'bg-[rgba(27,107,47,0.08)] border border-[rgba(27,107,47,0.35)] text-[#1B6B2F] font-[600]' 
                              : 'bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.65)] font-[500] hover:bg-[#f0efeb]'
                            }`}
                        >
                          {isSelected && <Check size={11} strokeWidth={3} />}
                          {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[12px] font-[600] text-[rgba(17,17,16,0.5)] tracking-[0.06em] mb-2">
                    Any specific details? (optional)
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    placeholder="e.g. I need GST registration for my new business in Maharashtra"
                    className="w-full bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] p-3 text-[14px] text-[#111110] resize-none font-sans focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] outline-none transition-all"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={closeRequestModal}
                    className="h-[44px] px-5 rounded-[100px] border border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.55)] text-[14px] font-[500] hover:bg-[rgba(17,17,16,0.02)] transition-colors w-1/3"
                  >
                    Cancel
                  </button>
                  <div className="flex-1 flex flex-col relative">
                    <button
                      onClick={handleRequestSubmit}
                      disabled={!selectedService || isSubmitting}
                      className={`h-[44px] rounded-[100px] text-white text-[14px] font-[700] transition-all duration-200 flex items-center justify-center w-full
                        ${(!selectedService || isSubmitting) ? 'bg-[#1B6B2F] opacity-45 cursor-not-allowed' : 'bg-[#1B6B2F] hover:bg-[#155526] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(27,107,47,0.25)]'}`}
                    >
                      {isSubmitting ? (
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                        </div>
                      ) : (
                        "Submit Request →"
                      )}
                    </button>
                    {submitError && (
                      <div className="absolute top-[100%] left-0 w-full mt-2 text-center">
                        <div className="text-[12px] text-[#DC2626] mb-1">Something went wrong.</div>
                        <button 
                          onClick={() => window.open(`https://wa.me/917683002685?text=${encodeURIComponent(whatsAppMsg)}`, '_blank')}
                          className="text-[13px] text-[#25D366] font-[600] hover:underline"
                        >
                          WhatsApp us directly →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-6 relative">
                <svg className="w-14 h-14 mb-4" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="animated-check-circle" cx="28" cy="28" r="26" stroke="#F4831F" strokeWidth="4" fill="transparent" />
                  <path className="animated-check-tick" d="M16 28L24 36L40 20" stroke="#1B6B2F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
                </svg>
                <h2 className="text-[22px] font-[800] text-[#111110] mt-4">Request Submitted!</h2>
                <p className="text-[14px] text-[rgba(17,17,16,0.5)] max-w-[300px] mt-2 mb-6">
                  Our team will reach out within 48 hours to get your <strong className="font-[600] text-[#111110]">{selectedService}</strong> started.
                </p>
                
                <div className="flex flex-col gap-3 w-full mb-4">
                  <button 
                    onClick={closeRequestModal}
                    className="h-[44px] rounded-[100px] text-[#111110] text-[14px] font-[600] hover:bg-[rgba(17,17,16,0.04)] transition-colors w-full"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/917683002685?text=${encodeURIComponent(whatsAppMsg)}`, '_blank')}
                    className="text-[13px] text-[#25D366] font-[600] hover:underline"
                  >
                    WhatsApp us to expedite →
                  </button>
                </div>
                <div className="text-[11px] text-[rgba(17,17,16,0.3)]">
                  Closing in {countdown}...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
