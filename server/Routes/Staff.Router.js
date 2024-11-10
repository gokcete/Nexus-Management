import express from "express";
import {
  name_validator,
  username_validator,
  password_validator,
  role_validator,
  other_staff_user_validators,
  new_password_validator,
    
} from "../Validators/Validators.Alaa.js";
import ValResultHandler from "../Validators/ValidatorsResultHandler.js";
import {
  add_staff,
  delete_staff,
  master_update,
  get_all_staff,
  activator,
  update,
  login,
  user_logout,
  get_one_staff,
  get_self,
  filter_all_staff,
} from "../Controllers/Staff.Controller.js";
import { isAdmin, isStaff, login_helper } from "../MW/MW.Staff.Alaa.js";

const staff_router = express.Router();

// with admin rights only
staff_router
  .route("/add")
  .post(name_validator,username_validator, password_validator, role_validator, other_staff_user_validators, ValResultHandler, isAdmin, add_staff);

staff_router.route("/delete/:id").delete(isAdmin, delete_staff);

staff_router
  .route("/master-update/:id")
  .put(username_validator,role_validator, ValResultHandler, isAdmin, master_update);
staff_router.route("/all").get(isAdmin, get_all_staff);
staff_router.route("/all/filter").get(isAdmin, filter_all_staff);
staff_router.route("/one/:id").get(isAdmin, get_one_staff);

// for the staff propose only
staff_router
  .route("/activate")
  .post(username_validator,password_validator, ValResultHandler, login_helper, activator);
staff_router
  .route("/update")
  .put(name_validator,username_validator, new_password_validator, other_staff_user_validators, ValResultHandler, isStaff, update);

// For all: staff, superuser, admin

staff_router
  .route("/login")
  .post(username_validator,password_validator, ValResultHandler, login_helper, login);
staff_router.route("/logout").post(isStaff, user_logout);
staff_router.route("/profile").get(isStaff, get_self);

export default staff_router;
