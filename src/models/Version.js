const mongoose = require("mongoose");

const deleteFromParent = require("../middlewares/deleteFromParent");
const CONSTANTS = require("../constants/constants");

const VersionSchema = new mongoose.Schema({
  parendId: { type: mongoose.Types.ObjectId, require: true },
  version: { type: Number, require: true, default: 0 },
  code: { type: String, require: true, default: "" },
  createdAt: {
    type: Date,
    required: true,
    expires: CONSTANTS.EXPIRED_SECOND,
    default: Date.now(),
  },
});

VersionSchema.pre("remove", deleteFromParent);

module.exports = mongoose.model("Version", VersionSchema);
