import { Staff } from "../Models/Staff.Model.js";
import { createToken } from "../HelperFNs/Helper.Alaa.js";

// Controllers for admin only

// 1- Adding staff member
export const add_staff = async (req, res, next) => {
  try {
    const { name, username, password, role, phone, address } = req.body;
    const staff = await Staff.create({
      name,
      username,
      password,
      role,
      phone,
      address,
    });
    staff.password = undefined;
    staff.__v = undefined;
    res.status(200).json({
      msg: `Staff with the username: ${staff.username} was added successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const delete_staff = async (req, res, next) => {
  try {
    const uid = req.params.id;
    const staff = await Staff.findOne({ _id: uid });
    if (!staff) {
      res.status(400).json({ msg: `We don't have a match in our database` });
    } else {
      await Staff.findByIdAndDelete(uid);
      res.status(200).json({
        msg: `The staff member with username: ${staff.username} was deleted successfully`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const get_all_staff = async (req, res, next) => {
  try {
    //page: which page you want to show /number, default 1
    //limit: how many per page / number, default 5

    const length = (await Staff.find()).length;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);

    const pageCount = Math.ceil(length / limit);

    const users = await Staff.find(
      {},
      { _id: 1, name: 1, username: 1, role: 1, activated: 1 }
    )
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      msg: `all users`,
      pageCount,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// new endpoint with filtering, using KEY and Sorting

export const filter_all_staff = async (req, res, next) => {
  try {
    // the end point is: localhost:9115/staff/all/filter

    // the queries to be sent (or not at optional)
    // sortBy: optional: username(default), or any
    // role: optional, admin, supervisor, staff
    // activated: optional, true, false
    // page: optional, which page to start, default the first page
    // limit: optional, how many per page, default 5

    // the code will send you the results and the total count to manipulate

    const { role, activated } = req.query;
    const sortBy = req.query.sortBy || "username";
    const sortOrder = req.query.sortOrder || "asc";
    const sortCriteria = { [sortBy]: sortOrder };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (Number(page) - 1) * Number(limit);
    const query = {};
    if (role) {
      query.role = role;
    }
    if (activated) {
      query.activated = activated;
    }
    const staff2count = await Staff.find(query);
    const countFound = staff2count.length;
    const staff = await Staff.find(query)
      .sort(sortCriteria)
      .limit(Number(limit))
      .skip(skip);

    res.status(200).json({
      msg: `all users`,
      countFound,
      staff,
    });
  } catch (error) {
    next(error);
  }
};

export const master_update = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body); // Add this line
    console.log("Request Params:", req.params); // Add this line

    const uid = req.params.id;
    const { username, role, activated } = req.body;
    const staff = await Staff.findOne({ _id: uid });

    if (!staff) {
      res.status(500).json({ msg: `Sorry, we didn't find any match` });
    } else {
      staff.username = username || staff.username;
      staff.role = role || staff.role;
      staff.activated =
        typeof activated !== "undefined" ? activated : staff.activated;

      await staff.save();

      res.status(200).json({
        msg: `Staff member: ${staff.username} edited successfully`,
        staff,
      });
    }
  } catch (error) {
    next(error);
  }
};

// for all staff members

export const activator = async (req, res, next) => {
  try {
    // UserFound is coming from MW login_helper
    const userFound = req.user;
    const { new_pass1, new_pass2 } = req.body;
    if (new_pass1 !== new_pass2) {
      res.status(500).json({
        msg: "Your first password doesn't match the second password",
      });
    } else {
      userFound.password = new_pass1;
      userFound.activated = true;
      await userFound.save();
      res.status(200).json({
        msg: "Password updated successfully, please login again",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const uid = req.user.uid; // Extract the user's ID from req.user (assumes authentication middleware)

    // Fetch the staff member using the extracted user ID
    const staff = await Staff.findById(uid);

    // Handle case where no staff member is found
    if (!staff) {
      return res.status(404).json({ msg: "Staff member not found" });
    }

    const { name, new_pass1, new_pass2, phone, address } = req.body;

    // Handle password mismatch case
    if (new_pass1 !== new_pass2) {
      res.status(400).json({
        msg: "Your new password does not match the confirmation password.",
      });
    } else {
      staff.name = name || staff.name;
      staff.phone = phone || staff.phone;
      staff.address = address || staff.address;
      staff.password = new_pass1 || staff.password;

      await staff.save();
    }

    // Return success response with detailed message
    res.status(200).json({
      msg: `Staff member ${staff.username}'s information was updated successfully.`,
    });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler middleware
  }
};

export const login = async (req, res, next) => {
  try {
    // staff is coming from MW login_helper
    const staff = req.user;
    if (!staff.activated) {
      res.status(426).json({
        msg: `Hello ${staff.username}, you have to change your password on the first login to activate your account and be able to continue`,
      });
    } else {
      // Generate JWT Token
      const token = await createToken(
        {
          uid: staff._id,
          username: staff.username,
          role: staff.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" } // Token expiration time
      );
      // Set token in an HTTP-only cookie
      res
        .cookie("token", token, {
          secure: true,
          httpOnly: true,
          sameSite: "None",
          expires: new Date(Date.now() + 3_600_000 * 10), // 10 hours
        })
        .status(200)
        .json({ msg: `Your are logged in as :${staff.role}`, staff });
    }
  } catch (error) {
    next(error);
  }
};

export const user_logout = async (req, res, next) => {
  try {
    // const userFound = req.user; // MW to find the user

    const uid = req.user.uid; // MW to find the user
    const staff = await Staff.findById(uid);

    if (!staff) {
      return res.status(404).json({ msg: "User not found" });
    }

    res
      .clearCookie("token")
      .status(200)
      .json({
        msg: `cookies have been terminated, ${staff.username} has been logged out successfully`,
        staff: {
          username: staff.username, // Send only necessary fields
          email: staff.email,
        },
      });
    //console.log("Logout successful for user:", staff.username);
  } catch (error) {
    next(error);
  }
};

export const get_one_staff = async (req, res, next) => {
  try {
    const uid = req.params.id;
    const staff = await Staff.findOne({ _id: uid });
    if (!staff) {
      res.status(400).json({ msg: `We don't have a match in our database` });
    } else {
      staff.password = undefined;
      staff.__v = undefined;
      res.status(200).json({
        msg: `Staff member with username: ${staff.username} was found`,
        staff,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const get_self = async (req, res, next) => {
  try {
    const uid = req.user.uid; // MW to find the user
    const staff = await Staff.findById(uid);
    res.status(200).json({
      msg: `Staff member with username: ${staff.username} was found`,
      staff,
    });
  } catch (error) {
    next(error);
  }
};
