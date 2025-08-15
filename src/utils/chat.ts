import { GoogleGenAI } from "@google/genai";


// Chat Function for Frontend
export const Chat = async (apiKey: string, message: string) => {
    console.log("Chat function called with API Key:", apiKey, " and message ",message);
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
                    const content = chunk.text || "";
                    if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                }
                controller.close();
            }
        })
        
        return readable;

    } catch (error) {
        console.error("Error in Chat function:", error);
        return {error: "Error Occured"}
    }
}

