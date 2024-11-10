import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useDeleteRoom,
  useFetchOneRoom,
  useUpdateRoom,
  useUpdatePictures,
  useDeletePictures,
} from "../hooks/useRoom";
import { useForm } from "react-hook-form";
import { format, isSameDay, parseISO, addDays, isValid } from "date-fns";
import EditBox from "../components/EditBox";
import RoomPhotos from "../components/RoomPhotos";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error, isLoading } = useFetchOneRoom(id);
  const deleteMutation = useDeleteRoom();
  const editMutation = useUpdateRoom(id);
  const addPictureMutation = useUpdatePictures(id);
  const deletePicturesMutation = useDeletePictures();
  console.log("rooms data", data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPictureOpen, setIsAddPictureOpen] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [modalRoom, setModalRoom] = useState(null);
  const { register, reset, handleSubmit } = useForm();

  const groupConsecutiveDates = (dates) => {
    if (!dates || dates.length === 0) return [];
    const groupedRanges = [];
    let startDate = parseISO(dates[0]);
    let endDate = startDate;

    for (let i = 1; i < dates.length; i++) {
      const currentDate = parseISO(dates[i]);
      const nextDate = addDays(endDate, 1);

      if (isSameDay(currentDate, nextDate)) {
        endDate = currentDate;
      } else {
        groupedRanges.push({ start: startDate, end: endDate });
        startDate = currentDate;
        endDate = currentDate;
      }
    }
    groupedRanges.push({ start: startDate, end: endDate });
    return groupedRanges;
  };

  const onEdit = (updatedRoomData) => {
    editMutation.mutate(
      { id, updatedRoom: updatedRoomData },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error("Error updating room:", error);
        },
      }
    );
  };

  const onAddPictures = (data) => {
    const pictures = data.pictures;
    const files = Array.from(pictures);

    setPictureLoading(true);

    addPictureMutation.mutate(files, {
      onSuccess: () => {
        setIsAddPictureOpen(false);
        setPictureLoading(false);
      },
      onError: (error) => {
        console.error("Error uploading pictures:", error);
        setPictureLoading(false);
      },
    });
  };

  const handleEditClick = (room) => {
    setModalRoom(room);
    setIsModalOpen(true);
  };

  const handleAddPictureClick = () => {
    setIsAddPictureOpen(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      navigate("/dashboard/rooms");
      deleteMutation.mutate(id);
    }
  };

  const onDeletePictures = (id, pictures) => {
    if (window.confirm("Are you sure you want to delete the pictures?")) {
      // Trigger mutation with both id and pictures
      deletePicturesMutation.mutate(
        { id, pictures },
        {
          onSuccess: () => {
            console.log("Pictures deleted successfully");

            navigate(`/dashboard/rooms/${id}`);
          },
          onError: (error) => {
            console.error("Error deleting pictures:", error);
          },
        }
      );
    }
  };

  if (isLoading) return <div>Fetching room details...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const groupedDates = groupConsecutiveDates(data?.room?.booked_on || []);

  return (
    <div className="p-8 max-w-2xl m-auto bg-gray-900 rounded-2xl shadow-lg mt-20 flex flex-col">
      {/* Close button */}
      <button
        className="btn btn-square btn-sm self-end"
        onClick={() => navigate("/dashboard/rooms")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Photos */}
      <RoomPhotos room={data.room} />

      {/* Photos action buttons */}
      <div className="flex justify-center gap-5 ">
        <button
          className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-green-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
          onClick={() => handleAddPictureClick()}
        >
          Add New Pictures
        </button>

        {isAddPictureOpen && (
          <dialog
            open
            className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
          >
            <div className="modal-box bg-gray-800 p-8 rounded-xl shadow-lg relative text-white w-96">
              {/* Close Button */}
              <button
                onClick={() => setIsAddPictureOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>

              {pictureLoading ? (
                <div className="flex items-center justify-center">
                  <div className="text-green-500">
                    Uploading, please wait...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onAddPictures)}>
                  <label className="block text-lg mb-4">
                    Photos
                    <input
                      {...register("pictures")}
                      type="file"
                      multiple
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-green-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
                  >
                    Submit Photos
                  </button>
                </form>
              )}
            </div>
          </dialog>
        )}

        <button
          className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-red-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
          onClick={() => onDeletePictures(id, data.room.pictures)}
        >
          Delete Pictures
        </button>
      </div>

      {/* Room Details Table */}
      <div className="overflow-x-auto mb-5">
        <table className="table-auto w-full text-left text-white">
          <tbody>
            <tr>
              <th className="p-3 bg-gray-800 rounded-t-lg">Room Type</th>
              <td className="p-3 bg-gray-700">
                {data?.room?.room_type || "N/A"}
              </td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-800">Status</th>
              <td className="p-3 bg-gray-700">{data?.room?.status || "N/A"}</td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-800">Room Capacity</th>
              <td className="p-3 bg-gray-700">
                {data?.room?.room_capacity || "N/A"}
              </td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-800">Price per Night</th>
              <td className="p-3 bg-gray-700">
                ${data?.room?.price_per_night || "N/A"}
              </td>
            </tr>
            <tr>
              <th colSpan="2" className="p-4 bg-gray-800 text-center">
                Booking Schedule
              </th>
            </tr>
            <tr>
              <td colSpan="2">
                <table className="table-auto w-full bg-gray-700 text-white text-center">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Start Date</th>
                      <th className="border px-4 py-2">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedDates?.map((range, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          {isValid(range.start)
                            ? format(range.start, "yyyy-MM-dd")
                            : "Invalid date"}
                        </td>
                        <td className="border px-4 py-2">
                          {isValid(range.end)
                            ? format(range.end, "yyyy-MM-dd")
                            : "Invalid date"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-5 mt-6">
        <button
          className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition duration-300"
          onClick={() => handleEditClick(data?.room)}
        >
          Edit
        </button>

        <button
          className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-600 transition duration-300"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {modalRoom && isModalOpen && (
        <EditBox
          onEdit={onEdit}
          modalRoom={modalRoom}
          setIsOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default RoomDetails;
