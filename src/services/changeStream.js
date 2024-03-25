const TemporaryUser = require("../models/TemporaryUser");
const Version = require("../models/Version");

if (process.env.NODE_ENV !== "test") {
  Version.watch().on("change", async (changedData) => {
    if (changedData.operationType === "delete") {
      const allUsers = await TemporaryUser.find();
      const deletedVersionId = changedData.documentKey._id.toString();

      for (const user of allUsers) {
        user.versions.forEach((versionId, index) => {
          if (versionId.toString() === deletedVersionId) {
            user.versions.splice(index, 1);
          }
        });

        await user.save();
      }
    }
  });
}
