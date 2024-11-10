import * as yup from "yup";
export enum Role {
  ADMIN = "admin",
  SUPERVISOR = "supervisor",
  STAFF = "staff",
}

export interface StaffPassword {
  username: string;
  password: string;
  new_pass1: string;
  new_pass2: string;
}

export const ChangePasswordSchema = yup.object().shape({
  username: yup.string().trim().required("Sorry, you need to provide a value"),

  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    )
    .required("Password is required"),
  new_pass1: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    )
    .required("New password is required"),
  new_pass2: yup
    .string()
    .oneOf([yup.ref("new_pass1")], "Passwords don't match")
    .required("Please confirm your new password"),
});

export const AddUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Sorry you need to provide a value")
    .min(6)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Sorry, you should provide a valid entry with only letters and spaces"
    ),
  username: yup.string().trim().required("Sorry, you need to provide a value"),

  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    )
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(Object.values(Role), "Invalid role") // Ensures role is one of the enum values
    .required("Role is required"),

  phone: yup
    .string()
    .matches(
      /^\+?\d{1,15}$/, // Simple regex to allow optional '+' and up to 15 digits
      "Please enter a valid phone number"
    )
    .required("Phone number is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(4, "Address must be at least 4 characters")
    .max(100, "Address must not exceed 100 characters"),
});

export const LoginUserSchema = yup.object().shape({
  username: yup.string().trim().required("Sorry, you need to provide a value"),

  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
    )
    .required("Password is required"),
});
