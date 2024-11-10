import { Link } from "react-router-dom";
import {
  useDeleteStaff,
  useEditAdmin,
  useFilterStaff,
} from "../hooks/useStaff";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import FilterBoxStaff, { StaffFilters } from "./FilterBoxStaff";
import { BsFilterSquareFill } from "react-icons/bs";
import Logo from "../assets/logo.png";
import { Staff } from "../api/staffService";

interface TableStaffProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableStaff: React.FC<TableStaffProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<StaffFilters>({});
  const { data, error, isLoading } = useFilterStaff(filters, currentPage);
  const deleteMutation = useDeleteStaff();
  const editMutation = useEditAdmin();
  const [modalStaff, setModalStaff] = useState<Staff | null>(null);
  const staff = data?.staff;

  const onNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const onPrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const onEdit = (staffId: string, updatedStaff: Staff) => {
    editMutation.mutate({ userId: staffId, updatedStaff });
    setIsOpen(false);
  };

  const handleEditClick = (staff: Staff) => {
    setModalStaff(staff);
    setIsOpen(true);
  };

  const onFilter = (newFilters: StaffFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const onDelete = (staffId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(staffId);
    }
  };

  if (isLoading) return <div>Fetching staff...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex flex-col min-h-full bg-gray-800 p-6">
      <div
        className={`transition-all ease-in duration-200 ${
          isModalOpen ? "blur-md" : ""
        } ${isOpen ? "blur-md" : ""}`}
      >
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
            <FilterBoxStaff
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

        <table className="table-auto w-full text-left bg-gray-900 text-white rounded-2xl shadow-lg">
          <thead className="bg-gray-800 text-gray-200">
            <tr className="text-lg">
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Role</th>
              <th className="p-3">Activated</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {Array.isArray(staff) ? (
              staff.map((staff) => (
                <tr
                  key={staff._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={staff.pic ? staff.pic : Logo}
                        alt="Avatar"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <Link
                      className="text-blue-400 hover:text-blue-300"
                      to={`/dashboard/staff/${staff._id}`}
                    >
                      {staff.name}
                    </Link>
                  </td>
                  <td className="p-3">{staff.username}</td>
                  <td className="p-3">{staff.role}</td>
                  <td className="p-3">{staff.activated ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <button
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 transition duration-300"
                      onClick={() => handleEditClick(staff)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-red-500 hover:to-red-600 transition duration-300"
                      onClick={() => onDelete(staff._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-3 text-center">
                  No staff found or data is not an array
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={data?.pagination.isFirstPage}
            onClick={onPrevious}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-gray-500 hover:to-gray-600 transition disabled:opacity-50"
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          <button
            disabled={data?.pagination.isLastPage}
            onClick={onNext}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-gray-500 hover:to-gray-600 transition disabled:opacity-50"
          >
            Next
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isOpen && modalStaff && (
        <dialog
          open
          className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >
          <div className="modal-box bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;

                const formData: Staff = {
                  ...modalStaff,
                  username: (target.username as HTMLInputElement).value,
                  role: (target.role as unknown as HTMLSelectElement).value,
                  activated:
                    (target.activated as HTMLSelectElement).value === "true",
                };
                onEdit(modalStaff._id, formData);
              }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Edit Staff
              </h2>
              <label className="block mb-4">
                Username
                <input
                  name="username"
                  type="text"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
                  defaultValue={modalStaff.username}
                />
              </label>

              <label className="block mb-4">
                Role
                <select
                  name="role"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
                  defaultValue={modalStaff.role.toLowerCase()}
                >
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="staff">Staff</option>
                </select>
              </label>

              <label className="block mb-4">
                Activated
                <select
                  name="activated"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
                  defaultValue={modalStaff.activated ? "true" : "false"}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>

              <div className="flex justify-center gap-5 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-400 px-4 py-2 rounded-lg shadow-md text-white hover:bg-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default TableStaff;
