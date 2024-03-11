const idRouter = require("../routers/id");

function loadRouter(app) {
  app.use("/id", idRouter);
}

module.exports = loadRouter;
