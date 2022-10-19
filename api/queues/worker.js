const { logger, LEVELS } = require("../services/loggerService");
const { Worker } = require("bullmq");
const { RECORDINGS_QUEUE } = require("./queues.constants");

const recordingsQueueWorker = new Worker(
  RECORDINGS_QUEUE,
  async (job) => {
    console.log("WE RAND THE JOB??");
    logger.log(LEVELS.DEBUG, "Worker | recordingsQueueWorker " + job.data);
  },
  {
    connection: {
      host: process.env.REDIS_URL,
    },
  }
);

recordingsQueueWorker.on("error", (err) => {
  logger.log(LEVELS.ERROR, `Worker | recordingsQueueWorker | ${err}`);
});

module.exports = { recordingsQueueWorker };
