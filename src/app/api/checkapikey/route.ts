import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {apiKey} = await request.json();
  const genAI = new GoogleGenAI({
    apiKey: apiKey
  });
  try {
    await genAI.models.list();
    return NextResponse.json({ message: "API key is valid" }, { status: 200 });
  } catch (error) {
    console.error("API key validation error:", error);
    return new Response("Invalid API key", { status: 401 });
  }
}
