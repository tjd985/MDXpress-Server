const util = require("util");
const exec = util.promisify(require("node:child_process").exec);
const createError = require("http-errors");

const ERROR = require("../constants/error");
const ERROR_PATTERNS = require("../constants/error");

async function getBundledPackageCode(req, res, next) {
  const { package: packageName } = req.params;

  try {
    const dockerCommand = `docker run --rm mdxpress-docker ${packageName} sh -c "cat /${packageName}.js" `;

    const { stdout: bundledPackageCode, stderr } = await exec(dockerCommand);

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
      content: bundledPackageCode,
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
