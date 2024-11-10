import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RoomsAvailable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchedRooms, user } = useContext(UserContext);
  console.log("Thsi is the Searched Roooms ContextApi : ", searchedRooms);
  const data = searchedRooms.available_rooms;
  const date_range = searchedRooms.date_range;
  const capacity = data[0]?.room_capacity;
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(7);
  const totalPages = Math.ceil(data?.length / postsPerPage);

  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedData = data?.slice(startIndex, startIndex + postsPerPage);
  const length = data.length;

  const onNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const onPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  console.log("Thsi is the date rangee", date_range);
  const navigate = useNavigate(); // Add navigation hook

  return (
    <div className="p-6 bg-gray-800 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg">
          {length > 1
            ? `${length} Rooms available`
            : `${length} Room available`}{" "}
          for {capacity} Guests
        </h2>
        <h3 className="text-white text-xl px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg">
          {date_range}
        </h3>
      </div>

      {/* Table */}
      <table className="table-auto w-full text-gray-100 bg-gray-900 rounded-lg shadow-lg">
        <thead className="bg-gray-800">
          <tr className="text-left text-lg">
            <th className="p-3">Image</th>
            <th className="p-3">Room Number</th>
            <th className="p-3">Room Type</th>
            <th className="p-3">Room Capacity</th>
            <th className="p-3">Price</th>
            <th className="p-3">Book now</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) ? (
            paginatedData
              .sort((a, b) => a.room_capacity - b.room_capacity)
              .map((room) => (
                <tr
                  key={room._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={room.pictures[0]}
                        alt={`Room #${room.room_number}`}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  {user.role === "admin" || user.role === "supervisor" ? (
                    <td className="p-3">
                      <Link
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                        to={`/dashboard/rooms/${room._id}`}
                      >
                        {room.room_number}
                      </Link>
                    </td>
                  ) : (
                    <td className="p-3">{room.room_number}</td>
                  )}
                  <td className="p-3">{room.room_type}</td>
                  <td className="p-3">{room.room_capacity}</td>
                  <td className="p-3">${room.price_per_night}</td>
                  <td className="p-3">
                    <button
                      className="px-4 py-2 bg-green-700 rounded-xl hover:bg-green-800"
                      onClick={() =>
                        navigate(`/dashboard/bookings/${room._id}`, {
                          state: { date_range, capacity },
                        })
                      } // Pass state with navigate
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center">
                No rooms found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={onPrevious}
          className="flex items-center bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-2 text-white rounded-lg shadow-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          <FaArrowLeft className="mr-2" /> Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={onNext}
          className="flex items-center bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-2 text-white rounded-lg shadow-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          Next <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default RoomsAvailable;
