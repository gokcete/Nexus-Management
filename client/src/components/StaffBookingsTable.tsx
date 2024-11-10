import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const StaffBookingsTable = ({ data }) => {
  const { user } = useContext(UserContext); // Get the logged-in user from context
  const staffId = user?._id; // Assuming the staff member's ID is saved in user context

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // Limit number of bookings per page

  // Filter bookings by the staff member's ID
  const staffBookings = data?.bookings?.filter(
    (booking) => booking.created_by.staff_id === staffId
  );

  // Calculate pagination values
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = staffBookings?.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(staffBookings?.length / bookingsPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold text-white mb-4">
        My Bookings:{" "}
        <span className="text-green-500">{staffBookings.length}</span>
      </h2>
      <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="table-auto w-full text-gray-100">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Room Number</th>
              <th className="p-3">Guest Name</th>
              <th className="p-3">Guest Quantity</th>
              <th className="p-3">Check-In</th>
              <th className="p-3">Check-Out</th>
              <th className="p-3">Created At</th>
              <th className="p-3 whitespace-nowrap w-auto">Status</th>
              <th className="p-3">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings?.map((booking) => (
              <tr
                key={booking._id}
                className="border-b border-gray-700 hover:bg-gray-800 transition text-center"
              >
                <td className="p-3">{booking.room_info?.room_number}</td>
                <td className="p-3">{booking.guest_info.guest_name}</td>
                <td className="p-3">{booking.guests_quantity}</td>
                <td className="p-3">
                  {new Date(booking.checkIn_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(booking.checkOut_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(booking.createdAt).toLocaleDateString()}{" "}
                  {new Date(booking.createdAt).toLocaleTimeString()}
                </td>
                <td className="p-3 whitespace-nowrap w-auto">
                  <span
                    className={`px-4 py-2 rounded-full text-sm ${
                      booking.status === "checked-in"
                        ? "bg-green-500 text-white"
                        : booking.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-3">${booking.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display a message if no bookings found */}
        {staffBookings?.length === 0 && (
          <div className="text-center text-white mt-4">No bookings found.</div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffBookingsTable;
