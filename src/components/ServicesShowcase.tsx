import React, { useState, useEffect } from 'react';
import { CircularGallery, type GalleryItem } from './ui/circular-gallery';

const bosServicesData: GalleryItem[] = [
	{
		common: 'Premium Workspaces',
		binomial: 'Coworking & Managed Offices',
		photo: {
			url: '/serviceslistimage/Premium Coworking Workspace Interior.jpg',
			text: 'Premium coworking workspace interior',
			pos: 'center',
			by: 'BOS Facilities'
		}
	},
	{
		common: 'Company Incorporation',
		binomial: 'Private Limited & LLP',
		photo: {
			url: '/serviceslistimage/Company Incorporation Desk Essentials.jpg',
			text: 'Company incorporation desk essentials',
			pos: 'center',
			by: 'BOS Legal'
		}
	},
	{
		common: 'Tax & Accounting',
		binomial: 'GST & Corporate Tax',
		photo: {
			url: '/serviceslistimage/Tax & Accounting Workspace.jpg',
			text: 'Tax and accounting workspace',
			pos: 'center',
			by: 'BOS Finance'
		}
	},
	{
		common: 'Virtual Offices',
		binomial: 'Premium Business Addresses',
		photo: {
			url: '/serviceslistimage/Modern Virtual Office Lounge.jpg',
			text: 'Modern virtual office lounge',
			pos: 'center',
			by: 'BOS Network'
		}
	},
	{
		common: 'IT Infrastructure',
		binomial: 'Network & Hardware Setup',
		photo: {
			url: '/serviceslistimage/Modern IT Infrastructure Workspace Poster.jpg',
			text: 'Modern IT infrastructure workspace',
			pos: 'center',
			by: 'BOS Tech'
		}
	},
	{
		common: 'Payroll & HR',
		binomial: 'End-to-end HR Management',
		photo: {
			url: '/serviceslistimage/Payroll & HR Team High-Five.jpg',
			text: 'Payroll and HR team',
			pos: 'center',
			by: 'BOS Operations'
		}
	},
	{
		common: 'Legal Advisory',
		binomial: 'Contracts & IP Protection',
		photo: {
			url: '/serviceslistimage/Legal Advisory Desk with Lady Justice.jpg',
			text: 'Legal advisory desk with Lady Justice',
			pos: 'center',
			by: 'BOS Legal'
		}
	},
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
