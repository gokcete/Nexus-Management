import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorCreator } from "./ErrorCreator/ErrorCreator.js";
import connect2DB from "./Connection/Connect2DB.js";
import staff_router from "./Routes/Staff.Router.js";
import { isStaff } from "./MW/MW.Staff.Alaa.js";
import dashboard_router from "./Routes/Dashboard.Router.js";
import room_router from "./Routes/Room.Router.js";
import booking_router from "./Routes/Booking.Router.js.js";

import fileUpload from 'express-fileupload'
import {delete_pics, staff_pic_delete, staff_pic_upload, upload_router} from "./HelperFNs/Upload.js";
import { v2 as cloudinary } from 'cloudinary';
import { email_sender } from "./HelperFNs/nodemailer.js";
import review_router from "./Routes/Review.Router.js";


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors(
    {
      origin: "https://nexus-management-frontend-b7zu.onrender.com",
      credentials: true,
    },
    {
      origin: "http://localhost:3000",
      credentials: true,
    }
  )
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true}));
dotenv.config();


cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret
})



// Routers
app.use("/dashboard", dashboard_router);
app.use("/staff", staff_router);
app.use("/booking", booking_router);
app.use("/room", room_router);
app.use("/room", upload_router)
app.use("/room", delete_pics)
app.use("/staff", staff_pic_upload)
app.use("/staff/", staff_pic_delete)
app.use("/review", review_router)


//Error Handler

app.use((req, res, next) => {
  next(errorCreator("Sorry, Path not found", 404));
});
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({ msg: err.message });
  }
});

// Connect to Database

connect2DB();

// Going Live

const port = process.env.PORT || 5000;
app.listen(port, console.log(`server is up on port: ${port} 🚀`));
