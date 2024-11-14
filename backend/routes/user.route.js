const express = require("express");
const UserRouter = express.Router();
const {
  getUsers,
  createUser,
  voteUser,
} = require("../controller/user.controller");

UserRouter.route("/users").get(getUsers).post(createUser);
UserRouter.route("/user/vote/:id").patch(voteUser);

module.exports = UserRouter;
