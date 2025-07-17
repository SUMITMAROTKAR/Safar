import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartPie, FaCalendarAlt, FaUsers, FaMoneyBill, FaCog, FaList, FaUserTie, FaBook, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaHome, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import { guideAPI } from '../services/api';

const pieData = [
  { name: 'Rajgad Trek', value: 120000 },
  { name: 'Goa Beach Fest', value: 90000 },
  { name: 'Pawna Camping', value: 60000 },
  { name: 'Dudhsagar Trek', value: 40000 },
];
const COLORS = ['#4f46e5', '#06b6d4', '#f59e42', '#10b981'];
const barData = [
  { month: 'Jan', bookings: 40 },
  { month: 'Feb', bookings: 55 },
  { month: 'Mar', bookings: 70 },
  { month: 'Apr', bookings: 60 },
  { month: 'May', bookings: 90 },
  { month: 'Jun', bookings: 80 },
];

const sidebarLinks = [
  { name: 'Dashboard', icon: <FaChartPie />, key: 'dashboard' },
  { name: 'Events', icon: <FaCalendarAlt />, key: 'events' },
  { name: 'Event Requests', icon: <FaList />, key: 'event-requests' },
  { name: 'Users', icon: <FaUsers />, key: 'users' },
  { name: 'Guides', icon: <FaUserTie />, key: 'guides' },
  { name: 'Bookings', icon: <FaBook />, key: 'bookings' },
  { name: 'Earnings', icon: <FaMoneyBill />, key: 'earnings' },
  { name: 'Settings', icon: <FaCog />, key: 'settings' },
];

