import React from 'react';
import { ShoppingCart, Check, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface AddToCartButtonProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    color: string;
  };
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  item, 
  variant = 'primary', 
  size = 'md',
  className = ''
}) => {
  const { addToCart, cartItems } = useCart();
  const { user, openAuthModal } = useAuth();
  
  const isInCart = cartItems.some(cartItem => cartItem.id === item.id);

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    addToCart(item);
  };

  const baseClasses = "inline-flex items-center justify-center space-x-2 font-subheading transition-all duration-300 transform hover:scale-105";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${className || variantClasses[variant]}`;

  return (
    <button
      onClick={handleAddToCart}
      className={classes}
      disabled={isInCart}
    >
      {isInCart ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton; 