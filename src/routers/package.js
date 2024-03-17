const express = require("express");

const packageController = require("../controllers/packageController");

const router = express.Router();

router.get("/:package", packageController.getBundledPackageCode);

module.exports = router;
