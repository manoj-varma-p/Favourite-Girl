"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Wand2,
  Terminal,
  HelpCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
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
}

const QUICK_PROMPTS = [
  {
    label: "Explain Active Tab",
    icon: HelpCircle,
    prompt: "Can you explain how this section works, how it connects to the frontend, and what best practices I should follow?",
  },
  {
    label: "Generate 20 SEO Keywords",
    icon: Search,
    prompt: "Generate 20 high-intent, location-tailored SEO keywords for the New Age Digital Marketing course (/categories/digital-marketing) in India.",
  },
  {
    label: "Why didn't my changes show on Vercel?",
    icon: AlertCircle,
    prompt: "I saved changes in the admin panel, but they are not appearing on my live Vercel website. Can you diagnose why and tell me exactly how to resolve this?",
  },
  {
    label: "Draft Announcement Banner",
    icon: Wand2,
    prompt: "Draft a high-converting announcement banner for Batch 2 enrollments with badge, headline, and link CTA, and format it as an action so I can apply it.",
  },
  {
    label: "Explain Mentor Lock / Unlock",
    icon: ShieldCheck,
    prompt: "Why are some mentors blurred with a lock icon on the website? How does the mentor lock/unlock feature work and how do I manage it?",
  },
  {
    label: "Audit Page SEO Matrix",
    icon: Layers,
    prompt: "Audit the SEO setup across my courses and landing pages. What pages need attention and how should I optimize their meta descriptions?",
  },
];

