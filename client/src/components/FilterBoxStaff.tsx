import { useForm } from "react-hook-form";

export interface StaffFilters {
  role?: string;
  activated?: string;
}

export interface FilterBoxProps {
  onFilter: (staffFilters: StaffFilters) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
}

const FilterBoxStaff = ({ onFilter, setIsFilterOpen }: FilterBoxProps) => {
  const { register, handleSubmit } = useForm<StaffFilters>();

  return (
    <div className="modal-box bg-gray-900 p-8 rounded-xl shadow-lg relative text-white w-96">
      <form
        onSubmit={handleSubmit(onFilter)}
        className="w-full max-w-md mx-auto p-4"
      >
        {/* Role Filter */}
        <label className="block text-white text-lg mb-4">
          Status
          <select
            {...register("role")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value={""}>Select role</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="staff">Staff</option>
          </select>
        </label>

        {/* Activated Filter */}
        <label className="block text-white text-lg mb-4">
          Status
          <select
            {...register("activated")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value={""}>Select Activated</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
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

export default FilterBoxStaff;
