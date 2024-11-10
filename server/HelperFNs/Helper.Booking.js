

export const BookingLogic = (Dates2Book, Booked_on) => {
  // Check if any element of Dates2Book exists in Booked_on

  for (let i = 0; i < Dates2Book.length; i++) {
    if (Booked_on.includes(Dates2Book[i])) {
      return false;
    }
  }

  // If no duplicates are found, returns true

  return true;
};

//const checkIn = new Date("2024-02-28").toLocaleDateString("de-DE")

//console.log(checkIn);

export const getDatesBetween = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  // Ensure the endDate is included by using <= in the while loop
  while (currentDate <= new Date(endDate)) {
    // Format the date as YYYY-MM-DD (or any desired format)
    dateArray.push(currentDate.toISOString().split("T")[0]);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

//console.log(JSON.stringify(getDatesBetween("2024-12-01","2024-12-31")))

// this function takes 2 arrays:
// the first one from the room model which has all the booked dates
// the second one is all dates between 2 dates to be later deleted

export const remove_unwanted_data=(mainArray, toRemoveArray)=> {
  return mainArray.filter(item => !toRemoveArray.includes(item));
}



