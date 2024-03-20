const util = require("util");
const exec = util.promisify(require("node:child_process").exec);
const createError = require("http-errors");

const ERROR = require("../constants/error");
const ERROR_PATTERNS = require("../constants/error");

async function getBundledPackageCode(req, res, next) {
  const { package: packageName } = req.params;

  try {
    const dockerCommand = `docker run --rm mdxpress-docker ${packageName} sh -c cat /${packageName}.js`;

    const { stdout: commandResult, stderr } = await exec(dockerCommand);
    const newLineIndex = commandResult.indexOf("\n");

    const packageInformation = commandResult.slice(0, newLineIndex);
    const bundledPackageCode = commandResult.slice(newLineIndex);

    if (stderr) {
      res.json({
        result: "Error",
        status: ERROR_PATTERNS.BAD_REQUEST.status,
        message: ERROR_PATTERNS.BAD_REQUEST.message,
      });
    }

    res.json({
      result: "OK",
      status: 200,
      content: {
        packageInformation,
        bundledPackageCode,
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

module.exports = { getBundledPackageCode };
