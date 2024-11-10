import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useLogoutStaff } from "../hooks/useStaff";
import Logo from "../assets/logo.png";

const Avatar = () => {
  const { user } = useContext(UserContext);
  const id = user?.id;
  const { mutate: logout, isSuccess, isError, error } = useLogoutStaff();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(
      {},
      {
        onSuccess: (data) => {
          console.log("Logout successful:", data);
          navigate("/");
        },
        onError: (error) => {
          console.error(
            "Logout failed:",
            error.response?.data || error.message
          );
        },
      }
    );
  };

  return (
    <div className="m-6">
      <div className="dropdown dropdown-top dropdown-end">
        {/* Avatar Image */}
        <div
          tabIndex={0}
          role="button"
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 hover:border-gray-400 transition duration-300 cursor-pointer"
        >
          <img
            className="object-cover w-full h-full"
            src={user.pic ? user.pic : Logo}
            alt="User Avatar"
          />
        </div>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content bg-gray-900 bg-opacity-90 text-white rounded-lg w-32 p-3 shadow-lg mt-2"
        >
          <li className="hover:bg-gray-700 rounded-md transition">
            <Link to={`/dashboard/edit-profile`} className="block py-2">
              Edit Profile
            </Link>
          </li>
          <li className="hover:bg-gray-700 rounded-md transition">
            <Link to={`/dashboard/profile-picture`} className="block py-2">
              Update Profile Photo
            </Link>
          </li>
          <li className="hover:bg-gray-700 rounded-md transition">
            <Link onClick={handleLogout} to={`/`} className="block py-2">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Avatar;