export default function AdminPanel() {
  const [active, setActive] = useState('dashboard');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Mock data for other sections
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', joinDate: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 98765 43211', joinDate: '2024-02-20', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 98765 43212', joinDate: '2024-03-10', status: 'Inactive' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 98765 43213', joinDate: '2024-04-05', status: 'Active' },
  ]);

  const [guides, setGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [showAddGuide, setShowAddGuide] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [newGuide, setNewGuide] = useState({ name: '', email: '', phone: '', experience: '', rating: 4.5, status: 'Active' });

  const [bookings] = useState([
    { id: 1, eventTitle: 'Trek to Rajgad Fort', userName: 'John Doe', guide: 'Amit Pawar', date: '2024-07-15', people: 2, amount: 1598, status: 'Confirmed' },
    { id: 2, eventTitle: 'Goa Beach Festival', userName: 'Jane Smith', guide: 'Sneha Patil', date: '2024-08-10', people: 3, amount: 3897, status: 'Pending' },
    { id: 3, eventTitle: 'Pawna Lake Camping', userName: 'Mike Johnson', guide: 'Rohit Shinde', date: '2024-07-20', people: 1, amount: 999, status: 'Confirmed' },
    { id: 4, eventTitle: 'Dudhsagar Waterfall Trek', userName: 'Sarah Wilson', guide: 'Priya Desai', date: '2024-08-05', people: 4, amount: 5996, status: 'Cancelled' },
  ]);

  const [earnings] = useState([
    { month: 'January', revenue: 45000, bookings: 45, events: 8 },
    { month: 'February', revenue: 52000, bookings: 52, events: 10 },
    { month: 'March', revenue: 61000, bookings: 61, events: 12 },
    { month: 'April', revenue: 58000, bookings: 58, events: 11 },
    { month: 'May', revenue: 72000, bookings: 72, events: 15 },
    { month: 'June', revenue: 68000, bookings: 68, events: 14 },
  ]);

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    guide: '',
    location: '',
    price: '',
    date: '',
    duration: '',
    difficulty: '',
    groupSize: '',
    description: '',
    image: '',
  });

  // Event Requests State
  const [eventRequests, setEventRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Add state for popular locations
  const [locations, setLocations] = useState([
    { name: 'Pune', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', description: 'Gateway to camping and adventure trips in the Western Ghats.' },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', description: 'Famous for its beaches, nightlife, and adventure sports.' },
    { name: 'Manali', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', description: 'A beautiful hill station in Himachal Pradesh.' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', description: 'The Pink City, known for its rich history and architecture.' },
  ]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [newLocation, setNewLocation] = useState({ name: '', image: '', description: '' });

  // Load events from backend on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await eventsAPI.getAll();
        setEvents(response.data);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Load event requests when admin panel is active
  useEffect(() => {
    if (active === 'event-requests') {
      loadEventRequests();
    }
  }, [active]);

  const loadEventRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await eventsAPI.getAllRequests();
      setEventRequests(response.data);
    } catch (error) {
      console.error('Error loading event requests:', error);
      toast.error('Failed to load event requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await eventsAPI.updateRequestStatus(requestId, status);
      toast.success(`Event request ${status.toLowerCase()} successfully`);
      loadEventRequests(); // Reload the list
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // Check if image is uploaded
      if (!newEvent.image) {
        toast.error('Please upload an image for the event');
        return;
      }

      // Submit event to backend
      await eventsAPI.create({
        ...newEvent,
        price: parseInt(newEvent.price),
        groupSize: parseInt(newEvent.groupSize),
      });
      
      toast.success('Event created successfully!');
      setNewEvent({
        title: '', guide: '', location: '', price: '', date: '', duration: '', difficulty: '', groupSize: '', description: '', image: '',
      });
      setShowAddEvent(false);
      
      // Refresh events list
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleEventImageUpload = (imageUrl) => {
    setNewEvent(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    const updatedEvents = events.map(event => 
      event.id === editingEvent.id ? { ...editingEvent, price: parseInt(editingEvent.price), groupSize: parseInt(editingEvent.groupSize) } : event
    );
    setEvents(updatedEvents);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Note: You'll need to add a delete endpoint to your backend
        // For now, we'll just remove from the frontend
        setEvents(events.filter(event => event._id !== eventId));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const startEdit = (event) => {
    setEditingEvent({ ...event });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  // Handler functions
  const handleAddLocation = () => {
    setLocations([...locations, newLocation]);
    setNewLocation({ name: '', image: '', description: '' });
  };
  const handleEditLocation = (idx) => {
    setEditingLocation({ ...locations[idx], idx });
  };
  const handleSaveEditLocation = () => {
    const updated = [...locations];
    updated[editingLocation.idx] = { name: editingLocation.name, image: editingLocation.image, description: editingLocation.description };
    setLocations(updated);
    setEditingLocation(null);
  };
  const handleDeleteLocation = (idx) => {
    setLocations(locations.filter((_, i) => i !== idx));
  };

  // Fetch guides from backend
  useEffect(() => {
    if (active === 'guides') {
      loadGuides();
    }
  }, [active]);

  const loadGuides = async () => {
    setLoadingGuides(true);
    try {
      const res = await guideAPI.getAll();
      setGuides(res.data);
    } catch (err) {
      toast.error('Failed to load guides');
    } finally {
      setLoadingGuides(false);
    }
  };

  const handleAddGuide = async (e) => {
    e.preventDefault();
    try {
      await guideAPI.create(newGuide);
      setShowAddGuide(false);
      setNewGuide({ name: '', email: '', phone: '', experience: '', rating: 4.5, status: 'Active' });
      loadGuides();
      toast.success('Guide added successfully!');
    } catch (err) {
      toast.error('Failed to add guide');
    }
  };

  const handleEditGuide = async (e) => {
    e.preventDefault();
    try {
      await guideAPI.update(editingGuide._id, editingGuide);
      setEditingGuide(null);
      loadGuides();
      toast.success('Guide updated successfully!');
    } catch (err) {
      toast.error('Failed to update guide');
    }
  };

  const handleDeleteGuide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this guide?')) return;
    try {
      await guideAPI.delete(id);
      loadGuides();
      toast.success('Guide deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete guide');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col py-6 px-4 sticky top-0 h-screen z-20">
        <div className="text-2xl font-bold text-blue-700 mb-8 text-center tracking-wide">Admin Panel</div>
        
        {/* Go to Home Page Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg text-lg font-medium transition bg-green-100 text-green-700 hover:bg-green-200"
        >
          <FaHome /> Go to Home Page
        </button>
        
        <nav className="flex-1 flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.key}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition ${active === link.key ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActive(link.key)}
            >
              {link.icon} {link.name}
            </button>
          ))}
        </nav>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 mt-8 rounded-lg text-red-500 hover:bg-red-50 transition font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 capitalize">{active} Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your travel booking platform</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
          >
            <FaHome /> Go to Home Page
          </button>
        </div>
        
        {active === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <FaList className="text-3xl text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-gray-500">Total Events</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <FaBook className="text-3xl text-green-500 mb-2" />
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-gray-500">Total Bookings</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <FaMoneyBill className="text-3xl text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">₹{earnings.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}</div>
                <div className="text-gray-500">Total Earnings</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                <FaUsers className="text-3xl text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-gray-500">Total Users</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="font-semibold mb-4">Earnings per Event</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="font-semibold mb-4">Bookings per Month</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {active === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Events Management</h1>
              <button
                onClick={() => setShowAddEvent(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <FaPlus /> Add New Event
              </button>
            </div>
            {loadingEvents ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading events...</div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No events available</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img 
                      src={event.image && event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} 
                      alt={event.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                                      <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div>👤 Guide: {event.guide}</div>
                        <div>📍 Location: {event.location}</div>
                        <div>📅 Date: {new Date(event.date).toLocaleDateString()}</div>
                        <div>⏱️ Duration: {event.duration}</div>
                        <div>🎯 Difficulty: {event.difficulty}</div>
                        <div>👥 Group Size: {event.groupSize}</div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-2xl font-bold text-green-600">₹{event.price}</span>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(event)} className="text-blue-600 hover:text-blue-900 p-2">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 hover:text-red-900 p-2">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'event-requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Event Requests Management</h1>
              <button
                onClick={loadEventRequests}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <FaList /> Refresh Requests
              </button>
            </div>
            
            {loadingRequests ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading event requests...</div>
              </div>
            ) : eventRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No event requests found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventRequests.map(request => (
                  <div key={request._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <img 
                      src={request.image && request.image.startsWith('http') ? request.image : `http://localhost:5000${request.image}`} 
                      alt={request.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{request.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{request.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div>👤 Guide: {request.guide}</div>
                        <div>📍 Location: {request.location}</div>
                        <div>📅 Date: {new Date(request.date).toLocaleDateString()}</div>
                        <div>⏱️ Duration: {request.duration}</div>
                        <div>🎯 Difficulty: {request.difficulty}</div>
                        <div>👥 Group Size: {request.groupSize}</div>
                        <div>💰 Price: ₹{request.price}</div>
                        <div>👤 Requested by: {request.requestedBy?.username || 'Unknown'}</div>
                      </div>
                      
                      {request.status === 'Pending' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <button 
                            onClick={() => handleRequestAction(request._id, 'Approved')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button 
                            onClick={() => handleRequestAction(request._id, 'Rejected')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            <FaX /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <FaPlus /> Add New User
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">All Users ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1">
                              <FaEdit />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {active === 'guides' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Guides Dashboard</h1>
              <button
                onClick={() => setShowAddGuide(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                + Add New Guide
              </button>
            </div>
            {loadingGuides ? (
              <div className="text-center py-8 text-gray-500">Loading guides...</div>
            ) : guides.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No guides available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => (
                  <div key={guide._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center text-white text-2xl font-bold">
                        {guide.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{guide.name}</div>
                        <div className="text-gray-500 text-sm">{guide.experience} experience</div>
                      </div>
                    </div>
                    <div className="mb-2 text-gray-700 text-sm">
                      <div><span className="font-semibold">Email:</span> {guide.email}</div>
                      <div><span className="font-semibold">Phone:</span> {guide.phone}</div>
                      <div><span className="font-semibold">Rating:</span> {guide.rating}/5</div>
                      <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs ${guide.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{guide.status}</span></div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button className="text-blue-600" onClick={() => setEditingGuide(guide)}><FaEdit /></button>
                      <button className="text-red-600" onClick={() => handleDeleteGuide(guide._id)}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Add Guide Modal */}
            {showAddGuide && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <form onSubmit={handleAddGuide} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3 relative">
                  <button type="button" className="absolute top-2 right-4 text-2xl" onClick={() => setShowAddGuide(false)}>&times;</button>
                  <h3 className="text-xl font-bold mb-2">Add New Guide</h3>
                  <input required placeholder="Name" className="border rounded px-3 py-2" value={newGuide.name} onChange={e => setNewGuide({ ...newGuide, name: e.target.value })} />
                  <input required placeholder="Email" className="border rounded px-3 py-2" value={newGuide.email} onChange={e => setNewGuide({ ...newGuide, email: e.target.value })} />
                  <input required placeholder="Phone" className="border rounded px-3 py-2" value={newGuide.phone} onChange={e => setNewGuide({ ...newGuide, phone: e.target.value })} />
                  <input required placeholder="Experience" className="border rounded px-3 py-2" value={newGuide.experience} onChange={e => setNewGuide({ ...newGuide, experience: e.target.value })} />
                  <input required placeholder="Rating" type="number" min="1" max="5" step="0.1" className="border rounded px-3 py-2" value={newGuide.rating} onChange={e => setNewGuide({ ...newGuide, rating: e.target.value })} />
                  <select className="border rounded px-3 py-2" value={newGuide.status} onChange={e => setNewGuide({ ...newGuide, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Add Guide</button>
                </form>
              </div>
            )}
            {/* Edit Guide Modal */}
            {editingGuide && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <form onSubmit={handleEditGuide} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3 relative">
                  <button type="button" className="absolute top-2 right-4 text-2xl" onClick={() => setEditingGuide(null)}>&times;</button>
                  <h3 className="text-xl font-bold mb-2">Edit Guide</h3>
                  <input required placeholder="Name" className="border rounded px-3 py-2" value={editingGuide.name} onChange={e => setEditingGuide({ ...editingGuide, name: e.target.value })} />
                  <input required placeholder="Email" className="border rounded px-3 py-2" value={editingGuide.email} onChange={e => setEditingGuide({ ...editingGuide, email: e.target.value })} />
                  <input required placeholder="Phone" className="border rounded px-3 py-2" value={editingGuide.phone} onChange={e => setEditingGuide({ ...editingGuide, phone: e.target.value })} />
                  <input required placeholder="Experience" className="border rounded px-3 py-2" value={editingGuide.experience} onChange={e => setEditingGuide({ ...editingGuide, experience: e.target.value })} />
                  <input required placeholder="Rating" type="number" min="1" max="5" step="0.1" className="border rounded px-3 py-2" value={editingGuide.rating} onChange={e => setEditingGuide({ ...editingGuide, rating: e.target.value })} />
                  <select className="border rounded px-3 py-2" value={editingGuide.status} onChange={e => setEditingGuide({ ...editingGuide, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        )}

        {active === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">All Bookings ({bookings.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.eventTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.userName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.guide}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.people}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{booking.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1">
                              <FaEdit />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {active === 'earnings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Earnings & Analytics</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="text-2xl font-bold text-green-600">₹{earnings.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}</div>
                <div className="text-gray-500">Total Revenue</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="text-2xl font-bold text-blue-600">{earnings.reduce((sum, e) => sum + e.bookings, 0)}</div>
                <div className="text-gray-500">Total Bookings</div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="text-2xl font-bold text-purple-600">{earnings.reduce((sum, e) => sum + e.events, 0)}</div>
                <div className="text-gray-500">Total Events</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="font-semibold mb-4">Monthly Revenue</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earnings}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="font-semibold mb-4">Monthly Breakdown</div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.map((earning, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{earning.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">₹{earning.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{earning.bookings}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{earning.events}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {active === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Home Page Popular Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {locations.map((loc, idx) => (
                <div key={loc.name + idx} className="flex flex-col bg-blue-50 rounded-lg p-4 relative">
                  {editingLocation && editingLocation.idx === idx ? (
                    <>
                      <input className="mb-2 p-2 rounded border" value={editingLocation.name} onChange={e => setEditingLocation({ ...editingLocation, name: e.target.value })} />
                      <input className="mb-2 p-2 rounded border" value={editingLocation.image} onChange={e => setEditingLocation({ ...editingLocation, image: e.target.value })} />
                      <textarea className="mb-2 p-2 rounded border" value={editingLocation.description} onChange={e => setEditingLocation({ ...editingLocation, description: e.target.value })} />
                      <div className="flex gap-2">
                        <button className="px-4 py-1 bg-green-500 text-white rounded" onClick={handleSaveEditLocation}>Save</button>
                        <button className="px-4 py-1 bg-gray-400 text-white rounded" onClick={() => setEditingLocation(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={loc.image} alt={loc.name} className="w-full h-24 object-cover rounded mb-2" />
                      <div className="font-bold text-blue-700 text-lg">{loc.name}</div>
                      <div className="text-gray-600 text-sm mb-2">{loc.description}</div>
                      <div className="flex gap-2 absolute top-2 right-2">
                        <button className="text-blue-600" onClick={() => handleEditLocation(idx)}><FaEdit /></button>
                        <button className="text-red-600" onClick={() => handleDeleteLocation(idx)}><FaTrash /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <input className="p-2 rounded border flex-1" placeholder="Location Name" value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} />
              <input className="p-2 rounded border flex-1" placeholder="Image URL" value={newLocation.image} onChange={e => setNewLocation({ ...newLocation, image: e.target.value })} />
              <textarea className="p-2 rounded border flex-1" placeholder="Description" value={newLocation.description} onChange={e => setNewLocation({ ...newLocation, description: e.target.value })} />
              <button className="px-6 py-2 bg-blue-500 text-white rounded" onClick={handleAddLocation}>Add Location</button>
            </div>
          </div>
)}

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Event</h2>
                <button onClick={() => setShowAddEvent(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Guide Name"
                    value={newEvent.guide}
                    onChange={e => setNewEvent({ ...newEvent, guide: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newEvent.price}
                    onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 1 Day, 2 Days)"
                    value={newEvent.duration}
                    onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={newEvent.difficulty}
                    onChange={e => setNewEvent({ ...newEvent, difficulty: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Group Size"
                    value={newEvent.groupSize}
                    onChange={e => setNewEvent({ ...newEvent, groupSize: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newEvent.image}
                  onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                />
                <textarea
                  placeholder="Event Description"
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24 resize-none"
                  required
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaSave /> Add Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Event</h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handleEditEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={editingEvent.title}
                    onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Guide Name"
                    value={editingEvent.guide}
                    onChange={e => setEditingEvent({ ...editingEvent, guide: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={editingEvent.location}
                    onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingEvent.price}
                    onChange={e => setEditingEvent({ ...editingEvent, price: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date"
                    value={editingEvent.date}
                    onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={editingEvent.duration}
                    onChange={e => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={editingEvent.difficulty}
                    onChange={e => setEditingEvent({ ...editingEvent, difficulty: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Group Size"
                    value={editingEvent.groupSize}
                    onChange={e => setEditingEvent({ ...editingEvent, groupSize: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={editingEvent.image}
                  onChange={e => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                />
                <textarea
                  placeholder="Event Description"
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-24 resize-none"
                  required
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaSave /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 