import { useForm, SubmitHandler } from "react-hook-form";
import { RoomType, RoomStatus } from "../api/roomsService";
import { useAddRoom } from "../hooks/useRoom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AddRoom, AddRoomSchema } from "../validations/roomValidators";
import { yupResolver } from "@hookform/resolvers/yup";

const ModalRooms = ({ isModalOpen, setIsModalOpen }) => {
  const { user, searchedRooms } = useContext(UserContext);

  const mutateRoom = useAddRoom();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddRoom>({ resolver: yupResolver(AddRoomSchema) });

  const onSubmit: SubmitHandler<AddRoom> = (data) => {
    const formattedData = {
      ...data,
      room_capacity: Number(data.room_capacity),
      price_per_night: Number(data.price_per_night),
    };

    reset();
    setIsModalOpen(false);
    mutateRoom.mutate(formattedData);
  };

  return (
    <>
      {(user?.role === "admin" || user?.role === "supervisor") && (
        <div className="text-center mt-10 mb-6">
          {/* Button to open the modal */}
          <button
            className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:bg-gray-700 transition duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Add New Room
          </button>

          {/* Modal */}
          {isModalOpen && (
            <dialog
              id="my_modal_5"
              className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
              open
            >
              <div className="modal-box bg-gray-900 p-8 rounded-xl shadow-lg relative text-white w-96">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2 className="text-3xl font-bold text-center mb-6">
                    Add New Room
                  </h2>

                  {/* Room Number Field */}
                  <label className="block text-lg mb-4">
                    Room Number
                    <input
                      {...register("room_number")}
                      type="text"
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                      placeholder="Room number"
                    />
                    {errors.room_number && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.room_number.message}
                      </p>
                    )}
                  </label>

                  {/* Room Type Select */}
                  <label className="block text-lg mb-4">
                    Room Type
                    <select
                      {...register("room_type")}
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                    >
                      <option value={RoomType.single}>Single</option>
                      <option value={RoomType.double}>Double</option>
                      <option value={RoomType.suite}>Suite</option>
                      <option value={RoomType.pentHouse}>Penth house</option>
                      <option value={RoomType.presidentialSuite}>
                        Presidential suite
                      </option>
                    </select>
                    {errors.room_type && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.room_type.message}
                      </p>
                    )}
                  </label>

                  {/* Room Capacity Field */}
                  <label className="block text-lg mb-4">
                    Room Capacity
                    <input
                      {...register("room_capacity")}
                      type="number"
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                      placeholder="Capacity (up to 8 guests)"
                    />
                    {errors.room_capacity && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.room_capacity.message || "Enter a valid number"}
                      </p>
                    )}
                  </label>

                  {/* Price Per Night Field */}
                  <label className="block text-lg mb-4">
                    Price per Night
                    <input
                      {...register("price_per_night")}
                      type="number"
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                      placeholder="Price per night"
                    />
                    {errors.price_per_night && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.price_per_night.message ||
                          "Enter a valid number"}
                      </p>
                    )}
                  </label>

                  {/* Room Status Select */}
                  <label className="block text-lg mb-4">
                    Room Status
                    <select
                      {...register("status")}
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                    >
                      <option value={RoomStatus.available}>Available</option>
                      <option value={RoomStatus.booked}>Booked</option>
                      <option value={RoomStatus.maintenance}>
                        Maintenance
                      </option>
                    </select>
                    {errors.status && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.status.message}
                      </p>
                    )}
                  </label>
                  <label className="block text-lg mb-4">
                    Description
                    <textarea
                      {...register("description")}
                      className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                      placeholder="This room is ..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.description.message || "Enter a text"}
                      </p>
                    )}
                  </label>

                  {/* Submit Button */}
                  <div className="modal-action">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
                    >
                      Add Room
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                </form>
              </div>
            </dialog>
          )}
        </div>
      )}
    </>
  );
};

export default ModalRooms;
