import React, { useState } from 'react';
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
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AuthDebug from './components/AuthDebug';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthModalOpen, isProfileModalOpen, closeAuthModal, closeProfileModal, login } = useAuth();

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
              
              {/* Debug Component - Remove in production */}
              <AuthDebug />
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