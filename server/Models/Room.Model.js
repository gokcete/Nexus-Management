import mongoose, { Schema, model } from "mongoose";

const RoomSchema = new Schema(
  {
    room_number: { type: String, unique: true, required: true },
    room_type: {
      type: String,
      enum: ["single", "double", "suite", "pentHouse", "presidentialSuite"],
      required: true,
    },
    room_capacity: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    price_per_night: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    description: { type: String },
    booked_on: [String],
    pictures: [String],
  },

  { timestamps: true }
);

export const Room = model("Room", RoomSchema);
