const expressLoader = require("./express");
const mongooseLoader = require("./mongoose");
const routerLoader = require("./routers");
const errorLoader = require("./error");

const appLoader = async (app) => {
  await mongooseLoader();
  expressLoader(app);
  routerLoader(app);
  errorLoader(app);
};

module.exports = appLoader;
