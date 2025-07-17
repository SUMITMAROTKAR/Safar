import React from "react";

function BookingForm() {
  return (
    <form className="bg-white p-6 rounded shadow flex flex-col space-y-4">
      <input type="text" placeholder="Name" className="border rounded px-3 py-2" required />
      <input type="text" placeholder="Contact" className="border rounded px-3 py-2" required />
      <input type="email" placeholder="Email" className="border rounded px-3 py-2" required />
      <div className="flex space-x-2">
        <input type="date" className="border rounded px-3 py-2 flex-1" required />
        <input type="date" className="border rounded px-3 py-2 flex-1" required />
      </div>
      <input type="number" placeholder="No. of people" className="border rounded px-3 py-2" min="1" required />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Confirm Booking</button>
    </form>
  );
}

export default BookingForm; 