import { useForm } from "react-hook-form";

export interface Filters {
  room_capacity?: number;
  priceMin?: string;
  priceMax?: string;
  status?: string;
}

export interface FilterBoxProps {
  onFilter: (filters: Filters) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const FilterBox = ({ onFilter, setIsFilterOpen }: FilterBoxProps) => {
  const { register, handleSubmit } = useForm<Filters>();

  return (
    <div className="modal-box bg-gray-900 p-8 rounded-xl shadow-lg relative text-white w-96">
      <form
        onSubmit={handleSubmit(onFilter)}
        className="w-full max-w-md mx-auto p-4"
      >
        {/* Capacity Filter */}
        <label className="block text-white text-lg mb-4">
          Room Capacity
          <input
            type="number"
            {...register("room_capacity")}
            placeholder="Room Capacity"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>

        {/* Status Filter */}
        <label className="block text-white text-lg mb-4">
          Status
          <select
            {...register("status")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value={""}>Select status</option>
            <option value="available">Available</option>

            <option value="maintenance">Maintenance</option>
          </select>
        </label>

        {/* Price Filter */}
        <label className="block text-lg mb-6">
          Minimum Price
          <input
            type="number"
            defaultValue={0}
            {...register("priceMin")}
            placeholder="Min Price"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          />
        </label>
        <label className="block text-lg mb-6">
          Maximum Price
          <input
            type="number"
            {...register("priceMax")}
            placeholder="Max Price"
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

export default FilterBox;
