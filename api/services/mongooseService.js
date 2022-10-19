const { logger, LEVELS } = require("./loggerService");
const mongoose = require("mongoose");

//import our modeles here
const Sample = require("../models/sampleSchema");
const models = { Sample };

const connectDb = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URL, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
      logger.log(LEVELS.INFO, "Mongoose Service | Mongoose Connected");
      resolve();
    });

    mongoose.connection.on("error", () => {
      logger.log(
        LEVELS.ERROR,
        "Mongoose Service | Mongoose Connection Error |" + error
      );
      reject();
    });
  });
};

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  logger.log(LEVELS.INFO, "Mongoose Service | Mongoose Disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    logger.log(
      LEVELS.INFO,
      "Mongoose Service | Mongoose Disconnected through app termination"
    );
    process.exit(0);
  });
});

//exports our connection and a models object for reuse
module.exports = { connectDb, models };
