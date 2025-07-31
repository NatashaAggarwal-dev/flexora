import React, { useState } from 'react';
import { X, User, Phone, MapPin, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, addUserAddress, markProfileComplete } from '../services/userService';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile with phone number
      await updateUserProfile(user.id, {
        phone: formData.phone
      });

      // Add shipping address
      await addUserAddress({
        user_id: user.id,
        address_type: 'shipping',
        is_default: true,
        full_name: user.name,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        phone: formData.phone
      });

      // Mark profile as complete
      await markProfileComplete(user.id);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Refresh the page to update user data
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-heading text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 font-body">
            Welcome, {user.name}! Please provide some additional details to complete your profile.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-600 text-sm font-body">Profile completed successfully!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-subheading text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-subheading text-gray-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span>Shipping Address</span>
            </h3>

            {/* Address Line 1 */}
            <div className="mb-4">
              <label htmlFor="address_line1" className="block text-sm font-subheading text-gray-700 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                placeholder="Street address, P.O. box, company name"
              />
            </div>

            {/* Address Line 2 */}
            <div className="mb-4">
              <label htmlFor="address_line2" className="block text-sm font-subheading text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="city" className="block text-sm font-subheading text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-subheading text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                  placeholder="State"
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-subheading text-gray-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-subheading text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isLoading ? 'Saving...' : 'Complete Profile'}</span>
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full text-gray-600 py-2 rounded-xl font-subheading hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal; 