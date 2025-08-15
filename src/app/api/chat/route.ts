import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { apiKey, message } = await request.json();

  const genAI = new GoogleGenAI({
    apiKey: apiKey
  });
  try {

    const stream = await genAI.models.generateContentStream({
        model: "gemini-1.5-flash",
        contents: message,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const content =  chunk.text || "";
                if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
            }
            controller.close();
        }
    })

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    })

  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
