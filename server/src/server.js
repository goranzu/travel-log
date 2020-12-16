"use strict";

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");

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

function start() {
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}

module.exports = { start };
