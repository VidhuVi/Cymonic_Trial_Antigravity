import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processTranscriptWithGemini } from "@/lib/extractor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      const text = await file.text();
      const filename = file.name;
      const wordCount = text.split(/\s+/).length;
      
      // Basic mock parsing for speakers
      const speakerRegex = /^[A-Z][a-zA-Z\s]+:/gm;
      const speakersFound = text.match(speakerRegex) || [];
      const uniqueSpeakers = new Set(speakersFound.map(s => s.replace(':', '').trim())).size;
      const speakerCount = uniqueSpeakers > 0 ? uniqueSpeakers : 1;

      // Extract AI insights using Gemini
      const aiData = await processTranscriptWithGemini(text);

      // Save to database with nested creation for insights
      const transcript = await prisma.transcript.create({
        data: {
          title: filename.replace(/\.(txt|vtt)$/i, ''),
          filename: filename,
          wordCount,
          speakerCount,
          content: text,
          sentiment: aiData?.sentiment || "Neutral",
          decisions: {
            create: aiData?.decisions?.map((d: any) => ({ content: d.content || "Unknown decision" })) || []
          },
          actionItems: {
            create: aiData?.actionItems?.map((a: any) => ({
              task: a.task || "Unknown task",
              assignee: a.assignee || null,
              dueDate: a.dueDate || null
            })) || []
          }
        }
      });
      
      results.push(transcript);
    }

    return NextResponse.json({ success: true, transcripts: results }, { status: 200 });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to process upload." }, { status: 500 });
  }
}
