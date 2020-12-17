"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const connect = require("./db");
const travelLogRouter = require("./resources/travel-log/travelLog.router");

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

app.use(function notFound(req, res, next) {
  const error = new Error("Not Found");
  res.status(404);
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(err, req, res, next) {
  // If status is set in previous middleware return that status else set it to 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res
    .status(statusCode)
    .json({ message: err.message, stack: config.isDev && err.stack });
});

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
