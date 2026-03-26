import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

function getClient() {
  if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
    throw new Error(
      "Missing OpenAI configuration. Add OPENAI_API_KEY and OPENAI_ASSISTANT_ID to your env file.",
    );
  }

  return new OpenAI({ apiKey: OPENAI_API_KEY });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message?: string;
      threadId?: string | null;
    };

    const message = body.message?.trim();
    const threadId = body.threadId?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 },
      );
    }

    const client = getClient();
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const pushEvent = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        };

        try {
          if (threadId) {
            await client.beta.threads.messages.create(threadId, {
              role: "user",
              content: message,
            });

            pushEvent("thread_id", { threadId });

            const runStream = client.beta.threads.runs.stream(threadId, {
              assistant_id: OPENAI_ASSISTANT_ID!,
            });

            for await (const event of runStream) {
              if (event.event === "thread.message.delta") {
                const content = event.data.delta.content ?? [];

                for (const item of content) {
                  if (item.type === "text" && item.text?.value) {
                    pushEvent("text_delta", { value: item.text.value });
                  }
                }
              }

              if (
                event.event === "thread.run.failed" ||
                event.event === "thread.run.expired" ||
                event.event === "thread.run.incomplete" ||
                event.event === "error"
              ) {
                const error =
                  "last_error" in event.data &&
                  event.data.last_error?.message
                    ? event.data.last_error.message
                    : "Assistant error.";

                pushEvent("error", { error });
              }
            }
          } else {
            const runStream = client.beta.threads.createAndRunStream({
              assistant_id: OPENAI_ASSISTANT_ID!,
              thread: {
                messages: [
                  {
                    role: "user",
                    content: message,
                  },
                ],
              },
            });

            for await (const event of runStream) {
              if (event.event === "thread.created") {
                pushEvent("thread_id", { threadId: event.data.id });
              }

              if (event.event === "thread.message.delta") {
                const content = event.data.delta.content ?? [];

                for (const item of content) {
                  if (item.type === "text" && item.text?.value) {
                    pushEvent("text_delta", { value: item.text.value });
                  }
                }
              }

              if (
                event.event === "thread.run.failed" ||
                event.event === "thread.run.expired" ||
                event.event === "thread.run.incomplete" ||
                event.event === "error"
              ) {
                const error =
                  "last_error" in event.data &&
                  event.data.last_error?.message
                    ? event.data.last_error.message
                    : "Assistant error.";

                pushEvent("error", { error });
              }
            }
          }

          pushEvent("done", { ok: true });
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unexpected assistant error.";
          pushEvent("error", { error: message });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected assistant error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
