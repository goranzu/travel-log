"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const connect = require("./db");
const travelLogRouter = require("./resources/travel-log/travelLog.router");
const middlewares = require("./middlewares");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  }),
);

app.use(morgan("common"));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "😆😎🍕😍✌🎂" });
});

app.use("/api/logs", travelLogRouter);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

function start() {
  connect(config.dbUrl)
    .then(() => {
      app.listen(config.port, () => {
        console.log(`Listening on http://localhost:${config.port}`);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { start };
