import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Mail, ShoppingCart, X, LogIn } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { useAuth } from '../context/AuthContext';

const CTA = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { user, openAuthModal } = useAuth();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Storing email in localStorage:', email);
      
      // Store email in localStorage for contact form
      localStorage.setItem('waitlistEmail', email);
      
      // Verify email was stored
      const storedEmail = localStorage.getItem('waitlistEmail');
      console.log('Verified stored email:', storedEmail);
      
      // Scroll to contact section after a short delay
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          console.log('Scrolled to contact section');
        } else {
          console.log('Contact section not found');
        }
      }, 100);
      
      setIsSubscribed(true);
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleScheduleDemo = () => {
    setShowDemoModal(true);
    // Auto close after 5 seconds
    setTimeout(() => setShowDemoModal(false), 5000);
  };

  return (
    <section id="cta" className="py-20 bg-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl lg:text-6xl font-heading text-gray-900 mb-6 leading-tight">
          Ready to Transform Your
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent block">
            Sitting Experience?
          </span>
        </h2>
        
        <p className="text-xl font-body text-gray-600 mb-8 max-w-3xl mx-auto">
          Join the revolution in ergonomic seating. Pre-order your Flexora chair today and be among the first to experience the future of comfort and productivity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <AddToCartButton
            item={{
              id: 999,
              name: "Flexora Smart Chair",
              price: 1299,
              image: "/images/products/Office workers.png",
              color: "Classic Black"
            }}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400"
          />
          
          <button 
            onClick={handleScheduleDemo}
            className="border-2 border-cyan-600 text-cyan-600 px-8 py-4 rounded-full font-subheading text-lg hover:bg-cyan-600 hover:text-white transition-all duration-300"
          >
            Schedule Demo
          </button>
          
          {!user && (
            <button 
              onClick={openAuthModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-subheading text-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              <LogIn size={20} />
              <span>Join Flexora</span>
            </button>
          )}
        </div>

        {/* Email Signup */}
        <div className="max-w-md mx-auto mb-12">
          <h3 className="text-xl font-subheading text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 font-body mb-6">Get notified about launch updates, exclusive offers, and early access opportunities.</p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:border-cyan-600 focus:outline-none transition-colors font-body"
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-cyan-600 text-white px-6 py-3 rounded-full font-subheading hover:bg-cyan-500 transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-green-600 font-subheading">
              <Check size={20} />
              <span>Thanks! You're on the list.</span>
            </div>
          )}
        </div>

        {/* Features summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-cyan-600 rounded-full"></div>
            </div>
            <div className="text-gray-600 font-body">Free Shipping</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-cyan-600 rounded-full"></div>
            </div>
            <div className="text-gray-600 font-body">2-Year Warranty</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-cyan-600 rounded-full"></div>
            </div>
                            <div className="text-gray-600 font-body">Free Trials</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-cyan-600 rounded-full"></div>
            </div>
            <div className="text-gray-600 font-body">24/7 Support</div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDemoModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative transform transition-all duration-500 scale-100 animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Animated icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>

              {/* Animated text */}
              <h3 className="text-3xl font-heading text-gray-900 mb-4 animate-fade-in">
                Coming Soon
              </h3>
              
              <p className="text-gray-600 font-body mb-6 animate-fade-in-delayed">
                Our interactive demo is currently in development. We're working hard to bring you an amazing experience!
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full animate-progress" style={{ width: '0%' }}></div>
              </div>

              {/* Features preview */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-4 h-4 bg-cyan-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-gray-600 font-body">3D Experience</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-gray-600 font-body">Live Demo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTA;