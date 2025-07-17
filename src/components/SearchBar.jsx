import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center bg-white rounded shadow px-4 py-2">
      <input
        type="text"
        placeholder="Search for a place..."
        className="flex-1 outline-none px-2 py-1 text-gray-700"
        value={value}
        onChange={onChange}
      />
      <span className="material-icons text-gray-400 ml-2">search</span>
    </div>
  );
}

export default SearchBar; 