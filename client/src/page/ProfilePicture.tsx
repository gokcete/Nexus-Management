import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useFetchUser,
  useUpdateStaffPicture,
  useDeleteStaffPicture,
} from "../hooks/useStaff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProfilePicture = () => {
  const { data, error, isLoading } = useFetchUser(); // Fetch the user data
  const addPictureMutation = useUpdateStaffPicture();
  const deletePictureMutation = useDeleteStaffPicture();
  const navigate = useNavigate();
  const [isAddPictureOpen, setIsAddPictureOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // Initialize the form
  const { register, handleSubmit, reset } = useForm();

  const onAddPicture = (data) => {
    const picture = data.picture;
    setLoading(true);

    addPictureMutation.mutate(picture, {
      onSuccess: (response) => {
        setUser((user) => ({ ...user, pic: response.staff.pic }));

        setLoading(false);
        setIsAddPictureOpen(false);
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error uploading picture:", error);
        setLoading(false);
      },
    });
  };

  const onDeletePicture = (pic) => {
    if (window.confirm("Are you sure you want to delete the photo?")) {
      setLoading(true);

      deletePictureMutation.mutate(
        { pic },
        {
          onSuccess: () => {
            setUser((user) => ({ ...user, pic: "" }));
            setLoading(false);
            console.log("Picture deleted successfully");

            navigate("/dashboard/profile-picture");
            window.location.reload();
          },
          onError: (error) => {
            console.error("Error deleting picture:", error);
            setLoading(false);
          },
        }
      );
    }
  };

  const handleAddPictureClick = () => {
    setIsAddPictureOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data</p>;

  return (
    <>
      <div className="relative p-10 text-center bg-gray-900 w-[500px] m-auto">
        {/* Close Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className=" absolute right-5 top-3 text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
        <h2 className="text-white text-3xl mb-10">Update Your Profile Photo</h2>

        <div className="avatar bg-white mb-5 h-48 w-48 m-auto ">
          <img
            src={data.pic ? data.pic : Logo}
            alt="Staff Avatar"
            className="object-cover"
          />
        </div>

        {/* Photo action buttons */}
        <div className="flex justify-center gap-5 ">
          <button
            className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-green-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
            onClick={() => handleAddPictureClick()}
          >
            Add New Photo
          </button>

          {isAddPictureOpen && (
            <dialog
              open
              className="modal bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
              <div className="modal-box bg-gray-800 p-8 rounded-xl shadow-lg relative text-white w-96">
                {/* Close Button */}
                <button
                  onClick={() => setIsAddPictureOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="text-green-500">
                      Uploading, please wait...
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onAddPicture)}>
                    <label className="block text-lg mb-4">
                      <input
                        {...register("picture")}
                        type="file"
                        className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-green-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
                    >
                      Submit Photo
                    </button>
                  </form>
                )}
              </div>
            </dialog>
          )}

          <button
            className="px-4 py-2 mt-1 mb-5 rounded-md border border-neutral-300 bg-red-500 text-neutral-100 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
            onClick={() => onDeletePicture(data?.pic)}
          >
            Delete Photo
          </button>
        </div>
      </div>
    </>
  );
};
export default ProfilePicture;
