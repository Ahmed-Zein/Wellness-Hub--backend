const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.cli()
  ),
});

module.exports = logger;
