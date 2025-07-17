import React from "react";

function Footer() {
  return (
    <footer className="bg-white text-center py-4 mt-8 shadow-inner">
      <span className="text-gray-500">&copy; {new Date().getFullYear()} TravelGuide. All rights reserved.</span>
    </footer>
  );
}

export default Footer; 