import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const staffSchema = new Schema(
  // in this Schema all of: Name, Email, Password and role are REQUIRED
  // but only the email should be unique:
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, min: 8, max: 50, required: true },
    role: {
      type: String,
      enum: ["admin", "supervisor", "staff"],
      default: "staff",
    },
    phone: { type: String },
    address: { type: String },
    pic: { type: String },
    activated: { type: Boolean, default: false },
    pass_changed_at: { type: Date },
  },
  { timestamps: true }
);

// hashing Password

staffSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    } else {
      // Hashing
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);

      next();
    }
  } catch (error) {
    next(error);
  }
});

staffSchema.methods.comparePass = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Staff = model("Staff", staffSchema);
