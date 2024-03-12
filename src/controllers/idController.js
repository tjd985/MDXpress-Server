const createError = require("http-errors");

const TemporaryUser = require("../models/TemporaryUser");
const Version = require("../models/Version");

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

const ERROR = require("../constants/error");

async function getCurrentVersionCode(req, res, next) {
  const { version: targetVersion } = req.params;
  const { temporaryUser } = res.locals;

  try {
    const targetCode = temporaryUser
      .populate({
        path: "versions",
        match: {
          version: targetVersion,
        },
      })
      .exec((err, result) => {
        return result.versions[0].code;
      });

    res.json({
      result: "OK",
      status: 200,
      content: targetCode,
    });
  } catch (err) {
    const customError = createError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
}

async function saveCode(req, res, next) {
  const { id } = req.params;
  const { code } = req.body;

  try {
    const temporaryUser = await TemporaryUser.findById(id);

    if (!temporaryUser) {
      const latestVersion = await Version.create({
        version: 0,
        code,
      });

      const newTemporayUser = await TemporaryUser.create({
        versions: latestVersion._id,
      });
      await newTemporayUser.save();

      res.json({
        result: "OK",
        status: 200,
        content: latestVersion,
      });

      return;
    }

    const userInformation = await TemporaryUser.findById(id)
      .populate("versions")
      .exec();

    const userVersionList = userInformation.versions;

    const versionNumberList = userVersionList.map((versionObject) => {
      return versionObject.version;
    });

    const currentLatestVersion = Math.max(...versionNumberList);

    const latestVersion = await Version.create({
      version: currentLatestVersion + 1,
      code,
      createdAt: Date.now(),
    });

    temporaryUser.versions.push(latestVersion._id);
    await temporaryUser.save();

    res.json({
      result: "OK",
      status: 200,
      content: latestVersion,
    });
  } catch (err) {
    const customError = createError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
}
module.exports = { getCurrentVersionCode, saveCode };
