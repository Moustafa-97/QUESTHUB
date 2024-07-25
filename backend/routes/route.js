const express = require("express");

const router = express.Router();
const { requireUserAuth } = require("../middleware/authUserMiddleware");
const {
  is_logged,
  auth_user_login,
  auth_user_signup,
  user_logout,
  user_profile,
  user_update_profile,
  user_add_task,
  user_delete_task,
  user_update_task,
  send_register_OTP,
  send_forget_password_OTP,
  change_password,
  user_get_task,
} = require("../controllers/UserController");

// user create control signup/login/logout routes
router.post("/login", auth_user_login);
router.post("/signup", auth_user_signup);
router.post("/logout", user_logout);
//
// check if user loggedin (cookies check)
router.post("/isLogged", requireUserAuth, is_logged);
//
// user profile control
router
  .route("/profile")
  .get(requireUserAuth, user_profile)
  .patch(requireUserAuth, user_update_profile);

//
// add change/forget password system
//

router.post("/send-forget-pass-otp", send_forget_password_OTP);
router.put("/change-password", change_password);

//
//  control tasks
router
  .route("/task")
  // 1)add task
  .post(requireUserAuth, user_add_task)
  // 2)edit task
  .patch(requireUserAuth, user_update_task)
  // 3)delete task
  .delete(requireUserAuth, user_delete_task)
  // 4)delete task
  .get(requireUserAuth, user_get_task);

//  control comments
router
  .route("/comment")
  // 1)add task
  .post(requireUserAuth, user_add_task)
  // 2)edit task
  .patch(requireUserAuth, user_update_task)
  // 3)delete task
  .delete(requireUserAuth, user_delete_task);

module.exports = router;
