import { body } from "express-validator";

// the conditional validator for empty value:

export const room_number_val = [
  body("room_number")
    .if((value, { req }) => req.body.room_number !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Room Number is required"),
];

export const room_type_val = [
  body("room_type")
    .if((value, { req }) => req.body.room_type !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Room type is required")
    .matches(/^(single|double|suite|pentHouse|presidentialSuite)$/)
    .withMessage("Sorry, you should provide a valid entry"),
];

export const room_capacity_val = [
  body("room_capacity")
    .if((value, { req }) => req.body.room_capacity !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Room capacity is required")
    .matches(/^(1|2|3|4|5|6|7|8)$/)
    .withMessage("Sorry, you should provide a valid entry"),
];

export const price_val = [
  body("price_per_night")
    .if((value, { req }) => req.body.price_per_night !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Price per night is required"),
];

export const status_val = [
  body("status")
    .escape()
    .trim()
    .matches(/^(available|booked|maintenance)$/)
    .withMessage("Status must be either available, booked or maintenance"),
];

export const other_room_validators = [
  body("booked_on").escape().trim(),
  body("pictures").escape().trim(),
];
