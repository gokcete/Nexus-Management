import { useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useConfirmBooking, useDeleteBooking } from "../hooks/useBook";

const TableDashboardBookings = ({ isLoading, isError, bookings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const confirmMutation = useConfirmBooking();
  const deleteBooking = useDeleteBooking();

  // Handle confirm action
  const onConfirm = (id) => {
    confirmMutation.mutate(id);
    window.location.reload();
  };

  // Handle delete action
  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id);
      window.location.reload();
    }
  };

  // Get today's date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // Filter the bookings to only include those with today's check-in date
  const todaysBookings = bookings.bookings
    .filter(
      (booking) =>
        booking?.status === "pending" || booking?.status === "checked-in"
    )
    .filter((booking) => booking?.checkIn_date === today);

  // Calculate pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = todaysBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Change page
  const nextPage = () => {
    if (indexOfLastBooking < todaysBookings.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to calculate the number of nights between check-in and check-out dates
  const calculateNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  if (isLoading) {
    return (
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  }

  if (isError) {
    return <div>{data?.error?.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-800">
      {/* Table */}
      <div className="flex-grow overflow-y-auto px-6 pb-6">
        <h2 className="text-white border inline-block px-4 py-2 rounded-lg">
          Today we have a total of{" "}
          <span className="text-green-500 font-bold text-lg">
            {todaysBookings.length}
          </span>{" "}
          Check-In{todaysBookings.length > 1 ? "s" : ""}{" "}
        </h2>
        <table className="table-auto w-full text-gray-100 bg-gray-900 rounded-lg shadow-lg">
          <thead className="bg-gray-800">
            <tr className="text-left">
              <th className="p-3"></th>
              <th className="p-3">Room</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Status</th>
              <th className="p-3">Nights</th>
              <th className="p-3">Price</th>
              <th className="p-3"></th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentBookings?.length > 0 ? (
              currentBookings.map((booking) => {
                const numberOfNights = calculateNights(
                  booking.checkIn_date,
                  booking.checkOut_date
                );
                return (
                  <tr
                    key={booking._id}
                    className="border-b border-gray-700  transition"
                  >
                    <th></th>
                    <td className="p-3">{booking.room_info?.room_number}</td>
                    <td className="p-3">
                      {booking.guest_info?.guest_name} <br />
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
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
                    <td className="p-3">{numberOfNights}</td>
                    <td className="p-3">{booking.total_price}</td>
                    <td className="p-3">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => onConfirm(booking._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-500 transition"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                    <td>
                      {booking.status === "pending" && (
                        <button
                          onClick={() => onDelete(booking._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-500 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center">
                  No bookings for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>

          <button
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
            onClick={nextPage}
            disabled={indexOfLastBooking >= todaysBookings.length}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableDashboardBookings;
