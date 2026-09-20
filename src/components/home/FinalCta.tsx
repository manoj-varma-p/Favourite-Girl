"use client";

import Container from "@/components/ui/Container";
import { useApplyModal } from "@/context/ApplyModalContext";
import { generalSettings } from "@/lib/cms-client";

interface FinalCtaProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function FinalCta({
  eyebrow = "NEXT BATCH · HYDERABAD + ONLINE",
  title = "Your next skill should earn its place.",
  subtitle = "See the curriculum, ask the uncomfortable questions, and decide with a real conversation.",
  primaryButtonText = "Book a free strategy call",
  secondaryButtonText = "WhatsApp admissions",
}: FinalCtaProps) {
  const { openApplyModal } = useApplyModal();
  const whatsappUrl =
    (generalSettings as Record<string, any>)?.whatsappUrl ||
    "https://wa.me/919948000491";

  const handleBookCall = (e: React.MouseEvent) => {
    e.preventDefault();
    openApplyModal("Strategy Call");
  };

  return (
    <section className="bg-[#FDFAF6] pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20 text-[#1A0A1A] border-b border-[#F5EDE0]">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-[#0C101A] border border-white/10 p-7 sm:p-10 lg:p-14 text-white shadow-2xl">
          {/* Top-Right Ambient Treqo Plum Glow Flare */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-[450px] w-[450px] rounded-full blur-[85px] opacity-75"
            style={{
              background:
                "radial-gradient(circle, rgba(138, 28, 138, 0.85) 0%, rgba(90, 18, 90, 0.55) 45%, rgba(59, 13, 59, 0.35) 70%, transparent 80%)",
            }}
          />

          {/* Content Block */}
          <div className="relative z-10 max-w-2xl">
            {/* Monospace Plum/Lilac Eyebrow */}
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#C084FC]">
              {eyebrow}
            </span>

            {/* Serif Title */}
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight text-white">
              {title}
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300 font-normal max-w-xl">
              {subtitle}
            </p>

            {/* Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {/* Primary Call Button (Crisp White) */}
              <button
                type="button"
                onClick={handleBookCall}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-100 px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-bold text-[#0C101A] transition-all shadow-md hover:shadow-xl active:scale-[0.98] cursor-pointer"
              >
                <span>{primaryButtonText}</span>
                <span className="text-base leading-none">→</span>
              </button>

              {/* Secondary WhatsApp Button */}
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent(
                  "Hi! I want to discuss admissions and the next batch at Treqo."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/35 active:scale-[0.98] cursor-pointer"
              >
                {secondaryButtonText}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
