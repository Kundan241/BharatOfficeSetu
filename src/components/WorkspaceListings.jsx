import React, { useState, useEffect, useRef } from 'react';
import './WorkspaceListings.css';

const listingsData = [
  {
    id: 'mh-001',
    name: 'Premium Coworking at Goregaon',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Coworking',
    price: '15,000',
    priceUnit: 'yr',
    features: ['WiFi', 'GST Address', 'Meeting Room'],
    image: '/images/listings/goregaon.jpg',
    available: true
  },
  {
    id: 'mh-002',
    name: 'Aesthetic Workspace at Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Coworking',
    price: '16,000',
    priceUnit: 'yr',
    features: ['WiFi', 'GST Address', 'Cafeteria'],
    image: '/images/listings/bandra.jpg',
    available: true
  },
  {
    id: 'gj-001',
    name: 'Dependable Workspace Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'Managed Office',
    price: '14,000',
    priceUnit: 'yr',
    features: ['WiFi', 'Parking', 'GST Address'],
    image: '/images/listings/navrangpura.jpg',
    available: true
  }
];

const categories = ['All', 'Coworking', 'Virtual Office', 'Managed Office', 'Private Cabin'];

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4831F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BuildingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(17,17,16,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"></path>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"></path>
  </svg>
);

const SkeletonImage = () => (
  <div className="skeleton-loader w-full h-full absolute inset-0 z-0 bg-[#F4F3EE] flex items-center justify-center">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5D9B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  </div>
);

const WorkspaceListings = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredListings, setFilteredListings] = useState(listingsData);
  const scrollRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Initial scroll hint
    const timer1 = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 120, behavior: 'smooth' });
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }, 700);
      }
    }, 1200);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    // Filter logic
    if (activeFilter === 'All') {
      setFilteredListings(listingsData);
    } else {
      setFilteredListings(listingsData.filter(l => l.type === activeFilter));
    }
    
    // Scroll back to left
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeFilter]);

  useEffect(() => {
    // Intersection Observer for scroll animation
    const container = observerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.listing-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(container);

    return () => {
      if (container) observer.unobserve(container);
    };
  }, [filteredListings]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth > 767 ? 300 : window.innerWidth * 0.75;
      const gap = 20;
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = window.innerWidth > 767 ? 300 : window.innerWidth * 0.75;
      const gap = 20;
      scrollRef.current.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
    }
  };

  const openWhatsApp = (listing, isWaitlist = false) => {
    const phone = '917683002685';
    let message = '';
    
    if (isWaitlist) {
      message = `Hi Bharat Office Setu! I'd like to join the waitlist for:\n\n` +
        `📍 *${listing.name}*\n` +
        `🏙️ ${listing.city}, ${listing.state}\n` +
        `🏢 Type: ${listing.type}\n` +
        `💰 Price: ₹${listing.price}/${listing.priceUnit}\n\n` +
        `Please let me know when a space opens up.`;
    } else {
      message = `Hi Bharat Office Setu! I'm interested in this workspace:\n\n` +
        `📍 *${listing.name}*\n` +
        `🏙️ ${listing.city}, ${listing.state}\n` +
        `🏢 Type: ${listing.type}\n` +
        `💰 Price: ₹${listing.price}/${listing.priceUnit}\n\n` +
        `Please share availability and next steps.`;
    }
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const scrollToConsultation = () => {
    const formSection = document.getElementById('consultation-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      // Logic to pre-select 'Coworking Spaces' chip would go here if accessible via state/event
    }
  };

  return (
    <section className="workspace-section">
      <div className="workspace-header-container">
        <div className="our-spaces-pill">OUR SPACES</div>
        <h2 className="workspace-headline">
          <span className="text-dark">Bridging Your Business to</span><br />
          <span className="text-accent">India's Finest Workspaces.</span>
        </h2>
        <p className="workspace-subtext">
          Premium coworking, private cabins, virtual offices and managed spaces — ready when you are
        </p>
        
        <div className="filter-row">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="listings-wrapper" ref={observerRef}>
        <button className="nav-arrow left-arrow" onClick={handleScrollLeft} aria-label="Scroll left">
          <ChevronLeft />
        </button>
        
        <div className="listings-container" ref={scrollRef} role="region" aria-label="Workspace listings">
          {filteredListings.length === 0 ? (
            <div className="empty-state">
              <BuildingIcon />
              <p>No spaces available in this category yet</p>
              <button className="view-all-link" onClick={() => setActiveFilter('All')}>
                View all spaces &rarr;
              </button>
            </div>
          ) : (
            filteredListings.map((listing) => {
              const ImageComponent = () => {
                const [loaded, setLoaded] = useState(false);
                const [error, setError] = useState(false);
                
                return (
                  <>
                    {!loaded && !error && <SkeletonImage />}
                    {error && (
                      <div className="w-full h-full absolute inset-0 z-0 bg-[#F4F3EE] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C5D9B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                        </svg>
                      </div>
                    )}
                    <img 
                      src={listing.image} 
                      alt={listing.name} 
                      onLoad={() => setLoaded(true)}
                      onError={() => { setLoaded(true); setError(true); }}
                      className={`listing-img ${loaded && !error ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </>
                );
              };

              return (
                <div key={listing.id} className="listing-card" tabIndex="0">
                  <div className="card-image-section">
                    <ImageComponent />
                    <div className="type-badge">{listing.type.toUpperCase()}</div>
                    <div className={`availability-badge ${listing.available ? 'available' : 'unavailable'}`}>
                      {listing.available ? 'Available' : 'Full'}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="location-line">
                      <PinIcon />
                      <span>{listing.city}, {listing.state}</span>
                    </div>
                    <h3 className="listing-name">{listing.name}</h3>
                    <div className="feature-pills">
                      {listing.features.map(feat => (
                        <span key={feat} className="feature-pill">{feat}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="price-container">
                      <div className="price">₹{listing.price}</div>
                      <div className="price-unit">/{listing.priceUnit}</div>
                    </div>
                    <button 
                      className={`book-now-btn ${!listing.available ? 'waitlist-btn' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(listing, !listing.available);
                      }}
                      aria-label={`${listing.available ? 'Book' : 'Waitlist for'} ${listing.name} on WhatsApp`}
                    >
                      {listing.available ? 'Book Now \u2192' : 'Join Waitlist'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <button className="nav-arrow right-arrow" onClick={handleScrollRight} aria-label="Scroll right">
          <ChevronRight />
        </button>
      </div>

      <div className="workspace-bottom-cta">
        <p>Exploring a specific city?</p>
        <button className="see-all-locations" onClick={scrollToConsultation}>
          See All Locations &rarr;
        </button>
      </div>
    </section>
  );
};

export default WorkspaceListings;
