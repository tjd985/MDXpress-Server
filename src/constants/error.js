const ERROR_PATTERNS = {
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found",
  },
  SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
  },
};

module.exports = ERROR_PATTERNS;
