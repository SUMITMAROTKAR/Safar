import React from "react";

function LocationCard({ image, name, description, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-2xl border-2 border-blue-100 hover:border-blue-400"
      onClick={onClick}
    >
      <img src={image} alt={name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-700 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default LocationCard; 