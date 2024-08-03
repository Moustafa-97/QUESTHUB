const asyncHandler = require("express-async-handler");
const { user } = require("../models/User/UserModel");
const { otpModel } = require("../models/otp/otp");
const { GenerateUserToken } = require("../utils/generateUserToken");
const { task } = require("../models/tasks/Tasks");
const { comment } = require("../models/comments/Comments");
const validator = require("validator");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
// handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors = "That email is already in use.";
    return errors;
  } else {
    errors = "wrong email or password";
    return errors;
  }

  // validation errors
  if (err.message.includes("Validation failed")) {
    console.log(err);
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// User controllers
// ---------------------
// @desc auth user isLoged
// @desc GET /user/isLoged
// @access public / require login
// to remove 👇
module.exports.is_logged = asyncHandler(async (req, res, next) => {
  res.status(200).json({ user: req.user, state: true });
});

//
// @desc auth user signup + token
// @desc POST /signup
//  @access public
// newUser
// done
module.exports.auth_user_signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body.newUser;
  try {
    await user.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.status(200).json({
      message: "Account created successfuly, Let's make the future",
      status: true,
    });
  } catch (err) {
    const errors = err.errors.email.message;
    res.status(400).json({ message: errors, state: false });
  }
});

//
// @desc auth user login + token
// @desc POST /login
//  @access public
// currentUser
module.exports.auth_user_login = async (req, res, next) => {
  const { email, password } = req.body.currentUser;
  try {
    const userLogin = await user.login(email, password);

    if (userLogin) {
      
      GenerateUserToken(res, userLogin._id);

      res.status(200).json({
        user: userLogin,
        message: "Welcome Back",
        state: true,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "wrong email or password, maybe you need to signup 😉",
      state: false,
    });
  }
};

//
// @desc auth user Logout - delete token
// @desc POST /logout
// @access public
//
module.exports.user_logout = asyncHandler(async (req, res, next) => {
  res.cookie(process.env.USER_TOKEN, "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out", state: true });
});

//
// @desc auth user profile
// @desc GET /profile
// @access Private - auth.
// user-token**
module.exports.user_profile = asyncHandler(async (req, res, next) => {
  res.status(200).json({ user: req.user, state: true });
});

//
// @desc auth user update profile
// @desc PATCH /user/profile
// @access Private - auth.
// _id(token)
module.exports.user_update_profile = asyncHandler(async (req, res, next) => {
  const loggeduser = await user.findById(req.user._id);

  if (loggeduser) {
    loggeduser.firstName = req.body.firstName || loggeduser.firstName;
    loggeduser.lastName = req.body.lastName || loggeduser.lastName;
    loggeduser.email = req.body.email || loggeduser.email;
    loggeduser.theme = req.body.theme || loggeduser.theme;
    loggeduser.expPoints = req.body.expPoints || loggeduser.expPoints;
    loggeduser.level = req.body.level || loggeduser.level;

    const loggedSave = await loggeduser.save();
    res
      .status(200)
      .json({ user: loggedSave, message: "Profile edited", state: true });
  } else {
    res.status(404);
    throw new Error("user is not found");
  }
});

// ------------
// will add forget/change password system using nodemailer
// ------------

