const mongoose = require("mongoose");
const { user } = require("../User/UserModel");

const Task = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    required: [true, "please login"],
    ref: "User",
  },
  taskTitle: {
    type: String,
    required: [true, "please enter your task title"],
  },
  taskDescription: {
    type: String,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, "please enter end date"],
  },
  taskStatus: {
    type: String,
    enum: ["completed", "pending", "incompleted"],
    default: "pending",
  },
});

// update user experience points and level when task is completed

Task.pre("save", async function (next) {
  if (this.taskStatus === "completed") {
    const task = this;
    const User = await user.findById(task.userID);
    if (User) {
      const expPointsIncrement = 50; // adjust this value as needed
      User.expPoints += expPointsIncrement;
      const levelUpThreshold = 1000; // adjust this value as needed
      if (User.expPoints >= levelUpThreshold) {
        User.level += 1;
        User.expPoints -= levelUpThreshold;
      }
      await User.save();
    }
  }
  next();
});

const task = mongoose.model("task", Task);
module.exports = { task };
