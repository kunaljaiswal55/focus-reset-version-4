import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const { message, metrics, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        text: "API Key missing. Please add GEMINI_API_KEY to your .env.local file to enable the AI Companion." 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `You are "Focus AI", a sophisticated holistic life coach.
      You monitor the user's "Socially" dashboard which has these metrics:
      - Family: ${metrics.family}%
      - Friends: ${metrics.friends}%
      - Parties: ${metrics.parties}%
      - Outings: ${metrics.outings}%

      Your goal is to help the user balance productivity, social life, and health.
      - If they ask about the gym or health, give them balanced advice.
      - If they ask about social situations, use the metrics to guide them.
      - Be witty, premium, and direct. 
      - Never cut off mid-sentence. Always finish your thoughts.`
    });

    let chatHistory = [];
    const messagesForHistory = history || [];
    let lastRole = null;

    messagesForHistory.forEach(msg => {
      const currentRole = msg.sender === 'ai' ? 'model' : 'user';
      if (currentRole !== lastRole) {
        chatHistory.push({
          role: currentRole,
          parts: [{ text: msg.text }],
        });
        lastRole = currentRole;
      }
    });

    if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    return NextResponse.json({ 
      error: "AI Error: " + error.message,
    }, { status: 500 });
  }
}
