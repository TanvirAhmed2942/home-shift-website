import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Home, Package, Truck, Calendar, Mail, Phone, FileText, HelpCircle, Settings, Users, Globe, Search, MessageSquare } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';
import { Logo } from './Logo';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// City Data - With Lat/Lng for Mapbox
const scotlandCities = [
  { name: 'Inverness', lat: 57.4778, lng: -4.2247, region: 'Highlands' },
  { name: 'Aberdeen', lat: 57.1497, lng: -2.0943, region: 'Aberdeenshire', popular: true },
  { name: 'Dundee', lat: 56.4620, lng: -2.9707, region: 'Tayside' },
  { name: 'Perth', lat: 56.3950, lng: -3.4308, region: 'Perthshire' },
  { name: 'Stirling', lat: 56.1165, lng: -3.9369, region: 'Central' },
  { name: 'Edinburgh', lat: 55.9533, lng: -3.1883, region: 'Lothian', popular: true },
  { name: 'Glasgow', lat: 55.8642, lng: -4.2518, region: 'Strathclyde', popular: true },
  { name: 'Livingston', lat: 55.8818, lng: -3.5221, region: 'West Lothian' },
  { name: 'Paisley', lat: 55.8456, lng: -4.4237, region: 'Renfrewshire' },
  { name: 'East Kilbride', lat: 55.7600, lng: -4.2200, region: 'South Lanarkshire' },
  { name: 'Hamilton', lat: 55.7772, lng: -4.0377, region: 'South Lanarkshire' },
  { name: 'Kirkcaldy', lat: 56.1107, lng: -3.1674, region: 'Fife' },
  { name: 'Dunfermline', lat: 56.0719, lng: -3.4393, region: 'Fife' },
  { name: 'Falkirk', lat: 56.0019, lng: -3.7839, region: 'Falkirk' },
  { name: 'Ayr', lat: 55.4586, lng: -4.6292, region: 'Ayrshire' },
  { name: 'Dumfries', lat: 55.0709, lng: -3.6051, region: 'Dumfries & Galloway' },
  { name: 'Carlisle', lat: 54.8925, lng: -2.9329, region: 'Cumbria (Border)' },
];

const sitemapStructure = [
  {
    category: 'Main Pages',
    links: [
      { name: 'Home', path: '#home' },
      { name: 'About Us', path: '#about' },
      { name: 'Services', path: '#services' },
      { name: 'Pricing & Quote', path: '#booking' },
      { name: 'Contact', path: '#contact' },
    ]
  },
  {
    category: 'Services',
    links: [
      { name: 'House Removals', path: '#house-move' },
      { name: 'Furniture Transport', path: '#furniture' },
      { name: 'Man & Van', path: '#man-van' },
      { name: 'Motorbike Transport', path: '#motorbike' },
      { name: 'Office Moves', path: '#office' },
    ]
  },
  {
    category: 'Legal & Support',
    links: [
      { name: 'Terms & Conditions', path: '#terms' },
      { name: 'Privacy Policy', path: '#privacy' },
      { name: 'Cookie Policy', path: '#cookies' },
      { name: 'Help Center', path: '#help' },
    ]
  }
];

export function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const filteredCities = scotlandCities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const token = MAPBOX_PUBLIC_TOKEN;
    if (!token) {
        console.warn("Mapbox token missing for Sitemap map");
        return;
    }

    mapboxgl.accessToken = token;
    
    try {
      if (!mapContainer.current) return;
      if (map.current) return; // Prevent double init
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-4.2026, 56.4907], // Scotland center
        zoom: 6,
        cooperativeGestures: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add markers
        scotlandCities.forEach(city => {
          if (!city.lat || !city.lng) return;

          const el = document.createElement('div');
          el.className = 'marker-container group';
          
          // Create custom marker element matching the previous design
          const markerHtml = `
            <div class="relative cursor-pointer group">
               <div class="absolute inset-0 -m-2 rounded-full animate-ping pointer-events-none opacity-40 ${city.popular ? 'bg-blue-600' : 'bg-slate-500'}"></div>
               <div class="relative w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${city.popular ? 'bg-blue-600 scale-125' : 'bg-slate-600 hover:bg-blue-500'}"></div>
               
               <div class="absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto z-50 min-w-[120px]">
                  <div class="flex items-center">
                    <div class="w-4 h-[2px] absolute -left-5 top-1/2 ${city.popular ? 'bg-blue-600' : 'bg-slate-400'}"></div>
                    <div class="bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                      <div class="border-l border-slate-200 pl-2 ml-1">
                        <span class="text-slate-900 text-xs font-bold whitespace-nowrap block">${city.name}</span>
                        <span class="text-slate-500 text-[10px] block">${city.region}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          `;
          
          el.innerHTML = markerHtml;

          new mapboxgl.Marker(el)
            .setLngLat([city.lng, city.lat])
            .addTo(map.current!);
        });
      });

    } catch (err) {
      console.error("Map init error:", err);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isOpen]);

  // Handle Search FlyTo
  useEffect(() => {
    if (!map.current || !filteredCities.length) return;
    
    // If search term matches exactly one city, fly to it
    if (searchTerm.length > 2 && filteredCities.length > 0) {
        const bestMatch = filteredCities[0];
        map.current.flyTo({
            center: [bestMatch.lng, bestMatch.lat],
            zoom: 10,
            essential: true
        });
    }
  }, [searchTerm, filteredCities]);

  if (!isOpen) return null;

  const hasToken = !!MAPBOX_PUBLIC_TOKEN;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full h-[90vh] overflow-hidden flex flex-col lg:flex-row relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all text-slate-800 lg:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Sidebar - Sitemap Structure */}
        <div className="lg:w-80 bg-slate-50 p-8 overflow-y-auto border-r border-slate-200 hidden lg:block scrollbar-hide">
          <div className="mb-8">
            <Logo variant="blue" className="h-8 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Sitemap
            </h2>
            <p className="text-xs text-slate-500 mt-1">Full website index & navigation</p>
          </div>

          <div className="space-y-8">
            {sitemapStructure.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href={link.path} 
                        onClick={onClose} 
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400">© 2025 ShiftMyHome Ltd.</p>
          </div>
        </div>

        {/* Right Side - The Map Container */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 right-0 p-6 z-20 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-none">
            <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
              <h2 className="text-xl font-bold text-slate-900">Our UK Network Coverage</h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Live Status</span>
                <span className="text-slate-300">|</span>
                <span>Active Locations</span>
              </p>
            </div>
            
            {/* Search Box */}
            <div className="mt-4 md:mt-0 pointer-events-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search city..."
                className="bg-white/90 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 backdrop-blur-md shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* MAP VIEWPORT */}
          <div className="flex-1 relative w-full h-full group/map bg-[#e8eaed]">
            
            {!hasToken ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">Map Unavailable</h3>
                        <p className="text-sm text-gray-500 mt-2">Mapbox token is missing. Please check Admin settings.</p>
                    </div>
                 </div>
            ) : (
                <>
                    <div ref={mapContainer} className="w-full h-full" />
                    {/* Gradient Overlay for style - Optional, simplified for Mapbox */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
                </>
            )}
          </div>

          {/* Bottom Bar: Action if location not found */}
          <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 z-30">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                  <MapPin className="text-blue-600 w-6 h-6 animate-pulse" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-slate-900 font-bold">Not on the map?</h3>
                  <p className="text-slate-500 text-sm">We cover 99% of UK postcodes. Contact us for a quote.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <a
                  href="tel:08001234567"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
                <a
                  href="mailto:support@shiftmyhome.co.uk"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all border border-slate-200 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
