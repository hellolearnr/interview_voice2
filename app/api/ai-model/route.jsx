import { QUESTIONS_PROMPT } from "@/Services/Constants";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTIONS_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type);

  console.log(FINAL_PROMPT);

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(FINAL_PROMPT);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    return NextResponse.json({ content: text });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to generate questions" }, 
      { status: 500 }
    );
  }
}