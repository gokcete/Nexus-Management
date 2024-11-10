import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  useDeleteStaff,
  useEditAdmin,
  useFetchOneStaff,
} from "../hooks/useStaff";
import { useForm } from "react-hook-form";
import Logo from "../assets/logo.png";

const StaffDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error, isLoading } = useFetchOneStaff(id);
  const deleteMutation = useDeleteStaff();
  const editMutation = useEditAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStaff, setModalStaff] = useState(null);

  const { register, reset, handleSubmit } = useForm();

  const onEdit = (staffId, updatedStaff) => {
    editMutation.mutate({ userId: staffId, updatedStaff });
    setIsModalOpen(false);
  };

  const handleEditClick = (staff) => {
    setModalStaff(staff);
    setIsModalOpen(true);
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Fetching staff details...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="p-8 max-w-2xl m-auto bg-gray-900  shadow-lg text-white mt-20 rounded-2xl flex flex-col">
      {/* Close button */}
      <button
        className="btn btn-square btn-sm self-end"
        onClick={() => navigate("/dashboard/staff")}
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
      {/* Avatar */}
      <div className="avatar mb-5 self-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
          <img
            src={data.staff.pic ? data.staff.pic : Logo}
            alt="Staff Avatar"
            className="object-cover"
          />
        </div>
      </div>

      {/* Staff Details Table */}
      <div className="overflow-x-auto mb-5">
        <table className="table-auto w-full text-left bg-gray-800 text-white rounded-lg shadow-lg">
          <tbody>
            <tr>
              <th className="p-3 bg-gray-700">Name</th>
              <td className="p-3 bg-gray-600">{data.staff.name}</td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-700">Username</th>
              <td className="p-3 bg-gray-600">{data.staff.username}</td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-700">Role</th>
              <td className="p-3 bg-gray-600">{data.staff.role}</td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-700">Phone Number</th>
              <td className="p-3 bg-gray-600">{data.staff.phone}</td>
            </tr>
            <tr>
              <th className="p-3 bg-gray-700">Address</th>
              <td className="p-3 bg-gray-600">{data.staff.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-5">
        <button
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 transition duration-300"
          onClick={() => handleEditClick(data.staff)}
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
      {isModalOpen && modalStaff && (
        <dialog
          open
          className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >
          <div className="modal-box bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  username: e.target.username.value,
                  role: e.target.role.value,
                  activated: e.target.activated.value === "true",
                };
                onEdit(modalStaff._id, formData);
              }}
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Edit Staff
              </h2>

              {/* Username Field */}
              <label className="block mb-4">
                Username
                <input
                  name="username"
                  type="text"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                  defaultValue={modalStaff.username}
                />
              </label>

              {/* Role Select */}
              <label className="block mb-4">
                Role
                <select
                  name="role"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                  defaultValue={modalStaff.role.toLowerCase()}
                >
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="staff">Staff</option>
                </select>
              </label>

              {/* Activated Select */}
              <label className="block mb-4">
                Activated
                <select
                  name="activated"
                  className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                  defaultValue={modalStaff.activated ? "true" : "false"}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>

              {/* Submit Button */}
              <div className="flex justify-center gap-5 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-400 px-6 py-2 rounded-lg shadow-md text-white hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
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

export default StaffDetails;
