import * as yup from "yup";
export enum Payment {
  CREDIT_CARD = "credit_card",
  paypal = "paypal",
  BANK_TRANSFER = "bank_transfer",
  CASH = "cash",
}

export interface AddBooking {
  guest_name: string;
  guest_email: string;
  guest_card_number: string;
  guests_quantity: number;
  payment_method: Payment;
  checkIn_date: string;
  checkOut_date: string;
}

export const AddBookingSchema = yup.object().shape({
  guest_name: yup
    .string()
    .trim()
    .required("Sorry, you need to provide a value"),

  guest_email: yup
    .string()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required("Sorry, you need to provide a valid email"),
  payment_method: yup
    .string()
    .required("Sorry, you need to provide a payment method"),
  checkIn_date: yup
    .string()
    .required("Sorry you need to provide a check in Date"),
  checkOut_date: yup
    .string()
    .required("Sorry you need to provide a check out Date"),
  guests_quantity: yup
    .number()
    .min(1)
    .max(8)
    .required("You need to provide a value"),
});
