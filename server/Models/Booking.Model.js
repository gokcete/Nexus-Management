import mongoose, { Schema, model } from "mongoose";
import randomString from "random-string-gen";

const guestSchema = new Schema(
  {
    guest_name: { type: String, required: true },
    guest_email: { type: String, required: true },
    guest_card_number: { type: String },
    payment_method: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "cash"],
      required: true,
      default: "cash",
    },
  },
  { _id: false }
);

const staffSchema = new Schema(
  {
    staff_name: { type: String, required: true },
    staff_id: { type: String, required: true },
  },
  { _id: false }
);

const roomSchema = new Schema(
  {
    room_number: { type: String, required: true },
    room_id: { type: String, required: true },
  },
  { _id: false }
);

const paymentSchema = new Schema({
  paid: { type: Boolean, default: false },
  payment_info: { type: String },
  refund_needed: { type: Boolean, default: false },
  refund_info: { type: String },
  payment_reference: { type: String },
});

// This is the main Schema for this Model:

const bookingSchema = new Schema(
  {
    created_by: staffSchema,
    room_info: roomSchema,
    guest_info: guestSchema,
    guests_quantity: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },
    checkIn_date: { type: String, required: true },
    checkOut_date: { type: String, required: true },
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "checked-in", "canceled"],
      default: "pending",
    },
    reservation_code: { type: String },
    payments: paymentSchema,
  },
  { timestamps: true }
);

bookingSchema.pre("save", async function (next) {
  try {
    const code1 = randomString({
      capitalization: "uppercase",
      length: 3,
      type: "numeric",
    });
    const code2 = randomString({
      capitalization: "uppercase",
      length: 5,
      type: "alphabetic",
    });

    const code = code1 + "-" + code2;

    this.reservation_code = code;
  } catch (error) {
    next(error);
  }
});

export const Booking = model("Booking", bookingSchema);
