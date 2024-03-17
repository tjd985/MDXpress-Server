const idRouter = require("../routers/id");
const packageRouter = require("../routers/package");

function loadRouter(app) {
  app.use("/id", idRouter);
  app.use("/package", packageRouter);
}

module.exports = loadRouter;
