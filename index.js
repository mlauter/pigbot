"use strict";
const {
  SLACK_TOKEN,
  SLACK_SIGNING_SECRET,
  LOG_LEVEL,
  PORT
} = require("./config");
const { App, directMention } = require("@slack/bolt");
const messages = require("./messages");
const geocoder = require("./geocoder");
const hebcal = require("./hebcal/client");

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

// TODO: allow users to ask about a specific location
app.message(
  directMention(),
  /(what time|when) is (candle\s?lighting|shabbat)\??/i,
  async ({ message, context, say }) => {
    const user = await app.client.users.info({
      token: context.botToken,
      user: message.user,
      include_locale: true
    });

    const tzid = user.user.tz || "America/New_York",
      locale = user.user.locale || "en-US",
      [_, city] = tzid.split("/"),
      fmtCity = city.replace("_", " ");

    const candleLightingTime = await hebcal.candleLightingTime(
      locale,
      tzid,
      geocoder()
    );
    if (candleLightingTime === "") {
      say(messages.genericError.text);
      return;
    }

    say(messages.candleLightingTime.fn(fmtCity, candleLightingTime));
  }
);

app.message(
  directMention(),
  /(what time|when) is (havdalah|havdallah|havdala)\??/i,
  async ({ message, context, say }) => {
    const user = await app.client.users.info({
      token: context.botToken,
      user: message.user,
      include_locale: true
    });

    const tzid = user.user.tz || "America/New_York",
      locale = user.user.locale || "en-US",
      [_, city] = tzid.split("/"),
      fmtCity = city.replace("_", " ");

    const havdalahTime = await hebcal.havdalahTime(locale, tzid, geocoder());
    if (havdalahTime === "") {
      say(messages.genericError.text);
      return;
    }

    say(messages.candleLightingTime.fn(fmtCity, havdalahTime, "Havadalah"));
  }
);

app.message(
  directMention(),
  /what is (this week\'?s para?sha|para?shat ha\s?shavuah?)\??/i,
  async ({ message, context, say }) => {
    const user = await app.client.users.info({
      token: context.botToken,
      user: message.user
    });

    const tzid = user.user.tz || "America/New_York";
    const parsha = await hebcal.parashatHashavuah(tzid, geocoder());
    if (parsha === "") {
      say(messages.genericError.text);
      return;
    }

    say(messages.parashatHashavuah.fn(parsha));
  }
);

/**
 * `reaction_added` event is triggered when a user adds a reaction to a message in a channel where the Bot User is part of
 * https://api.slack.com/events/reaction_added
 **/
app.event("reaction_added", ({ event, context, say }) => {
  // only react to custom (:honk*:) emoji
  const honks = ["honk", "honk-intensifies"];

  if (honks.includes(event.reaction)) {
    say(
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
