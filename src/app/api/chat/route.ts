import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { message, history, transcriptId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const whereClause = transcriptId ? { id: transcriptId } : {};

    // Fetch transcripts for context
    const transcripts = await prisma.transcript.findMany({
      where: whereClause,
      select: { title: true, date: true, content: true }
    });

    if (transcripts.length === 0) {
      return NextResponse.json({ reply: "I don't have any meeting transcripts loaded yet. Please upload some meetings in the Dashboard first." }, { status: 200 });
    }

    const context = transcripts.map(t => `--- Meeting: ${t.title} (${t.date.toLocaleDateString()}) ---\n${t.content}`).join("\n\n");

    const systemInstruction = `
      You are the "Meeting Intelligence Hub" AI assistant. 
      You have access to the transcripts of all the organization's meetings.
      Use the provided transcripts to answer the user's questions. 
      Always cite your sources by mentioning the Meeting Title when you provide information.
      If the answer is not in the transcripts, clearly state that.
      
      Here are the transcripts available:
      ${context.substring(0, 150000)}
    `;

    const formattedHistory = history.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
    const finalPrompt = `${systemInstruction}\n\nConversation so far:\n${formattedHistory}\n\nUser: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
    });

    return NextResponse.json({ reply: response.text }, { status: 200 });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
