import React, { useState, useEffect } from 'react';
import { User, Package, LogOut, Settings, ChevronDown, X, CheckCircle } from 'lucide-react';
import { getUserOrders, getUserAddresses, getUserPreferences, updateUserProfile, addUserAddress, updateUserPreferences, Order, UserAddress, UserPreferences } from '../services/userService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAuthenticated: boolean;
}

interface AccountMenuProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ user, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    full_name: user.profile?.full_name || user.name,
    phone: user.profile?.phone || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [userOrders, userAddresses, userPrefs] = await Promise.all([
          getUserOrders(user.id),
          getUserAddresses(user.id),
          getUserPreferences(user.id)
        ]);
        
        setOrders(userOrders);
        setAddresses(userAddresses);
        setPreferences(userPrefs);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('flexoraUser');
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-heading text-gray-900 mb-2">{user.name}</h2>
          <p className="text-gray-600 font-body">{user.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 rounded-lg font-subheading transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 rounded-lg font-subheading transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-subheading text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                                        <div>
                          <label className="block text-sm font-subheading text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-subheading text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 font-body text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-subheading text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                          />
                        </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-subheading text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-subheading text-gray-700 mb-2">Address</label>
                  <textarea
                    placeholder="Enter your shipping address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-subheading text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-subheading text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

                                <button 
                      onClick={async () => {
                        try {
                          await updateUserProfile(user.id, {
                            full_name: profileData.full_name,
                            phone: profileData.phone
                          });
                          setShowSuccess(true);
                          setTimeout(() => setShowSuccess(false), 3000);
                        } catch (error) {
                          console.error('Error updating profile:', error);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                    
                    {showSuccess && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 text-sm font-body">Changes have been saved for the account!</span>
                        </div>
                      </div>
                    )}
          </div>
        )}

                        {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No orders yet</p>
                        <p className="text-sm text-gray-500">Your order history will appear here</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-subheading text-gray-900">Order #{order.order_number}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-subheading ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-subheading ${
                                order.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="font-subheading text-gray-900">Total</span>
                              <span className="font-subheading text-cyan-600">₹{order.total_amount}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-subheading hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu; 