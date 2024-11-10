import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditStaff, useFetchUser } from "../hooks/useStaff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const EditStaff = () => {
  const { data: user, error, isLoading } = useFetchUser(); // Fetch the user data
  const editMutation = useEditStaff();
  const navigate = useNavigate();

  // Initialize the form
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      new_pass1: "",
      new_pass2: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  // Form submission handler
  const onSubmit = (data) => {
    const updatedStaff = {};

    if (data.name) updatedStaff.name = data.name;
    if (data.phone) updatedStaff.phone = data.phone;
    if (data.address) updatedStaff.address = data.address;
    if (data.new_pass1) updatedStaff.new_pass1 = data.new_pass1;
    if (data.new_pass2) updatedStaff.new_pass2 = data.new_pass2;

    // Trigger mutation to update the staff details
    if (Object.keys(updatedStaff).length > 0) {
      editMutation.mutate(updatedStaff, {
        onSuccess: () => {
          toast.success("Details successfully updated", {
            onClose: () => navigate("/dashboard"), // Navigate after toast closes
          });
        },
      });
    } else {
      toast.info("No changes to update.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data</p>;

  return (
    <div className="flex flex-col justify-center items-center min-h-full bg-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-lg p-6 bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className=" absolute right-5 top-3 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
        <h2 className="text-3xl font-semibold text-center mb-6">
          Edit Profile
        </h2>

        {/* Name Field */}
        <label className="block mb-4">
          Name
          <input
            {...register("name")}
            type="text"
            className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
            placeholder="Name"
          />
        </label>

        {/* Phone Field */}
        <label className="block mb-4">
          Phone Number
          <input
            {...register("phone")}
            type="text"
            className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
            placeholder="Phone Number"
          />
        </label>

        {/* Address Field */}
        <label className="block mb-4">
          Address
          <input
            {...register("address")}
            type="text"
            className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
            placeholder="Address"
          />
        </label>

        {/* New Password Field */}
        <label className="block mb-4">
          New Password
          <input
            {...register("new_pass1")}
            type="password"
            className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
            placeholder="New Password"
          />
        </label>

        {/* Confirm New Password Field */}
        <label className="block mb-4">
          Confirm New Password
          <input
            {...register("new_pass2")}
            type="password"
            className="block w-full mt-2 p-3 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400"
            placeholder="Confirm New Password"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-600 transition duration-300"
        >
          Save Changes
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditStaff;
