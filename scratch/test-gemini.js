const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : null;

async function listModels() {
  const genAI = new GoogleGenerativeAI(key);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Checking gemini-pro...");
    // Just try a simple generation to see if it works
    const result = await model.generateContent("Hello");
    console.log("Response:", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash:", e.message);
  }
}

listModels();
