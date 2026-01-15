const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention. Be concise, include ingredients list, steps, and approximate cook time.
`;

/*
  This client-side module no longer contains or expects an API key.
  It calls a Netlify Function (server-side) which reads the NETLIFY_GROQ_API_KEY from environment variables.
*/
const NETLIFY_FUNCTION_URL = "/.netlify/functions/get-recipe";

export async function getRecipeFromLlama(ingredientsArr) {
  const ingredients = Array.isArray(ingredientsArr) ? ingredientsArr : [ingredientsArr];
  try {
    const resp = await fetch(NETLIFY_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      // server returned an error message in data.error
      throw new Error(data.error || "Failed to fetch recipe from server function");
    }

    // the function returns { recipe: "..." }
    return data.recipe || "Sorry, no recipe returned.";
  } catch (err) {
    console.error("getRecipeFromLlama error:", err);
    return "Sorry, I couldn't fetch a recipe at the moment.";
  }
}