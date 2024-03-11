const express = require("express");

const verifyUser = require("../middlewares/verifyUser");
const idController = require("../controllers/idController");

const router = express.Router();

router.get(
  "/:id/version/:version",
  verifyUser,
  idController.getCurrentVersionCode,
);
router.post("/:id", idController.saveCode);

module.exports = router;
