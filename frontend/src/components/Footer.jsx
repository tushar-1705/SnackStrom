import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaInstagram, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              🌧️ Rainy Day Snacks
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Share your favorite rainy-day snacks and drinks with our amazing community! 
              Discover new comfort foods and connect with fellow food lovers.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
              >
                Home
              </Link>
              <Link 
                to="/add-snack" 
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
              >
                Add Snack
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
              >
                Profile
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary-500 hover:transform hover:-translate-y-1 transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary-500 hover:transform hover:-translate-y-1 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary-500 hover:transform hover:-translate-y-1 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 flex items-center justify-center space-x-2">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-heartbeat" />
            <span>by the Rainy Day Snacks Community</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
