require("dotenv").config();
const { logger, LEVELS } = require("./services/loggerService");
const morgan = require("morgan");

const express = require("express");
const apiServer = express();
apiServer.use(morgan("common"));

const { connectDb } = require("./services/mongooseService");

const router = require("./routes/router.js");
apiServer.use(router);

//Bull Dashboard
const { serverAdapter } = require("./queues/dashboard");

const start = async () => {
  //connect to Mongo
  await connectDb();

  //Bull Dashboard
  apiServer.use(process.env.QUEUES_ADMIN_UI, serverAdapter.getRouter());

  //tell app to listen
  apiServer.listen(process.env.APP_PORT, () => {
    logger.log(LEVELS.INFO, `Server | App listening on port  ${process.env.APP_PORT}`);
  });
};

//run start
start();
