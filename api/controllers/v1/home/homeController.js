// const { logger, LEVELS } = require("./services/loggerService");

async function home(req, res, next) {
  res.status(200).send("Hello World From Our Sample Route");
}

module.exports = { home };
