const mongoose = require("mongoose");

const { Schema } = mongoose;

const TemporaryUserSchema = new Schema({
  versions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
    },
  ],
});

module.exports = mongoose.model("TemporaryUser", TemporaryUserSchema);
