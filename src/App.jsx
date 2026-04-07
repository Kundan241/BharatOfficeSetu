import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import FooterBanner from './components/FooterBanner'

function App() {
  return (
    <div className="min-h-screen" style={{ background: "#0a1628", color: "#e2e8f0" }}>
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
