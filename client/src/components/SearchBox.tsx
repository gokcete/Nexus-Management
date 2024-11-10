import { useForm } from "react-hook-form";

export interface Data {
  room_capacity: number;
  startDate: Date;
  endDate: Date;
}

export interface SearchBoxProps {
  onSearch: (data: Data) => void;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const SearchBox = ({ onSearch, setIsSearchOpen }: SearchBoxProps) => {
  const { register, handleSubmit } = useForm<Data>();

  return (
    <div className="modal-box bg-gray-900 p-8 rounded-xl shadow-lg relative text-white w-96">
      <form onSubmit={handleSubmit(onSearch)}>
        <h2 className="text-3xl font-bold text-center mb-6">Find Your Room</h2>

        {/* Room Capacity Field */}
        <label className="block text-lg mb-4">
          Room Capacity
          <input
            {...register("room_capacity")}
            type="number"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Enter room capacity"
            required
          />
        </label>

        {/* Start Date Field */}
        <label className="block text-lg mb-4">
          Start Date
          <input
            {...register("startDate")}
            type="date"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            required
          />
        </label>

        {/* End Date Field */}
        <label className="block text-lg mb-6">
          End Date
          <input
            {...register("endDate")}
            type="date"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            required
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>

      {/* Close Button */}
      <button
        onClick={() => setIsSearchOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
      >
        ✕
      </button>
    </div>
  );
};

export default SearchBox;
