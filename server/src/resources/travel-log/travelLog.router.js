"use strict";

const express = require("express");
const TravelLog = require("./travelLog.model");
const constants = require("../../utils/constants");

const travelLogRouter = express.Router();

travelLogRouter
  .route("/")
  .post(async function createOne(req, res, next) {
    try {
      const location = {
        title: req.body.title,
        comments: req.body.comments,
        visitDate: req.body.visitDate,
        location: {
          type: "Point",
          coordinates: [req.body.latitude, req.body.longitude],
        },
      };
      await TravelLog.create(location);

      return res.status(201).end();
    } catch (error) {
      if (error.name === constants.VALIDATION_ERROR) {
        res.status(400);
      }
      next(error);
    }
  })
  .get(async function getAll(req, res, next) {
    try {
      const logEntries = await TravelLog.find().limit(100).exec();
      return res.status(200).json({ data: logEntries });
    } catch (error) {
      next(error);
    }
  });

module.exports = travelLogRouter;
