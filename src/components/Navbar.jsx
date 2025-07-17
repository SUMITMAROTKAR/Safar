import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-500 px-6 py-3 flex items-center shadow-md">
      <div className="flex items-center mr-4">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <circle cx="24" cy="24" r="22" stroke="#fff" strokeWidth="4" fill="#6366f1" />
          <path d="M16 32L24 16L32 32" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-white text-2xl font-bold tracking-wide">safer sukoon ke aur...</span>
      </div>
      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar; 