import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse, Moon, Sun } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isLoggedIn, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavClick = (sectionId: string) => {
    // If not logged in or if we are already on the landing page, we can scroll.
    // If logged in, we might need to navigate first (logic handled by onNavigate usually, 
    // but here we assume Landing View for these links if logged out).
    if (!isLoggedIn) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // If logged in, "Home" usually goes back to dashboard home, 
      // but if user wants to see Landing page sections, we must switch view first.
      onNavigate(ViewState.LANDING);
      // Use setTimeout to allow render before scrolling
      setTimeout(() => {
         const element = document.getElementById(sectionId);
         if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="bg-teal-600 p-2 rounded-lg mr-2">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className={`text-2xl font-bold font-['Poppins'] tracking-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-slate-800 dark:text-white'}`}>
              Arogix
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('features')}
              className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              About
            </button>
            <button 
               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
               className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
               Contact
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-teal-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => handleNavClick('login-section')} 
                  className="text-gray-700 dark:text-gray-200 font-semibold hover:text-teal-600"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavClick('login-section')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-teal-600/20"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogout}
                className="text-red-500 font-medium hover:text-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-teal-300 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg absolute top-full left-0 w-full py-4 px-4 flex flex-col space-y-4 border-t dark:border-gray-800">
          <button 
            className="text-left text-gray-600 dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className="text-left text-gray-600 dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            onClick={() => handleNavClick('features')}
          >
             Services
          </button>
          <button 
            className="text-left text-gray-600 dark:text-gray-300 font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            onClick={() => {
               window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
               setIsMobileMenuOpen(false);
            }}
          >
            Contact
          </button>
          
          {!isLoggedIn && (
            <button 
              onClick={() => handleNavClick('login-section')}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium"
            >
              Sign Up / Login
            </button>
          )}
          {isLoggedIn && (
            <button onClick={onLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};