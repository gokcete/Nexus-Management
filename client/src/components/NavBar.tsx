import { NavLink } from "react-router-dom";
import { navLinks } from "../utils/links";
import logo from "../assets/logo.png";
import Avatar from "./Avatar";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <nav className="sticky top-0 h-screen flex flex-col justify-between bg-gray-900 border-r border-gray-700 shadow-lg text-white">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-20 mt-12">
        <img
          className="w-14 h-14 rounded-full shadow-lg"
          src={logo}
          alt="Nexus Logo"
        />
        <h2 className="text-white font-bold ml-4 text-2xl tracking-wide">
          NEXUS
        </h2>
      </div>

      {/* Navigation Links */}
      <ul className="flex-grow flex flex-col gap-6 px-4">
        {navLinks
          .filter((_, index) => user.role === "admin" || index < 3) // Show all links for admin, limit to 3 for others
          .map((nav) => (
            <li key={nav.href}>
              <NavLink
                to={nav.href}
                end={nav.href === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-md transition-all text-gray-300 hover:text-white ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "hover:bg-gray-800"
                  }`
                }
              >
                <nav.icon className="inline-block w-6 h-6 text-gray-400" />
                <span className="text-lg font-medium">{nav.label}</span>
              </NavLink>
            </li>
          ))}
      </ul>

      {/* Avatar Section */}
      <div className="mt-auto flex items-center justify-center pb-8">
        <Avatar />
      </div>
    </nav>
  );
};

export default NavBar;
