import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import LocationCard from "../components/LocationCard";
import { FaBars, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { eventsAPI } from '../services/api';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import Modal from "../components/Modal"; // (Assume we will create this if not present)
import { aboutAPI } from '../services/api';

const heroSlides = [
  {
    type: "trip",
    title: "Kalu Waterfall Trek",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    description: "Trek to the majestic Kalu Waterfall, the highest in Malshej region. Includes guide, food, and transport.",
    cta: "Book Now",
    link: "/location/pune",
  },
  {
    type: "guide",
    title: "Guide: Meera Pawar",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Expert in Pune treks, speaks English & Marathi, 4.8★ rating.",
    cta: "Book Guide",
    link: "/location/pune",
  },
  {
    type: "transport",
    title: "Trip Bus & Cab Options",
    image: "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable AC buses and cabs available for all Pune trips.",
    cta: "View Transport",
    link: "/location/pune",
  },
  {
    type: "places",
    title: "Explore All Pune Places",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "See all adventure, camping, and waterfall trips in Pune.",
    cta: "See Trips",
    link: "/location/pune",
  },
];

const sliderImages = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    text: 'Explore Beautiful Destinations',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80',
    text: 'Book Your Next Adventure',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    text: 'Stay in Comfort',
  },
  {
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
    text: 'Events & Festivals Await',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1200&q=80',
    text: 'Personalize Your Experience',
  },
];

function HamburgerMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEditAbout, setShowEditAbout] = React.useState(false);
  const [aboutContent, setAboutContent] = React.useState('');
  const [editValue, setEditValue] = React.useState('');
  const [loadingAbout, setLoadingAbout] = React.useState(true);
  const [errorAbout, setErrorAbout] = React.useState('');

  React.useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoadingAbout(true);
        const res = await aboutAPI.get();
        setAboutContent(res.data.content);
        setEditValue(res.data.content);
      } catch (err) {
        setErrorAbout('Failed to load About info');
      } finally {
        setLoadingAbout(false);
      }
    };
    if (open) fetchAbout();
  }, [open]);

  const handleSaveAbout = async () => {
    try {
      setLoadingAbout(true);
      const res = await aboutAPI.update(editValue);
      setAboutContent(res.data.content);
      setShowEditAbout(false);
    } catch (err) {
      setErrorAbout('Failed to update About info');
    } finally {
      setLoadingAbout(false);
    }
  };

  return (
    <div className={`fixed top-0 right-0 z-50 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} bg-white shadow-lg w-56 h-full flex flex-col p-6`}> 
      <button className="self-end mb-4 text-2xl" onClick={onClose}>&times;</button>
      {user ? (
        <>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700">Welcome, {user.username}</div>
            <div className="text-sm text-blue-600">{user.role === 'admin' ? 'Administrator' : 'User'}</div>
          </div>
          <button
            className="py-2 px-2 hover:bg-gray-100 rounded transition text-left w-full"
            onClick={() => setShowEditAbout(true)}
          >
            About
          </button>
          <a href="#profile" className="py-2 px-2 hover:bg-gray-100 rounded transition">Profile</a>
          {user.role === 'admin' && (
            <button 
              onClick={() => {
                onClose();
                navigate('/admin');
              }}
              className="py-2 px-2 hover:bg-gray-100 rounded transition text-left w-full text-blue-600 font-semibold"
            >
              Admin Panel
            </button>
          )}
          <button 
            onClick={() => {
              onClose();
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="py-2 px-2 hover:bg-red-50 rounded transition text-left w-full text-red-600 font-semibold mt-4"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-700">Guest User</div>
            <div className="text-sm text-gray-600">Please login to access all features</div>
          </div>
          <button 
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold mb-4"
          >
            Login
          </button>
          <button
            className="py-2 px-2 hover:bg-gray-100 rounded transition text-left w-full"
            onClick={() => setShowEditAbout(true)}
          >
            About
          </button>
        </>
      )}
      {showEditAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
            <button className="absolute top-2 right-4 text-2xl" onClick={() => setShowEditAbout(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">About & Contact</h2>
            {loadingAbout ? (
              <div className="text-gray-500">Loading...</div>
            ) : errorAbout ? (
              <div className="text-red-500">{errorAbout}</div>
            ) : user && user.role === 'admin' ? (
              <>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  rows={4}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSaveAbout} disabled={loadingAbout}>Save</button>
              </>
            ) : (
              <div className="text-gray-700 whitespace-pre-line">{aboutContent}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Slider() {
  const [current, setCurrent] = useState(0);
  const length = sliderImages.length;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current, length]);

  return (
    <div className="relative w-full h-[80vh] md:h-screen overflow-hidden">
      {sliderImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={img.src} alt="slide" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h2 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg text-center">{img.text}</h2>
          </div>
        </div>
      ))}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 text-xl z-20 transition"
        onClick={() => setCurrent((current - 1 + length) % length)}
        aria-label="Previous slide"
      >&#8592;</button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 text-xl z-20 transition"
        onClick={() => setCurrent((current + 1) % length)}
        aria-label="Next slide"
      >&#8594;</button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {sliderImages.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-white/50'} transition`}
          />
        ))}
      </div>
    </div>
  );
}

