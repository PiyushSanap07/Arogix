import React from 'react';
import { HeartPulse, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
           <div className="flex items-center">
            <div className="bg-teal-600 p-2 rounded-lg mr-2">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-['Poppins']">Arogix</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Bridging the gap between patients and top-tier healthcare professionals through secure, AI-powered telemedicine.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Our Doctors</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Video Consultations</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">AI Symptom Check</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Digital Prescriptions</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Lab Tests</a></li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
           <h3 className="text-white font-semibold mb-4">Legal</h3>
           <ul className="space-y-2 text-sm mb-6">
            <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
          </ul>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Twitter size={20}/></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook size={20}/></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram size={20}/></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20}/></a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Arogix Telemedicine. All rights reserved.</p>
        <p className="mt-2">Disclaimer: Arogix is not a replacement for emergency services. In case of emergency, dial 112.</p>
      </div>
    </footer>
  );
};
