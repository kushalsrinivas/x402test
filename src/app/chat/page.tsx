// Chat Page - Simple AI chat UI using /api/chat

"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! You're in the gated AI Chat. Ask me anything to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }
      const data = (await res.json()) as { reply?: string };
      const reply = data.reply ?? "(no response)";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 container mx-auto flex max-w-4xl flex-1 flex-col px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-block rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent">
                AI Chat (Gated)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Chat</h1>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-red-500/30 hover:bg-white/10"
          >
            Home
          </Link>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-2xl backdrop-blur-xl">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className="flex w-full">
                <div
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[80%] rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-100"
                      : "mr-auto max-w-[80%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100"
                  }
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {m.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex w-full">
                <div className="mr-auto max-w-[80%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></span>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex w-full">
                <div className="mr-auto max-w-[80%] rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200">
                  {error}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-red-500/30"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3 font-semibold text-white transition enabled:hover:from-red-500 enabled:hover:to-rose-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-500">
              Powered by Google Gemini • Your key stays on the server
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


