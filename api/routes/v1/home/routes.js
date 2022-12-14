const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/v1/home/homeController");

router.get("/", homeController.home);

module.exports = router;
