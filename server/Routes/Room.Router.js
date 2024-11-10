import express from "express";
import {
  other_room_validators,
  price_val,
  room_capacity_val,
  room_number_val,
  room_type_val,
  status_val,
} from "../Validators/Validators.Anne.js";
import ValResultHandler from "../Validators/ValidatorsResultHandler.js";
import { isStaff, isSupervisor } from "../MW/MW.Staff.Alaa.js";
import {
  add_room,
  check_rooms,
  delete_room,
  filter_all_rooms,
  get_all_rooms,
  getRoom,
  room_pic_upload,
  room_update,
} from "../Controllers/Room.Controller.js";

const room_router = express.Router();

room_router
  .route("/add")
  .post(
    room_number_val,
    room_type_val,
    room_capacity_val,
    price_val,
    status_val,
    other_room_validators,
    ValResultHandler,
    isSupervisor,
    add_room
  );

room_router
  .route("/update/:id")
  .put(
    room_type_val,
    room_capacity_val,
    price_val,
    status_val,
    other_room_validators,
    ValResultHandler,
    isSupervisor,
    room_update
  );

// room_router
//   .route("/pic-upload/:id")
//   .post( isSupervisor, room_pic_upload);

room_router.route("/all").get(isStaff, get_all_rooms);
room_router.route("/all/filter").get(isStaff, filter_all_rooms);
room_router.route("/one/:id").get(isStaff, getRoom);
room_router.route("/delete/:id").delete(isSupervisor, delete_room);
room_router.route("/check-rooms").post(isStaff, check_rooms);

export default room_router;
