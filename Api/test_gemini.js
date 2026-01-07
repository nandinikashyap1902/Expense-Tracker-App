
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    console.log("Checking API Key...");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        return;
    }
    console.log("Key found:", key.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(key);

    // Generic fetch to list models
    try {
        console.log("Listing models via Fetch...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.error("No models found or error:", data);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

test();
