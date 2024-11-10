import { FaHome } from "react-icons/fa";
import { TbBrandBooking } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi2";

// Update the type to store the icon component as a function reference
type Navigation = {
  label: string;
  href: string;
  icon: React.ElementType;
};

// Use the icon component's reference (e.g., FaHome), not JSX
export const navLinks: Navigation[] = [
  {
    label: "Home",
    href: "/dashboard",
    icon: FaHome, // Just reference the component, no JSX here
  },
  {
    label: "Bookings",
    href: "bookings",
    icon: TbBrandBooking,
  },
  {
    label: "Rooms",
    href: "rooms",
    icon: FaHome,
  },
  {
    label: "Staff",
    href: "staff",
    icon: HiUserGroup,
  },
];
