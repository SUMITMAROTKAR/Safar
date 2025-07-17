import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { 
  FaUser, 
  FaGlobe, 
  FaBell, 
  FaCog, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaShieldAlt, 
  FaEnvelope,
  FaEye,
  FaDatabase,
  FaLanguage,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Settings() {
  const [activeSection, setActiveSection] = useState(null);
  const { logout } = useAuth();

  const settingsCategories = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: <FaUser className="text-2xl" />,
      color: 'blue',
      description: 'Customize your profile, login info, and language quickly and easily.',
      features: [
        { icon: <FaUser />, label: 'Profile Information', desc: 'Update your personal details' },
        { icon: <FaLanguage />, label: 'Language & Region', desc: 'Set your preferred language' },
        { icon: <FaLock />, label: 'Security Settings', desc: 'Manage passwords and 2FA' },
        { icon: <FaCreditCard />, label: 'Payment Methods', desc: 'Update billing information' }
      ]
    },
    {
      id: 'preferences',
      title: 'Travel Preferences',
      icon: <FaGlobe className="text-2xl" />,
      color: 'green',
      description: 'Customize your default location, interests, and budget range quickly and easily.',
      features: [
        { icon: <FaMapMarkerAlt />, label: 'Default Location', desc: 'Set your home base' },
        { icon: <FaHeart />, label: 'Travel Interests', desc: 'Choose your adventure types' },
        { icon: <FaCalendarAlt />, label: 'Budget Range', desc: 'Set spending preferences' },
        { icon: <FaCog />, label: 'Trip Preferences', desc: 'Customize travel style' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications & Privacy',
      icon: <FaBell className="text-2xl" />,
      color: 'orange',
      description: 'Customize your email alerts, privacy mode, and data settings quickly and easily.',
      features: [
        { icon: <FaEnvelope />, label: 'Email Alerts', desc: 'Manage notification preferences' },
        { icon: <FaEye />, label: 'Privacy Mode', desc: 'Control your visibility' },
        { icon: <FaDatabase />, label: 'Data Settings', desc: 'Manage your information' },
        { icon: <FaShieldAlt />, label: 'Privacy Controls', desc: 'Set data sharing preferences' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colors[color] || colors.blue;
  };

  const getArrowColor = (color) => {
    const colors = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      orange: 'text-orange-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Settings & Preferences
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your travel experience with our comprehensive settings
          </p>
        </div>

        {/* 3-Arrow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {settingsCategories.map((category, index) => (
            <div
              key={category.id}
              className="relative group cursor-pointer"
              onClick={() => setActiveSection(activeSection === category.id ? null : category.id)}
            >
              {/* Arrow Card */}
              <div className={`
                relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                transform hover:scale-105 hover:-translate-y-2 p-8 text-center
                ${activeSection === category.id ? 'ring-4 ring-opacity-50' : ''}
                ${activeSection === category.id ? `ring-${category.color}-500` : ''}
              `}>
                {/* Arrow Icon */}
                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-white
                  ${getColorClasses(category.color)}
                  transform transition-transform duration-300 group-hover:rotate-12
                `}>
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {category.description}
                </p>

                {/* Arrow Indicator */}
                <div className={`
                  w-12 h-12 mx-auto rounded-full flex items-center justify-center
                  bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300
                `}>
                  <svg 
                    className={`w-6 h-6 transform transition-transform duration-300 ${
                      activeSection === category.id ? 'rotate-180' : ''
                    } ${getArrowColor(category.color)}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {activeSection === category.id && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl p-6 z-20 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-lg ${getArrowColor(category.color)} bg-opacity-10`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{feature.label}</h4>
                          <p className="text-sm text-gray-600">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className={`
                      w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-200
                      ${getColorClasses(category.color)}
                    `}>
                      Configure {category.title}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              <FaUser className="text-blue-500" />
              <span className="font-medium">Edit Profile</span>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 transition-colors duration-200">
              <FaMapMarkerAlt className="text-green-500" />
              <span className="font-medium">Set Location</span>
            </button>
            <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors duration-200">
              <FaBell className="text-orange-500" />
              <span className="font-medium">Notifications</span>
            </button>
            <button 
              onClick={logout}
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FaSignOutAlt className="text-red-500" />
              <span className="font-medium">Logout</span>
            </button>
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