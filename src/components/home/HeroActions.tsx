"use client";

import Link from "next/link";
import { Video } from "lucide-react";
import { heroContent } from "@/data/home";
import { useApplyModal } from "@/context/ApplyModalContext";

export default function HeroActions() {
  const { openApplyModal } = useApplyModal();

  const handleOpenVideo = () => {
    window.dispatchEvent(new CustomEvent("open-treqo-video"));
  };

  const handleBookDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    openApplyModal("Book a Demo");
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-3.5 w-full sm:w-auto">
      <Link
        href={heroContent.primaryCta.href}
        className="glossy-shine inline-flex items-center justify-center rounded-xl bg-[#3B0D3B] px-6 py-3.5 text-sm sm:text-base font-bold text-[#FDFAF6] shadow-lg shadow-[#3B0D3B]/25 hover:bg-[#2B052B] active:scale-[0.98] transition-all"
      >
        {heroContent.primaryCta.label}
      </Link>

      <button
        type="button"
        onClick={handleBookDemo}
        className="glossy-shine inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-[#1A0A1A] shadow-xs transition-all hover:border-[#3B0D3B] hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
      >
        Book a demo
      </button>

      {/* Mobile-only inline trigger so mobile users can still watch the reel without any floating overlay */}
      <button
        type="button"
        onClick={handleOpenVideo}
        className="lg:hidden inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-bold text-[#1A0A1A] shadow-xs hover:bg-slate-100 transition-all cursor-pointer"
      >
        <Video size={15} className="text-[#3B0D3B]" />
        <span>Watch Video</span>
      </button>
    </div>
  );
}
