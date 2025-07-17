import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { eventsAPI } from '../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaMoneyBill, FaImage, FaFileAlt, FaUsers, FaClock, FaFlag, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function EventRequestForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('details');
  const [loading, setLoading] = useState(false);
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    guide: '',
    location: '',
    price: '',
    date: '',
    duration: '',
    difficulty: '',
    groupSize: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit event requests');
      return;
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'guide', 'location', 'price', 'date', 'duration', 'difficulty', 'groupSize'];
    const missingFields = requiredFields.filter(field => !eventData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const result = await eventsAPI.submitRequest({
        ...eventData,
        price: parseInt(eventData.price),
        groupSize: parseInt(eventData.groupSize)
      });
      
      toast.success('Event request submitted successfully!');
      onSuccess && onSuccess(result.data);
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit event request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.imageUrl) {
        setEventData(prev => ({ ...prev, image: data.imageUrl }));
        toast.success('Image uploaded!');
      } else {
        toast.error(data.message || 'Image upload failed');
      }
    } catch (err) {
      toast.error('Image upload failed');
    }
  };

  const sections = [
    {
      id: 'details',
      title: 'Event Details',
      icon: <FaFileAlt />,
      color: 'blue',
      description: 'Basic event information'
    },
    {
      id: 'location',
      title: 'Location & Guide',
      icon: <FaMapMarkerAlt />,
      color: 'green',
      description: 'Where and who will guide'
    },
    {
      id: 'pricing',
      title: 'Pricing & Schedule',
      icon: <FaMoneyBill />,
      color: 'orange',
      description: 'Cost and timing details'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      orange: 'bg-gradient-to-br from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Submit Event Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Create a new event request for admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* 3-Arrow Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg transition-all duration-300
                  ${activeSection === section.id 
                    ? `${getColorClasses(section.color)} text-white shadow-lg` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <div className="text-xl">{section.icon}</div>
                <div className="text-left">
                  <div className="font-semibold">{section.title}</div>
                  <div className="text-sm opacity-80">{section.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="space-y-6">
            {/* Event Details Section */}
            {activeSection === 'details' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your event"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {eventData.image && (
                    <img src={eventData.image} alt="Event" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={eventData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            )}

            {/* Location & Guide Section */}
            {activeSection === 'location' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Location & Guide</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={eventData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter location (e.g., Pune, Goa)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guide Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="guide"
                      value={eventData.guide}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter guide name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size *
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="groupSize"
                      value={eventData.groupSize}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Maximum number of participants"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing & Schedule Section */}
            {activeSection === 'pricing' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Schedule</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <FaMoneyBill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={eventData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter price per person"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={eventData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="duration"
                      value={eventData.duration}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 1 Day, 2 Days, 1 Night"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation and Submit Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    px-4 py-2 rounded-lg transition-colors duration-200
                    ${activeSection === section.id 
                      ? `${getColorClasses(section.color)} text-white` 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 