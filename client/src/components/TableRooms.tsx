import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { BsSearch, BsFilterSquareFill } from "react-icons/bs";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import {
  useAvailableRooms,
  useDeleteRoom,
  useUpdateRoom,
  useFilterRoom,
} from "../hooks/useRoom";
import { UserContext } from "../context/UserContext";

import SearchBox from "./SearchBox";
import EditBox from "./EditBox";
import FilterBox, { Filters } from "./FilterBox";

const TableRooms = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [modalRoom, setModalRoom] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading, error } = useFilterRoom(filters, currentPage);
  const deleteMutation = useDeleteRoom();
  const editMutation = useUpdateRoom();
  const searchRooms = useAvailableRooms();
  const rooms = data?.rooms;

  const onNext = () => {
    setCurrentPage((s) => s + 1);
  };
  const onPrevious = () => {
    setCurrentPage((s) => s - 1);
  };

  const onSearch = (data) => {
    searchRooms.mutate(data, {
      onSuccess: () => {
        setIsSearchOpen(false);
        navigate("/dashboard/rooms/available");
      },
    });
  };

  const handleEditClick = (room) => {
    setModalRoom(room);
    setIsOpen(true);
  };

  const onEdit = (updatedRoomData) => {
    editMutation.mutate(
      { id: modalRoom._id, updatedRoom: updatedRoomData },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Error updating room:", error);
        },
      }
    );
  };

  const onFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading rooms...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex flex-col min-h-full bg-gray-800">
      {/* Search Button */}
      <div className="flex justify-end px-6 py-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center bg-gradient-to-r from-gray-600 to-gray-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:bg-gray-700 transition duration-300"
        >
          <BsSearch className="mr-2" />
          Search Available Rooms
        </button>
      </div>

      {isSearchOpen && (
        <dialog
          open
          className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >
          <SearchBox onSearch={onSearch} setIsSearchOpen={setIsSearchOpen} />
        </dialog>
      )}

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
          <FilterBox onFilter={onFilter} setIsFilterOpen={setIsFilterOpen} />
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
      <div className="flex-grow overflow-y-auto px-6 pb-6">
        <table className="table-auto w-full text-gray-100 bg-gray-900 rounded-lg shadow-lg">
          <thead className="bg-gray-800">
            <tr className="text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Room Number</th>
              <th className="p-3">Room Type</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              {(user?.role === "admin" || user?.role === "supervisor") && (
                <>
                  <th className="p-3">Edit</th>
                  <th className="p-3">Delete</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rooms) ? (
              rooms.map((room) => (
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
                  <td className="p-3">
                    {user.role === "admin" || user.role === "supervisor" ? (
                      <Link
                        className="text-lg font-semibold text-blue-400 hover:text-blue-300"
                        to={`/dashboard/rooms/${room._id}`}
                      >
                        {room.room_number}
                      </Link>
                    ) : (
                      <span>{room.room_number}</span>
                    )}
                  </td>
                  <td className="p-3">{room.room_type}</td>
                  <td className="p-3">{room.room_capacity}</td>
                  <td className="p-3">${room.price_per_night}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        room.status === "available"
                          ? "bg-green-500 text-white"
                          : room.status === "booked"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>

                  {(user.role === "admin" || user.role === "supervisor") && (
                    <>
                      <td className="p-3">
                        <button
                          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                          onClick={() => handleEditClick(room)}
                        >
                          Edit
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                          onClick={() => onDelete(room._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center">
                  No rooms found
                </td>
              </tr>
            )}
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

      {/* Modal for editing room */}
      {isOpen && modalRoom && (
        <EditBox onEdit={onEdit} modalRoom={modalRoom} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default TableRooms;
