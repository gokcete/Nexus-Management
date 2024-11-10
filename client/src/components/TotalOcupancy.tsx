import { useFetchRooms } from "../hooks/useRoom";

const TotalOcupancy = ({ allRooms, bookings }) => {
  const today = new Date().toISOString().split("T")[0];

  // Filter the rooms to only include those where today is between check-in and check-out dates
  const currentlyBookedRooms = bookings.bookings.filter((booking) => {
    const checkIn = new Date(booking?.checkIn_date).toISOString().split("T")[0];
    const checkOut = new Date(booking?.checkOut_date)
      .toISOString()
      .split("T")[0];
    return today >= checkIn && today < checkOut;
  });

  const totalRooms = allRooms;
  const bookedRooms = currentlyBookedRooms.length; // Number of currently booked rooms
  const occupancyRate = ((bookedRooms / totalRooms) * 100).toFixed(2); // Occupancy rate in percentage

  return (
    <>
      <h2 className="font-bold text-white text-md tracking-wider">
        Total Rooms:{" "}
        <span className="text-2xl text-blue-500">{totalRooms}</span>
      </h2>
      <h2 className="font-bold text-white text-md tracking-wider">
        Occupancy Rate:{" "}
        <span className="text-2xl text-yellow-500">{occupancyRate}%</span>
      </h2>
    </>
  );
};

export default TotalOcupancy;
