// frontend/src/components/help/HelpMiniChatModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ✅ FIXED: correct relative imports from src/components/help -> src/components/ui
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const CHARCOAL = "#2F2F2F";

export default function HelpMiniChatModal({ open, onOpenChange }) {
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  );

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I’m Oli. How can I help you today?" },
  ]);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }, 0);
  }, [open, messages.length]);

  const canSend = useMemo(() => !!text.trim() && !sending, [text, sending]);

  async function send() {
    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    setText("");
    setMessages((p) => [...p, { role: "user", content }]);

    try {
      const res = await fetch("/api/help/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: content }),
      });

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.error || "Help chat failed.");
      }

      const data = await res.json();
      if (!data?.reply) throw new Error("No reply returned.");

      setMessages((p) => [...p, { role: "assistant", content: data.reply }]);
    } catch (e) {
      toast.error(e?.message || "Something went wrong.");
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "I hit an error. Try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") send();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={() => onOpenChange(false)}
        aria-label="Close Help chat"
      />

      {/* Small window */}
      <div className="absolute right-4 bottom-4 w-[340px] max-w-[calc(100vw-2rem)]">
        <div
          className="rounded-2xl border shadow-xl overflow-hidden bg-white"
          style={{ borderColor: `${CHARCOAL}33`, color: CHARCOAL }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: `${CHARCOAL}33` }}
          >
            <div className="font-semibold">Help</div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm hover:underline"
              style={{ color: CHARCOAL }}
            >
              Close
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="h-[280px] overflow-auto p-3 space-y-2 bg-white"
            style={{ color: CHARCOAL }}
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {sending && <Bubble role="assistant" content="Typing…" />}
          </div>

          {/* Input */}
          <div
            className="p-3 border-t flex gap-2 bg-white"
            style={{ borderColor: `${CHARCOAL}33` }}
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question…"
              disabled={sending}
              className="border"
              style={{
                borderColor: `${CHARCOAL}55`,
                color: CHARCOAL,
              }}
            />
            <Button
              onClick={send}
              disabled={!canSend}
              style={{
                backgroundColor: CHARCOAL,
                color: "white",
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] rounded-2xl px-3 py-2 border text-sm whitespace-pre-wrap bg-white"
        style={{
          color: CHARCOAL,
          borderColor: `${CHARCOAL}33`,
          backgroundColor: isUser ? "#F2F2F2" : "white",
        }}
      >
        {content}
      </div>
    </div>
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
