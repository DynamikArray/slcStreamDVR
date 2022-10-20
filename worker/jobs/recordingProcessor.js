const { LEVELS, logger } = require("../services/loggerService");

module.exports = async (job) => {
  return new Promise((resolve, reject) => {
    logger.log(LEVELS.INFO, `recordingProcessor | Starting Job | ${job.id}`);
    console.log("*****\nSTART DOING A BUNCH OF STUFF\n*********");

    setTimeout(() => {
      console.log("*****\nFINISH DOING A BUNCH OF STUFF\n*********");
      resolve("DONE");
    }, 20000);
  });
};
