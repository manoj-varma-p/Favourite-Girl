"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, RotateCcw, X, Check, ArrowRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  proposedAction?: any;
  actionApplied?: boolean;
  timestamp: string;
}

interface Props {
  adminPin: string;
  currentTab?: string;
  onNavigateTab?: (tabId: string) => void;
  isCompact?: boolean;
}

const SUGGESTIONS = [
  "Explain this section and best practices",
  "Generate SEO keywords for Digital Marketing",
  "Diagnose why changes didn't appear on Vercel",
  "How do locked mentors and courses work?",
];

export default function AdminAiBotTab({
  adminPin,
  currentTab = "overview",
  onNavigateTab,
  isCompact = false,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applyingActionId, setApplyingActionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function getEffectivePin() {
    if (adminPin) return adminPin;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("treqo_admin_pin") || "treqo2026";
    }
    return "treqo2026";
  }

  // Load chat history
  useEffect(() => {
    try {
      // Clean out older legacy cached errors
      localStorage.removeItem("treqo_admin_ai_chat_v1");
      localStorage.removeItem("treqo_admin_ai_chat_v2");
      localStorage.removeItem("treqo_admin_ai_chat_v3");

      const stored = localStorage.getItem("treqo_admin_ai_chat_v4");
      if (stored) {
        const parsed: Message[] = JSON.parse(stored);
        // Exclude stale error messages from past setup attempts
        const clean = parsed.filter(
          (m) =>
            !m.content.toLowerCase().includes("invalid api key") &&
            !m.content.toLowerCase().includes("not configured in .env")
        );
        if (clean.length > 0) {
          setMessages(clean);
          return;
        }
      }

      setMessages([
        {
          id: "welcome",
          role: "model",
          content: "How can I help you with Treqo today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      // ignore
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("treqo_admin_ai_chat_v4", JSON.stringify(messages.slice(-25)));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(text?: string) {
    const textToSend = (text || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const pin = getEffectivePin();
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyForApi.slice(-8),
          currentTab,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const botMessage: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          content: data.reply || "Done.",
          proposedAction: data.proposedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMsg: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          content: data.error || "Unable to reach the assistant right now. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        content: "Network error. Please check your connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApplyAction(msgId: string, action: any) {
    setApplyingActionId(msgId);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": adminPin,
        },
        body: JSON.stringify({
          action: "apply_action",
          actionPayload: action,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, actionApplied: true } : m))
        );
        const confirmMsg: Message = {
          id: `confirm-${Date.now()}`,
          role: "model",
          content: data.message || "Changes applied successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, confirmMsg]);
      } else {
        alert(data.error || "Failed to execute update.");
      }
    } catch {
      alert("Network error applying update.");
    } finally {
      setApplyingActionId(null);
    }
  }

  function handleClearChat() {
    localStorage.removeItem("treqo_admin_ai_chat_v1");
    localStorage.removeItem("treqo_admin_ai_chat_v2");
    localStorage.removeItem("treqo_admin_ai_chat_v3");
    localStorage.removeItem("treqo_admin_ai_chat_v4");
    setMessages([
      {
        id: "welcome",
        role: "model",
        content: "How can I help you with Treqo today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  // Clean, elegant text formatting
  function renderFormattedText(text: string) {
    const cleaned = text.replace(/```action[\s\S]*?```/g, "").trim();

    return cleaned.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-semibold text-[#1F1E1B] text-sm mt-3 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-semibold text-[#1F1E1B] text-base mt-3 mb-1">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-0.5 text-xs sm:text-sm text-[#2D2A26]">
            <span className="text-[#8C827A]">•</span>
            <span>{formatInlineMarkdown(line.slice(2))}</span>
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-[#2D2A26] my-0.5">
          {formatInlineMarkdown(line)}
        </p>
      );
    });
  }

  function formatInlineMarkdown(str: string): React.ReactNode {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-[#1F1E1B]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-[#EFECE6] px-1.5 py-0.5 font-mono text-[11px] text-[#3F3934]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#FAF9F5] text-[#1F1E1B]",
        isCompact ? "p-3 sm:p-4" : "max-w-3xl mx-auto w-full p-4 sm:p-6"
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[#8C827A]" />
          <span className="text-sm font-semibold tracking-tight text-[#1F1E1B]">
            Treqo Bot
          </span>
          <span className="text-[11px] text-[#8C827A]">
            • {currentTab}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          title="Clear chat"
          className="p-1 rounded-md text-[#8C827A] hover:text-[#1F1E1B] hover:bg-[#EFECE6] transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
            >
              {isUser ? (
                <div className="max-w-[85%] rounded-2xl bg-[#EFECE6] px-4 py-2.5 text-xs sm:text-sm text-[#1F1E1B] whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>
              ) : (
                <div className="max-w-[95%] sm:max-w-[90%] space-y-2">
                  <div className="text-xs sm:text-sm leading-relaxed text-[#2D2A26]">
                    {renderFormattedText(m.content)}
                  </div>

                  {/* Clean Action Card */}
                  {m.proposedAction && (
                    <div className="mt-2.5 rounded-xl border border-[#E8E5DE] bg-white p-3 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-[#1F1E1B]">
                        <span>{m.proposedAction.label || `Update ${m.proposedAction.type}`}</span>
                        {m.actionApplied && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Applied
                          </span>
                        )}
                      </div>

                      {!m.actionApplied && (
                        <button
                          type="button"
                          onClick={() => handleApplyAction(m.id, m.proposedAction)}
                          disabled={applyingActionId === m.id}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1F1E1B] hover:bg-[#333] text-white py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {applyingActionId === m.id ? (
                            "Applying..."
                          ) : (
                            <>
                              <span>Apply to website</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Minimal Claude Loading Dots */}
        {isLoading && (
          <div className="flex items-center gap-1.5 py-2 text-[#8C827A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8C827A] animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8C827A] animate-pulse [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8C827A] animate-pulse [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (Only if conversation is fresh) */}
      {messages.length <= 1 && (
        <div className="pb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(s)}
              disabled={isLoading}
              className="text-[11px] text-[#6E6760] bg-white hover:bg-[#EFECE6] hover:text-[#1F1E1B] border border-[#E8E5DE] rounded-full px-3 py-1 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Box (Claude Style) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative bg-white rounded-2xl border border-[#E0DDD5] shadow-xs focus-within:border-[#8C827A] transition-colors p-1.5 flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          rows={isCompact ? 1 : 2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Reply to Treqo Bot..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#1F1E1B] placeholder:text-[#A39E96] focus:outline-none resize-none max-h-32"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0 mb-0.5 mr-0.5 cursor-pointer",
            input.trim() && !isLoading
              ? "bg-[#1F1E1B] text-white hover:bg-[#383430]"
              : "bg-[#EFECE6] text-[#A39E96] cursor-not-allowed"
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
