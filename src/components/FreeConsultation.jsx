import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

const PREDEFINED_SERVICES = [
  "Coworking Spaces", "Managed Offices", "Virtual Offices", 
  "Company Incorporation", "GST Registration", "Legal Advisory", 
  "Tax & Accounting", "Payroll & HR", "BPO/KPO Enablement", 
  "IT Infrastructure", "Facility Management", "Business Consulting", 
  "Branding & Marketing", "Market Entry Advisory", "Ecosystem Partnerships"
];

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+61', flag: '🇸🇬' },
];

export default function FreeConsultation() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedServices, setSelectedServices] = useState([]);
  
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
    if (errors.services) setErrors(prev => ({ ...prev, services: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim() || formData.phone.length < 7) newErrors.phone = 'Valid phone number is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (selectedServices.length === 0) newErrors.services = 'Please select at least one service';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      name: formData.name,
      phone: `${countryCode} ${formData.phone}`,
      email: formData.email,
      services: selectedServices.join(', '),
      lastHoveredState: window.lastHoveredState || 'None'
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxJsqakzHd4nbETSSWqscn3baHoEPS3lSFJwRsxvPnuo6OLr9ssPWpr2dGJXv-LCnM5gQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });
      // Emulate success state with small delay for smoother transition
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="consultation" className="bg-[#F4F3EE] py-12 md:py-20 px-5 md:px-6 border-t border-[#1B6B2F]/10">
      <div className="max-w-[860px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-[#F4831F]/10 border border-[#F4831F]/20 text-[#F4831F] text-[10px] font-bold tracking-[0.12em] uppercase">
            FREE · NO COMMITMENT · 48HR RESPONSE
          </div>
          <h2 className="text-[32px] md:text-[42px] font-bold text-[#111110] leading-tight tracking-tight">
            Get a Free Consultation
          </h2>
        </div>

        {/* Form Card */}
        <div className="relative bg-white rounded-2xl md:rounded-3xl border border-[#1B6B2F]/10 shadow-[0_8px_32px_-8px_rgba(27,107,47,0.06)] overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-10 lg:p-12"
                onSubmit={handleSubmit}
              >
                {/* 1. Contact Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8 md:mb-10">
                  <div className={`relative ${errors.name ? 'shake-error' : ''}`}>
                    <label className="block text-[11px] font-bold text-[#111110]/60 uppercase tracking-widest mb-2">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full h-12 px-4 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#1B6B2F]/15 bg-[#F9F8F5] hover:border-[#1B6B2F]/30'} focus:outline-none focus:ring-1 focus:ring-[#1B6B2F]/50 transition-colors text-[14px] text-[#111110] placeholder:text-[#111110]/30`}
                    />
                    {errors.name && <span className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-medium">{errors.name}</span>}
                  </div>

                  <div className={`relative ${errors.phone ? 'shake-error' : ''}`}>
                    <label className="block text-[11px] font-bold text-[#111110]/60 uppercase tracking-widest mb-2">Phone</label>
                    <div className="flex relative">
                      <button 
                        type="button"
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        className={`h-12 pl-3 pr-2 flex items-center gap-1.5 rounded-l-xl border-y border-l ${errors.phone ? 'border-red-400 bg-red-50' : 'border-[#1B6B2F]/15 bg-[#F9F8F5] hover:bg-[#E8F0E0]/50'} transition-colors flex-shrink-0 focus:outline-none`}
                      >
                        <span className="text-sm">{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                        <span className="text-[13px] font-medium text-[#111110]">{countryCode}</span>
                        <ChevronDown className="w-3 h-3 text-[#111110]/40" />
                      </button>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98765 43210"
                        className={`w-full h-12 px-3 rounded-r-xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-[#1B6B2F]/15 bg-[#F9F8F5] hover:border-[#1B6B2F]/30'} focus:outline-none focus:ring-1 focus:ring-[#1B6B2F]/50 transition-colors text-[14px] text-[#111110] placeholder:text-[#111110]/30`}
                      />
                      {/* Dropdown */}
                      <AnimatePresence>
                        {isCountryDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-40 md:hidden bg-black/20" onClick={() => setIsCountryDropdownOpen(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-14 left-0 w-full md:w-[120px] bg-white border border-[#1B6B2F]/10 rounded-xl shadow-lg z-50 overflow-hidden md:top-[52px]"
                            >
                              {COUNTRY_CODES.map(c => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => { setCountryCode(c.code); setIsCountryDropdownOpen(false); }}
                                  className="w-full flex items-center gap-2 px-4 py-3 md:py-2 hover:bg-[#F9F8F5] transition-colors text-left"
                                >
                                  <span className="text-base md:text-sm">{c.flag}</span>
                                  <span className="text-[14px] md:text-[13px] font-medium text-[#111110]">{c.code}</span>
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    {errors.phone && <span className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-medium">{errors.phone}</span>}
                  </div>

                  <div className={`relative ${errors.email ? 'shake-error' : ''}`}>
                    <label className="block text-[11px] font-bold text-[#111110]/60 uppercase tracking-widest mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="hello@company.com"
                      className={`w-full h-12 px-4 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#1B6B2F]/15 bg-[#F9F8F5] hover:border-[#1B6B2F]/30'} focus:outline-none focus:ring-1 focus:ring-[#1B6B2F]/50 transition-colors text-[14px] text-[#111110] placeholder:text-[#111110]/30`}
                    />
                    {errors.email && <span className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-medium">{errors.email}</span>}
                  </div>
                </div>

                {/* 2. Services Row */}
                <div className={`mb-10 md:mb-12 ${errors.services ? 'shake-error' : ''}`}>
                  <label className="flex items-center justify-between text-[11px] font-bold text-[#111110]/60 uppercase tracking-widest mb-3 md:mb-4">
                    <span>What do you need help with?</span>
                    {errors.services && <span className="text-red-500 font-medium normal-case tracking-normal">{errors.services}</span>}
                  </label>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {PREDEFINED_SERVICES.map(service => {
                      const isSelected = selectedServices.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`
                            px-4 py-2 rounded-full text-[12px] md:text-[13px] font-medium transition-all duration-300
                            ${isSelected 
                              ? 'bg-[#1B6B2F] text-white border border-[#1B6B2F] shadow-md scale-[1.02]' 
                              : 'bg-white border border-[#1B6B2F]/15 text-[#111110]/70 hover:border-[#1B6B2F]/40 hover:bg-[#F9F8F5]'
                            }
                          `}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Submit Row */}
                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto min-w-[240px] h-[52px] rounded-xl bg-[#F4831F] hover:bg-[#d67015] text-white font-bold text-[14px] tracking-wide transition-all shadow-[0_4px_14px_rgba(244,131,31,0.3)] hover:-translate-y-0.5 focus:outline-none flex items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white pulsing-dot"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white pulsing-dot"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white pulsing-dot"></span>
                      </div>
                    ) : (
                      "Claim Free Consultation"
                    )}
                  </button>
                  <p className="mt-4 text-[11px] text-[#111110]/40 font-medium">
                    Your details are 100% secure. We hate spam as much as you do.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-10 md:p-16 flex flex-col items-center text-center"
              >
                {/* SVG Success Animation */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 52 52">
                    <circle className="draw-circle" cx="26" cy="26" r="25" fill="none" stroke="#1B6B2F" strokeWidth="2" />
                    <path className="draw-check" fill="none" stroke="#1B6B2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-[#111110] mb-3 font-display">
                  We've Received Your Request!
                </h3>
                <p className="text-[#111110]/60 text-sm md:text-base mb-8 max-w-[400px]">
                  Our workspace experts will reach out to you within the next 48 hours to discuss your customized solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <a href="#services" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#1B6B2F]/20 text-[#1B6B2F] font-bold text-[13px] tracking-wide hover:bg-[#F9F8F5] transition-colors">
                    Explore Services
                  </a>
                  <a href="https://wa.me/917303338423" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M16 3.5C8.82 3.5 3 9.32 3 16.5c0 2.385.652 4.617 1.785 6.528L3.25 28.5l5.648-1.52A12.46 12.46 0 0 0 16 29.5c7.18 0 13-5.82 13-13S23.18 3.5 16 3.5zm-3.944 7.04c.243 0 .494.006.714.012.244.007.568-.086.888.677.336.8 1.14 2.788 1.24 2.99.099.2.165.432.033.696-.133.264-.2.43-.396.664-.198.232-.416.52-.594.698-.198.198-.403.413-.174.81.23.396 1.02 1.682 2.193 2.724 1.508 1.344 2.78 1.76 3.175 1.958.396.2.627.166.858-.1.232-.264.993-1.156 1.258-1.553.264-.396.527-.33.89-.198.363.132 2.306 1.088 2.702 1.286.396.198.66.297.757.463.1.166.1.96-.232 1.888-.33.927-1.95 1.82-2.676 1.887-.727.066-1.41.33-4.76-.99-4.04-1.584-6.585-5.72-6.784-5.983-.198-.264-1.617-2.152-1.617-4.104 0-1.952 1.025-2.912 1.388-3.308.363-.396.793-.495 1.057-.495z"/>
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
