import { body } from "express-validator";
import regexPattern from "./detector.js";

// the conditional validator for empty value:
/*
   check('password').if(...): Conditional check that ensures the following validation rules are only applied if the password field is present in the request body. */
// use the val in any path as MW according to your needs

export const name_validator = [
  body("name")
    .if((value, { req }) => req.body.name !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Sorry, you should provide a valid entry"),
];

export const username_validator = [
  body("username")
    .if((value, { req }) => req.body.username !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value"),
];

export const email_validator = [
  body("email")
    .if((value, { req }) => req.body.email !== undefined)
    .escape()
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .isEmail()
    .withMessage("Sorry, this is not a valid Email"),
];

export const password_validator = [
  body("password")
    .if((value, { req }) => req.body.password !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/
    )
    .withMessage(
      "Sorry, you should provide a valid entry, please check the password requirements: (UpperCase, LowerCase, numbers and special Char[!@#$%^&*]"
    ),
];

export const new_password_validator = [
  body("new_pass1")
    .if((value, { req }) => req.body.new_pass1 !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/
    )
    .withMessage(
      "Sorry, you should provide a valid entry, please check the password requirements: (UpperCase, LowerCase, numbers and special Char[!@#$%^&*]"
    ),
];

export const role_validator = [
  body("role")
    .if((value, { req }) => req.body.role !== undefined)
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(/^(admin|supervisor|staff|customer)$/)
    .withMessage("Sorry, you should provide a valid entry"),
];

export const other_staff_user_validators = [
  body("phone").escape().trim(),
  body("address").escape().trim(),
  body("pic").escape().trim(),
  body("main_address").escape().trim(),
  body("billing_address").escape().trim(),
];

// Validation for Booking
export const booking_validator = [
  body("guest_name")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("You need to provide a value"),

  body("guest_email")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("You need to provide a value")
    .isEmail()
    .withMessage("This is not a valid Email-Address"),

  body("guest_card_number").escape().trim(),

  body("payment_method")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(/^(credit_card|paypal|bank_transfer|cash)$/)
    .withMessage("Sorry, you should provide a valid entry"),

  body("guests_quantity")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("You need to provide a guest number")
    .isLength({ min: 1, max: 8 })
    .withMessage("The guest number should be between 1 and 8 person"),

  body("checkIn_date")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a valid date")
    .isISO8601()
    .withMessage("Date must be in ISO 8601 format (YYYY-MM-DD)"),

  body("checkOut_date")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("Sorry, you need to provide a valid date")
    .isISO8601()
    .withMessage("Date must be in ISO 8601 format (YYYY-MM-DD)"),
];

export const rating_validator=[
  body("rating")
  .escape()
  .trim()
  .notEmpty()
    .withMessage("Sorry, you need to provide a value")
    .matches(/^(1|2|3|4|5)$/)
    .withMessage("Sorry, Valid rating between 1 and 5"),
]

export const post_validator=[
  body("post")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Sorry, you need to provide a comment")
      .isLength({ min: 1, max: 500 })
      .withMessage("The comment shouldn't exceed 500 Characters")
      .not()
      .matches(regexPattern)
      .withMessage("Inappropriate language detected")
]
