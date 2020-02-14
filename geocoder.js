"use strict";
const { GOOGLE_MAPS_API_KEY } = require("./config");
const Client = require("@googlemaps/google-maps-services-js").Client;

// Get a rough lat/long for the city in a tzid
// We really only need any city in the timezone to get the shabbat time right
const geocoder = () => {
  const client = new Client({});

  return async tzid => {
    const [country, city] = tzid.split("/");

    try {
      // can include optional timeout after params object
      const response = await client.geocode({
        params: {
          address: city,
          components: `country:${country}`,
          key: GOOGLE_MAPS_API_KEY
        }
      });

      return response.data.results[0].geometry.location;
    } catch (e) {
      console.log(e);
      return {};
    }
  };
};

module.exports = geocoder;
