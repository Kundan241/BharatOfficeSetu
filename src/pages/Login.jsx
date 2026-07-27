import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, X as XIcon, Check } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { login, sendSetPasswordEmail } from '../services/auth';
import { useAuth } from '../components/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [loginRole, setLoginRole] = useState('client'); // 'client' | 'partner'


  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrorField('email');
      setErrorMessage('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorField('email');
      setErrorMessage('Please enter a valid email');
      return;
    }
    if (!password) {
      setErrorField('password');
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);
    setErrorField('');
    setErrorMessage('');

    try {
      const result = await login(email, password);
      
      if (!result) {
        setLoading(false);
        setErrorField('password');
        setErrorMessage('Authentication failed.');
        return;
      }

      if (result.error) {
        setLoading(false);
        setErrorField('password');
        setErrorMessage(result.error);
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }

      const uid = result.user.uid;
      let userRole = null;
      let userData = null;

      // 1. Check Admin
      try {
        const adminEmails = ['admin@bos.com', 'mu8ndan@gmail.com'];
        const adminSnap = await getDoc(doc(db, 'admins', uid));
        if (adminSnap.exists() || adminEmails.includes(result.user.email)) { 
          userRole = 'admin'; 
        }
      } catch(e) { /* Ignore read error */ }

      // 2. Check Partner (if not admin)
      if (!userRole) {
        try {
          const partnerSnap = await getDoc(doc(db, 'partners', uid));
          if (partnerSnap.exists()) { 
            userRole = 'partner'; 
            userData = partnerSnap.data(); 
          }
        } catch(e) { /* Ignore read error */ }
      }

      // 3. Check Client (if neither admin nor partner)
      if (!userRole) {
        try {
          const clientSnap = await getDoc(doc(db, 'clients', uid));
          if (clientSnap.exists()) { 
            userRole = 'client'; 
            userData = clientSnap.data(); 
          }
        } catch(e) { /* Ignore read error */ }
      }

      // 4. Final Routing
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'partner' || userRole === 'client') {
        // Check forced password reset flag
        if (userData?.tempPasswordUsed === true) {
          navigate('/change-password', { state: { role: userRole } });
        } else {
          navigate(userRole === 'partner' ? '/partner-dashboard' : '/dashboard');
        }
      } else {
        setErrorMessage('Account setup incomplete. Please contact support.');
        setErrorField('password');
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
      setErrorField('password');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    setLoadingForgot(true);
    setForgotError('');
    setForgotSuccess(false);
    
    try {
      const result = await sendSetPasswordEmail(forgotEmail);
      if (result && result.error) {
        setForgotError(result.error);
      } else {
        setForgotSuccess(true);
        setTimeout(() => setShowForgotModal(false), 3000);
      }
    } catch (err) {
      setForgotError('Something went wrong. Please try again.');
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <>
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
      <div className="min-h-screen bg-[#F4F3EE] flex flex-col items-center pt-[10vh] px-4 font-sans relative">
        <div className="absolute top-8 w-full px-8 flex justify-center sm:justify-start">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Bharat Office Setu Logo" className="h-8 object-contain" />
          </Link>
        </div>

        <div className="w-full max-w-[400px] bg-white rounded-[20px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative z-10 fade-up-enter">
          <h1 className="font-display text-2xl font-bold text-[#111110] mb-2">Welcome back</h1>
          <p className="text-[14px] text-[rgba(17,17,16,0.45)] mb-6">Log in to your BOS account</p>

          <div className="flex bg-[#F9F8F5] p-1 rounded-[12px] mb-8 relative">
            <button
              type="button"
              onClick={() => setLoginRole('client')}
              className={`flex-1 h-10 rounded-[10px] text-[13px] font-[600] transition-all z-10 ${loginRole === 'client' ? 'bg-white text-[#1B6B2F] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-[rgba(17,17,16,0.45)] hover:text-[#111110]'}`}
            >
              Client Login
            </button>
            <button
              type="button"
              onClick={() => setLoginRole('partner')}
              className={`flex-1 h-10 rounded-[10px] text-[13px] font-[600] transition-all z-10 ${loginRole === 'partner' ? 'bg-white text-[#1B6B2F] shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'text-[rgba(17,17,16,0.45)] hover:text-[#111110]'}`}
            >
              Partner Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#111110]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 bg-[#F9F8F5] border rounded-[10px] px-4 text-[14px] outline-none transition-colors duration-200
                  ${errorField === 'email' ? 'border-[#DC2626]' : 'border-[rgba(17,17,16,0.1)] focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)]'}`}
              />
              {errorField === 'email' && (
                <span className="text-[12px] text-[#DC2626] mt-1">{errorMessage}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-[#111110]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[13px] font-medium text-[#F4831F] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 bg-[#F9F8F5] border rounded-[10px] pl-4 pr-10 text-[14px] outline-none transition-colors duration-200
                    ${errorField === 'password' ? 'border-[#DC2626]' : 'border-[rgba(17,17,16,0.1)] focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)]'}
                    ${errorField === 'password' && shake ? 'shake-animation' : ''}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errorField === 'password' && (
                <span className="text-[12px] text-[#DC2626] mt-1">{errorMessage}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-[#1B6B2F] text-white rounded-[100px] font-bold text-[15px] hover:bg-[#145324] transition-all duration-200 hover:-translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                </div>
              ) : (
                "Log In →"
              )}
            </button>
          </form>

          <div className="h-[1px] bg-[rgba(17,17,16,0.06)] w-full my-6"></div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <span className="text-[13px] text-[rgba(17,17,16,0.45)]">Don't have an account? </span>
              <span 
                onClick={() => window.open('https://wa.me/917683002685', '_blank')}
                className="text-[#25D366] font-[600] cursor-pointer hover:underline"
              >
                Contact us on WhatsApp
              </span>
            </div>
            <div className="text-center text-[13px] text-[rgba(17,17,16,0.45)]">
              Need help? <a href="https://wa.me/917683002685" target="_blank" rel="noreferrer" className="text-[#1B6B2F] font-medium hover:underline">WhatsApp us</a>
            </div>
          </div>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[rgba(255,255,255,0.4)] backdrop-blur-sm" onClick={() => setShowForgotModal(false)}></div>
            <div className="bg-white rounded-[20px] p-8 w-full max-w-[400px] relative z-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] fade-up-enter">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-5 right-5 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
              >
                <XIcon size={20} />
              </button>
              
              {forgotSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <div className="w-12 h-12 bg-[rgba(27,107,47,0.1)] rounded-full flex items-center justify-center mb-4 text-[#1B6B2F]">
                    <Check size={24} />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111110] mb-2">Reset link sent!</h2>
                  <p className="text-[14px] text-[#1B6B2F]">Check your inbox and follow the link</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-[#111110] mb-2">Reset your password</h2>
                  <p className="text-[13px] text-[rgba(17,17,16,0.45)] mb-6">Enter your email and we'll send you a link to reset your password.</p>
                  
                  <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Email Address"
                      className="h-12 bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-4 text-[14px] outline-none focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)] transition-colors"
                    />
                    {forgotError && (
                      <span className="text-[12px] text-[#DC2626]">{forgotError}</span>
                    )}
                    <button
                      type="submit"
                      disabled={loadingForgot}
                      className="h-12 bg-[#1B6B2F] text-white rounded-[100px] font-bold text-[14px] hover:bg-[#145324] transition-all hover:-translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
                    >
                      {loadingForgot ? (
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></span>
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
