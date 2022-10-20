require("dotenv").config();
const { Worker } = require("bullmq");

const path = require("path");
const { logger, LEVELS } = require("./services/loggerService");
const { RECORDINGS_QUEUE, connection } = require("./queues/queues.constants");

const processorFile = path.join(__dirname, "/jobs/recordingProcessor.js");

function start() {
  try {
    logger.log(LEVELS.INFO, "Worker | index | Starting...");

    const recordingsQueueWorker = new Worker(RECORDINGS_QUEUE, processorFile, { connection });

    recordingsQueueWorker.on("error", (err) => {
      logger.log(LEVELS.ERROR, `Worker | Error | ${err}`);
    });

    recordingsQueueWorker.on("completed", ({ name, id, returnvalue }) => {
      logger.log(LEVELS.INFO, `Worker | Completed: ${name} | Id: ${id} | optionalResponse: ${returnvalue}`);
    });

    logger.log(LEVELS.INFO, "Worker | index | Workers Started.");
  } catch (error) {
    logger.log(LEVELS.ERROR, `Worker | index | ${error.message}`);
  }
}

start();
