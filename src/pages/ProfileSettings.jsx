import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaUpload, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    about: '',
    photo: '',
    country: '',
    state: ''
  });

  // Form states for each section
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [addressInfo, setAddressInfo] = useState({
    address: '',
    about: '',
    country: '',
    state: ''
  });

  // Load profile data on component mount
  useEffect(() => {
    if (user?.profile) {
      const profile = user.profile;
      setProfileData(profile);
      setBasicInfo({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
      setAddressInfo({
        address: profile.address || '',
        about: profile.about || '',
        country: profile.country || '',
        state: profile.state || ''
      });
    }
  }, [user]);

  // Photo upload handling
  const handlePhotoUpload = (imageUrl) => {
    if (imageUrl) {
      setProfileData(prev => ({
        ...prev,
        photo: imageUrl
      }));
    }
  };

  // Save basic info
  const handleSaveBasicInfo = async () => {
    setLoading(true);
    try {
      const result = await updateProfile({
        name: basicInfo.name,
        email: basicInfo.email,
        phone: basicInfo.phone
      });
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          ...basicInfo
        }));
        toast.success('Basic information updated successfully!');
      }
    } catch (error) {
      console.error('Error saving basic info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save address info
  const handleSaveAddressInfo = async () => {
    setLoading(true);
    try {
      const result = await updateProfile({
        address: addressInfo.address,
        about: addressInfo.about,
        country: addressInfo.country,
        state: addressInfo.state
      });
      if (result.success) {
        setProfileData(prev => ({
          ...prev,
          ...addressInfo
        }));
        toast.success('Address information updated successfully!');
      }
    } catch (error) {
      console.error('Error saving address info:', error);
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan'
  ];

  const states = {
    'India': ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan'],
    'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    'Germany': ['Bavaria', 'Berlin', 'Hamburg', 'Hesse'],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Hokkaido']
  };

  const getStatesForCountry = (country) => {
    return states[country] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img 
                src={profileData.photo || 'https://via.placeholder.com/100x100?text=Profile'} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=Profile';
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name || user?.username || 'User'}
              </h2>
              <p className="text-gray-600">{profileData.email || user?.email || 'No email set'}</p>
              <p className="text-gray-500 text-sm">{profileData.phone || 'No phone set'}</p>
              <div className="flex items-center mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Arrow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Arrow 1: Profile Photo */}
          <div className="relative group cursor-pointer">
            <div 
              className={`
                relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                transform hover:scale-105 hover:-translate-y-2 p-8 text-center
                ${activeSection === 'photo' ? 'ring-4 ring-opacity-50 ring-blue-500' : ''}
              `}
              onClick={() => setActiveSection(activeSection === 'photo' ? null : 'photo')}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white transform transition-transform duration-300 group-hover:rotate-12">
                <FaCamera className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Profile Photo</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Upload and preview your profile picture
              </p>
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                <svg 
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    activeSection === 'photo' ? 'rotate-180' : ''
                  } text-blue-500`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

                        {/* Expanded Photo Content */}
            {activeSection === 'photo' && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl p-6 z-20 animate-fadeIn">
                <div className="space-y-4">
                  <div className="text-center">
                    <ImageUpload
                      onImageUpload={handlePhotoUpload}
                      currentImage={profileData.photo}
                      placeholder="Upload Profile Photo"
                      uploadType="profile-photo"
                      className="flex flex-col items-center"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    Click to upload a new profile photo
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Arrow 2: Basic Info */}
          <div className="relative group cursor-pointer">
            <div 
              className={`
                relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                transform hover:scale-105 hover:-translate-y-2 p-8 text-center
                ${activeSection === 'basic' ? 'ring-4 ring-opacity-50 ring-green-500' : ''}
              `}
              onClick={() => setActiveSection(activeSection === 'basic' ? null : 'basic')}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white transform transition-transform duration-300 group-hover:rotate-12">
                <FaUser className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Basic Info</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Edit your name, email, and phone number
              </p>
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                <svg 
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    activeSection === 'basic' ? 'rotate-180' : ''
                  } text-green-500`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Basic Info Content */}
            {activeSection === 'basic' && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl p-6 z-20 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={basicInfo.name}
                        onChange={(e) => setBasicInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveBasicInfo}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Basic Info'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Arrow 3: Address & About */}
          <div className="relative group cursor-pointer">
            <div 
              className={`
                relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                transform hover:scale-105 hover:-translate-y-2 p-8 text-center
                ${activeSection === 'address' ? 'ring-4 ring-opacity-50 ring-orange-500' : ''}
              `}
              onClick={() => setActiveSection(activeSection === 'address' ? null : 'address')}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white transform transition-transform duration-300 group-hover:rotate-12">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Address & About</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Update your address and personal bio
              </p>
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                <svg 
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    activeSection === 'address' ? 'rotate-180' : ''
                  } text-orange-500`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Address Content */}
            {activeSection === 'address' && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl p-6 z-20 animate-fadeIn">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={addressInfo.address}
                      onChange={(e) => setAddressInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        value={addressInfo.country}
                        onChange={(e) => setAddressInfo(prev => ({ ...prev, country: e.target.value, state: '' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select
                        value={addressInfo.state}
                        onChange={(e) => setAddressInfo(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={!addressInfo.country}
                      >
                        <option value="">Select State</option>
                        {getStatesForCountry(addressInfo.country).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                    <textarea
                      value={addressInfo.about}
                      onChange={(e) => setAddressInfo(prev => ({ ...prev, about: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Tell us about yourself"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={handleSaveAddressInfo}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Address & About'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {activeSection && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setActiveSection(null)}
        ></div>
      )}
    </div>
  );
} 