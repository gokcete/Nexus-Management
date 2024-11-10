import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Rooms } from "../api/roomsService";

export interface EditBoxProps {
  onEdit: (updatedRoomData: Rooms) => void;
  modalRoom: (modalRoom: Rooms) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const EditBox = ({ onEdit, modalRoom, setIsOpen }: EditBoxProps) => {
  const { register, reset, handleSubmit } = useForm();

  useEffect(() => {
    if (modalRoom) {
      reset({
        room_type: modalRoom.room_type,
        room_capacity: modalRoom.room_capacity,
        price_per_night: modalRoom.price_per_night,
        status: modalRoom.status,
      });
    }
  }, [modalRoom, reset]);
  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="modal-box bg-gray-900 text-white p-6 rounded-xl shadow-lg relative">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Edit Room {modalRoom?.room_number}
        </h2>
        <form onSubmit={handleSubmit(onEdit)}>
          <label className="block mb-4">
            Room Type
            <select
              {...register("room_type")}
              className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </label>

          <label className="block mb-4">
            Room Capacity
            <input
              {...register("room_capacity")}
              type="number"
              className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600"
              placeholder="Room Capacity"
            />
          </label>

          <label className="block mb-4">
            Price per night
            <input
              {...register("price_per_night")}
              type="number"
              className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600"
              placeholder="Price per Night"
            />
          </label>

          <label className="block mb-6">
            Status
            <select
              {...register("status")}
              className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600"
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default EditBox;
