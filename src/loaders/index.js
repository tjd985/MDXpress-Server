const expressLoader = require("./express");
const routerLoader = require("./routers");
const errorLoader = require("./error");
const mongooseLoader = require("./mongoose");
const dockerLoader = require("./docker");

const appLoader = async (app) => {
  expressLoader(app);
  routerLoader(app);
  errorLoader(app);
  await mongooseLoader();
  await dockerLoader();
};

module.exports = appLoader;
