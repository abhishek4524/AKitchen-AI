const axios = require("axios");

const getRecipeImage = async (query) => {
  try {
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