import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Bookings from "./page/Bookings";
import Dashboard from "./page/Dashboard";
import Rooms from "./page/Rooms";
import Staff from "./page/Staff";
import Login from "./page/Login";
import ChangePassword from "./page/ChangePassword";

import EditStaff from "./page/EditProfile";
import StaffDetails from "./page/StaffDetails";
import RoomDetails from "./page/RoomDetails";
import RoomsAvailable from "./page/RoomsAvailable";
import NotFoundPage from "./components/NotFoundPage";
import ModalBooking from "./components/ModalBooking";
import ProfilePicture from "./page/ProfilePicture";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000, gcTime: 10 * (60 * 1000) } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="edit-profile" element={<EditStaff />} />
            <Route path="profile-picture" element={<ProfilePicture />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<ModalBooking />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:id" element={<RoomDetails />} />
            <Route path="rooms/available" element={<RoomsAvailable />} />
            <Route path="staff" element={<Staff />} />
            <Route path="staff/:id" element={<StaffDetails />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
