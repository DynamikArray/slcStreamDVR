const { Queue } = require("bullmq");
const { RECORDINGS_QUEUE } = require("./queues.constants");

const recordingsQueue = new Queue(RECORDINGS_QUEUE, {
  connection: {
    host: process.env.REDIS_URL,
  },
});

module.exports = { recordingsQueue };
