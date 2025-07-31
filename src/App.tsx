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
import AuthModal from './components/AuthModal';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import OrderTracking from './components/OrderTracking';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';


function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'tracking'>('home');
  const { isAuthModalOpen, isProfileModalOpen, closeAuthModal, closeProfileModal, login } = useAuth();

  // Handle URL hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#track') {
        setCurrentPage('tracking');
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

  if (currentPage === 'tracking') {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartOpen={() => setIsCartOpen(true)} />
        <OrderTracking />
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
        />
        <ProfileCompletionModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <Hero />
      <Features />
      <Audience />
      <Innovation />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
      <StickyButton />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
      
      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
      
      
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