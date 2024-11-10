const TotalBookings = ({ isLoading, isError, rooms }) => {
  // Get today's date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // Filter the rooms to only include those where today is between check-in and check-out dates
  const currentlyBookedRooms = rooms.bookings
    .filter((booking) => booking?.status === "checked-in")
    .filter((booking) => {
      const checkIn = new Date(booking?.checkIn_date)
        .toISOString()
        .split("T")[0];
      const checkOut = new Date(booking?.checkOut_date)
        .toISOString()
        .split("T")[0];
      return today >= checkIn && today < checkOut;
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching rooms: {error.message}</div>;
  }

  return (
    <>
      <h2 className="font-bold text-white text-md tracking-wider">
        Rooms Currently Occupied:{" "}
        <span className="text-2xl text-green-500">
          {currentlyBookedRooms.length}
        </span>
        <span className="text-2xl text-white font-extrabold"></span>
      </h2>
    </>
  );
};

export default TotalBookings;
