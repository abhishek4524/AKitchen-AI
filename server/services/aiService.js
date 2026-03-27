// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// const generateRecipeAI = async (ingredients, cuisine, diet) => {
//   const prompt = `
// Create a detailed cooking recipe.

// Ingredients: ${ingredients}
// Cuisine: ${cuisine}
// Diet: ${diet}

// Return ONLY JSON :

// {
// "title": "",
// "description": "",
// "ingredients": [
//   {
//     "name": "",
//     "quantity": ""
//   }
// ],
// "steps": [],
// "totalTime": "",
// "difficulty": "",
// "nutrition": {
//   "calories": "",
//   "protein": "",
//   "carbs": "",
//   "fat": ""
// },
// "chefTips": [],
// "imageQuery": ""
// }
// `;

//   const response = await groq.chat.completions.create({
//     model: "groq/compound",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.7,
//     max_tokens: 800,
//     response_format: { type: "json_object" }, // 🔥 MUST ADD
//   });

//   const text = response.choices[0].message.content;

//   const cleanedText = text
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   return JSON.parse(cleanedText);
// };

// module.exports = generateRecipeAI;

// const Groq = require("groq-sdk");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// const generateRecipeAI = async (ingredients, cuisine, diet) => {
//   // Truncate ingredients to avoid token limit and 413 error
//   const MAX_INGREDIENTS_LENGTH = 400;
//   let truncatedIngredients = ingredients;
//   if (ingredients.length > MAX_INGREDIENTS_LENGTH) {
//     truncatedIngredients = ingredients.substring(0, MAX_INGREDIENTS_LENGTH) + "...";
//   }

//   // Compact prompt – no extra whitespace, minimal text
//   const prompt = `Generate recipe: ingredients: ${truncatedIngredients}, cuisine: ${cuisine}, diet: ${diet}. Return JSON: {title, description, ingredients:[{name,quantity}], steps, totalTime, difficulty, nutrition:{calories,protein,carbs,fat}, chefTips, imageQuery}`;

//   try {
//     const response = await groq.chat.completions.create({
//       // Use a model that reliably supports JSON mode
//       model: "groq/compound",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//       max_tokens: 800,
//       response_format: { type: "json_object" }, // Enforces pure JSON output
//     });

//     let text = response.choices[0].message.content;

//     // Clean up any markdown or extra text that may slip through
//     text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

//     // Extract JSON if the response includes explanatory text
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       text = jsonMatch[0];
//     }

//     return JSON.parse(text);
//   } catch (error) {
//     console.error("Groq API error:", error);
//     throw new Error("Failed to generate recipe from AI");
//   }
// };

// module.exports = generateRecipeAI;

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractJSON = (text) => {
  try {
    // Remove code blocks
    text = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();

    // Extract JSON object safely
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found");
    }

    const jsonString = text.substring(firstBrace, lastBrace + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON Extraction Error:", text);
    throw new Error("Invalid JSON received from AI");
  }
};

const generateRecipeAI = async (ingredients, cuisine, diet) => {
  let ingredientsStr = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients || "";

  // Limit size
  if (ingredientsStr.length > 400) {
    ingredientsStr = ingredientsStr.slice(0, 400) + "...";
  }

  const prompt = `
Generate a cooking recipe strictly in valid JSON.

Rules:
- Return ONLY JSON (no text, no explanation)
- No trailing commas
- No comments

Format:
{
  "title": "",
  "desc": "",
  "ingredients": [{"name": "", "qty": ""}],
  "steps": [""],
  "time": "",
  "diff": "",
  "nutri": {"cal": "", "prot": "", "carbs": "", "fat": ""},
  "tips": "",
  "img": ""
}

Input:
ingredients: ${ingredientsStr}
cuisine: ${cuisine}
diet: ${diet}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "groq/compound", // ✅ stable model (better than groq/compound)
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const text = response.choices[0].message.content;

    return extractJSON(text);

  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    throw new Error("Failed to generate recipe from AI");
  }
};

module.exports = generateRecipeAI;