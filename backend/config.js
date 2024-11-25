require("dotenv").config({
  path: "./.env",
});

const Config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_CONNECTION_URI: process.env.DB_CONNECTION_URI,
};

module.exports = { ...Config };
