import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/ToastContext';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0); // 0 to 4
  const [matchError, setMatchError] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    setStrength(s);
    
    if (confirmPassword && password !== confirmPassword) {
      setMatchError(true);
    } else {
      setMatchError(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 2) {
      addToast('error', 'Please choose a stronger password.');
      return;
    }
    if (password !== confirmPassword) {
      setMatchError(true);
      return;
    }
    
    setLoading(true);

    try {
      await new Promise(r => setTimeout(r, 1000));
      // Call service layer to set password
      addToast('success', 'Password set successfully.');
      navigate('/dashboard');
    } catch {
      addToast('error', 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-[#E5E7EB]', 'bg-[#DC2626]', 'bg-[#F59E0B]', 'bg-[#FBBF24]', 'bg-[#1B6B2F]'];

  return (
    <div className="min-h-screen bg-[#F4F3EE] flex flex-col items-center pt-[10vh] px-4 font-sans relative">
      <div className="absolute top-8 w-full px-8 flex justify-center sm:justify-start">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Bharat Office Setu Logo" className="h-8 object-contain" />
        </Link>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-[20px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative z-10 fade-up-enter">
        <h1 className="font-display text-2xl font-bold text-[#111110] mb-2">Create Your Password</h1>
        <p className="text-[14px] text-[rgba(17,17,16,0.45)] mb-8">Set a password for your BOS account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-semibold text-[#111110]">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] pl-4 pr-10 text-[14px] outline-none focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)] transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="h-1 flex-1 rounded-full overflow-hidden bg-[rgba(17,17,16,0.06)]">
                    <div 
                      className={`h-full w-full transition-transform duration-500 origin-left
                        ${strength >= num ? strengthColors[strength] : 'scale-x-0'}
                      `}
                    ></div>
                  </div>
                ))}
              </div>
              <span className={`text-[12px] font-medium transition-colors duration-300
                ${strength === 0 ? 'text-[rgba(17,17,16,0.4)]' : ''}
                ${strength === 1 ? 'text-[#DC2626]' : ''}
                ${strength === 2 ? 'text-[#F59E0B]' : ''}
                ${strength === 3 ? 'text-[#FBBF24]' : ''}
                ${strength === 4 ? 'text-[#1B6B2F]' : ''}
              `}>
                {strength === 0 ? 'Enter a password' : strengthLabels[strength]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-semibold text-[#111110]">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full h-12 bg-[#F9F8F5] border rounded-[10px] pl-4 pr-10 text-[14px] outline-none transition-colors duration-200
                  ${matchError ? 'border-[#DC2626]' : 'border-[rgba(17,17,16,0.1)] focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)]'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {matchError && (
              <span className="text-[12px] text-[#DC2626] mt-1">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] mt-2 bg-[#1B6B2F] text-white rounded-[100px] font-bold text-[15px] hover:bg-[#145324] transition-all duration-200 hover:-translate-y-[1px] disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full pulsing-dot"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full pulsing-dot"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full pulsing-dot"></span>
              </div>
            ) : (
              "Set Password & Access Dashboard →"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-[13px] text-[#F4831F] font-medium hover:underline">
            Already have a password? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
