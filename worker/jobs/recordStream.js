const { LEVELS, logger } = require("../services/loggerService");
const { RecordingProcessor } = require("./RecordingProcessor.js");

module.exports = async (job) => {
  try {
    const streamUrl = "https://www.whatnot.com/live/ce1d03ac-fc13-40aa-b7d8-1c9829a6170b";
    await RecordingProcessor.init(streamUrl);
    const results = await RecordingProcessor.jobControl();
    logger.log(LEVELS.INFO, `recordingProcess | job | Completed | Results : ${results}`);
  } catch (error) {
    logger.log(LEVELS.ERROR, `recordingProcess | job | Error : ${error.message}`);
    console.log("caught an error", error);
  } finally {
    //anything else we need to do?  Update DB with recording results from results?
    console.log("Finished the job");
  }
};
