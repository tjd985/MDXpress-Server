const createError = require("http-errors");

const ERROR = require("../constants/error");

async function getCurrentVersionCode(req, res, next) {
  const { version } = req.params;
  const { temporaryUser } = res.locals;

  try {
    const targetVersionCode = temporaryUser.versions[version].code;

    res.json({
      result: "OK",
      status: 200,
      content: targetVersionCode,
    });
  } catch (err) {
    const customError = createError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
}

function saveCode(req, res, next) {
  res.status(200).end("saved");
}

module.exports = { getCurrentVersionCode, saveCode };
