import * as yup from "yup";
export enum Type {
  SINGLE = "single",
  DOUBLE = "double",
  SUITE = "suite",
  PENTHOUSE = "pentHouse",
  PRESIDENTIALSUITE = "presidentialSuite",
}
export enum Status {
  AVAILABLE = "available",
  BOOKED = "booked",
  MAINTENANCE = "maintenance",
}

export interface AddRoom {
  room_number: string;
  room_type: Type;
  room_capacity: number[];
  price_per_night: number;
  status: Status;
}

export const AddRoomSchema = yup.object().shape({
  room_number: yup
    .string()
    .trim()
    .required("Sorry, you need to provide a value"),

  room_type: yup.string().required("Sorry, you need to provide a value"),
  room_capacity: yup
    .number()
    .min(1)
    .max(8)
    .required("Sorry,you need to provide a value"),
  price_per_night: yup.number().required("Sorry you need to provide a value"),
  status: yup.string().required("Sorry you need to provide a value"),
});
