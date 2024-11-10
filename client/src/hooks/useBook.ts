import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addBooking,
  deleteBooking,
  getBookings,
  getBookingsDashboard,
  filterBookings,
  confirmBooking,
} from "../api/bookingService";
import { BookingFilters } from "../components/FilterBoxBookings";

export const useAddBooking = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking) => addBooking(id, booking),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error(
        "Add Booking Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteBooking(id),
    onSuccess: (data) => {
      console.log("Booking deleted succesfully");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error(
        "Delete Booking Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};

export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
};

export const useGetBookingsDashboard = () => {
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: getBookingsDashboard,
  });
};

// Filter bookings
export const useFilterBooking = (filters: BookingFilters, page: number) => {
  return useQuery({
    queryKey: ["bookings", filters, page],
    queryFn: () => filterBookings(filters, page),
  });
};

// confirm bookings
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => confirmBooking(id),
    onSuccess: (data) => {
      console.log("Booking confirmed");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error(
        "Confirm Booking Failed:",
        error.response?.data?.message || "An error occurred"
      );
    },
  });
};
