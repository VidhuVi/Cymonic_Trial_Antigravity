import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });
console.log("Running Gemini API Key check...");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: "Hello, generate a 3 word response.",
    });
    console.log("✅ gemini-1.5-flash Works:", response.text);
  } catch (e: any) {
    console.error("❌ gemini-1.5-flash Error:", e.message);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hello, generate a 3 word response.",
    });
    console.log("✅ gemini-2.5-flash Works:", response.text);
  } catch (e: any) {
    console.error("❌ gemini-2.5-flash Error:", e.message);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Hello, generate a 3 word response.",
    });
    console.log("✅ gemini-2.0-flash Works:", response.text);
  } catch (e: any) {
    console.error("❌ gemini-2.0-flash Error:", e.message);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: "Hello, test.",
    });
    console.log("✅ gemini-1.5-pro Works:", response.text);
  } catch (e: any) {
    console.error("❌ gemini-1.5-pro Error:", e.message);
  }
}
test();
