const express = require("express");
const app = express();
const { PORT } = require("./config");
const morgan = require("morgan");
const Connect = require("./models");
const route = require("./routes/user.route");
const cors = require("cors");
const cookies = require("cookie-parser");

app.use(cookies());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://votememodel.vercel.app"],
    credentials: true,
  })
);
app.use(route);

app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, async () => {
  await Connect();
  console.log(`Running server on ${PORT}`);
});
