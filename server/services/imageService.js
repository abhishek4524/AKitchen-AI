const axios = require("axios");
const trackApiUsage = require('../utils/trackApiUsage');

const getRecipeImage = async (query, req) => {
  try {
    // Track usage of Unsplash API
    await trackApiUsage('UNSPLASH_ACCESS_KEY', req);
    const res = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: { query, per_page: 1 },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    return res.data.results[0]?.urls?.regular || "";
  } catch (err) {
    console.log("Image fetch error:", err.message);
    return "";
  }
};

module.exports = getRecipeImage;