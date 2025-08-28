import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onSignIn, onSignUp, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#', active: true },
    { name: 'About', href: '#about', active: false },
    { name: 'Features', href: '#features', active: false },
    { name: 'Contact', href: '#contact', active: false },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Digi <span className="text-gray-700">बचत</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                  item.active 
                    ? 'text-teal-600 border-b-2 border-teal-600 pb-1' 
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={onSignIn}
                  className="flex items-center px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </button>
                <button
                  onClick={onSignUp}
                  className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.active 
                      ? 'text-teal-600 bg-teal-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {!isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={onSignIn}
                      className="flex items-center justify-center px-3 py-2 text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                    <button
                      onClick={onSignUp}
                      className="flex items-center justify-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;