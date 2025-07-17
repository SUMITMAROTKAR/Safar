import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';
import { eventsAPI } from '../services/api';
import Modal from '../components/Modal';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', people: 1, date: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventsAPI.getById(id);
        setEvent(res.data);
      } catch (err) {
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading event...</div>;
  if (error || !event) return <div className="p-8 text-center text-red-500">{error || 'Event not found.'}</div>;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setShowPayment(true);
  };
  const handleMockPayment = async () => {
    try {
      // Submit booking to backend (implement this endpoint in your backend)
      await eventsAPI.bookEvent({ ...form, eventId: event._id, paid: true });
      setShowPayment(false);
      setPaymentSuccess(true);
      setSubmitted(true);
    } catch (err) {
      setError('Booking failed. Please try again.');
      setShowPayment(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Banner & Details */}
      <div className="md:col-span-2">
        <img src={event.image && event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6 shadow" />
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <FaUser className="mr-2 text-blue-500" /> {event.guide}
          <FaMapMarkerAlt className="ml-6 mr-2 text-blue-500" /> {event.location}
        </div>
        <div className="flex flex-wrap gap-4 text-gray-500 mb-4">
          <span className="flex items-center"><FaCalendarAlt className="mr-1" /> {event.date}</span>
          <span className="flex items-center"><FaClock className="mr-1" /> {event.duration}</span>
          <span className="flex items-center"><FaChartLine className="mr-1" /> {event.difficulty}</span>
          <span className="flex items-center"><FaUsers className="mr-1" /> {event.groupSize} people</span>
          <span className="flex items-center text-yellow-500"><FaStar className="mr-1" /> {event.rating || 4.5}</span>
        </div>
        <div className="mb-6 text-gray-700 leading-relaxed">{event.description}</div>
        {/* Gallery */}
        {event.gallery && event.gallery.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Gallery</h2>
            <div className="flex gap-4 overflow-x-auto">
              {event.gallery.map((img, i) => (
                <img key={i} src={img} alt="Gallery" className="w-40 h-28 object-cover rounded-lg shadow" />
              ))}
            </div>
          </div>
        )}
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Back to Events</button>
      </div>
      {/* Booking Form */}
      <div className="md:sticky md:top-24 h-fit bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Book This Event</h2>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full" onClick={() => navigate(`/booking/${id}`)}>Book Now</button>
      </div>
    </div>
  );
} 