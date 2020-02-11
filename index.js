"use strict";
const {
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  LOG_LEVEL,
  PORT
} = require("./config");
const { App } = require("@slack/bolt");
const messages = require("./messages");

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

/**
 * `reaction_added` event is triggered when a user adds a reaction to a message in a channel where the Bot User is part of
 * https://api.slack.com/events/reaction_added
 **/
app.event("reaction_added", async ({ event, context, say }) => {
  // only react to custom (:honk*:) emoji
  const honks = ["honk", "honk-intensifies"];

  if (honks.includes(event.reaction)) {
    // get user info of user who reacted to this message
    const user = await app.client.users.info({
      token: context.botToken,
      user: event.user
    });

    // formatting the user's name to mention that user in the message (see: https://api.slack.com/messaging/composing/formatting)
    let name = "<@" + user.user.id + ">";

    say(
      `${name} ` +
        messages.honk_responses[
          parseInt(Math.random() * messages.honk_responses.length)
        ].text
    );
  }
});

app.error(error => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

(async () => {
  // Start your app
  await app.start(PORT);
  console.log(`⚡️ Bolt app is running on port ${PORT}!`);
})();
