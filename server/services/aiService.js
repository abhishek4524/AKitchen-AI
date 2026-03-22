const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateRecipeAI = async (ingredients, cuisine, diet) => {
  const prompt = `
Create a detailed cooking recipe.

Ingredients: ${ingredients}
Cuisine: ${cuisine}
Diet: ${diet}

Return ONLY JSON in this format:

{
"title": "",
"description": "",
"ingredients": [
  {
    "name": "",
    "quantity": ""
  }
],
"steps": [],
"totalTime": "",
"difficulty": "",
"nutrition": {
  "calories": "",
  "protein": "",
  "carbs": "",
  "fat": ""
},
"chefTips": [],
"imageQuery": ""
}

Make it detailed, realistic, and user-friendly like a professional recipe blog.
`;

  const response = await groq.chat.completions.create({
    model: "groq/compound",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
    response_format: { type: "json_object" }, // 🔥 MUST ADD
  });

  const text = response.choices[0].message.content;

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

module.exports = generateRecipeAI;
