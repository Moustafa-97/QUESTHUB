const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    required: [true, "please login"],
  },
  commentTitle: {
    type: String,
    required: [true, "please enter your comment title"],
  },
  commentDescription: {
    type: String,
  },
  commentDate: {
    type: Date,
    default: Date.now,
  },
});

const comment = mongoose.model("comment", Comment);
module.exports = { comment };
