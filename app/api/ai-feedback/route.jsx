import { FEEDBACK_PROMPT } from "@/Services/Constants";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(req) {
const {conversation}=await req.json();
console.log("Raw conversation:", conversation);

// Validate conversation data
if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
  console.error("Invalid conversation data");
  return NextResponse.json(
    { error: "Invalid conversation data" }, 
    { status: 400 }
  );
}

// Format conversation as a readable string
let conversationText = "";
conversation.forEach((message, index) => {
  const role = message.role === 'user' ? 'Candidate' : 'Interviewer';
  conversationText += `${role}: ${message.content}\n\n`;
});

console.log("Formatted conversation text:", conversationText);
const FINAL_PROMPT=FEEDBACK_PROMPT.replace('{{conversation}}', conversationText);
console.log("Final prompt:", FINAL_PROMPT);

// Check if API key exists
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not set in environment variables");
    return NextResponse.json(
      { error: "API key not configured" }, 
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Try gemini-1.5-pro first (more stable)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Calling Google AI API...");
    const result = await model.generateContent(FINAL_PROMPT);
    console.log("API call successful");
    
    const response = await result.response;
    const text = response.text();

    console.log("Generated text:", text);
    
    // Clean up the response text to extract JSON
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*\n?/g, '');
    cleanedText = cleanedText.replace(/```\s*$/g, '');
    cleanedText = cleanedText.replace(/\*\*/g, ''); // Remove bold markdown
    cleanedText = cleanedText.replace(/\*/g, ''); // Remove italic markdown
    
    // Try to parse as JSON
    try {
      const parsedJSON = JSON.parse(cleanedText);
      return NextResponse.json({ content: parsedJSON });
    } catch (parseError) {
      console.log("Could not parse as JSON, returning as text");
      return NextResponse.json({ content: { rawText: cleanedText } });
    }
  } catch (e) {
    console.error("Detailed error:", e);
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    
    // Return more specific error information
    return NextResponse.json(
      { 
        error: "Failed to generate questions", 
        details: e.message,
        errorType: e.constructor.name
      }, 
      { status: 500 }
    );
  }

}