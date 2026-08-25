import React, { useState, useEffect, useRef } from 'react';
import './WorkspaceListings.css';

const verifiedSpaces = [
  {
    id: 1,
    category: "Coworking",
    title: "Premium Coworking at Goregaon",
    location: "Mumbai, Maharashtra",
    price: "₹15,000/yr",
    amenities: ["WIFI", "GST Address", "Meeting Room"],
    imageUrl: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80" // Dummy photo
  },
  {
    id: 2,
    category: "Coworking",
    title: "Aesthetic Workspace at Bandra",
    location: "Mumbai, Maharashtra",
    price: "₹16,000/yr",
    amenities: ["WIFI", "GST Address", "Cafeteria"],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" // Dummy photo
  },
  {
    id: 3,
    category: "Managed Office",
    title: "Dependable Workspace Navrangpura",
    location: "Ahmedabad, Gujarat",
    price: "₹14,000/yr",
    amenities: ["WIFI", "Parking", "GST Address"],
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80" // Dummy photo
  },
  {
    id: 4,
    category: "Private Cabin",
    title: "Executive Private Cabin",
    location: "Mumbai, Maharashtra",
    price: "₹25,000/mo",
    amenities: ["High-Speed WIFI", "24/7 Access", "AC"],
    imageUrl: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80" // Dummy photo
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
  const [filteredListings, setFilteredListings] = useState(verifiedSpaces);
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
      setFilteredListings(verifiedSpaces);
    } else {
      setFilteredListings(verifiedSpaces.filter(l => l.category === activeFilter));
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
        `📍 *${listing.title}*\n` +
        `🏙️ ${listing.location}\n` +
        `🏢 Type: ${listing.category}\n` +
        `💰 Price: ${listing.price}\n\n` +
        `Please let me know when a space opens up.`;
    } else {
      message = `Hi Bharat Office Setu! I'm interested in this workspace:\n\n` +
        `📍 *${listing.title}*\n` +
        `🏙️ ${listing.location}\n` +
        `🏢 Type: ${listing.category}\n` +
        `💰 Price: ${listing.price}\n\n` +
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
          <span className="text-dark">Verified Business Premises for</span><br />
          <span className="text-accent">Physical &amp; Virtual Offices</span>
        </h2>
        <p className="workspace-subtext">
          We facilitate documented use of verified shared business premises.
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
                      src={listing.imageUrl} 
                      alt={listing.title} 
                      onLoad={() => setLoaded(true)}
                      onError={() => { setLoaded(true); setError(true); }}
                      className={`listing-img ${loaded && !error ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </>
                );
              };

              return (
                <div key={listing.id} className="listing-card" tabIndex="0">
                  <div className="card-image-section relative">
                    <ImageComponent />
                    <div className="type-badge">{listing.category.toUpperCase()}</div>
                    <div className={`availability-badge ${listing.available !== false ? 'available' : 'unavailable'}`}>
                      {listing.available !== false ? 'Available' : 'Full'}
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute bottom-3 right-3 bg-white rounded-full p-[2px] shadow-sm flex items-center justify-center z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" className="w-6 h-6">
                        <path d="M11.99 2C7.52 2 4 5.52 4 9.99c0 1.94.69 3.71 1.83 5.09l-.79 3.73 3.82-1.07A7.95 7.95 0 0011.99 18c4.47 0 8-3.52 8-7.99S16.46 2 11.99 2zm-1 11.41L7.5 10l1.41-1.41 2.09 2.09 4.09-4.09L16.5 8l-5.51 5.41z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="location-line">
                      <PinIcon />
                      <span>{listing.location}</span>
                    </div>
                    <h3 className="listing-name">{listing.title}</h3>
                    <div className="feature-pills">
                      {listing.amenities.map(feat => (
                        <span key={feat} className="feature-pill">{feat}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="price-container">
                      <div className="price">{listing.price}</div>
                    </div>
                    <button 
                      className={`book-now-btn ${listing.available === false ? 'waitlist-btn' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(listing, listing.available === false);
                      }}
                      aria-label={`${listing.available !== false ? 'Book' : 'Waitlist for'} ${listing.title} on WhatsApp`}
                    >
                      {listing.available !== false ? 'Book Now \u2192' : 'Join Waitlist'}
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
