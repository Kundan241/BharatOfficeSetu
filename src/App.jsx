import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ServicesShowcase from './components/ServicesShowcase'
import ClientLogosTicker from './components/ClientLogosTicker'
import WhyBosSection from './components/WhyBosSection'
import WorkspaceListings from './components/WorkspaceListings'
import FreeConsultation from './components/FreeConsultation'
import Services from './components/Services'
import InfoSections from './components/InfoSections'
import BlogPreview from './components/BlogPreview'
import FooterBanner from './components/FooterBanner'
import WhatsAppWidget from './components/WhatsAppWidget'
import PWAInstallPrompt from './components/PWAInstallPrompt'

import { ToastProvider } from './components/ToastContext'
import { AuthProvider } from './components/AuthContext'

import Login from './pages/Login'
import SetPassword from './pages/SetPassword'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import PartnerDashboard from './pages/PartnerDashboard'

import BlogListing from './pages/BlogListing'
import BlogPost from './pages/BlogPost'
import DraftGenerator from './pages/DraftGenerator'
import ChangePassword from './pages/ChangePassword'

import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import NotFound from './pages/NotFound'
import { applySeoMeta } from './utils/seo'

function LandingPage() {
  useEffect(() => {
    applySeoMeta({
      title: 'Bharat Office Setu | Virtual Offices, GST Registration & Compliance',
      description: 'Bharat Office Setu provides compliant virtual offices for GST and MCA company registration, coworking spaces, and end-to-end business compliance across 28+ Indian states.',
      url: 'https://www.bharatofficesetu.com/',
      image: 'https://www.bharatofficesetu.com/logo.png',
      type: 'website',
    });
  }, []);

  return (
    <div className="bg-[var(--color-bg-warm)] text-[var(--color-text-dark)]">
      <Navbar />
      <main>
        {/* 1. The Interactive India Map Section */}
        <Hero />

        {/* 2. ADD THIS HERE: The New Services Carousel */}
        <ServicesShowcase />

        {/* Client Logos Bulletin Marquee */}
        <ClientLogosTicker />

        {/* 3. The Dark Green "Stop doing the boring stuff" Section */}
        <WhyBosSection />

        <WorkspaceListings />
        <FreeConsultation />
        <Services />
        <BlogPreview />
        <InfoSections />
      </main>
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen">
            <PWAInstallPrompt />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/blog" element={<BlogListing />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/partner-dashboard" element={<PartnerDashboard />} />
              <Route path="/admin/*" element={<Admin />} />
              
              <Route path="/drafts" element={<DraftGenerator />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
