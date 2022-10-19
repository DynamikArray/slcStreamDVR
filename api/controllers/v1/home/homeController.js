const { recordingsQueue } = require("../../../queues/queues");

async function home(req, res, next) {
  await recordingsQueue.add("someJobName", { foo: "bar" });

  res.status(200).send("Hello World From Our Sample Route");
}

module.exports = { home };
