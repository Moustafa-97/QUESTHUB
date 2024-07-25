const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 1800 },
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.model("OTP", otpSchema);
module.exports = { otpModel };
