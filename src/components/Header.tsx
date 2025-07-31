import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  isCartOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCartOpen, onAuthOpen, isCartOpen = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isCartOpen ? 'opacity-0 pointer-events-none' : ''
    } ${
      isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/logo.png" 
                alt="Flexora Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="text-2xl font-heading text-gray-900">
                Flex<span className="text-cyan-600">ora</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#features" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">Features</a>
              <a href="#audience" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">Designed for You</a>
              <a href="#innovation" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">Innovation</a>
              <a href="#faq" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">FAQ</a>
              <a href="#contact" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">Contact</a>
              <a href="#track" className="font-body text-gray-600 hover:text-cyan-600 transition-colors">Track Order</a>
            </div>
          </nav>

                            <div className="hidden md:flex items-center space-x-4">
                    <button
                      onClick={onCartOpen}
                      className="text-gray-600 hover:text-cyan-600 transition-colors relative"
                    >
                      <ShoppingCart size={20} />
                      <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-subheading">
                        {getTotalItems()}
                      </span>
                    </button>
                    
                    {user ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.location.hash = '#profile'}
                          className="flex items-center space-x-2 text-gray-600 hover:text-cyan-600 transition-colors"
                        >
                          <User size={20} />
                          <span className="font-subheading">{user.firstName}</span>
                        </button>
                        <button
                          onClick={logout}
                          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Logout"
                        >
                          <LogOut size={20} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={onAuthOpen}
                        className="bg-cyan-600 text-white px-6 py-2 rounded-full font-subheading hover:bg-cyan-500 transition-colors"
                      >
                        Sign In
                      </button>
                    )}
                  </div>

                            <div className="md:hidden flex items-center space-x-2">
                    {!user && (
                      <button
                        onClick={onAuthOpen}
                        className="p-2 text-gray-600 hover:text-cyan-600 transition-colors"
                        title="Sign In"
                      >
                        <User size={20} />
                      </button>
                    )}
                    <button
                      className="text-gray-900"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200">
          <div className="px-4 py-4 space-y-4">
                                <a href="#features" className="block font-body text-gray-600 hover:text-cyan-600 transition-colors">Features</a>
                    <a href="#audience" className="block font-body text-gray-600 hover:text-cyan-600 transition-colors">Designed for You</a>
                    <a href="#innovation" className="block font-body text-gray-600 hover:text-cyan-600 transition-colors">Innovation</a>
                    <a href="#faq" className="block font-body text-gray-600 hover:text-cyan-600 transition-colors">FAQ</a>
                    <a href="#contact" className="block font-body text-gray-600 hover:text-cyan-600 transition-colors">Contact</a>
            <button 
              onClick={() => {
                onCartOpen();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-cyan-600 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Cart ({getTotalItems()})</span>
            </button>
            
            {user ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.location.hash = '#profile';
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-full font-subheading hover:bg-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full font-subheading hover:bg-red-500 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAuthOpen();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <User size={20} />
                <span>Sign In / Sign Up</span>
              </button>
            )}


          </div>
        </div>
      )}


    </header>
  );
};

export default Header;