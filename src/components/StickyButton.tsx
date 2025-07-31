import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';

const StickyButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky CTA Button */}
      <button 
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-black p-4 rounded-full shadow-2xl hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-110 z-50 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
        onClick={() => setShowModal(true)}
      >
        <ShoppingCart size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-4">
                Pre-order Flexora
              </div>
              <p className="text-gray-300 mb-6">
                Be among the first to experience the future of ergonomic seating.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Flexora Chair</span>
                    <span className="text-cyan-400 font-bold">$1,299</span>
                  </div>
                  <p className="text-gray-400 text-sm">Expected delivery: Q2 2025</p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Free shipping</span>
                    <span className="text-green-400">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2-year warranty</span>
                    <span className="text-cyan-400">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>free trials</span>
                    <span className="text-cyan-400">Guaranteed</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-4 rounded-full font-bold text-lg hover:from-cyan-300 hover:to-blue-400 transition-all duration-300">
                  Secure Pre-order
                </button>
                
                <p className="text-gray-400 text-xs">
                  No charge until shipping. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyButton;