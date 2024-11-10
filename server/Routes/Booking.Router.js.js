import express from "express";
import { isAdmin, isStaff, isSupervisor } from "../MW/MW.Staff.Alaa.js";
import {
  book_room,
  change_booking_status,
  check_maintenance,
  dashboard_bookings,
  delete_booking,
  filter_bookings,
  get_bookings,
  move_booking,
} from "../Controllers/Booking.Controller.js";
import { booking_validator } from "../Validators/Validators.Alaa.js";
import ValResultHandler from "../Validators/ValidatorsResultHandler.js";

const booking_router = express.Router();

booking_router
  .route("/book_room/:id")
  .post(booking_validator, ValResultHandler, isStaff, book_room);
booking_router.route("/delete/:id").delete(isSupervisor, delete_booking);
booking_router.route("/getall/home").get(isStaff, dashboard_bookings);
booking_router.route("/getall").get(isStaff, get_bookings);
booking_router.route("/getall/filter").get(isStaff, filter_bookings);
booking_router.route("/maintenance-check").post(isAdmin, check_maintenance);
booking_router.route("/move_booking/:id").get(isAdmin, move_booking);
booking_router.route("/checked_in/:id").get(isStaff, change_booking_status)

export default booking_router;
