import { passwordCheck, verifyToken } from "../HelperFNs/Helper.Alaa.js";
import { Staff } from "../Models/Staff.Model.js";
import jwt from "jsonwebtoken";

// use this as a MW in each path to find the user or return failure message
export const login_helper = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Staff.findOne({ username: username });

    if (!user) {
      res.status(500).json({
        msg: `We couldn't find any user registered with this username: ${username}, please check your entry and login again`,
      });
    } else if (!(await passwordCheck(user, password))) {
      res
        .status(401)
        .json({ msg: `Your password doesn't match, please try again` });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

// use this FN to give only Admins the role to add, delete or get users

export const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user = await verifyToken(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      res
        .status(401)
        .json({ msg: "You need admin authentications to proceed" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const isStaff = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Extract the token from cookies

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Authentication required: No token provided" });
    }

    // Verify the token using jsonwebtoken
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return res.status(403).json({ msg: "Access denied: Unauthorized" });
    }

    req.user = user; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error); // Log the error for debugging
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const isSupervisor = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user = await verifyToken(token, process.env.JWT_SECRET);
    if (!user || !token) {
      res.status(400).json({ msg: "Sorry, no match found" });
    } else if (user.role === "staff") {
      res
        .status(400)
        .json({ msg: "Sorry, you are not authorized to make changes" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};
