"use strict";

const mongoose = require("mongoose");

const travelLogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    visitDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const TravelLog = mongoose.model("travelLog", travelLogSchema);

module.exports = TravelLog;