module.exports.send_register_OTP = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email)
      return res
        .status(400)
        .json({ message: "email field is required", state: false });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        state: false,
      });

    const isEmailAlreadyReg = await user.findOne({ email });
    // in register user should not be registered already
    if (isEmailAlreadyReg)
      return res.status(400).json({
        message: `user with email ${email} already resgistered `,
        state: false,
      });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await otpModel.create({
      email,
      otp: hashedOTP,
      name: "register_otp",
    });

    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verification",
      html: `<p>Your OTP code is ${otp}</p>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else return null;
      console.log(info);
    });

    res.status(200).json({
      result: newOTP,
      message: "register_otp send successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: "error in sendRegisterOTP - controllers/user.js",
      error,
      success: false,
    });
  }
};

//
// @desc auth user change/forgot profile
// @desc POST /user/send-forget-pass-otp
// @access Public
// forgetPassword:email
//
module.exports.send_forget_password_OTP = async (req, res) => {
  try {
    const { email } = req.body.forgetPassword;
    const isEmailAlreadyReg = await user.findOne({ email: email });

    if (!email)
      return res
        .status(400)
        .json({ message: "email field is required", success: false });
    // in forget password route, user should be registered already
    if (!isEmailAlreadyReg)
      return res
        .status(400)
        .json({ message: `no user exist with email ${email}`, success: false });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        success: false,
      });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTP = await otpModel.create({
      email,
      otp: hashedOTP,
      name: "forget_password_otp",
    });

    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verification",
      html: `<p>Your OTP code is ${otp}</p>`, // all data to be sent
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else return null;
      // console.log(info);
    });

    res.status(200).json({
      result: newOTP,
      otp,
      message: "forget_password_otp send successfully",
      state: true,
    });
  } catch (error) {
    res.status(404).json({
      message: "error in sendForgetPasswordOTP - controllers/user.js",
      error,
      state: false,
    });
  }
};

//
// @desc auth user change/change password
// @desc PUT /user/change-password
// @access Public
// newPassword:email,password,otp
//
module.exports.change_password = async (req, res) => {
  try {
    const { email, password, otp } = req.body.newPassword;
    if (!email || !password || !otp)
      return res.status(400).json({
        message: "make sure to provide all the fieds ( email, password, otp)",
        success: false,
      });
    if (!validator.isEmail(email))
      return res.status(400).json({
        message: `email pattern failed. Please provide a valid email.`,
        success: false,
      });

    const findedUser = await user.findOne({ email });
    if (!findedUser)
      return res.status(400).json({
        message: `user with email ${email} is not exist `,
        success: false,
      });

    const otpHolder = await otpModel.find({ email });
    if (otpHolder.length == 0)
      return res
        .status(400)
        .json({ message: "you have entered an expired otp", success: false });

    const forg_pass_otps = otpHolder.filter(
      (otp) => otp.name == "forget_password_otp"
    ); // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
    const findedOTP = forg_pass_otps[forg_pass_otps.length - 1];

    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;

    const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP);
    console.log(isValidOTP);
    if (isValidOTP) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await user.findByIdAndUpdate(
        findedUser._id,
        { email, password: hashedPassword },
        { new: true }
      );

      await otpModel.deleteMany({ email: findedOTP.email });

      return res.status(200).json({
        result,
        message: "password changed successfully",
        success: true,
      });
    } else {
      return res.status(200).json({ message: "wrong otp", success: false });
    }
  } catch (error) {
    res.status(404).json({
      message: "error in changePassword - controllers/user.js",
      error,
      success: false,
    });
  }
};

//
// @desc auth user add new task
// @desc POST /task
// @access Private
//
// res: tasks/message/state
// user._id(token), taskTitle, taskDescription, startDate, endDate
module.exports.user_add_task = asyncHandler(async (req, res, next) => {
  const { taskTitle, taskDescription, startDate, endDate } = req.body.newTask;
  try {
    await task.create({
      userID: req.user._id,
      taskTitle,
      taskDescription,
      startDate,
      endDate,
    });

    const userHasTasks = await task.find({
      userID: req.user._id.toString(),
    });
    // console.log(userHasTasks);
    if (userHasTasks) {
      res.status(200).json({
        message: "Task was added successfully",
        tasks: userHasTasks,
        state: true,
      });
      return;
    }
  } catch (err) {
    res.status(400).json({
      message: err,
      state: true,
    });
  }
});

// @desc auth user update task
// @desc PATCH /task
// @access Private
//
// res: tasks/message/state
// user._id(token), taskId, taskTitle, taskDescription, startDate, endDate, taskStatus(completed/pending/incompleted)
module.exports.user_update_task = asyncHandler(async (req, res, next) => {
  const userTask = await task.findById(req.body.taskId);

  if (userTask) {
    userTask.taskTitle = req.body.taskTitle || userTask.taskTitle;
    userTask.taskDescription =
      req.body.taskDescription || userTask.taskDescription;
    userTask.startDate = req.body.startDate || userTask.startDate;
    userTask.endDate = req.body.endDate || userTask.endDate;
    userTask.taskStatus = req.body.taskStatus || userTask.taskStatus;

    await userTask.save();
    const updatedUserTasks = await task.find({ userID: req.user._id });
    res.status(200).json({
      tasks: updatedUserTasks,
      message: req.body.taskStatus ? "task completed" : "task edited",
      state: true,
    });
  } else {
    res.status(404);
    throw new Error("task is not found");
  }
});

// @desc auth user delete task
// @desc DELETE /task
// @access Private
//
// res: tasks/message/state
// user._id(token), taskId
module.exports.user_delete_task = async (req, res, next) => {
  const { taskId } = req.body;

  try {
    await task.findByIdAndDelete(taskId.toString());
    const userHasTasks = await task.find({
      userID: req.user._id.toString(),
    });

    res.status(200).json({
      message: "Task deleted successfully",
      tasks: userHasTasks,
      state: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
      state: true,
    });
  }
};

// @desc auth user get task
// @desc GET /task
// @access Private
//
// res: tasks/message/state
// user._id(token)

module.exports.user_get_task = async (req, res, next) => {
  const userId = req.user._id;
  const userTasks = await task.find({ userID: userId });
  res.status(200).json({
    tasks: userTasks,
    message: "Task fetched successfully",
    state: true,
  });
};

// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------

//
// @desc auth user add new comment
// @desc POST /comment
// @access Private
//
// res: comments/message/state
// user._id(token), commentTitle, commentDescription, commentDate
module.exports.user_add_comment = asyncHandler(async (req, res, next) => {
  const { commentTitle, commentDescription, commentDate } = req.body;
  try {
    await comment.create({
      userID: req.user._id,
      commentTitle,
      commentDescription,
      commentDate,
    });

    const userHasComments = await comment.find({
      userID: req.user._id.toString(),
    });
    console.log(userHasComments);
    if (userHasComments) {
      res.status(200).json({
        message: "Comment was added successfully",
        comments: userHasComments,
        state: true,
      });
      return;
    }
  } catch (err) {
    res.status(400).json({
      message: err,
      state: true,
    });
  }
});

// @desc auth user add new comment
// @desc PATCH /comment
// @access Private
//
// res: comments/message/state
// user._id(token), commentId, commentTitle, commentDescription, commentDate, endDate, commentStatus(completed/pending/incompleted)
module.exports.user_update_comment = asyncHandler(async (req, res, next) => {
  const usercomment = await comment.findById(req.body.commentId);
  // console.log(usercomment);
  if (usercomment) {
    console.log(req.body);
    usercomment.commentTitle =
      req.body.commentTitle || usercomment.commentTitle;
    usercomment.commentDescription =
      req.body.commentDescription || usercomment.commentDescription;

    await usercomment.save();
    const updatedUserComments = await comment.find({ userID: req.user._id });
    res.status(200).json({
      comments: updatedUserComments,
      message: "Comment edited",
      state: true,
    });
  } else {
    res.status(404);
    throw new Error("Comment is not found");
  }
});

// @desc auth user delete comment
// @desc DELETE /comment
// @access Private
//
// res: comments/message/state
// user._id(token), commentId
module.exports.user_delete_comment = async (req, res, next) => {
  const { commentId } = req.body;

  try {
    await comment.findByIdAndDelete(commentId.toString());
    const userHasComments = await comment.find({
      userID: req.user._id.toString(),
    });

    res.status(200).json({
      message: "comment deleted successfully",
      comments: userHasComments,
      state: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
      state: true,
    });
  }
};
