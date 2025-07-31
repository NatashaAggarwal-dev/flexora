import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Audience from './components/Audience';
import Innovation from './components/Innovation';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import CTA from './components/CTA';
import Footer from './components/Footer';
import StickyButton from './components/StickyButton';
import CartSidebar from './components/CartSidebar';
import OrderTracking from './components/OrderTracking';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';


function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'tracking' | 'profile'>('home');
  const { user, loading } = useAuth();

  // Handle URL hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#track') {
        setCurrentPage('tracking');
      } else if (hash === '#profile') {
        setCurrentPage('profile');
      } else {
        setCurrentPage('home');
      }
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'tracking') {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartOpen={() => setIsCartOpen(true)} onAuthOpen={() => setIsAuthModalOpen(true)} />
        <OrderTracking />
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  if (currentPage === 'profile') {
    if (!user) {
      // Redirect to home if not authenticated
      window.location.hash = '';
      return null;
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartOpen={() => setIsCartOpen(true)} onAuthOpen={() => setIsAuthModalOpen(true)} />
        <UserProfile />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onCartOpen={() => setIsCartOpen(true)} onAuthOpen={() => setIsAuthModalOpen(true)} />
      <Hero />
      <Features />
      <Audience />
      <Innovation />
      <FAQ />
      <Contact />
      <CTA onAuthOpen={() => setIsAuthModalOpen(true)} />
      <Footer />
      <StickyButton />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;