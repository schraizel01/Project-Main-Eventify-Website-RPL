import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoEventify from '../assets/Logo Eventify.png';

const Navbar = () => {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "border-primary text-primary inline-flex items-center px-2 pt-1 border-b-[3px] text-sm font-bold"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-2 pt-1 border-b-[3px] text-sm font-medium";
  };

  return (
    <nav className="bg-[#fcfcff] shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center mr-8">
              <img src={LogoEventify} alt="Logo" className="h-14 w-auto" />
            </Link>
            <div className="hidden sm:flex sm:space-x-8 h-full">
              <Link to="/" className={getLinkClass('/')}>
                Home
              </Link>
              <Link to="/events" className={getLinkClass('/events')}>
                Events
              </Link>
              <Link to="/about" className={getLinkClass('/about')}>
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/login" className="text-white bg-[#9b8afb] hover:bg-[#8673f5] px-8 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
