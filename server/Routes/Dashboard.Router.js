import express from "express";
import { isStaff } from "../MW/MW.Staff.Alaa.js";

const dashboard_router = express.Router();

dashboard_router.route("/").get(isStaff, (req, res, next) => {
  res
    .status(200)
    .json({ msg: "You are logged in and allowed to navigate the dashboard" });
});



export default dashboard_router;
