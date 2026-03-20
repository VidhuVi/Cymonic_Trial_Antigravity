import { GoogleGenAI } from "@google/genai";

export async function processTranscriptWithGemini(transcriptText: string) {
  // If no API key, gracefully fail or use mock data
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Falling back to mock extraction.");
    return {
      sentiment: "Neutral",
      decisions: [{ content: "No real decisions due to missing API key" }],
      actionItems: [{ task: "Configure GEMINI_API_KEY", assignee: "Admin", dueDate: "ASAP" }]
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    Analyze the following meeting transcript. Extract the key decisions made and the action items assigned.
    Also, determine the overall sentiment of the meeting.
    
    Return the output exactly as a JSON object with this structure (no markdown fences, just pure JSON):
    {
      "sentiment": "Positive" | "Neutral" | "Negative" | "Conflict" | "Enthusiastic",
      "decisions": [
        { "content": "The decision made" }
      ],
      "actionItems": [
        { "task": "What needs to be done", "assignee": "Person responsible (or null if unknown)", "dueDate": "When it should be done (or null)" }
      ]
    }
    
    Transcript:
    """
    ${transcriptText.substring(0, 100000)}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Gemini AI Extraction Error:", error);
    return null;
  }
}
