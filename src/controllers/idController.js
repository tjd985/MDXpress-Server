const mongoose = require("mongoose");
const createError = require("http-errors");

const TemporaryUser = require("../models/TemporaryUser");
const Version = require("../models/Version");

const ERROR = require("../constants/error");
require("../utils/changeStream");

async function getCurrentVersionCode(req, res, next) {
  const { id, version: targetVersion } = req.params;

  try {
    const result = await TemporaryUser.findById(id)
      .populate({
        path: "versions",
        match: {
          version: targetVersion,
        },
      })
      .exec();

    const targetCode = result.versions[0].code;

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
    if (!mongoose.isValidObjectId(id) && id !== "first") {
      res.json({
        result: "Error",
        status: ERROR.BAD_REQUEST.status,
        message: ERROR.BAD_REQUEST.message,
      });

      return;
    }

    if (id === "first") {
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

    const temporaryUser = await TemporaryUser.findById(id);

    if (!temporaryUser) {
      res.json({
        result: "Error",
        status: ERROR.NOT_FOUND.status,
        message: ERROR.NOT_FOUND.message,
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
