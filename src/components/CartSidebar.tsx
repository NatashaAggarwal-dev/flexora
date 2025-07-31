import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-cyan-600" />
            <h2 className="text-xl font-heading text-gray-900">Shopping Cart</h2>
            <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded-full font-subheading">
              {getTotalItems()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-subheading text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 font-body">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4 p-4 bg-gray-50 rounded-2xl">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-subheading text-gray-900 mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{item.color}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-subheading text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-subheading text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-gray-600">Subtotal</span>
              <span className="font-subheading text-lg text-gray-900">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            {/* Shipping */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-body text-gray-600">Shipping</span>
              <span className="font-subheading text-green-600">Free</span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <span className="font-subheading text-lg text-gray-900">Total</span>
              <span className="font-heading text-xl text-gray-900">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={() => {
                if (cartItems.length === 0) return;
                setShowPaymentModal(true);
              }}
              disabled={cartItems.length === 0 || isProcessing}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isProcessing ? 'Processing...' : 'Proceed to Payment'}</span>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full mt-3 text-gray-600 hover:text-gray-900 font-body transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={getTotalPrice()}
          onSuccess={() => {
            clearCart();
            onClose();
          }}
        />
      </div>
    </>
  );
};

export default CartSidebar; 