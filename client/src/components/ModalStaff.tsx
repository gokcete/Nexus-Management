import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { AddUserSchema, Role } from "../validations/staffValidators";
import { useAddStaff } from "../hooks/useStaff";
import { useEffect } from "react";
import { Inputs } from "../api/staffService";

const ModalStaff = ({ isModalOpen, setIsModalOpen }) => {
  const addStaffMutation = useAddStaff();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({ resolver: yupResolver(AddUserSchema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addStaffMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false); // Close modal on successful submit
      },
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        username: "",
        password: "",
        role: "",
        phone: "",
        address: "",
      });
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ""; // Clear file input
      }
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="text-center mt-10">
      <button
        className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        Add New User
      </button>

      {isModalOpen && (
        <dialog
          open
          className="modal bg-black bg-opacity-40 fixed inset-0 flex items-center justify-center"
        >
          <div className="modal-box bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-2xl font-bold text-center mb-6">
                Add New User
              </h2>

              {/* Name Field */}
              <label className="block mb-4">
                <input
                  {...register("name")}
                  type="text"
                  className="block w-full p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.name.message}
                  </p>
                )}
              </label>

              {/* Username Field */}
              <label className="block mb-4">
                <input
                  {...register("username")}
                  type="text"
                  className="block w-full p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.username.message}
                  </p>
                )}
              </label>

              {/* Password Field */}
              <label className="block mb-4">
                <input
                  {...register("password")}
                  type="password"
                  className="block w-full p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.password.message}
                  </p>
                )}
              </label>

              {/* Role Select */}
              <label className="block mb-4">
                Role
                <select
                  {...register("role")}
                  className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                >
                  <option value={Role.ADMIN}>Admin</option>
                  <option value={Role.SUPERVISOR}>Supervisor</option>
                  <option value={Role.STAFF}>Staff</option>
                </select>
              </label>

              {/* Phone Field */}
              <label className="block mb-4">
                <input
                  {...register("phone")}
                  type="text"
                  className="block w-full p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.phone.message}
                  </p>
                )}
              </label>

              {/* Address Field */}
              <label className="block mb-4">
                <input
                  {...register("address")}
                  type="text"
                  className="block w-full p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.address.message}
                  </p>
                )}
              </label>

              {/* Photo Upload */}
              <label className="block mb-4">
                Photo
                <input
                  {...register("photo")}
                  type="file"
                  className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:outline-none"
                />
              </label>

              {/* Submit Button */}
              <div className="flex justify-center gap-5 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transition duration-300"
                >
                  Add User
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

export default ModalStaff;
