import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Address {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  address_type: string;
  is_default: boolean;
}

interface UserProfileData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    isVerified: boolean;
    createdAt: string;
  };
  addresses: Address[];
}

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Address states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    addressType: 'shipping',
    isDefault: false
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('flexora_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setProfileForm({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone || ''
        });
      } else {
        setError('Failed to fetch profile');
      }
    } catch (error) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setError(null);
      await updateProfile(profileForm);
      setSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('flexora_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/users/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressForm),
      });

      if (response.ok) {
        setSuccess('Address added successfully!');
        setIsAddingAddress(false);
        setAddressForm({
          fullName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          phone: '',
          addressType: 'shipping',
          isDefault: false
        });
        fetchProfile();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add address');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setError(null);
      const token = localStorage.getItem('flexora_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccess('Address deleted successfully!');
        fetchProfile();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete address');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and addresses</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-subheading text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-500"
              >
                {isEditingProfile ? <X size={20} /> : <Edit size={20} />}
                <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-subheading hover:bg-cyan-500 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-subheading hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profileData.user.firstName} {profileData.user.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profileData.user.email}</p>
                  </div>
                </div>
                {profileData.user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profileData.user.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium">
                      {profileData.user.isVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-subheading text-gray-900">Addresses</h2>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-500"
              >
                <Plus size={20} />
                <span>Add Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium mb-4">Add New Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={addressForm.addressLine2}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={addressForm.addressType}
                      onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                      className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                    >
                      <option value="shipping">Shipping Address</option>
                      <option value="billing">Billing Address</option>
                    </select>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-600"
                      />
                      <span className="text-sm text-gray-700">Set as default</span>
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-subheading hover:bg-cyan-500 transition-colors"
                    >
                      Add Address
                    </button>
                    <button
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-subheading hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {profileData.addresses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No addresses added yet.</p>
              ) : (
                profileData.addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="text-gray-400" size={16} />
                          <span className="text-sm font-medium text-gray-700">
                            {address.address_type === 'shipping' ? 'Shipping Address' : 'Billing Address'}
                          </span>
                          {address.is_default && (
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-medium">{address.full_name}</p>
                        <p className="text-gray-600">{address.address_line1}</p>
                        {address.address_line2 && (
                          <p className="text-gray-600">{address.address_line2}</p>
                        )}
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                        {address.phone && (
                          <p className="text-gray-600">{address.phone}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 