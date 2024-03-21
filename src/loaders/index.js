const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
const routerLoader = require("./routers");
const dockerLoader = require("./docker");
const errorLoader = require("./error");

const appLoader = async (app) => {
  await mongooseLoader();
  await dockerLoader();
  expressLoader(app);
  routerLoader(app);
  errorLoader(app);
};

module.exports = appLoader;
