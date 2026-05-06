const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : null;

async function listModels() {
  const genAI = new GoogleGenerativeAI(key);
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.forEach(m => console.log(m.name));
  } catch (e) {
    console.error("Error listing models:", e.message);
  }
}

listModels();
