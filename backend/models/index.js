const mongoose = require("mongoose");
const config = require("../config");

const connect = async () => {
  try {
    await mongoose.connect(config.DB_CONNECTION_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
