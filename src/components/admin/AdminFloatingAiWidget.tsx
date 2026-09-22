"use client";

import React, { useState } from "react";
import { Sparkles, X, Bot, Maximize2 } from "lucide-react";
import AdminAiBotTab from "./AdminAiBotTab";
import { cn } from "@/lib/utils";

interface Props {
  adminPin: string;
  currentTab: string;
  onNavigateTab: (tabId: string) => void;
}

export default function AdminFloatingAiWidget({ adminPin, currentTab, onNavigateTab }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Copilot"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#3B0D3B] to-[#1A0A1A] p-3.5 sm:px-5 sm:py-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(192,132,252,0.4)] border border-white/20 cursor-pointer"
          >
            <div className="relative">
              <Sparkles className="h-5 w-5 text-[#C084FC] animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-black tracking-tight leading-none text-white">
                Treqo AI Copilot
              </span>
              <span className="text-[10px] text-[#C8B8C8] font-medium leading-tight mt-0.5">
                Gemini 3.6 • Read, Write & Fix
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Drawer Modal Backdrop & Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FDFAF6] h-full shadow-2xl flex flex-col border-l border-[#3B0D3B]/15 animate-in slide-in-from-right duration-300">
            {/* Drawer Header Controls */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#3B0D3B]/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3B0D3B] text-[#C084FC]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1A0A1A]">
                    Treqo AI Operations Assistant
                  </h3>
                  <p className="text-[11px] text-[#5A4A5A]">
                    Context: <strong className="capitalize text-[#3B0D3B]">{currentTab} Tab</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Switch to full-page tab"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateTab("aiBot");
                  }}
                  className="p-2 rounded-xl text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#1A0A1A] transition-colors cursor-pointer"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Close Assistant"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#1A0A1A] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Assistant Body */}
            <div className="flex-1 p-4 overflow-hidden">
              <AdminAiBotTab
                adminPin={adminPin}
                currentTab={currentTab}
                onNavigateTab={(tab) => {
                  setIsOpen(false);
                  onNavigateTab(tab);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
