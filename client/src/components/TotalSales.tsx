const TotalSales = ({ bookings }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // getMonth returns 0 for January, 11 for December

  // Array of all bookings
  const arrOfBookings = bookings.bookings;

  // Filter bookings based on checkIn_date and status
  const bookingsThisMonth = arrOfBookings.filter((booking) => {
    const checkInDate = new Date(booking.checkIn_date);
    return (
      checkInDate.getFullYear() === currentYear && // Same year
      checkInDate.getMonth() === currentMonth && // Same month
      checkInDate <= today && // Check-in date is before or on today
      booking.status !== "canceled" // Only include bookings that are not canceled
    );
  });

  // Sum total_price of all valid bookings
  const totalSalesThisMonth = bookingsThisMonth.reduce((acc, booking) => {
    return acc + booking.total_price;
  }, 0);

  return (
    <div className="text-white">
      Total Sales This Month:{" "}
      <span className="text-2xl text-green-500">${totalSalesThisMonth}</span>
    </div>
  );
};

export default TotalSales;
