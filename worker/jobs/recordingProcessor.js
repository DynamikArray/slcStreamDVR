const { LEVELS, logger } = require("../services/loggerService");
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

const RecordingProcessor = {
  heartbeatInterval: 15000, //15 seconds
  pageUrl: false,
  browser: false,
  page: false,
  stream: false,
  intervalId: false,
  file: false,

  init: async function (pageUrl) {
    logger.log(LEVELS.INFO, "RecordingProcessor | init | Initilization");
    RecordingProcessor.pageUrl = pageUrl;
    RecordingProcessor.browser = await RecordingProcessor.createBrowser();
    RecordingProcessor.page = await RecordingProcessor.createPage();
    RecordingProcessor.file = fs.createWriteStream("/slcApps/recordings" + "/testRecording.webm");
  },

  jobControl: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | jobControl | Start");

    return new Promise((resolve, reject) => {
      RecordingProcessor.startRecording();

      let intervalCount = 0;
      RecordingProcessor.intervalId = setInterval(() => {
        //Do stuff and things
        logger.log(LEVELS.INFO, "RecordingProcessor | jobControl | Interval Heartbeat");
        if (intervalCount == 2) {
          RecordingProcessor.endRecording();
          resolve("Some stats and stuff?");
        }
        intervalCount++;
      }, RecordingProcessor.heartbeatInterval);
    });
  },

  /**
   * CREATES THE BROWSER INSTANCE
   */
  createBrowser: async function () {
    return await launch({
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1920,1080"],
      ignoreDefaultArgs: ["--mute-audio"],
      executablePath: "/usr/bin/chromium",
    });
  },

  /**
   *  TRY CATCH THE ELEMENTS IF NO #app it will fail, stream not available, exit gracefully somehow
   */
  createPage: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | createPage | start");
    const page = await RecordingProcessor.browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:73.0) Gecko/20100101 Firefox/73.0");
    await page.goto(RecordingProcessor.pageUrl);

    try {
      await page.waitForSelector("#app", { visible: true });

      /*
      const data = await page.evaluate(() => document.querySelector("*").outerHTML);
      fs.writeFile(__dirname + "/source_code.html", data, (err) => {
        console.log("LOGGED THE SOURCE DOE");
      });
      */

      //THIS SOMETIMES FAILES???
      await page.click("#app");
    } catch (error) {
      logger.log(LEVELS.ERROR, error);
    }

    //WE SHOULD HAVE VIDEO NOW
    logger.log(LEVELS.INFO, "RecordingProcessor | createPage | page created");
    return page;
  },

  /**
   * STARTS THE RECORDING
   */
  startRecording: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | startRecording | getStream");
    RecordingProcessor.stream = await getStream(RecordingProcessor.page, {
      audio: true,
      video: true,
    });
    RecordingProcessor.stream.pipe(RecordingProcessor.file);
    logger.log(LEVELS.INFO, "RecordingProcessor | startRecording | piping stream");
  },

  /**
   * ENDS A RECORDING -and cleans up interval, stream, and file.
   */
  endRecording: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | endRecording | destroying stream");
    clearInterval(RecordingProcessor.intervalId);
    await RecordingProcessor.stream.destroy();
    RecordingProcessor.file.close();
    logger.log(LEVELS.INFO, "RecordingProcessor | endRecording | stream ended ");
  },
};

module.exports = { RecordingProcessor };