// Remove all mock event and location data
// Only use events and locations fetched from backend
// Remove or comment out any const events = [...] and const locations = [...] declarations

function Home() {
  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [slide, setSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Expanded mock data with more destinations and images, including Pune
  const popularDestinations = [
    { id: 1, name: "Manali", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", description: "A beautiful hill station in Himachal Pradesh." },
    { id: 2, name: "Goa", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", description: "Famous for its beaches and nightlife." },
    { id: 3, name: "Jaipur", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", description: "The Pink City, known for its rich history and architecture." },
    { id: 4, name: "Pune", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80", description: "A vibrant city near the Western Ghats, gateway to camping and adventure trips." },
  ];
  // List of static locations to exclude from search results
  const staticLocations = ["Pune", "Goa", "Manali", "Jaipur"];
  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter events based on search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase())
  );

  // Hero slider controls
  const nextSlide = () => setSlide((slide + 1) % heroSlides.length);
  const prevSlide = () => setSlide((slide - 1 + heroSlides.length) % heroSlides.length);

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    guide: '',
    location: '',
    price: '',
    image: '',
    date: '',
    duration: '',
    difficulty: '',
    groupSize: '',
    description: '',
  });

  // Load events from backend
  React.useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        setEvents(response.data);
      } catch (error) {
        console.error('Error loading events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Mock data for locations
  const locations = [
    { name: "Pune", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80" },
    { name: "Goa", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
    { name: "Manali", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
    { name: "Jaipur", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
  ];

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      // Check if image is uploaded
      if (!newEvent.image) {
        toast.error('Please upload an image for the event');
        return;
      }

      // Submit event request to backend
      await eventsAPI.submitRequest({
        ...newEvent,
        price: parseInt(newEvent.price),
        groupSize: parseInt(newEvent.groupSize)
      });
      toast.success('Event request submitted! Awaiting admin approval.');
      setShowAddEvent(false);
      setNewEvent({
        title: '', guide: '', location: '', price: '', image: '', date: '', duration: '', difficulty: '', groupSize: '', description: '',
      });
      // Refresh events list
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error submitting event request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit event request');
    }
  };

  const handleEventImageUpload = (imageUrl) => {
    setNewEvent(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  // Helper to check if events exist for a location
  const hasEventsForLocation = (locName) => events.some(e => e.location && e.location.toLowerCase() === locName.toLowerCase());

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-12 bg-white/80 shadow-sm sticky top-0 z-30">
        <div className="flex-1 flex items-center justify-center relative">
          <span className="text-xs md:text-sm text-gray-400 font-semibold mr-4 hidden md:inline">safer sukoon ke aur...</span>
          <input
            type="text"
            placeholder="Search for events, places, or guides..."
            className="w-full md:w-[32rem] px-6 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-md animate-fadeIn"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearchResults(search.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          />
          {showSearchResults && filteredEvents.length > 0 && (
            <div className="absolute top-16 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
              {filteredEvents.map(event => (
                <div
                  key={event._id}
                  className="px-6 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    navigate(`/event/${event._id}`);
                    setShowSearchResults(false);
                    setSearch("");
                  }}
                >
                  <img src={event.image && event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <div className="font-semibold text-blue-700">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.location}</div>
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="px-6 py-3 text-gray-500">No events found.</div>
              )}
            </div>
          )}
        </div>
        
        {/* Login/User Status */}
        <div className="flex items-center space-x-4 ml-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user.username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition font-semibold shadow-md"
            >
              Login
            </button>
          )}
          
          <button
            className="text-2xl md:text-3xl p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>
        
        <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      {/* Add margin below search bar for spacing */}
      <div className="mt-8" />

      {/* Slider */}
      <Slider />

      {/* Login CTA Section - Only show if user is not logged in */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Login to access exclusive deals, save your preferences, and manage your bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
              >
                Login Now
              </button>
              <div className="text-white text-sm">
                <div className="font-semibold mb-1">Demo Credentials:</div>
                <div>Admin: sam.marotkar / 7758892030</div>
                <div>User: any username & password</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Upcoming Events</h2>
          {user && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-semibold shadow"
              onClick={() => setShowAddEvent(true)}
            >
              + Add Event
            </button>
          )}
        </div>
        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleAddEvent} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-3 relative">
              <button type="button" className="absolute top-2 right-4 text-2xl" onClick={() => setShowAddEvent(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-2">Add New Event</h3>
              <input required placeholder="Title" className="border rounded px-3 py-2" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
              <input required placeholder="Guide Name" className="border rounded px-3 py-2" value={newEvent.guide} onChange={e => setNewEvent({ ...newEvent, guide: e.target.value })} />
              <input required placeholder="Location" className="border rounded px-3 py-2" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
              <input required placeholder="Price" type="number" className="border rounded px-3 py-2" value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: e.target.value })} />
              <div className="border rounded px-3 py-2">
                <ImageUpload
                  onImageUpload={handleEventImageUpload}
                  currentImage={newEvent.image}
                  placeholder="Upload Event Image"
                  showPreview={false}
                />
              </div>
              <input required placeholder="Date" type="date" className="border rounded px-3 py-2" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
              <input required placeholder="Duration" className="border rounded px-3 py-2" value={newEvent.duration} onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })} />
              <input required placeholder="Difficulty" className="border rounded px-3 py-2" value={newEvent.difficulty} onChange={e => setNewEvent({ ...newEvent, difficulty: e.target.value })} />
              <input required placeholder="Group Size" type="number" className="border rounded px-3 py-2" value={newEvent.groupSize} onChange={e => setNewEvent({ ...newEvent, groupSize: e.target.value })} />
              <textarea required placeholder="Description" className="border rounded px-3 py-2" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Add Event</button>
            </form>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No events available yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {events.map(event => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-4 flex flex-col cursor-pointer group"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <img 
                  src={event.image && event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} 
                  alt={event.title} 
                  className="rounded-xl w-full h-40 object-cover mb-4 group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <span className="mr-2">👤 {event.guide}</span>
                  <span className="flex items-center ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-yellow-400 ${i < Math.round(event.rating || 4.5) ? '' : 'opacity-30'}`} />
                    ))}
                    <span className="ml-1 font-medium">{event.rating || 4.5}</span>
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <FaMapMarkerAlt className="mr-1 text-blue-500" /> {event.location}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-600 font-bold text-lg">₹{event.price}</span>
                  <button className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm" onClick={e => { e.stopPropagation(); navigate(`/booking/${event._id}`); }}>Book Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locations Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-700">Popular Locations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {locations.map(loc => (
            <LocationCard
              key={loc.name}
              image={loc.image}
              name={loc.name}
              description={loc.description || ''}
              onClick={() => {
                if (hasEventsForLocation(loc.name)) {
                  // Navigate to location page or show events (customize as needed)
                  navigate(`/location/${loc.name.toLowerCase()}`);
                } else {
                  setSelectedLocation(loc.name);
                  setShowComingSoon(true);
                }
              }}
            />
          ))}
        </div>
        {showComingSoon && (
          <Modal onClose={() => setShowComingSoon(false)}>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">{selectedLocation} - Coming Soon!</h3>
              <p className="text-gray-600">We're working to bring events to this location. Stay tuned!</p>
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full" onClick={() => setShowComingSoon(false)}>Close</button>
            </div>
          </Modal>
        )}
      </div>

      {/* Card Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
          <img src="https://img.icons8.com/ios-filled/100/4a90e2/hotel-room.png" alt="Stay" className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stay</h3>
          <p className="text-gray-500 text-center mb-4">Find hotels, hostels, and unique stays for your trip.</p>
          <button className="mt-auto px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Book Stay</button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
          <img src="https://img.icons8.com/ios-filled/100/4a90e2/ticket.png" alt="Event Booking" className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Event Booking</h3>
          <p className="text-gray-500 text-center mb-4">Book tickets for festivals, concerts, and local events.</p>
          <button className="mt-auto px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Book Event</button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
          <img src="https://img.icons8.com/ios-filled/100/4a90e2/settings.png" alt="Home Setting" className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Home Setting</h3>
          <p className="text-gray-500 text-center mb-4">Manage your preferences and personalize your experience.</p>
          <button className="mt-auto px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Settings</button>
        </div>
      </div>

      {/* Floating Login Button - Only show if user is not logged in */}
      {!user && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Login"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </div>
    </>
  );
}

export default Home; 