const TemporaryUser = require("../models/TemporaryUser");

async function deleteFromParent(next) {
  await TemporaryUser.findOneAndUpdate(
    { _id: this.parendId },
    {
      $pull: {
        versions: this._id,
      },
    },
  );

  next();
}

module.exports = deleteFromParent;
