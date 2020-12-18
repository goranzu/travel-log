"use strict";

const config = require("./config");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // If status is set in previous middleware return that status else set it to 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res
    .status(statusCode)
    .json({ message: err.message, stack: config.isDev && err.stack });
}

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

module.exports = { errorHandler, notFound };
