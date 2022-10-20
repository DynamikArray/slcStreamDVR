const { Queue } = require("bullmq");
const { RECORDINGS_QUEUE, connection } = require("./queues.constants");

const recordingsQueue = new Queue(RECORDINGS_QUEUE, { connection });

module.exports = { recordingsQueue };
