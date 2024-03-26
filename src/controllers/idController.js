const mongoose = require("mongoose");
const createError = require("http-errors");
const util = require("util");
const exec = util.promisify(require("node:child_process").exec);

const TemporaryUser = require("../models/TemporaryUser");
const Version = require("../models/Version");

const ERROR = require("../constants/error");
require("../services/changeStream");
const isOwnProperty = require("../utils/isOwnPorperty");

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

    const currnetVersionPackageList = result.versions[0].packageList;
    const bundleCodeList = [];

    for (const packageName in currnetVersionPackageList) {
      if (isOwnProperty(currnetVersionPackageList, packageName)) {
        const dockerCommand = `docker run --rm tjd985/mdxpress-docker:latest ${packageName} sh -c cat /${packageName}.js`;

        const { stdout: commandResult, stderr } = await exec(dockerCommand);

        if (stderr) {
          const customError = createError(
            ERROR.BAD_REQUEST.status,
            ERROR.BAD_REQUEST.message,
          );

          next(customError);

          return;
        }

        const newLineIndex = commandResult.indexOf("\n");

        const packageInformation = commandResult.slice(0, newLineIndex);
        const bundledPackageCode = commandResult.slice(newLineIndex);

        bundleCodeList.push({ packageInformation, bundledPackageCode });
      }
    }

    const targetCode = result.versions[0].code;

    res.json({
      result: "OK",
      status: 200,
      content: {
        targetCode,
        bundleCodeList,
      },
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
  const { code, packageList } = req.body;

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
        packageList,
      });

      const newTemporaryUser = await TemporaryUser.create({
        versions: latestVersion._id,
      });

      res.json({
        result: "OK",
        status: 200,
        content: {
          latestVersion,
          temporaryUser: newTemporaryUser,
        },
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
      packageList,
    });

    temporaryUser.versions.push(latestVersion._id);
    await temporaryUser.save();

    res.json({
      result: "OK",
      status: 200,
      content: {
        latestVersion,
        temporaryUser,
      },
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
