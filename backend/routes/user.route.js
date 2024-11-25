const express = require("express");
const UserRouter = express.Router();
const {
  getUsers,
  createUser,
  voteUser,
  login,
  verifyCode,
  sendCode,
  resendCode,
  getUser,
  logout,
} = require("../controller/user.controller");
const Wrapper = require("../middleware/wrapper");

UserRouter.route("/users").get(getUsers).post(Wrapper(createUser));
UserRouter.route("/user/vote/:id").patch(Wrapper(voteUser));

UserRouter.route("/login").post(Wrapper(login));
UserRouter.route("/logout").get(Wrapper(logout));
UserRouter.route("/resend-code").post(Wrapper(resendCode));
UserRouter.route("/verify-code").patch(Wrapper(verifyCode));
UserRouter.route("/me").get(Wrapper(getUser));

module.exports = UserRouter;
