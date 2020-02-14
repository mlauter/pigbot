"use strict";
const fetch = require("node-fetch");
const { stringify } = require("querystring");
const AbortController = require("abort-controller");

const baseUrl = "https://www.hebcal.com/shabbat";
const defaultTimeout = 10000;

const formatDate = (datestring, locale = "en-US") => {
  const d = new Date(datestring);
  return d.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/New_York"
  });
};

// TODO cache responses
// @see https://www.hebcal.com/home/197/shabbat-times-rest-api
const shabbatTimes = async (lat, long, tzid, timeoutDur = defaultTimeout) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutDur);

  const query = stringify({
    cfg: "json",
    geo: "pos",
    latitude: lat,
    longitude: long,
    tzid: tzid
  });
  const url = `${baseUrl}?${query}`;
  let json;

  try {
    const hebcalResponse = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    json = await hebcalResponse.json();
  } catch (e) {
    // TODO: perhaps some better error handling
    throw e;
  }

  return json;
};

const candleLightingTime = async (locale, tzid, geocodeFn) => {
  const { lat, lng } = await geocodeFn(tzid);
  if (lat === undefined || lng === undefined) {
    console.log("Unable to determine lat/long for tzid");
    return "";
  }

  try {
    const response = await shabbatTimes(lat, lng, tzid);
    const datestring = response.items.filter(
      item => item.category === "candles"
    )[0].date;

    return formatDate(datestring, locale);
  } catch (e) {
    console.log(e);
    return "";
  }
};

const havdalahTime = async (locale, tzid, geocodeFn) => {
  const { lat, lng } = await geocodeFn(tzid);
  if (lat === undefined || lng === undefined) {
    console.log("Unable to determine lat/long for tzid");
    return "";
  }

  try {
    const response = await shabbatTimes(lat, lng, tzid);
    const datestring = response.items.filter(
      item => item.category === "havdalah"
    )[0].date;

    return formatDate(datestring, locale);
  } catch (e) {
    console.log(e);
    return "";
  }
};

const parashatHashavuah = async (tzid, geocodeFn) => {
  const { lat, lng } = await geocodeFn(tzid);
  if (lat === undefined || lng === undefined) {
    console.log("Unable to determine lat/long for tzid");
    return "";
  }

  try {
    const response = await shabbatTimes(lat, lng, tzid);
    return r.items.filter(item => item.category === "parashat")[0].title;
  } catch (e) {
    console.log(e);
    return "";
  }
};

module.exports = {
  shabbatTimes: shabbatTimes,
  candleLightingTime: candleLightingTime,
  havdalahTime: havdalahTime,
  parashatHashavuah: parashatHashavuah
};
