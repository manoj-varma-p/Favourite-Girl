"use client";

import React, { useState } from "react";
import { Bot, X, Maximize2 } from "lucide-react";
import AdminAiBotTab from "./AdminAiBotTab";

interface Props {
  adminPin: string;
  currentTab: string;
  onNavigateTab: (tabId: string) => void;
}

export default function AdminFloatingAiWidget({ adminPin, currentTab, onNavigateTab }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Treqo Bot"
            className="flex items-center gap-2 rounded-full bg-[#1F1E1B] hover:bg-[#34302C] text-white px-3.5 py-2.5 shadow-lg border border-black/10 transition-all hover:scale-105 cursor-pointer"
          >
            <Bot className="h-4 w-4 text-[#D8D2C7]" />
            <span className="text-xs font-medium tracking-tight">Treqo Bot</span>
          </button>
        </div>
      )}

      {/* Reduced-Size Floating Card (No full-screen dark backdrop) */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[390px] h-[520px] max-h-[84vh] bg-[#FAF9F5] rounded-2xl shadow-2xl border border-[#E8E5DE] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Minimal Window Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-[#E8E5DE]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1E1B]">
              <Bot className="h-3.5 w-3.5 text-[#8C827A]" />
              <span>Treqo Bot</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Expand to full page"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateTab("aiBot");
                }}
                className="p-1 rounded-md text-[#8C827A] hover:text-[#1F1E1B] hover:bg-[#EFECE6] transition-colors cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Close"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[#8C827A] hover:text-[#1F1E1B] hover:bg-[#EFECE6] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Compact Assistant Body */}
          <div className="flex-1 overflow-hidden">
            <AdminAiBotTab
              adminPin={adminPin}
              currentTab={currentTab}
              isCompact={true}
              onNavigateTab={(tab) => {
                setIsOpen(false);
                onNavigateTab(tab);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
