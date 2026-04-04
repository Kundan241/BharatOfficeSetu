import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import FooterBanner from './components/FooterBanner'

function App() {
  return (
    <div className="min-h-screen font-sans bg-forest-cream smooth-scroll selection:bg-forest-mint selection:text-forest">
      <Navbar />
      <main>
        <Hero />
        <Services />
      </main>
      <FooterBanner />
    </div>
  )
}

export default App
