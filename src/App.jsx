import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FreeConsultation from './components/FreeConsultation'
import Services from './components/Services'
import InfoSections from './components/InfoSections'
import FooterBanner from './components/FooterBanner'
import WhatsAppWidget from './components/WhatsAppWidget'

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-warm)] text-[var(--color-text-dark)]">
      <Navbar />
      <main>
        <Hero />
        <FreeConsultation />
        <Services />
        <InfoSections />
      </main>
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  )
}

export default App
