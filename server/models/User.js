const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.role !== "patient";
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User }
