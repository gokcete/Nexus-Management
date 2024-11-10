//import { cancel_conformation } from "../HelperFNs/emails_generator.js";
import {
  BookingLogic,
  getDatesBetween,
  remove_unwanted_data,
} from "../HelperFNs/Helper.Booking.js";
import { email_sender } from "../HelperFNs/nodemailer.js";
import { Booking } from "../Models/Booking.Model.js";
import { Room } from "../Models/Room.Model.js";

// 1 create booking
/*
This is the main booking function,

*/
// this function takes:
// room id as a param
// staff id from th jwt
// variables from json object in the req.body
/*
the function will check again if the room is available
in the days between start and end, if yes will proceed
if no will return the error to try again or change the entries
*/

export const book_room = async (req, res, next) => {
  try {
    // staff is coming from MW login_helper
    // working on Booking Model Object:

    const staff = req.user;
    const room_id = req.params.id;
    const room = await Room.findById({ _id: room_id });

    // working on req.body:

    const {
      guest_name,
      guest_email,
      guest_card_number,
      payment_method,
      guests_quantity,
      checkIn_date,
      checkOut_date,
    } = req.body;

    // establishing the model variables:
    const created_by = { staff_name: staff.username, staff_id: staff.uid };
    const room_info = { room_number: room.room_number, room_id: room._id };
    const guest_info = {
      guest_name: guest_name,
      guest_email: guest_email,
      guest_card_number: guest_card_number,
      payment_method: payment_method,
    };

    // working on logical input-output
    const dates2book = getDatesBetween(checkIn_date, checkOut_date);
    const can_be_booked = BookingLogic(dates2book, room.booked_on);
    const total_price = (dates2book.length - 1) * room.price_per_night;

    if (!can_be_booked) {
      res.status(400).json({
        msg: "Sorry, an error accrued while booking the room, please check the check in-out dates and try again",
      });
    } else {
      const new_booking = await Booking.create({
        created_by,
        room_info,
        guest_info,
        guests_quantity,
        checkIn_date,
        checkOut_date,
        total_price,
      });

      email_sender(new_booking, "confirm");
      const edited_room = await Room.findByIdAndUpdate(
        { _id: room_id },
        { $addToSet: { booked_on: dates2book } },
        { new: true }
      );

      res.status(201).json({
        msg: `The requested booking was successful, room ${
          room.room_number
        } is booked for [${dates2book.length}] day-s and [${
          dates2book.length - 1
        }] night-s from (${checkIn_date}) until (${checkOut_date})`,
        edited_room,
        new_booking,
      });
    }
  } catch (error) {
    next(error);
  }
};

// 2 delete booking
// to delete a booking we need the param as booking id
// as well only supervisor or admin can delete

export const delete_booking = async (req, res, next) => {
  try {
    const bookingID = req.params.id;

    if (!bookingID) {
      res.status(400).json({
        msg: `We didn't find any booking in our database, please check the booking ID and try again`,
      });
    } else {
      const booking = await Booking.findOne({ _id: bookingID });
      const roomID = booking.room_info.room_id;
      const room = await Room.findOne({ _id: roomID });
      const room_booked_on = room.booked_on;
      const dates2delete = getDatesBetween(
        booking.checkIn_date,
        booking.checkOut_date
      );

      // the next function remove_unwanted_dates
      // takes 2 array, the first is the main, the second is the sub
      // the function removes all sub-indexes from the main and return it new
      const new_booked_on = remove_unwanted_data(room_booked_on, dates2delete);
      room.booked_on = new_booked_on;
      await room.save();
      booking.status = "canceled";
      await booking.save();
      email_sender(booking, "cancel");
      res
        //.status(400)
        .json({
          msg: `Working on it`,
          room,
          booking,
        });
    }
  } catch (error) {
    next(error);
  }
};

// 4 get all Bookings:

// Fetch all Bookings

