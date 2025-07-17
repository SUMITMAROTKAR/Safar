import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { eventsAPI } from "../services/api";
import { useAuth } from "../AuthContext";
import ImageUpload from "../components/ImageUpload";

function Booking() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState({ name: "", contact: "", email: "", date: "", people: 1 });
  const [confirmed, setConfirmed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventsAPI.getById(eventId);
        setEvent(res.data);
        setEditEvent(null);
        setGalleryImages(res.data.gallery || []);
        setError("");
      } catch (err) {
        setError("Event not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setBooking(b => ({ ...b, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setConfirmed(true);
    setEditing(false);
  };

  // Admin Edit Handlers
  const openEditModal = () => {
    setEditEvent({ ...event, gallery: event.gallery ? [...event.gallery] : [] });
    setGalleryImages(event.gallery ? [...event.gallery] : []);
    setShowEditModal(true);
  };
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditEvent(ev => ({ ...ev, [name]: value }));
  };
  const handleEditImageUpload = (imageUrl) => {
    setEditEvent(ev => ({ ...ev, image: imageUrl }));
  };
  const handleAddGalleryImage = (imageUrl) => {
    setGalleryImages(imgs => [...imgs, imageUrl]);
  };
  const handleRemoveGalleryImage = (idx) => {
    setGalleryImages(imgs => imgs.filter((_, i) => i !== idx));
  };
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = { ...editEvent, gallery: galleryImages };
      await eventsAPI.update(event._id, updated);
      setEvent(updated);
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading event...</div>;
  if (error || !event) return <div className="p-8 text-center text-red-500">{error || "Event not found."}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Top Book Now and Admin Edit */}
      <div className="flex items-center justify-between mb-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-lg shadow hover:bg-blue-700 transition" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}>Book Now</button>
        {user && user.role === 'admin' && (
          <button className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold ml-4" onClick={openEditModal}>Edit Event</button>
        )}
      </div>
      {/* Event Banner & Gallery */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <img src={event.image && event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="w-full h-64 object-cover rounded-xl mb-4 shadow" />
            {event.gallery && event.gallery.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Gallery</h3>
                <div className="flex gap-4 overflow-x-auto">
                  {event.gallery.map((img, i) => (
                    <img key={i} src={img} alt="Gallery" className="w-32 h-20 object-cover rounded-lg shadow" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <span className="mr-4">👤 {event.guide}</span>
              <span className="mr-4">📍 {event.location}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-500 mb-2">
              <span>📅 {event.date ? new Date(event.date).toLocaleDateString() : ''}</span>
              <span>⏱️ {event.duration}</span>
              <span>🎯 {event.difficulty}</span>
              <span>👥 {event.groupSize} people</span>
              <span className="text-yellow-500">⭐ {event.rating || 4.5}</span>
            </div>
            <div className="mb-4 text-gray-700 leading-relaxed">{event.description}</div>
            <div className="text-2xl font-bold text-blue-700 mb-2">₹{event.price}</div>
          </div>
        </div>
      </div>
      {/* Booking Form Section */}
      <div id="booking-form-section" className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Book This Event</h2>
        {!confirmed || editing ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input name="name" type="text" placeholder="Name" className="border rounded px-3 py-2" value={booking.name} onChange={handleChange} required />
            <input name="contact" type="text" placeholder="Contact" className="border rounded px-3 py-2" value={booking.contact} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" className="border rounded px-3 py-2" value={booking.email} onChange={handleChange} required />
            <input name="date" type="date" className="border rounded px-3 py-2" value={booking.date} onChange={handleChange} required />
            <input name="people" type="number" placeholder="No. of people" className="border rounded px-3 py-2" min="1" value={booking.people} onChange={handleChange} required />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editing ? "Update Booking" : "Confirm Booking"}</button>
          </form>
        ) : (
          <div className="bg-white p-6 rounded shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Your Ticket</h2>
            <div><b>Name:</b> {booking.name}</div>
            <div><b>Contact:</b> {booking.contact}</div>
            <div><b>Email:</b> {booking.email}</div>
            <div><b>Date:</b> {booking.date}</div>
            <div><b>No. of people:</b> {booking.people}</div>
            <div><b>Event:</b> {event.title}</div>
            <div><b>Guide:</b> {event.guide}</div>
            <div><b>Location:</b> {event.location}</div>
            <div><b>Price:</b> ₹{event.price}</div>
            <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setEditing(true)}>Edit Booking</button>
          </div>
        )}
      </div>
      {/* Admin Edit Modal */}
      {showEditModal && user && user.role === 'admin' && editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-3 relative">
            <button type="button" className="absolute top-2 right-4 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-2">Edit Event (Admin Only)</h3>
            <form className="flex flex-col gap-3" onSubmit={handleSaveEdit}>
              <input name="title" value={editEvent.title} onChange={handleEditChange} placeholder="Title" className="border rounded px-3 py-2" required />
              <input name="guide" value={editEvent.guide} onChange={handleEditChange} placeholder="Guide" className="border rounded px-3 py-2" required />
              <input name="location" value={editEvent.location} onChange={handleEditChange} placeholder="Location" className="border rounded px-3 py-2" required />
              <input name="price" value={editEvent.price} onChange={handleEditChange} placeholder="Price" type="number" className="border rounded px-3 py-2" required />
              <input name="date" value={editEvent.date ? editEvent.date.substring(0,10) : ''} onChange={handleEditChange} placeholder="Date" type="date" className="border rounded px-3 py-2" required />
              <input name="duration" value={editEvent.duration} onChange={handleEditChange} placeholder="Duration" className="border rounded px-3 py-2" required />
              <input name="difficulty" value={editEvent.difficulty} onChange={handleEditChange} placeholder="Difficulty" className="border rounded px-3 py-2" required />
              <input name="groupSize" value={editEvent.groupSize} onChange={handleEditChange} placeholder="Group Size" type="number" className="border rounded px-3 py-2" required />
              <textarea name="description" value={editEvent.description} onChange={handleEditChange} placeholder="Description" className="border rounded px-3 py-2" required />
              <div>
                <label className="block text-sm font-medium mb-1">Main Image</label>
                <ImageUpload onImageUpload={handleEditImageUpload} currentImage={editEvent.image} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gallery Images</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt="Gallery" className="w-20 h-14 object-cover rounded shadow" />
                      <button type="button" className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 py-0.5 text-xs opacity-80 group-hover:opacity-100" onClick={() => handleRemoveGalleryImage(idx)}>&times;</button>
                    </div>
                  ))}
                </div>
                <ImageUpload onImageUpload={handleAddGalleryImage} />
              </div>
              <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking; 