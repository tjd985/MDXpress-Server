const TemporaryUser = require("../models/TemporaryUser");

async function deleteFromParent(next) {
  const parentCollection = await TemporaryUser.findById(this.parendId);
  const thisIndex = parentCollection.versions.findIndex(
    (value) => value === this._id,
  );

  parentCollection.versions.splice(thisIndex, 1);
  await parentCollection.save();

  next();
}

module.exports = deleteFromParent;
