const { LEVELS, logger } = require("../services/loggerService");
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");
const { exec } = require("child_process");

const RecordingProcessor = {
  heartbeatInterval: 15000, //15 seconds
  pageUrl: false,
  browser: false,
  page: false,
  stream: false,
  intervalId: false,
  ffmpeg: false,

  // recorder: false,

  init: async function (pageUrl) {
    logger.log(LEVELS.INFO, "RecordingProcessor | init | Initilization");
    RecordingProcessor.pageUrl = pageUrl;
    RecordingProcessor.browser = await RecordingProcessor.createBrowser();
    RecordingProcessor.page = await RecordingProcessor.createPage();
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
          resolve("Some STats and Stuff?");
        }
        intervalCount++;
      }, RecordingProcessor.heartbeatInterval);
    });
  },

  createBrowser: async function () {
    return await launch({
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium",
    });
  },

  /**
   *
   *
   *  TRY CATCH THE ELEMENTS IF NO #app it will fail, stream not available, exit gracefully somehow
   *
   */
  createPage: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | createPage | start");
    const page = await RecordingProcessor.browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");
    await page.goto(RecordingProcessor.pageUrl);
    await page.waitFor("#app");
    await page.click("#app");
    logger.log(LEVELS.INFO, "RecordingProcessor | createPage | page created");
    return page;
  },

  startRecording: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | startRecording | getStream");
    RecordingProcessor.stream = await getStream(RecordingProcessor.page, {
      audtio: true,
      video: true,
      frameSize: 10000,
    });
    RecordingProcessor.ffmpeg = exec(`ffmpeg -y -i - testVideo.mp4`);

    RecordingProcessor.ffmpeg.stderr.on("data", (chunk) => {
      console.log(chunk.toString());
    });

    RecordingProcessor.stream.pipe(RecordingProcessor.ffmpeg.stdin);
    logger.log(LEVELS.INFO, "RecordingProcessor | startRecording | piping stream");
  },

  endRecording: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | endRecording | destroying stream");
    clearInterval(RecordingProcessor.intervalId);
    await RecordingProcessor.stream.unpipe(RecordingProcessor.ffmpeg);
    RecordingProcessor.ffmpeg.kill();
    logger.log(LEVELS.INFO, "RecordingProcessor | endRecording | stream ended ");
  },
};

module.exports = { RecordingProcessor };
