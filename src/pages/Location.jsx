import React from "react";
import GuideCard from "../components/GuideCard";
import { useParams } from "react-router-dom";

function Location() {
  const { id } = useParams();

  if (id === "pune") {
    // Mock data for Pune trips/camping with guides, including Kalu Waterfall
    const puneTrips = [
      {
        id: 1,
        name: "Pawna Lake Camping",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        description: "Enjoy lakeside camping with bonfire, music, and stargazing at Pawna Lake.",
        price: 1500,
        guides: [
          { id: 101, name: "Sahil Patil", image: "https://randomuser.me/api/portraits/men/21.jpg", rating: 4.7, languages: ["English", "Marathi", "Hindi"], services: ["Stay", "Food", "First aid kit"], price: 500 },
          { id: 102, name: "Aarti Deshmukh", image: "https://randomuser.me/api/portraits/women/32.jpg", rating: 4.8, languages: ["English", "Hindi"], services: ["Transport", "Safety gear"], price: 600 },
        ],
      },
      {
        id: 2,
        name: "Rajmachi Trek",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
        description: "A scenic trek to the historic Rajmachi Fort, perfect for adventure seekers.",
        price: 1200,
        guides: [
          { id: 103, name: "Rohit Shinde", image: "https://randomuser.me/api/portraits/men/45.jpg", rating: 4.9, languages: ["English", "Hindi"], services: ["Stay", "Transport", "First aid kit"], price: 700 },
          { id: 104, name: "Sneha Kulkarni", image: "https://randomuser.me/api/portraits/women/55.jpg", rating: 4.6, languages: ["English", "Marathi"], services: ["Food", "Safety gear"], price: 650 },
        ],
      },
      {
        id: 3,
        name: "Sinhagad Fort Day Trip",
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80",
        description: "Explore the iconic Sinhagad Fort and enjoy local food at the top.",
        price: 800,
        guides: [
          { id: 105, name: "Vikas Jadhav", image: "https://randomuser.me/api/portraits/men/67.jpg", rating: 4.5, languages: ["English", "Hindi", "Marathi"], services: ["Transport", "First aid kit"], price: 400 },
        ],
      },
      {
        id: 4,
        name: "Kalu Waterfall Trek",
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
        description: "Trek to the majestic Kalu Waterfall, the highest waterfall in the Malshej region, with lush green views and adventure.",
        price: 1600,
        guides: [
          { id: 106, name: "Meera Pawar", image: "https://randomuser.me/api/portraits/women/68.jpg", rating: 4.8, languages: ["English", "Marathi"], services: ["Transport", "Food", "First aid kit"], price: 700 },
          { id: 107, name: "Ajay More", image: "https://randomuser.me/api/portraits/men/88.jpg", rating: 4.7, languages: ["English", "Hindi"], services: ["Stay", "Safety gear"], price: 750 },
        ],
      },
    ];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pb-10">
        <div className="max-w-3xl mx-auto pt-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Pune Trips & Camping</h2>
          <div className="space-y-10">
            {puneTrips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-100 hover:border-blue-400 transition">
                <img src={trip.image} alt={trip.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-700 mb-1">{trip.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{trip.description}</p>
                  <p className="text-lg font-semibold text-purple-700 mb-4">₹{trip.price} per person</p>
                  <h4 className="text-md font-semibold text-blue-600 mb-2">Available Guides</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.guides.map(guide => (
                      <div key={guide.id} className="relative">
                        <GuideCard {...guide} />
                        <button className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Book Now</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === "goa") {
    // Mock data for Goa trips, including Dudhsagar Waterfall
    const goaTrips = [
      {
        id: 1,
        name: "Dudhsagar Waterfall Trek",
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80",
        description: "Experience the breathtaking Dudhsagar Waterfall, one of India's tallest, with a scenic trek and train ride.",
        price: 2000,
        guides: [
          { id: 201, name: "Ramesh Naik", image: "https://randomuser.me/api/portraits/men/90.jpg", rating: 4.9, languages: ["English", "Konkani", "Hindi"], services: ["Transport", "Food", "First aid kit"], price: 900 },
          { id: 202, name: "Leena D'Souza", image: "https://randomuser.me/api/portraits/women/91.jpg", rating: 4.7, languages: ["English", "Hindi"], services: ["Stay", "Safety gear"], price: 950 },
        ],
      },
    ];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pb-10">
        <div className="max-w-3xl mx-auto pt-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Goa Waterfall Trips</h2>
          <div className="space-y-10">
            {goaTrips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-100 hover:border-blue-400 transition">
                <img src={trip.image} alt={trip.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-700 mb-1">{trip.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{trip.description}</p>
                  <p className="text-lg font-semibold text-purple-700 mb-4">₹{trip.price} per person</p>
                  <h4 className="text-md font-semibold text-blue-600 mb-2">Available Guides</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.guides.map(guide => (
                      <div key={guide.id} className="relative">
                        <GuideCard {...guide} />
                        <button className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Book Now</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default location and guides (existing mock data)
  const location = {
    name: "Manali",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "A beautiful hill station in Himachal Pradesh, perfect for adventure and relaxation.",
  };
  const guides = [
    { id: 1, name: "Ravi Kumar", image: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4.8, languages: ["English", "Hindi"], services: ["Stay", "Transport", "Food", "Safety gear", "First aid kit"], price: 1200 },
    { id: 2, name: "Priya Sharma", image: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.6, languages: ["English", "Hindi", "Punjabi"], services: ["Stay", "Food", "First aid kit"], price: 1000 },
    { id: 3, name: "Amit Singh", image: "https://randomuser.me/api/portraits/men/54.jpg", rating: 4.9, languages: ["English", "Hindi", "French"], services: ["Transport", "Safety gear", "First aid kit"], price: 1400 },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pb-10">
      <div className="max-w-3xl mx-auto pt-10">
        <div className="mb-6">
          <img src={location.image} alt={location.name} className="w-full h-56 object-cover rounded-xl shadow" />
          <h2 className="text-3xl font-bold text-blue-700 mt-4 mb-2">{location.name}</h2>
          <p className="text-gray-700 mb-4">{location.description}</p>
        </div>
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">Available Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map(guide => (
            <div key={guide.id} className="relative">
              <GuideCard {...guide} />
              <button className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Location; 