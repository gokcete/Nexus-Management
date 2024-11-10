import { useForm, SubmitHandler } from "react-hook-form";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddBooking, AddBookingSchema } from "../validations/bookingValidators";
import { Payment } from "../validations/bookingValidators";
import { useAddBooking } from "../hooks/useBook";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const ModalBooking = () => {
  // Get the room ID from the URL parameters
  const { id } = useParams();
  console.log("Room ID from URL:", id);

  const location = useLocation();
  const { date_range, capacity } = location.state || {}; // Extract passed state

  // Prepare default values for check-in and check-out dates
  const checkIn = date_range?.slice(0, 10).split("/").reverse().join("-") || ""; // Set empty string if date_range is undefined
  const checkOut = date_range?.slice(13).split("/").reverse().join("-") || "";
  console.log("date range", date_range);
  console.log("Check in DATE", checkIn);
  console.log("Check out DATE", checkOut);
  // Get the current user context
  const { user } = useContext(UserContext);

  // Hook to handle booking mutation
  const mutateBooking = useAddBooking(id);

  // React state to track submission success
  const [isSuccess, setIsSuccess] = useState(false);

  // Use navigate for redirecting after success
  const navigate = useNavigate();

  // Use react-hook-form with validation schema and default values
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBooking>({
    resolver: yupResolver(AddBookingSchema),
    defaultValues: {
      checkIn_date: checkIn, // Set default check-in date
      checkOut_date: checkOut, // Set default check-out date
      guests_quantity: capacity, // Set default guests quantity
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<AddBooking> = (data) => {
    const formattedData = {
      ...data,
      guests_quantity: capacity, // Convert guests_quantity to number
      checkIn_date: checkIn,
      checkOut_date: checkOut,
    };

    console.log("Formatted Data:", formattedData); // Verify the booking data
    console.log("Room ID:", id); // Verify the room ID is being logged correctly

    // Submit booking data
    mutateBooking.mutate(formattedData, {
      onSuccess: () => {
        console.log(
          "This is the DATA PASSED to onSUBMIT function :",
          formattedData
        );
        // Set success state to true
        setIsSuccess(true);

        // Reset the form
        reset();

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // 2-second delay
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-4 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Add Booking</h2>

      {isSuccess && (
        <div className="p-4 mb-4 text-green-800 bg-green-200 rounded-lg">
          Booking Successful! Redirecting to dashboard...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Guest Name Field */}
        <div className="mb-4">
          <label className="block text-lg">Guest Name</label>
          <input
            {...register("guest_name")}
            type="text"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Guest Name"
          />
          {errors.guest_name && (
            <p className="text-sm text-red-500 mt-2">
              {errors.guest_name.message}
            </p>
          )}
        </div>

        {/* Guest Email Field */}
        <div className="mb-4">
          <label className="block text-lg">Guest Email</label>
          <input
            type="email"
            {...register("guest_email")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Guest Email"
          />
          {errors.guest_email && (
            <p className="text-sm text-red-500 mt-2">
              {errors.guest_email.message}
            </p>
          )}
        </div>

        {/* Guest Card Number Field */}
        <div className="mb-4">
          <label className="block text-lg">Guest Card Number</label>
          <input
            {...register("guest_card_number")}
            type="text"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Card Number"
          />
          {errors.guest_card_number && (
            <p className="text-sm text-red-500 mt-2">
              {errors.guest_card_number.message || "Enter a valid number"}
            </p>
          )}
        </div>

        {/* Number of Guests Field */}
        <div className="mb-4">
          <label className="block text-lg">Number of Guests</label>
          <input
            {...register("guests_quantity")}
            type="number"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Number of Guests"
          />
          {errors.guests_quantity && (
            <p className="text-sm text-red-500 mt-2">
              {errors.guests_quantity.message || "Enter a valid number"}
            </p>
          )}
        </div>

        {/* Check-in Date Field */}
        <div className="mb-4">
          <label className="block text-lg">Check-in Date</label>
          <input
            {...register("checkIn_date")}
            type="date"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Check-in Date"
          />
          {errors.checkIn_date && (
            <p className="text-sm text-red-500 mt-2">
              {errors.checkIn_date.message}
            </p>
          )}
        </div>

        {/* Check-out Date Field */}
        <div className="mb-4">
          <label className="block text-lg">Check-out Date</label>
          <input
            {...register("checkOut_date")}
            type="date"
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
            placeholder="Check-out Date"
          />
          {errors.checkOut_date && (
            <p className="text-sm text-red-500 mt-2">
              {errors.checkOut_date.message}
            </p>
          )}
        </div>

        {/* Payment Method Field */}
        <div className="mb-4">
          <label className="block text-lg">Payment Method</label>
          <select
            {...register("payment_method")}
            className="block w-full mt-2 p-2 bg-gray-800 rounded-md border border-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value={Payment.credit_card}>credit_card</option>
            <option value={Payment.paypal}>paypal</option>
            <option value={Payment.bank_transfer}>bank_transfer</option>
            <option value={Payment.cash}>cash</option>
          </select>
          {errors.payment_method && (
            <p className="text-sm text-red-500 mt-2">
              {errors.payment_method.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        >
          Book Room
        </button>
      </form>
    </div>
  );
};

export default ModalBooking;
