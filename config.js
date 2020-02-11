const { LogLevel } = require("@slack/bolt");
require("dotenv").config();

module.exports = {
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  ALIAS: process.env.ALIAS || "?",
  LOG_LEVEL: process.env.LOG_LEVEL || LogLevel.INFO,
  PORT: process.env.PORT || 3000
};
