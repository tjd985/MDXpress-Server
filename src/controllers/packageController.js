const fs = require("node:fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("node:child_process").exec);
const createError = require("http-errors");

const ERROR = require("../constants/error");
const ERROR_PATTERNS = require("../constants/error");

const getEntryPointPath = require("../utils/getEntryPointPath");
const bundlePackage = require("../utils/bundlePackage");

async function getBundledPackageCode(req, res, next) {
  const { package: packageName } = req.params;

  try {
    const { stderr } = await exec(`npm install ${packageName}`);

    if (stderr) {
      res.json({
        result: "Error",
        status: ERROR_PATTERNS.BAD_REQUEST.status,
        message: ERROR_PATTERNS.BAD_REQUEST.message,
      });
    }

    const entryPointPath = getEntryPointPath(packageName);

    bundlePackage(packageName, entryPointPath).then(() => {
      const bundleCodePath = path.resolve(
        __dirname,
        "../../",
        "dist",
        "packageBundle.js",
      );

      const bundledPackageCode = fs.readFileSync(bundleCodePath, {
        encoding: "utf8",
      });

      res.json({
        result: "OK",
        status: 200,
        content: bundledPackageCode,
      });
    });
  } catch (err) {
    const customError = createError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
}

module.exports = { getBundledPackageCode };
