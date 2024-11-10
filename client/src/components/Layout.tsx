import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Header from "./Header";
import { useEffect } from "react";
import { useProtectRoute } from "../hooks/useStaff"; // Import your useProtectRoute hook

const Layout = () => {
  const navigate = useNavigate();

  // Use the hook that checks if the user is authenticated
  const { data, error, isLoading } = useProtectRoute();

  // Handle redirect if authentication fails
  useEffect(() => {
    if (error && !isLoading) {
      // If there's an error after loading is done, redirect to the home page or login page
      navigate("/");
    }
  }, [error, isLoading, navigate]);

  // Render loading state while authentication is in progress
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-gray-500 text-3xl font-bold">Loading...</h2>
      </div>
    );
  }

  // If authentication passes, render the dashboard layout
  return (
    <div className="grid grid-cols-6 min-h-screen bg-gray-800 bg-cover bg-left-top">
      <div className="col-span-1">
        <NavBar />
      </div>
      <div className="col-span-5 flex flex-col ">
        <Header />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
