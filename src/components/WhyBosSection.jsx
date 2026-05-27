import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));
const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

const useCountUp = (target, duration = 1500, shouldStart) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(eased * target));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldStart, target, duration]);
  
  return count;
};

class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(139,195,74,0.1)',
            border: '1px solid rgba(139,195,74,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            🏢
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px'
          }}>
            Interactive experience unavailable
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const RobotPlaceholder = () => (
  <div className="spline-loading-placeholder">
    <svg 
      className="animated-robot-outline" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="30" width="60" height="50" rx="10" />
      <circle cx="35" cy="50" r="6" />
      <circle cx="65" cy="50" r="6" />
      <path d="M40 70 h20" strokeLinecap="round" />
      <path d="M50 30 v-15" />
      <circle cx="50" cy="10" r="5" />
    </svg>
    <div className="loading-text">
      Loading 3D experience
      <span className="loading-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    </div>
  </div>
);

export default function WhyBosSection() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const states = useCountUp(36, 1500, shouldLoad);
  const cities = useCountUp(150, 1650, shouldLoad);
  const clients = useCountUp(5000, 1800, shouldLoad);

  return (
    <section id="why-bos" ref={sectionRef} className={shouldLoad ? 'section-visible' : ''}>
      <div className="section-fade-top" />
      
      <div className="bg-texture" aria-hidden="true" />
      
      <div className="content-grid">
        <div className="text-column">
          <span className="pill-badge">POWERED BY AI · BUILT FOR INDIA</span>
          <h2 className="headline">
            Stop doing the <br/>
            boring stuff in <br/>
            this <span className="highlight">AI era.
              <svg className="underline-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 Q25,10 50,5 T100,5" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="subheadline">
            We handle compliance, offices
            and registrations — you grow.
          </p>
          <div className="feature-chips">
            <span className="chip"><span className="chip-check">✓</span> GST in 48hrs</span>
            <span className="chip"><span className="chip-check">✓</span> Pan-India Offices</span>
            <span className="chip"><span className="chip-check">✓</span> Company Setup</span>
          </div>
          <div className="cta-row">
            <button className="btn-primary" onClick={() => document.querySelector('#consultation')?.scrollIntoView({ behavior: 'smooth' })}>Get Started →</button>
            <a href="#services" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>See Services</a>
          </div>
          <div className="trust-line" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#F4831F', fontSize: '14px' }}>⭐⭐⭐⭐⭐</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>4.9/5 from 500+ verified clients</span>
          </div>
        </div>
        
        <div className="robot-column">
          <div className="glow-bg" aria-hidden="true" />
          <div className={`spline-wrapper ${isLoaded ? 'spline-loaded' : ''}`}>
            <SplineErrorBoundary>
              <Suspense fallback={<RobotPlaceholder />}>
                {shouldLoad && (
                  <Spline
                    scene={SCENE_URL}
                    style={{ width: '100%', height: '100%' }}
                    onLoad={() => setIsLoaded(true)}
                  />
                )}
              </Suspense>
            </SplineErrorBoundary>
          </div>
        </div>
      </div>
      
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">{states}+</span>
          <span className="stat-label">STATES</span>
        </div>
        <div className="stat-separator" />
        <div className="stat">
          <span className="stat-number">{cities}+</span>
          <span className="stat-label">CITIES</span>
        </div>
        <div className="stat-separator" />
        <div className="stat">
          <span className="stat-number">{clients.toLocaleString()}+</span>
          <span className="stat-label">CLIENTS</span>
        </div>
      </div>
      
      <div className="section-fade-bottom" />
    </section>
  );
}
