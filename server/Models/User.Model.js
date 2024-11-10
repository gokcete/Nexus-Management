import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import randomString from "random-string-gen";

const addressSchema = new Schema(
  {
    country: { type: String },
    city: { type: String },
    zip_code: { type: String },
    street: { type: String },
    number: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema(
  // in this Schema all of: Name, Email, Password and role are REQUIRED
  // but only the email should be unique:
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, min: 8, max: 50, required: true },
    birthday: { type: String },
    main_address: addressSchema,
    billing_address: addressSchema,
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    activated: { type: Boolean, default: false },
    activation: { type: String, default: "" },
    user_experiences: [],
  },
  { timestamps: true }
);

// hashing Password and creating activation_code

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    } else {
      // Hashing
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);

      // Creating activation link
      const code = randomString({ capitalization: "lowercase" });
      this.activation = code + "/" + this._id;

      // Saving the time of change
      this.updated_at = Date.now();

      next();
    }
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
