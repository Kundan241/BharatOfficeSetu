import React, { useState, useEffect } from 'react';
import { CircularGallery, type GalleryItem } from './ui/circular-gallery';

const bosServicesData: GalleryItem[] = [
	{
		common: 'Premium Workspaces',
		binomial: 'Coworking & Managed Offices',
		photo: {
			url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
			text: 'Modern coworking space',
			pos: 'center',
			by: 'BOS Facilities'
		}
	},
	{
		common: 'Company Incorporation',
		binomial: 'Private Limited & LLP',
		photo: {
			url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
			text: 'Legal documents and scales',
			pos: 'center',
			by: 'BOS Legal'
		}
	},
	{
		common: 'Tax & Accounting',
		binomial: 'GST & Corporate Tax',
		photo: {
			url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
			text: 'Accounting calculator and charts',
			pos: 'center',
			by: 'BOS Finance'
		}
	},
	{
		common: 'Virtual Offices',
		binomial: 'Premium Business Addresses',
		photo: {
			url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
			text: 'Modern office exterior',
			pos: 'center',
			by: 'BOS Network'
		}
	},
	{
		common: 'IT Infrastructure',
		binomial: 'Network & Hardware Setup',
		photo: {
			url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
			text: 'Server room and IT desk',
			pos: 'center',
			by: 'BOS Tech'
		}
	},
	{
		common: 'Payroll & HR',
		binomial: 'End-to-end HR Management',
		photo: {
			url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
			text: 'Business meeting',
			pos: 'center',
			by: 'BOS Operations'
		}
	},
	{
		common: 'Legal Advisory',
		binomial: 'Contracts & IP Protection',
		photo: {
			url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
			text: 'Legal paperwork',
			pos: 'center',
			by: 'BOS Legal'
		}
	},
	{
		common: 'Business Consulting',
		binomial: 'Market Entry & Strategy',
		photo: {
			url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
			text: 'Strategy planning session',
			pos: 'center',
			by: 'BOS Growth'
		}
	}
];

export default function ServicesShowcase() {
  const [radius, setRadius] = useState(950);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRadius(300);
      } else {
        setRadius(950);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full bg-white relative">
      {/* This outer container provides the 500vh scrollable height for the 3D effect */}
      <div className="w-full bg-slate-50" style={{ height: '500vh' }}>
        
        {/* This inner container sticks to the top while scrolling */}
        <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
          
          {/* BOS Custom Header */}
          <div className="text-center z-10 px-6 mt-24 md:mt-32 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Everything your business needs to scale.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scroll to explore our premium workspaces and full-stack compliance solutions.
            </p>
          </div>

          {/* The 3D Gallery */}
          <div className="w-full flex-grow relative flex items-center justify-center -mt-8 md:-mt-16">
            <CircularGallery items={bosServicesData} radius={radius} />
          </div>

        </div>
      </div>
    </section>
  );
}
