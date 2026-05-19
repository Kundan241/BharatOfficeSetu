import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Check, X, Info, X as XIcon } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in
              ${toast.type === 'success' ? 'bg-[#1B6B2F] text-white' : ''}
              ${toast.type === 'error' ? 'bg-[#DC2626] text-white' : ''}
              ${toast.type === 'info' ? 'bg-[#111110] text-white' : ''}
            `}
            style={{
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {toast.type === 'success' && <Check size={18} />}
            {toast.type === 'error' && <X size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span className="text-[13px] font-medium leading-tight">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
            >
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
