module.exports = {
  connection: {
    host: process.env.REDIS_URL,
  },
  RECORDINGS_QUEUE: "recordingsQueue",
};
