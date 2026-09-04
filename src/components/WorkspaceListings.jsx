import React, { useState, useEffect, useRef } from 'react';
import './WorkspaceListings.css';

const verifiedSpaces = [
  {
    id: 1,
    isVerified: true,
    category: "Managed Office",
    title: "Gurgaon (Haryana) Location",
    location: "Gurgaon, Haryana",
    price: "Starting ₹6,500/mo",
    amenities: ["120 Workstations", "4 Cabins", "Conference", "Cafeteria"],
    images: [
      "/images/listings/Gurgaon(Haryana)_Location/AssetSense.jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.52%20(1).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.52.jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.53%20(1).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.53.jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.54.jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.56%20(1).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.57%20(1).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.57%20(2).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.57%20(3).jpeg",
      "/images/listings/Gurgaon(Haryana)_Location/WhatsApp%20Image%202026-08-07%20at%2018.35.58%20(2).jpeg"
    ]
  },
  {
    id: 2,
    isVerified: true,
    category: "Coworking",
    title: "Kondapur, Hyderabad",
    location: "Kondapur, Hyderabad",
    price: "₹15,000/yr",
    amenities: ["WIFI", "GST Address", "Meeting Room"],
    images: [
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.34%20(1).jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.34%20(2).jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.34.jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.35%20(1).jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.35.jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.36%20(1).jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.36%20(2).jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.36.jpeg",
      "/images/listings/Kondapur,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.37.jpeg"
    ]
  },
  {
    id: 3,
    isVerified: true,
    category: "Coworking",
    title: "Laxmi Nagar, East Delhi",
    location: "Laxmi Nagar, East Delhi",
    price: "₹15,000/yr",
    amenities: ["WIFI", "GST Address", "Meeting Room"],
    images: [
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.00.59%20(1).jpeg",
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.00.59.jpeg",
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.01.00.jpeg",
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.01.01%20(1).jpeg",
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.01.01%20(2).jpeg",
      "/images/listings/Laxmi%20Nagar,East%20Delhi/WhatsApp%20Image%202026-09-01%20at%2017.01.01.jpeg"
    ]
  },
  {
    id: 4,
    isVerified: true,
    category: "Coworking",
    title: "Saket, New Delhi",
    location: "Saket, New Delhi",
    price: "₹16,000/yr",
    amenities: ["WIFI", "GST Address", "Cafeteria"],
    images: [
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.24.jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.25%20(1).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.25.jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.26%20(1).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.26%20(2).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.26.jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.27%20(1).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2012.53.27.jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2013.26.04%20(1).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2013.26.04.jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2013.26.05%20(1).jpeg",
      "/images/listings/Saket,New%20Delhi/WhatsApp%20Image%202026-09-04%20at%2013.26.05.jpeg"
    ]
  },
  {
    id: 5,
    isVerified: true,
    category: "Managed Office",
    title: "Telangana, Hyderabad",
    location: "Telangana, Hyderabad",
    price: "₹14,000/yr",
    amenities: ["WIFI", "Parking", "GST Address"],
    images: [
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.31%20(1).jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.31.jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.32%20(1).jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.32%20(2).jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.32.jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.33%20(1).jpeg",
      "/images/listings/Telangana,Hyderabad/WhatsApp%20Image%202026-09-01%20at%2017.01.33.jpeg"
    ]
  },
  {
    id: 6,
    category: "Coworking",
    title: "Premium Coworking at Goregaon",
    location: "Mumbai, Maharashtra",
    price: "₹15,000/yr",
    amenities: ["WIFI", "GST Address", "Meeting Room"],
    images: [
      "/images/listings/goregaon.jpg",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
    ]
  },
  {
    id: 7,
    category: "Coworking",
    title: "Aesthetic Workspace at Bandra",
    location: "Mumbai, Maharashtra",
    price: "₹16,000/yr",
    amenities: ["WIFI", "GST Address", "Cafeteria"],
    images: [
      "/images/listings/bandra.jpg",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80"
    ]
  },
  {
    id: 8,
    category: "Managed Office",
    title: "Dependable Workspace Navrangpura",
    location: "Ahmedabad, Gujarat",
    price: "₹14,000/yr",
    amenities: ["WIFI", "Parking", "GST Address"],
    images: [
      "/images/listings/navrangpura.jpg",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80"
    ]
  },
  {
    id: 9,
    category: "Private Cabin",
    title: "Executive Private Cabin",
    location: "Mumbai, Maharashtra",
    price: "₹25,000/mo",
    amenities: ["High-Speed WIFI", "24/7 Access", "AC"],
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    ]
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

  // Lightbox state
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  const openLightbox = (images) => {
    setLightbox({
      isOpen: true,
      images,
      currentIndex: 0
    });
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

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
                  <div 
                    className="relative w-full h-48 sm:h-56 cursor-pointer"
                    onClick={() => openLightbox(listing.images)}
                  >
                    <div className="w-full h-full relative overflow-hidden rounded-t-lg">
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
                        src={listing.images[0]} 
                        alt={listing.title} 
                        onLoad={() => setLoaded(true)}
                        onError={() => { setLoaded(true); setError(true); }}
                        className={`listing-img w-full h-full object-cover ${loaded && !error ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </div>
                    {listing.isVerified && (
                      <div className="absolute -bottom-8 right-2 w-16 h-16 drop-shadow-md z-20">
                        <img 
                          src="/BosVerifiedBadge.png" 
                          alt="BOS Verified" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
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
                    {/* Verified Badge removed from here to be placed next to title */}
                  </div>
                  
                  <div className="card-body">
                    <div className="location-line">
                      <PinIcon />
                      <span>{listing.location}</span>
                    </div>
                    <h3 className="listing-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {listing.title}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" fill="#0095F6"/>
                      </svg>
                    </h3>
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

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 p-2"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button 
            className="absolute left-4 md:left-12 text-white hover:text-gray-300 transition-colors z-50 p-2 bg-black/20 rounded-full hover:bg-black/40"
            onClick={prevImage}
            aria-label="Previous Image"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>

          <img 
            src={lightbox.images[lightbox.currentIndex]} 
            alt="Workspace preview" 
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />

          <button 
            className="absolute right-4 md:right-12 text-white hover:text-gray-300 transition-colors z-50 p-2 bg-black/20 rounded-full hover:bg-black/40"
            onClick={nextImage}
            aria-label="Next Image"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
            {lightbox.currentIndex + 1} / {lightbox.images.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkspaceListings;
