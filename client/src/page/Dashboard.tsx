import TotalBookings from "../components/TotalBookings";
import TotalSales from "../components/TotalSales";
import CheckIns from "../components/CheckIns";
import TotalOcupancy from "../components/TotalOcupancy";
import TableDashboardBookings from "../components/TableDashboardBookings";
import SummaryChart from "../components/SummaryChart";
import { useGetBookingsDashboard } from "../hooks/useBook";
import { useFetchRooms } from "../hooks/useRoom";
import StaffBookingsTable from "../components/StaffBookingsTable";

const Dashboard = () => {
  // Fetch bookings data
  const {
    data: bookingsData,
    isError: bookingsError,
    isLoading: bookingsLoading,
  } = useGetBookingsDashboard();

  const {
    data: rooms,
    isError: roomsError,
    isLoading: roomsLoading,
  } = useFetchRooms(1);
  const roomsData = rooms?.length;

  // Handle loading state
  if (bookingsLoading || roomsLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (bookingsError || roomsError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="text-gray-800 p-8 grid grid-cols-4 gap-4 bg-gray-800 ">
      {/* First section spanning all 4 columns */}
      <div className="col-span-4 flex justify-between gap-4">
        <div className="flex-1 h-full border border-gray-400 p-8 rounded-lg place-content-center">
          <TotalBookings
            rooms={bookingsData}
            isLoading={bookingsLoading}
            isError={bookingsError}
          />
        </div>
        <div className="flex-1 h-full border border-gray-400 p-8 rounded-lg place-content-center">
          <TotalSales bookings={bookingsData} />
        </div>
        <div className="flex-1 h-full border border-gray-400 rounded-lg flex flex-col justify-center items-center p-8">
          <SummaryChart data={bookingsData} />
        </div>

        <div className="flex-1 h-full border border-gray-400 p-8 rounded-lg place-content-center">
          <TotalOcupancy bookings={bookingsData} allRooms={roomsData} />
        </div>
      </div>

      {/* Table spanning 4 columns */}
      <div className="col-span-4 mt-4 border border-gray-400 rounded-xl p-4">
        <TableDashboardBookings
          isLoading={bookingsLoading}
          bookings={bookingsData}
          isError={bookingsError}
        />
      </div>

      {/* Table spanning 4 columns */}
      <div className="col-span-4">
        <StaffBookingsTable data={bookingsData} />
      </div>
    </div>
  );
};

export default Dashboard;
