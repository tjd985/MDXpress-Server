const mongoose = require("mongoose");

const CONSTANTS = require("../constants/constants");

const VersionSchema = new mongoose.Schema({
  version: { type: Number, require: true, default: 0 },
  code: { type: String, require: true, default: "" },
  expireAt: {
    type: Date,
    expires: CONSTANTS.EXPIRED_SECOND,
    default: Date.now,
  },
});

module.exports = mongoose.model("Version", VersionSchema);
