module.exports = {
  honk_responses: [
    {
      text:
        ":honk: :honk-intensifies: :airhorn: :portal-parrot: HONK hOnK hoooooonk :partyparrot: :meow_party: :airhorn: :airhorn: :honk-intensifies: :honk:"
    },
    {
      text:
        ":honk: :honk-intensifies: I am the goose and you are the miserable boy with no honk. I invented my body and it was the best idea. :honk-intensifies: :honk:"
    },
    {
      text:
        ":carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :carrot: :radio:"
    }
  ],
  candleLightingTime: {
    fn: (city, time, chag = "Shabbat") => {
      return `Candle lighting time for ${chag} in ${city} is ${time}`;
    }
  },
  genericError: {
    text: "Uh oh. Something went wrong, sorry."
  }
};
