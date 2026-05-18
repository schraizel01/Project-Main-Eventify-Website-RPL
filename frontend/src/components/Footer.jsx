import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">EVENTIFY</span>
          </div>
          <p className="text-center text-base text-gray-400">
            &copy; 2024 Eventify. Empowering Academic Excellence.
          </p>
          <div className="flex space-x-6 mt-6 md:mt-0 justify-center">
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Privacy Policy</span>
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Terms of Service</span>
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Contact Us</span>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
