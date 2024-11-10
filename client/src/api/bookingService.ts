import axios, { type AxiosResponse } from "axios";
import { AddBooking } from "../validations/bookingValidators";
import { Staff } from "./staffService";
import { Rooms } from "./roomsService";

export enum PaymentMethod {
  credit_card = "credit_card",
  paypal = "paypal",
  bank_transfer = "bank_transfer",
  cash = "cash",
}

export enum BookingStatus {
  pending = "pending",
  checkedin = "checked-in",
  canceled = "canceled",
}

export interface Guest {
  guest_name: string;
  guest_email: string;
  guest_card_number: string;
  payment_method: PaymentMethod;
}

export interface Payment {
  paid: boolean;
  payment_info: string;
  refund_needed: boolean;
  refund_info: string;
  payment_reference: string;
}

export interface Bookings {
  created_by: Staff;
  room_info: Rooms;
  guest_info: Guest;
  guests_quantity: number;
  checkIn_date: Date;
  checkOut_date: Date;
  total_price: number;
  status: BookingStatus;
  reservation_code: string;
  payments: Payment;
}

export interface FilteredBookingsResponse {
  bookings: Bookings[];
  countFound: number;
}

export const addBooking = async (id, booking: AddBooking) => {
  try {
    const response = await axios.post(
      `https://nexus-management-vk4e.onrender.com/booking/book_room/${id}`,
      booking,
      {
        withCredentials: true, // Send cookie with the request
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding Booking", error);
    return null;
  }
};

export const getBookings = async () => {
  try {
    const response = await axios.get(
      `https://nexus-management-vk4e.onrender.com/booking/getall`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting bookings", error);
    return null;
  }
};

export const getBookingsDashboard = async () => {
  try {
    const response = await axios.get(
      `https://nexus-management-vk4e.onrender.com/booking/getall/home`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting bookings", error);
    return null;
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(
      `https://nexus-management-vk4e.onrender.com/booking/delete/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting booking", error);
    return null;
  }
};

// filter bookings

export const filterBookings = async (filters, page: number) => {
  try {
    const url = new URL(
      "https://nexus-management-vk4e.onrender.com/booking/getall/filter"
    );

    url.searchParams.set("page", String(page));
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      url.searchParams.set(key, value);
    });

    const response = await axios.get<
      null,
      AxiosResponse<FilteredBookingsResponse>
    >(url.toString(), {
      withCredentials: true,
    });

    const { bookings, countFound } = response.data;
    const totalPages = Math.ceil(countFound / 5);

    return {
      bookings: bookings,
      pagination: {
        currentPage: page,
        totalPages,
        isFirstPage: page === 1,
        isLastPage: page === totalPages,
      },
    };
  } catch (error) {
    console.error("Error filter bookings", error);
    return null;
  }
};

// confirm booking

export const confirmBooking = async (id) => {
  try {
    const response = await axios.get(
      `https://nexus-management-vk4e.onrender.com/booking/checked_in/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirm booking", error);
    return null;
  }
};
