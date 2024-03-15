const { isValidObjectId } = require("mongoose");
const createError = require("http-errors");

const TemporaryUser = require("../models/TemporaryUser");

const ERROR = require("../constants/error");
const CONSTANTS = require("../constants/constants");

async function verifyUser(req, res, next) {
  const { id } = req.params;

  if (!isValidObjectId(id) && id !== "first") {
    res.json({
      result: "error",
      status: ERROR.BAD_REQUEST.status,
      message: ERROR.BAD_REQUEST.message,
    });

    return;
  }

  if (id === "first") {
    res.json({
      result: "OK",
      status: 200,
      content: CONSTANTS.BOILER_PLATE_CODE,
    });

    return;
  }

  try {
    const temporaryUser = await TemporaryUser.findById(id);

    if (!temporaryUser) {
      res.json({
        result: "error",
        status: ERROR.NOT_FOUND.status,
        message: ERROR.NOT_FOUND.message,
      });

      return;
    }

    next();
  } catch (err) {
    const customError = createError(
      ERROR.SERVER_ERROR.status,
      ERROR.SERVER_ERROR.message,
    );

    next(customError);
  }
}

module.exports = verifyUser;
