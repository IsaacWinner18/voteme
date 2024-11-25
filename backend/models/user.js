const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  code: {
    type: Number,
    nullable: true,
    default: null
  },
});

const userSchema = new mongoose.model("users", user);
module.exports = userSchema;
