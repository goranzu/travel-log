"use strict";

const constants = require("../utils/constants");

const env = process.env.NODE_ENV || constants.DEVELOPMENT;

const baseConfig = {
  env,
  isDev: env === constants.DEVELOPMENT,
  corsOrigin: "http://localhost:3000",
  port: 5000,
};

module.exports = Object.freeze(baseConfig);
