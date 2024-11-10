import {
  useDeleteBooking,
  useGetBookings,
  useFilterBooking,
} from "../hooks/useBook";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { BsFilterSquareFill } from "react-icons/bs";
import FilterBoxBookings, { BookingFilters } from "./FilterBoxBookings";
import { useState } from "react";

const TableBookings = () => {
  const deleteBooking = useDeleteBooking();
  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<BookingFilters>({});
  const { data, isLoading, error } = useFilterBooking(filters, currentPage);
  const bookings = data?.bookings;

  const onNext = () => {
    setCurrentPage((s) => s + 1);
  };
  const onPrevious = () => {
    setCurrentPage((s) => s - 1);
  };

  const onFilter = (newFilters: BookingFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Function to calculate the number of nights between check-in and check-out dates
  const calculateNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    return differenceInTime / (1000 * 3600 * 24); // Convert from milliseconds to days
  };

  // Function to format dates to a more readable format
  const formatDateWithFullMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long", // Full month name
      year: "numeric",
    });
  };

  // Handle delete action
  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id);
    }
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

  if (error) {
    return <div className="text-red-500">Error fetching bookings</div>;
  }

  return (
    <div className="px-6 py-4">
      {/* Filter Button */}

      <div className="flex justify-start px-6 py-2">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center bg-gradient-to-r from-gray-600 to-gray-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:bg-gray-700 transition duration-300"
        >
          <BsFilterSquareFill className="mr-2" />
        </button>
      </div>

      {isFilterOpen && (
        <dialog
          open
          className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >
          <FilterBoxBookings
            onFilter={onFilter}
            setIsFilterOpen={setIsFilterOpen}
          />
        </dialog>
      )}

      {/* Reset Button */}

      {Object.keys(filters).length !== 0 && (
        <div className="flex justify-start px-6 py-2">
          <button
            onClick={() => setFilters({})}
            className="flex items-center bg-gradient-to-r from-gray-600 to-gray-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:bg-gray-700 transition duration-300"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="table-auto w-full text-gray-100">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Room</th>
              <th className="p-3">Guest Details</th>
              <th className="p-3">Number of Guests</th>
              <th className="p-3">Dates</th>
              <th className="p-3 whitespace-nowrap w-auto">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((booking) => {
              const numberOfNights = calculateNights(
                booking.checkIn_date,
                booking.checkOut_date
              );

              return (
                <tr
                  key={booking._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{booking.room_info?.room_number}</td>
                  <td className="p-3">
                    {booking.guest_info.guest_name} <br />
                    <span className="text-gray-400 text-sm">
                      {booking.guest_info.guest_email}
                    </span>
                  </td>
                  <td className="p-3">{booking.guests_quantity}</td>
                  <td className="p-3">
                    {numberOfNights} night{numberOfNights > 1 ? "s" : ""} <br />
                    <span className="text-gray-400 text-sm">
                      {formatDateWithFullMonth(booking.checkIn_date)}
                    </span>{" "}
                    -{" "}
                    <span className="text-gray-400 text-sm">
                      {formatDateWithFullMonth(booking.checkOut_date)}
                    </span>
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
                      {booking.status === "checked-in"
                        ? booking.status.slice(0, 7)
                        : booking.status}
                    </span>
                  </td>
                  <td className="p-3">${booking.total_price}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      {booking.status === "pending" && (
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-400 transition">
                          Edit
                        </button>
                      )}
                      {/* Conditionally render the Delete button only if the status is not "canceled" */}
                      {booking.status === "pending" && (
                        <button
                          onClick={() => onDelete(booking._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-500 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={data?.pagination.isFirstPage}
            onClick={onPrevious}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>

          <button
            disabled={data?.pagination.isLastPage}
            onClick={onNext}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableBookings;
