import React from "react";
import { Link } from "react-router-dom";

const serviceIcons = {
  "Stay": "🏨",
  "Transport": "🚗",
  "Food": "🍽️",
  "Safety gear": "🦺",
  "First aid kit": "🩹",
};

function GuideCard({ id, name, image, rating, languages, services, price }) {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-5 flex flex-col border-2 border-blue-100 hover:border-blue-400 transition">
      <div className="flex items-center mb-3">
        <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-200" />
        <div>
          <h3 className="text-lg font-bold text-blue-700">{name}</h3>
          <p className="text-yellow-500 font-bold">★ {rating}</p>
          <p className="text-gray-500 text-sm">{languages.join(", ")}</p>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Services:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {services.map((s, i) => (
            <span key={i} className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
              {serviceIcons[s] || "✅"} <span className="ml-1">{s}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center mt-auto pt-3">
        <span className="font-bold text-blue-600 text-lg">₹{price}</span>
        <Link to={`/booking/${id}`} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-semibold transition">Book Now</Link>
      </div>
    </div>
  );
}

export default GuideCard; 