import React from 'react';
import { Link } from 'react-router-dom';
import LogoEventify from '../assets/Logo Eventify.png';
import TextEventify from '../assets/Text Eventify.png';

const Footer = () => {
  return (
    <footer className="bg-[#eeeef7] border-t border-[#ddddf0] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top row: logo + links */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 flex-shrink-0">
            <img src={LogoEventify} alt="Logo Eventify" className="h-8 w-auto" />
            <img src={TextEventify} alt="Eventify" className="h-5 w-auto" />
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-primary transition-colors font-medium">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors font-medium">Terms of Service</Link>
            <Link to="#" className="hover:text-primary transition-colors font-medium">Contact Us</Link>
          </nav>
        </div>

        {/* Bottom row: copyright */}
        <div className="border-t border-[#ddddf0] py-3">
          <p className="text-xs text-gray-400">
            &copy; 2024 Eventify. Empowering Academic Excellence.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
