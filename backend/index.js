const express = require("express");
const app = express();
const { PORT } = require("./config");
const morgan = require("morgan");
const Connect = require("./models");
const route = require("./routes/user.route");
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(route);

app.listen(PORT, async () => {
  await Connect();
  console.log(`Running server on ${PORT}`);
});