export default function AdminAiBotTab({ adminPin, currentTab = "overview", onNavigateTab }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [applyingActionId, setApplyingActionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("treqo_admin_ai_chat_v1");
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Welcome message
        setMessages([
          {
            id: "welcome-1",
            role: "model",
            content: `👋 **Welcome to the Treqo Admin AI Copilot!**\n\nI am powered by **Google Gemini 3.6 Flash** and have complete operational knowledge of your entire admin panel, MongoDB database, SEO matrix, and Next.js frontend.\n\n### Here is what I can do for you right now:\n* 📘 **Explain Every Part:** Ask about any tab, workflow, curriculum structure, or settings.\n* 🛠️ **Resolve Issues:** Troubleshoot Vercel deployments, MongoDB sync, mentor lock states, and PIN auth.\n* 🔍 **Read & Audit:** Inspect live SEO keywords, courses, leads, and site configuration.\n* ✨ **Generate Content:** Create high-volume SEO keywords, compelling meta descriptions, curriculum modules, and blog drafts.\n* ⚡ **Live Execution (Write):** When I suggest updates (like new SEO keywords or banner changes), I can provide an **Apply Changes** card so you can update the site with 1 click!\n\nWhat would you like to explore or update today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("treqo_admin_ai_chat_v1", JSON.stringify(messages.slice(-30)));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load diagnostics once on mount
  useEffect(() => {
    async function loadDiag() {
      try {
        const res = await fetch("/api/admin/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-pin": adminPin,
          },
          body: JSON.stringify({ action: "diagnostics" }),
        });
        const data = await res.json();
        if (data.success && data.diagnostics) {
          setDiagnostics(data.diagnostics);
        }
      } catch (e) {
        console.warn("Diagnostics fetch failed:", e);
      }
    }
    loadDiag();
  }, [adminPin]);

  async function handleSend(customText?: string) {
    const textToSend = (customText || input).trim();
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
      const historyPayload = newMessages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": adminPin,
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          currentTab,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const modelMessage: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          content: data.reply,
          proposedAction: data.proposedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        const errorMessage: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          content: `⚠️ **AI Service Error:** ${data.error || "Unable to reach Gemini API. Please verify your connection."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        content: "⚠️ **Network Error:** Could not contact the AI backend service.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        // Add confirmation message
        const confirmationMsg: Message = {
          id: `confirm-${Date.now()}`,
          role: "model",
          content: `✅ **Action Executed Successfully!**\n\n${data.message || "The changes have been saved to your database and local backup files."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, confirmationMsg]);
      } else {
        alert(data.error || "Failed to execute action.");
      }
    } catch (e) {
      alert("Network error applying action.");
    } finally {
      setApplyingActionId(null);
    }
  }

  function handleClearChat() {
    if (confirm("Clear AI conversation history?")) {
      localStorage.removeItem("treqo_admin_ai_chat_v1");
      setMessages([
        {
          id: "welcome-clean",
          role: "model",
          content: "Conversation history cleared. Ready for your next command or question!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  // Simple markdown renderer for bold, code blocks, lists
  function renderFormattedText(text: string) {
    // Remove action code blocks from standard display to keep clean
    const cleaned = text.replace(/```action[\s\S]*?```/g, "").trim();

    return cleaned.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-black text-[#1A0A1A] text-sm mt-3 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="font-black text-[#1A0A1A] text-base mt-3 mb-1">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-0.5 text-xs sm:text-sm">
            <span className="text-[#3B0D3B] font-black">•</span>
            <span>{formatInlineMarkdown(line.slice(2))}</span>
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-0.5">
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
          <strong key={i} className="font-bold text-[#1A0A1A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-[#3B0D3B]/10 px-1 py-0.5 font-mono text-[11px] text-[#3B0D3B] font-bold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] space-y-4">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#3B0D3B]/10 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B0D3B] to-[#1A0A1A] text-white shadow-md">
            <Sparkles className="h-5 w-5 text-[#C084FC] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1A0A1A] tracking-tight">
                Treqo AI Copilot
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.6 Flash Active
              </span>
            </div>
            <p className="text-xs text-[#5A4A5A]">
              Trained operations officer with live read, write, and generation capabilities across the entire Treqo system.
            </p>
          </div>
        </div>

        {/* Live Diagnostics Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {diagnostics && (
            <div className="hidden md:flex items-center gap-2 text-[11px] font-medium text-[#5A4A5A] bg-[#FAF5EE] px-3 py-1.5 rounded-xl border border-[#3B0D3B]/10">
              <Database className="h-3 w-3 text-[#3B0D3B]" />
              <span>MongoDB: <strong className="text-[#1A0A1A]">{diagnostics.mongoStatus}</strong></span>
              <span className="text-[#3B0D3B]/30">•</span>
              <span>Courses: <strong className="text-[#1A0A1A]">{diagnostics.coursesCount}</strong></span>
              <span className="text-[#3B0D3B]/30">•</span>
              <span>Mentors: <strong className="text-[#1A0A1A]">{diagnostics.tutorsCount}</strong></span>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B0D3B] bg-[#3B0D3B]/10 px-3 py-1.5 rounded-xl border border-[#3B0D3B]/15">
            <Terminal className="h-3.5 w-3.5" />
            <span className="capitalize">{currentTab} Tab Active</span>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            title="Reset conversation"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompt Recommendation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#8C6A8C] shrink-0 flex items-center gap-1 mr-1">
          <Zap className="h-3 w-3 text-[#C084FC]" /> Quick Tasks:
        </span>
        {QUICK_PROMPTS.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q.prompt)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#3B0D3B]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#1A0A1A] shadow-2xs hover:border-[#3B0D3B] hover:bg-[#FAF5EE] transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5 text-[#3B0D3B]" />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE]/60 p-4 sm:p-6 space-y-4 shadow-inner">
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={cn("flex gap-3 max-w-[90%] sm:max-w-[80%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-xs",
                  isUser
                    ? "bg-[#3B0D3B] text-white"
                    : "bg-gradient-to-br from-[#1A0A1A] to-[#3B0D3B] text-[#C084FC]"
                )}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Bubble */}
              <div className="flex flex-col gap-1.5">
                <div
                  className={cn(
                    "rounded-2xl p-4 sm:p-5 shadow-xs text-sm leading-relaxed",
                    isUser
                      ? "bg-[#3B0D3B] text-white rounded-tr-xs"
                      : "bg-white text-[#2A1A2A] border border-[#3B0D3B]/10 rounded-tl-xs"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="space-y-1">{renderFormattedText(m.content)}</div>
                  )}

                  {/* Interactive Action Proposal Card */}
                  {m.proposedAction && !isUser && (
                    <div className="mt-4 rounded-xl border border-[#3B0D3B]/20 bg-[#FAF5EE] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#3B0D3B]">
                          <Wand2 className="h-3.5 w-3.5 text-[#C084FC]" />
                          Suggested Live Action: {m.proposedAction.type}
                        </span>
                        {m.actionApplied && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" /> Applied to Site
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-[#1A0A1A]">
                        {m.proposedAction.label || "Click below to execute this change directly on your website:"}
                      </p>

                      <pre className="p-2.5 rounded-lg bg-[#14141A] text-[#C084FC] text-[11px] font-mono overflow-x-auto max-h-36">
                        {JSON.stringify(m.proposedAction.payload, null, 2)}
                      </pre>

                      <button
                        type="button"
                        onClick={() => handleApplyAction(m.id, m.proposedAction)}
                        disabled={m.actionApplied || applyingActionId === m.id}
                        className={cn(
                          "w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer",
                          m.actionApplied
                            ? "bg-emerald-600 text-white cursor-default opacity-80"
                            : "bg-[#3B0D3B] hover:bg-[#2A082A] text-white"
                        )}
                      >
                        {applyingActionId === m.id ? (
                          <span>Executing live update...</span>
                        ) : m.actionApplied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Successfully Applied</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4" />
                            <span>Apply This Action to Live Website</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[10px] text-[#8C6A8C] px-1 font-mono",
                    isUser ? "text-right" : "text-left"
                  )}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A0A1A] to-[#3B0D3B] text-[#C084FC] shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-xs p-4 bg-white border border-[#3B0D3B]/10 shadow-xs flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3B0D3B] animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-[#C084FC] animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-[#3B0D3B] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-[#5A4A5A] ml-2 font-medium">Gemini is reasoning & compiling response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2.5 bg-white p-2.5 sm:p-3 rounded-2xl border border-[#3B0D3B]/15 shadow-sm"
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Ask anything about ${currentTab}, generate SEO keywords, diagnose sync, or request live updates...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#1A0A1A] placeholder:text-[#8C6A8C] focus:outline-none resize-none max-h-32"
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-3 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
