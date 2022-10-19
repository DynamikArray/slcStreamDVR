const winston = require("winston");
const colorizer = winston.format.colorize();

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
    winston.format.printf((msg) =>
      colorizer.colorize(
        msg.level,
        `${msg.timestamp} - ${msg.level}: ${msg.message}`
      )
    )
  ),
  transports: [new winston.transports.Console()],
});

const LEVELS = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

module.exports = { logger, LEVELS };
