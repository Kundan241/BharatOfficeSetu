import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyBosSection from './components/WhyBosSection'
import WorkspaceListings from './components/WorkspaceListings'
import FreeConsultation from './components/FreeConsultation'
import Services from './components/Services'
import InfoSections from './components/InfoSections'
import BlogPreview from './components/BlogPreview'
import FooterBanner from './components/FooterBanner'
import WhatsAppWidget from './components/WhatsAppWidget'

import { ToastProvider } from './components/ToastContext'
import { AuthProvider } from './components/AuthContext'

import Login from './pages/Login'
import SetPassword from './pages/SetPassword'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

import BlogListing from './pages/BlogListing'
import BlogPost from './pages/BlogPost'
import DraftGenerator from './pages/DraftGenerator'

function LandingPage() {
  return (
    <div className="bg-[var(--color-bg-warm)] text-[var(--color-text-dark)]">
      <Navbar />
      <main>
        <Hero />
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
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/blog" element={<BlogListing />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/drafts" element={<DraftGenerator />} />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
