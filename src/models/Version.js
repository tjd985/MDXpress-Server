const mongoose = require("mongoose");

const { Schema } = mongoose;
const CONSTANTS = require("../constants/constants");

const VersionSchema = new Schema({
  version: { type: Number, require: true, default: 0 },
  code: { type: String, require: true, default: "" },
  createdAt: {
    type: Date,
    required: true,
    expires: CONSTANTS.EXPIRED_SECOND,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Version", VersionSchema);
