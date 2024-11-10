import { Room } from "../Models/Room.Model.js";

export const add_room = async (req, res, next) => {
  try {
    const {
      room_number,
      room_type,
      room_capacity,
      price_per_night,
      status,
      description,
      booked_on,
    } = req.body;

    const room = await Room.findOne({ room_number: room_number });
    if (room) {
      res.status(400).json({ msg: "Room exists", room });
    } else {
      const new_room = await Room.create({
        room_number,
        room_type,
        room_capacity,
        price_per_night,
        status,
        booked_on,
        description,
      });

      res.status(201).json({ msg: "Room created successfully", new_room });
    }
  } catch (error) {
    next(error);
  }
};

export const get_all_rooms = async (req, res, next) => {
  try {
    //page: which page you want to show /number, default 1
    //limit: how many per page / number, default 5

    const length = (await Room.find()).length;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);

    const pageCount = Math.ceil(length / limit);
    const all_rooms = await Room.find(
      {},
      {
        _id: 1,
        room_number: 1,
        room_type: 1,
        room_capacity: 1,
        price_per_night: 1,
        status: 1,
        booked_on: 1,
        pictures: 1,
        description: 1,
      }
    )
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      msg: "All Rooms with page count:",
      length,
      pageCount,
      all_rooms,
    });
  } catch (error) {
    next(error);
  }
};

// a new fetch req from the all route to filter according to KEY and SORTING:

export const filter_all_rooms = async (req, res, next) => {
  try {
    // the end point is: localhost:9115/room/all/filter
    // the queries to be sent

    // sortOrder: optional, 2 values: "asc" or "desc", default "asc"
    // sortBy: optional: room_number(default), price, or any property
    // status: optional: room status: available or maintenance
    // room_capacity: optional, equals
    // priceMin, PriceMax: optional, together or one of them to filter price
    // page: optional, which page to start, default the first page
    // limit: optional, how many per page, default 5

    // the code will send you the results and the total count to manipulate

    const { room_capacity, priceMin = 0, priceMax, status } = req.query;
    const sortBy = req.query.sortBy || "room_number";
    const sortOrder = req.query.sortOrder || "asc";
    const sortCriteria = { [sortBy]: sortOrder };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);
    const query = {};
    if (priceMin && priceMax) {
      query.price_per_night = {
        $gte: Number(priceMin),
        $lte: Number(priceMax),
      };
    } else if (priceMin) {
      query.price_per_night = { $gte: Number(priceMin) };
    } else if (priceMax) {
      query.price_per_night = { $lte: Number(priceMax) };
    }

    if (room_capacity) {
      query.room_capacity = { $eq: Number(room_capacity) };
    }

    if (status) {
      query.status = status;
    }
    const rooms2count = await Room.find(query);
    const countFound = rooms2count.length;
    const all_rooms = await Room.find(query)
      .sort(sortCriteria)
      .limit(Number(limit))
      .skip(skip);

    res
      .status(200)
      .json({ msg: "All Rooms with page count:", countFound, all_rooms });
  } catch (error) {
    next(error);
  }
};

export const room_update = async (req, res, next) => {
  try {
    const roomID = req.params.id;
    if (!roomID) {
      res.status(400).json({ msg: "Sorry, Room not found" });
    } else {
      const room = await Room.findById(roomID);
      const { room_type, room_capacity, price_per_night, status } = req.body;
      room.room_type = room_type || room.room_type;
      room.room_capacity = room_capacity || room.room_capacity;
      room.price_per_night = price_per_night || room.price_per_night;
      room.status = status || room.status;
      await room.save();

      await res.status(200).json({ msg: "room updated successfully", room });
    }
  } catch (error) {
    next(error);
  }
};

export const room_pic_upload = async (req, res, next) => {
  try {
    const roomID = req.params.id;

    if (!roomID) {
      res.status(404).json({ msg: "Sorry, Room not found" });
    } else {
      const file = req.body;
      //const temp_path= file.tempFilePath

      console.log(file);

      //  const room = await Room.findByIdAndUpdate(
      //    { _id: roomID },
      //    { $addToSet: { pictures: pictures } },
      //    { new: true }
      //  );
      //  res.status(200).json({ msg: "Picture-s uploaded successfully", room });
    }
  } catch (error) {
    next(error);
  }
};

export const delete_room = async (req, res, next) => {
  try {
    const roomID = req.params.id;
    if (!roomID) {
      return res.status(404).json({ msg: "Sorry, Room not found" });
    }
    const room = await Room.findByIdAndDelete(roomID); // corrected this line
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }
    res.status(200).json({
      msg: `The room number: ${room.room_number} was deleted successfully`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id); //find room by ID
    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }
    res.status(200).json({ msg: "Your requested room is:", room }); //return room
  } catch (error) {
    next(error);
  }
};

// checking the rooms is post req with 3 variables:
// the first is the room capacity
// the second is start date format YYYY-MM-DD
// the third is end date format YYYY-MM-DD
// it will send back only the rooms that match the search

export const check_rooms = async (req, res, next) => {
  try {
    const { room_capacity, startDate, endDate } = req.body;

    // Format the search dates in DD.MM.YYYY format
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-GB");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-GB");

    // Get all dates between startDate and endDate
    const datesBetween = getDatesBetween(startDate, endDate).map(
      (date) => date.toISOString().split("T")[0]
    ); // Format dates to YYYY-MM-DD

    const rooms = await Room.find(
      { status: "available", room_capacity: { $gte: room_capacity } },
      {
        room_number: 1,
        room_type: 1,
        price_per_night: 1,
        room_capacity: 1,
        booked_on: 1,
        pictures: 1,
      }
    );

    const available_rooms = [];
    for (let i = 0; i < rooms.length; i++) {
      let booking = rooms[i].booked_on; // This remains an array of strings
      if (!BookingLogic(datesBetween, booking)) {
        // If the room is available for the given date range
        available_rooms.push(rooms[i]);
      }
    }

    // Respond with the available rooms and the search date range
    res.status(200).json({
      msg: "List of available rooms",
      date_range: `${formattedStartDate} - ${formattedEndDate}`,
      available_rooms,
    });
  } catch (error) {
    next(error);
  }
};

// Function to determine booking conflicts
function BookingLogic(datesBetween, bookedDates) {
  // Check if any of the dates in datesBetween are already booked
  return datesBetween.some((date) => bookedDates.includes(date));
}

// Helper function to get dates between two dates
const getDatesBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  let currentDate = start;
  while (currentDate <= end) {
    dates.push(currentDate);
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1); // Add one day
  }

  return dates;
};
