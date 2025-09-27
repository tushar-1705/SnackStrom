import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaPlus, FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSnacks } from '../context/SnackContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout } = useSnacks();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleModeSwitch = (newMode) => {
    setAuthMode(newMode);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-purple-50/95 backdrop-blur-md border-b border-gray-200 z-50 py-3">
        <div className="container-custom">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              🌧️ SnackStorm
            </Link>
            
            <nav className={`hidden md:flex space-x-4 lg:space-x-6 items-center`}>
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50 font-semibold' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FaHome className="text-sm" />
                <span>Home</span>
              </Link>
              <Link 
                to="/add-snack" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                  isActive('/add-snack') 
                    ? 'text-primary-600 bg-primary-50 font-semibold' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FaPlus className="text-sm" />
                <span>Add Snack</span>
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                      isActive('/profile') 
                        ? 'text-primary-600 bg-primary-50 font-semibold' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <FaUser className="text-sm" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 text-sm"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 text-sm"
                  >
                    <FaSignInAlt className="text-sm" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="btn-primary text-sm px-3 py-2"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>

            <button 
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-lg border border-gray-200">
              <div className="flex flex-col space-y-2 px-4">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
                    isActive('/') 
                      ? 'text-primary-600 bg-primary-50 font-semibold' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="text-sm" />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/add-snack" 
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
                    isActive('/add-snack') 
                      ? 'text-primary-600 bg-primary-50 font-semibold' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaPlus className="text-sm" />
                  <span>Add Snack</span>
                </Link>
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
                        isActive('/profile') 
                          ? 'text-primary-600 bg-primary-50 font-semibold' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="text-sm" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 text-sm"
                    >
                      <FaSignOutAlt className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        handleAuthClick('login');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 text-sm"
                    >
                      <FaSignInAlt className="text-sm" />
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        handleAuthClick('register');
                        setIsMenuOpen(false);
                      }}
                      className="btn-primary text-sm px-4 py-3 mx-4"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeSwitch={handleModeSwitch}
      />
    </>
  );
};

export default Header;
