"use client";

import * as React from "react";
import { BadgeQuestionMark, Bot, LoaderCircle, Send, Sparkles, UserRound } from "lucide-react";
import { BackgroundShell } from "./BackgroundShell";
import { TopNavbar } from "./TopNavBar";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "streaming" | "done" | "error";
};

const starterPrompts = [
  "What kinds of support are available after a cancer diagnosis?",
  "How do I find financial assistance resources near me?",
  "What questions should I ask a new provider?",
];

export default function AssistantExperience() {
  const [threadId, setThreadId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Ask CWC. You can use this space to explore support options, prepare for care conversations, and think through practical next steps.",
      status: "done",
    },
  ]);
  const [isSending, setIsSending] = React.useState(false);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      status: "done",
    };
    const assistantMessageId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        status: "streaming",
      },
    ]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          threadId,
        }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to start assistant chat.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const rawEvent of events) {
          const lines = rawEvent.split("\n").filter(Boolean);
          let eventName = "message";
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trim());
            }
          }

          const data = dataLines.join("\n");
          if (!data) continue;

          if (eventName === "thread_id") {
            try {
              const parsed = JSON.parse(data) as { threadId?: string };
              if (parsed.threadId) setThreadId(parsed.threadId);
            } catch {}
            continue;
          }

          if (eventName === "text_delta") {
            try {
              const parsed = JSON.parse(data) as { value?: string };
              if (!parsed.value) continue;

              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantMessageId
                    ? {
                        ...message,
                        content: message.content + parsed.value,
                      }
                    : message,
                ),
              );
            } catch {}
            continue;
          }

          if (eventName === "error") {
            let message = "The assistant hit an error.";
            try {
              const parsed = JSON.parse(data) as { error?: string };
              if (parsed.error) message = parsed.error;
            } catch {}

            setMessages((prev) =>
              prev.map((entry) =>
                entry.id === assistantMessageId
                  ? {
                      ...entry,
                      content: entry.content || message,
                      status: "error",
                    }
                  : entry,
              ),
            );
            continue;
          }

          if (eventName === "done") {
            setMessages((prev) =>
              prev.map((entry) =>
                entry.id === assistantMessageId
                  ? {
                      ...entry,
                      status: "done",
                    }
                  : entry,
              ),
            );
          }
        }
      }

      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === assistantMessageId
            ? {
                ...entry,
                status: entry.status === "error" ? "error" : "done",
              }
            : entry,
        ),
      );
    } catch (error) {
      const fallback =
        error instanceof Error ? error.message : "The assistant hit an error.";
      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === assistantMessageId
            ? {
                ...entry,
                content: entry.content || fallback,
                status: "error",
              }
            : entry,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <BackgroundShell>
      <TopNavbar />

      <div className="relative z-10 px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
        <div className="mx-auto max-w-[1300px]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)] shadow-sm">
              <BadgeQuestionMark className="h-4 w-4" />
              Ask CWC
            </div>

            <h1 className="cwc-display mt-6 text-balance text-[2.9rem] leading-[0.95] text-[var(--foreground)] sm:text-[4rem]">
              A New Kind of Support.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Ask questions to bring clarity, connection, and trusted guidance to every step of the cancer journey.
            </p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] cwc-panel-strong p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Common questions
              </div>
              <div className="mt-4 space-y-3">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    disabled={isSending}
                    className="cwc-button-secondary flex w-full items-start justify-start rounded-[1.4rem] px-4 py-3 text-left text-sm leading-6 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--sage-light)] p-4 text-sm leading-6 text-[var(--foreground)]">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  What this can help with
                </div>
                <p className="mt-3">
                  Ask CWC can help you think through support options, prepare
                  for provider or family conversations, and decide what next
                  steps may be helpful as you navigate care.
                </p>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-[var(--border)] bg-white p-4 text-sm leading-6 text-[var(--foreground)]">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Good to know
                </div>
                <p className="mt-3 text-[var(--muted)]">
                  This space is meant to support exploration and planning, not
                  replace medical, legal, or emergency guidance. For urgent
                  symptoms or immediate concerns, contact your care team or call
                  911. You can also use the Provider Directory to find
                  organizations and services near you.
                </p>
              </div>
            </aside>

            <section className="rounded-[2rem] cwc-panel-strong p-4 sm:p-5">
              <div
                ref={scrollerRef}
                className="max-h-[62vh] min-h-[50vh] space-y-4 overflow-y-auto pr-1"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[52rem] rounded-[1.6rem] px-4 py-3 sm:px-5 ${
                        message.role === "user"
                          ? "border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)]"
                          : "bg-[var(--accent)] text-white"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                        {message.role === "user" ? (
                          <UserRound className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                        {message.role === "user" ? "You" : "CWC Navigator"}
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-7 sm:text-[0.96rem]">
                        {message.status === "streaming" &&
                        message.content.length === 0 ? (
                          <span
                            className={`inline-flex items-center gap-1 py-1 ${
                              message.role === "user"
                                ? "text-[var(--accent)]"
                                : "text-white"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                          </span>
                        ) : (
                          message.content
                        )}
                        {message.status === "streaming" &&
                        message.content.length > 0 ? (
                          <span
                            className={`ml-1 inline-block animate-pulse ${
                              message.role === "user"
                                ? "text-[var(--accent)]"
                                : "text-white"
                            }`}
                          >
                            |
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-4 border-t border-[var(--border)] pt-4"
              >
                <div className="flex flex-col gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Ask about support options, care navigation, talking to providers, or what to do next..."
                    className="cwc-input min-h-32 resize-y rounded-[1.6rem] px-4 py-4 text-sm leading-7"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-[var(--muted)]">
                      {threadId
                        ? "Conversation context is active for this session."
                        : "A new conversation will start with your first message."}
                    </div>

                    <button
                      type="submit"
                      disabled={isSending || !input.trim()}
                      className="cwc-button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSending ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </BackgroundShell>
  );
}