export const dashboard_bookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    if (!bookings) {
      res.status(500).json({ msg: "An error accord, please try again later" });
    } else {
      const length = bookings.length;
      res.status(200).json({
        msg: "Here is an array of all bookings with total :",
        length,
        bookings,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const get_bookings = async (req, res, next) => {
  try {
    const length = (await Booking.find()).length;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);

    const pageCount = Math.ceil(length / limit);
    const bookings = await Booking.find().skip(skip).limit(limit);
    res
      .status(200)
      .json({ msg: "Here is a list of all bookings", pageCount, bookings });
  } catch (error) {
    next(error);
  }
};

// Filter Bookings

export const filter_bookings = async (req, res, next) => {
  try {
    // the queries to be sent:

    // sortOrder: optional, 2 values: "asc" or "desc", default "asc"
    // sortBy: optional: can take only direct property and not hosted property
    // status: optional, the status of booking, pending, canceled etc...
    // room_number, optional, search for room number
    // booked by: optional, search for the person made the booking and not case sensitive, notice that space should be (((%20)))
    // guest: optional, search for guest name, same as booked_by
    // guest_quantity, optional, search for guest quantity

    // the code will send you the results and the total count to manipulate

    const { status, room_number, booked_by, guest, guest_quantity } = req.query;

    const sortBy = req.query.sortBy || "checkIn_date";
    const sortOrder = req.query.sortOrder || "asc";
    const sortCriteria = { [sortBy]: sortOrder };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);
    const query = {};
    console.log(typeof Number(guest_quantity));
    if (status) {
      query.status = status;
    }
    if (room_number) {
      query["room_info.room_number"] = Number(room_number);
    }
    if (booked_by) {
      query["created_by.staff_name"] = new RegExp(booked_by, "i"); // 'i' makes it case-insensitive
    }
    if (guest) {
      query["guest_info.guest_name"] = new RegExp(guest, "i"); // 'i' makes it case-insensitive
    }
    if (guest_quantity) {
      query.guests_quantity = { $eq: Number(guest_quantity) };
    }

    const bookings2count = await Booking.find(query);
    const countFound = bookings2count.length;

    const bookings = await Booking.find(query)
      .sort(sortCriteria)
      .limit(Number(limit))
      .skip(skip);

    res.status(200).json({
      msg: "The result for your search with total count:",
      countFound,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// 4 change booking for maintenance

// for the maintenance we need to send three parameters
// room number, start and end
// it is a post request checks the booking for the mentioned room

export const check_maintenance = async (req, res, next) => {
  try {
    const { room_number, start_date, end_date } = req.body;
    const dates2check = getDatesBetween(start_date, end_date);
    let bookings = await Booking.find({
      "room_info.room_number": room_number,
      status: { $in: ["pending"] },
    });

    const bookings2change = [];
    if (!bookings[0]) {
      res.status(200).json({
        msg: "for your selection we don't have any valid booking, you might set the room to maintenance status now",
      });
    } else {
      for (let i = 0; i < bookings.length; i++) {
        const booked_on = getDatesBetween(
          bookings[i].checkIn_date,
          bookings[i].checkOut_date
        );
        if (!BookingLogic(dates2check, booked_on)) {
          //console.log(!BookingLogic(dates2check, booked_on));
          console.log(booked_on, !BookingLogic(dates2check, booked_on));
          bookings2change.push(bookings[i]);
        }
      }
      res.status(200).json({
        msg: "we found booking match for the selected room, you can't set the room to maintenance before changing the existing bookings",
        bookings2change,
      });
    }
  } catch (error) {
    next(error);
  }
};

// this function is moving any existing booking to another room, clear the reservations from the source room
// it takes a booking id and checks for solutions
// get req with params

export const move_booking = async (req, res, next) => {
  try {
    const bookingID = req.params.id;
    const booking = await Booking.findOne({ _id: bookingID });
    const old_room = await Room.findById(booking.room_info.room_id);

    // 1 check for similar free room

    let room_capacity = booking.guests_quantity;
    const startDate = booking.checkIn_date;
    const endDate = booking.checkOut_date;

    const datesBetween = getDatesBetween(startDate, endDate);

    const available_rooms = [];
    let rooms;
    do {
      rooms = await Room.find({
        status: "available",
        room_capacity: { $eq: room_capacity },
      });
      for (let i = 0; i < rooms.length; i++) {
        let old_booked = rooms[i].booked_on; // This remains an array of strings

        if (BookingLogic(datesBetween, old_booked)) {
          // If the room is available for the given date range
          available_rooms.push(rooms[i]);
        }
      }

      room_capacity++;
    } while (room_capacity <= 8 || !rooms[0]);

    let new_room = available_rooms[0];

    if (!available_rooms[0]) {
      res.status(400).json({
        msg: "We didn't find any matching rooms, please consider canceling the reservation and book multiple rooms instead",
        available_rooms,
      });
    } else {
      // 2 change the room info in booking according to it
      booking.room_info = {
        room_number: new_room.room_number,
        room_id: new_room._id,
      };
      booking.save();

      // 3 add the new dates to the new room
      //new_room={booked_on:{ $addToSet: datesBetween  }};
      for (let i = 0; i < datesBetween.length; i++) {
        new_room.booked_on.push(datesBetween[i]);
      }
      new_room.save();
      // 4 delete the dates from the old room
      for (let i = 0; i < datesBetween.length; i++) {
        old_room.booked_on.splice(datesBetween[i], 1);
      }
      old_room.save();

      // 5 return the new booking: new_room
      res.status(200).json({ msg: "avl", booking, old_room, new_room });
    }
  } catch (error) {
    next(error);
  }
};

export const change_booking_status = async (req, res, next) => {
  try {
    const bookingID = req.params.id;

    const booking = await Booking.findById(bookingID);
    if (booking.status === "pending") {
      booking.status = "checked-in";
      await booking.save();
      res
        .status(200)
        .json({ msg: "Booking has been updated to checked in", booking });
    } else if (booking.status === "canceled") {
      res.status(400).json({
        msg: "Sorry, this booking has been already canceled",
        booking,
      });
    } else if (booking.status === "checked-in") {
      res.status(200).json({
        msg: "This booking has been already marked as checked in",
        booking,
      });
    }
  } catch (error) {
    next(error);
  }
};
