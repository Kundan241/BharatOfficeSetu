import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Check if the user is on an iOS device
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Check if app is already installed/running in standalone mode
    const isStandalone = () => {
      return ('standalone' in window.navigator && window.navigator.standalone) || 
             window.matchMedia('(display-mode: standalone)').matches;
    };

    // Show banner for iOS if not installed
    if (isIos() && !isStandalone()) {
      setIsIOSDevice(true);
      setShowBanner(true);
    }

    // Capture the beforeinstallprompt event for Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      console.log('PWA was installed successfully');
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // Handling iOS specifically since it doesn't support programmatic install prompts
    if (isIOSDevice) {
      alert('To install the BOS Portal App on iOS, tap the Share icon at the bottom of Safari, then scroll down and tap "Add to Home Screen".');
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Show the native install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
      setShowBanner(false);
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[9999] flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 max-w-lg mx-auto transform transition-all">
      <div className="flex items-center gap-3">
        <img 
          src="/logo.png" 
          alt="BOS Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain" 
        />
        <div className="flex flex-col">
          <span className="text-[#111110] font-bold text-sm sm:text-base leading-tight">
            BOS Portal App
          </span>
          <span className="text-[#4A4A4A] text-[11px] sm:text-xs max-w-[170px] sm:max-w-xs leading-snug mt-0.5">
            Install for instant dashboard access & faster updates
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstallClick}
          className="bg-[#1B6B2F] text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg shadow-sm hover:bg-[#155424] active:scale-95 transition-all whitespace-nowrap"
        >
          Install Now
        </button>
        <button 
          onClick={handleClose} 
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-1"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
