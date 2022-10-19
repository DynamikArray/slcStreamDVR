const express = require("express");
const router = express.Router();

const homeRouter = require("./home/routes");

router.use("/home", homeRouter);

module.exports = router;
