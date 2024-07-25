const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcryptjs = require("bcrypt");

const User = new mongoose.Schema({
  // user main data
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: [true, "This Email has been used before"],
    lowercase: true,
    validate: [isEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password should be at least 8 characters"],
  },
  // select role
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // theme control
  theme: {
    type: String,
    default: "dark",
  },
  // user app data
  //
  // experience points
  expPoints: {
    type: Number,
    default: 0,
  },
  //
  // Level
  level: {
    type: Number,
    default: 1,
  },
  //
  // tasks::
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

// Login settings for user
//
// 1) password encryption
User.pre("save", async function (next) {
  // to prevent password change while update
  if (!this.isModified(["password"])) {
    return next();
  }
  //--------
  // password encryption using bcrypt
  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});
// ----------
// 2) login method
User.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const autheticated = await bcryptjs.compare(password, user.password);

    if (autheticated) {
      const userData = user.toObject(); // Convert to plain object
      delete userData.password; // Remove password property
      return userData; // Return user data without password
    } else {
      throw new Error("Invalid Password");
    }
  } else {
    throw new Error("Invalid email");
  }
};

const user = mongoose.model("user", User);
module.exports = { user };
