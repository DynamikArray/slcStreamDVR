//Bring in our queue stuff
const { recordingsQueue } = require("./queues");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath(process.env.QUEUES_ADMIN_UI);

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(recordingsQueue)],
  serverAdapter: serverAdapter,
});

module.exports = { serverAdapter };
