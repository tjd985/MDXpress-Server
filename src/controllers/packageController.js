const fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("node:child_process").exec);
const webpack = require("webpack");
const createError = require("http-errors");

const ERROR = require("../constants/error");
const ERROR_PATTERNS = require("../constants/error");

function getPackageEntryPointPath(packageName) {
  const packageJsonPath = path.resolve(
    __dirname,
    "../../",
    "node_modules",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const entryPointPath = path.resolve(
    __dirname,
    "../../",
    "node_modules",
    packageName,
    packageJson.main || "index.js",
  );

  return entryPointPath;
}

async function bundlePackage(entryPointPath) {
  return new Promise((resolve, reject) => {
    webpack(
      {
        mode: "development",
        entry: entryPointPath,
        output: {
          path: path.resolve(__dirname, "../../", "dist"),
          filename: "packageBundle.js",
          libraryTarget: "umd",
        },
      },
      (error, stats) => {
        if (error || stats.hasErrors()) {
          reject(new Error());

          return;
        }

        resolve();
      },
    );
  });
}

async function getBundledPackageCode(req, res, next) {
  const { package: packageName } = req.params;

  try {
    const { stderr } = await exec(`npm install ${packageName}`);

    if (stderr) {
      res.json({
        result: "ERROR",
        status: ERROR_PATTERNS.BAD_REQUEST.status,
        message: ERROR_PATTERNS.BAD_REQUEST.message,
      });
    }

    const entryPointPath = getPackageEntryPointPath(packageName);

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
