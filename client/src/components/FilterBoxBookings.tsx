import { useForm } from "react-hook-form";

export interface BookingFilters {
  status?: string;
  room_number?: number;
  booked_by?: string;
  guest?: string;
  guest_quantity?: number;
}

export interface FilterBoxProps {
  onFilter: (filters: BookingFilters) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const FilterBoxBookings = ({ onFilter, setIsFilterOpen }: FilterBoxProps) => {
  const { register, handleSubmit } = useForm<BookingFilters>();

  return (
    <div className="modal-box bg-gray-900 p-8 rounded-xl shadow-lg relative text-white w-96">
      <form
        onSubmit={handleSubmit(onFilter)}
        className="w-full max-w-md mx-auto p-4"
      >
        {/* Status Filter */}
        <label className="block text-white text-lg mb-4">
          Status
          <select
            {...register("status")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value={""}>Select status</option>
            <option value="pending">Pending</option>
            <option value="checked-in">Checked-in</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>

        {/* Room Number Filter */}
        <label className="block text-white text-lg mb-4">
          Room Number
          <input
            type="number"
            {...register("room_number")}
            placeholder="Room Number"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>

        {/* Booked By Filter */}
        <label className="block text-lg mb-6">
          Booked By
          <input
            type="text"
            {...register("booked_by")}
            placeholder="Booked By"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>

        {/* Guest Name Filter */}

        <label className="block text-lg mb-6">
          Guest Name
          <input
            type="text"
            {...register("guest")}
            placeholder="Guest Name"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>

        {/* Guest Quantity Filter */}
        <label className="block text-white text-lg mb-4">
          Guest Quantity
          <input
            type="number"
            {...register("guest_quantity")}
            placeholder="Guest Quantity"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>

        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        >
          Apply Filters
        </button>
      </form>
      {/* Close Button */}
      <button
        onClick={() => setIsFilterOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
      >
        ✕
      </button>
    </div>
  );
};

export default FilterBoxBookings;
