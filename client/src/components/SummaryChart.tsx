import { PieChart } from "@mui/x-charts/PieChart";

// Function to calculate nights between check-in and check-out dates
const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const differenceInTime = checkOut.getTime() - checkIn.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays;
};

// Categorize stays into different ranges (1-2, 3-5, 6+)
const categorizeStayDuration = (nights: number) => {
  if (nights <= 2) return "1-2 nights";
  else if (nights <= 5) return "3-5 nights";
  else return "6+ nights";
};

const SummaryChart = ({ data }) => {
  const bookings = data.bookings;
  // Count occurrences of each stay duration category
  const stayDurationCounts = {
    "1-2 nights": 0,
    "3-5 nights": 0,
    "6+ nights": 0,
  };

  // Iterate through bookings to calculate and categorize stay duration
  bookings.forEach((booking) => {
    const nights = calculateNights(booking.checkIn_date, booking.checkOut_date);
    const category = categorizeStayDuration(nights);
    stayDurationCounts[category] += 1;
  });

  // Prepare data for the PieChart
  const chartData = [
    { id: 0, value: stayDurationCounts["1-2 nights"], label: "1-2 nights" },
    { id: 1, value: stayDurationCounts["3-5 nights"], label: "3-5 nights" },
    { id: 2, value: stayDurationCounts["6+ nights"], label: "6+ nights" },
  ];

  return (
    <>
      <h2 className="mb-2 text-white text-2xl">Guest Stay Duration</h2>
      <PieChart
        series={[
          {
            data: chartData,
            labels: {
              enabled: true,
              formatter: (value) => `${value.toFixed(1)}%`,
            },
          },
        ]}
        width={300}
        height={100}
        slotProps={{
          legend: {
            labelStyle: {
              fill: "white",
            },
          },
        }}
      />
    </>
  );
};

export default SummaryChart;
