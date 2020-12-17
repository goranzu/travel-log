"use strict";

const { merge } = require("lodash");
const constants = require("../utils/constants");

const env = process.env.NODE_ENV || constants.DEVELOPMENT;

const baseConfig = {
  env,
  isDev: env === constants.DEVELOPMENT,
  corsOrigin: "http://localhost:3000",
  port: 5000,
};

let envConfig = {};

switch (env) {
  case constants.DEVELOPMENT:
    envConfig = require("./dev");
    break;
  default:
    envConfig = require("./dev");
}

module.exports = Object.freeze(merge(baseConfig, envConfig));
