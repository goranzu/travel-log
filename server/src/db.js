"use strict";

const mongoose = require("mongoose");

function connect(url) {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}

module.exports = connect;
