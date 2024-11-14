require("dotenv").config({
  path: "./.env",
});

const Config = {
  PORT: process.env.PORT || 5000,
  DB_CONNECTION_URI: process.env.DB_CONNECTION_URI,
};

module.exports = { ...Config };
