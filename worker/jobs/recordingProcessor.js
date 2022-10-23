const { LEVELS, logger } = require("../services/loggerService");

const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");

const FILENAME_TO_SAVE_MP = "./reports/videos/stream.mp4";

const RecordingProcessor = {
  heartbeatInterval: 15000, //15 seconds
  streamUrl: false,
  browser: false,
  page: false,
  recorder: false,

  init: async function (streamUrl) {
    logger.log(LEVELS.INFO, "RecordingProcessor | init | Initilization");
    RecordingProcessor.streamUrl = streamUrl;
    RecordingProcessor.browser = await RecordingProcessor.createBrowser();
    RecordingProcessor.page = await RecordingProcessor.createPage(streamUrl);
    RecordingProcessor.recorder = await RecordingProcessor.createRecorder();
  },

  jobControl: async function () {
    logger.log(LEVELS.INFO, "RecordingProcessor | jobControl | Start");

    return new Promise((resolve, reject) => {
      RecordingProcessor.startRecording();

      let intervalCount = 0;

      setInterval(() => {
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
    return await puppeteer.launch({
      ignoreDefaultArgs: ["--mute-audio"],
      args: ["--autoplay-policy=no-user-gesture-required"],
      executablePath: "/usr/bin/chromium-browser",
      args: [
        `--window-size=1280,720`,
        "--disable-gpu",
        // " --disable-dev-shm-usage",
        // "--disable-setuid-sandbox",
        "--no-sandbox",
      ],
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      fps: 30,
      videoCrf: 18,
      videoCodec: "libx264",
      videoPreset: "ultrafast",
      videoBitrate: 1000,
      /*
      videoFrame: {
        width: 1280,
        height: 720,
      },
      */
      /* autopad: {
        color: 'black' | '#35A5FF',
      },*/
      //aspectRatio: '4:3',
    });
  },

  createPage: async function () {
    const page = await RecordingProcessor.browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");
    return page;
  },

  createRecorder: async function () {
    const config = {
      ffmpeg_Path: "/usr/bin/ffmpeg",
    };
    const recorder = new PuppeteerScreenRecorder(RecordingProcessor.page, config);
    return recorder;
  },

  startRecording: async function () {
    await RecordingProcessor.recorder.start(FILENAME_TO_SAVE_MP);
    RecordingProcessor.page.goto(RecordingProcessor.streamUrl);
  },

  endRecording: async function () {
    await RecordingProcessor.recorder.stop();
    await RecordingProcessor.browser.close();
  },
};

module.exports = { RecordingProcessor };
