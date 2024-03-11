const mongooseLoader = require("./mongoose");
const expressLoader = require("./express");
const errorLoader = require("./error");

const appLoader = async (app) => {
  await mongooseLoader();
  await expressLoader(app);
  errorLoader(app);
};

module.exports = appLoader;
