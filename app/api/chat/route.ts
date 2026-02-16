import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system:
      "Eres un asistente util y claro. Responde en espanol de forma breve, con ejemplos simples cuando ayuden.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
