import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useToast } from '../components/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const role = location.state?.role || 'client'; // 'client' or 'partner'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in. Please log in again.');
      }

      await updatePassword(user, newPassword);

      // Update Firestore document
      const collectionName = role === 'partner' ? 'partners' : 'clients';
      await updateDoc(doc(db, collectionName, user.uid), {
        tempPasswordUsed: false
      });

      addToast('success', 'Password updated successfully!');
      
      // Navigate to respective dashboard
      if (role === 'partner') {
        navigate('/partner-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Change Password Error:', err);
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] flex flex-col items-center pt-[10vh] px-4 font-sans relative">
      <div className="w-full max-w-[400px] bg-white rounded-[20px] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative z-10 fade-up-enter">
        <h1 className="font-display text-2xl font-bold text-[#111110] mb-2">Change Password</h1>
        <p className="text-[14px] text-[rgba(17,17,16,0.45)] mb-6">Please set a new password to secure your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-semibold text-[#111110]">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] pl-4 pr-10 text-[14px] outline-none focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)] transition-colors duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-semibold text-[#111110]">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] pl-4 pr-10 text-[14px] outline-none focus:border-[#1B6B2F] focus:shadow-[0_0_0_2px_rgba(27,107,47,0.1)] transition-colors duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(17,17,16,0.4)] hover:text-[#111110] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-[12px] text-[#DC2626]">{error}</div>
          )}

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
              "Update Password →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
