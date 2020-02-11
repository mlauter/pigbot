"use strict";
const {
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  LOG_LEVEL,
  PORT
} = require("./config");
const { App } = require("@slack/bolt");

const app = new App({
  token: SLACK_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET,
  logLevel: LOG_LEVEL
});

app.message(/^ping$/i, ({ message, say }) => {
  if (Math.random() * 100 < 10) {
    say("meow");
  } else {
    say("pong");
  }
});
