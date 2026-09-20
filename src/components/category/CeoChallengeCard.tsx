"use client";

interface CeoChallengeCardProps {
  heading?: string;
  tagline?: string;
  description?: string;
}

export default function CeoChallengeCard({
  heading = "The CEO Challenge",
  tagline = "“One Real Problem. One Instant Solution.”",
  description = "Every module ends with a pressure-test scenario. No Googling. You make the call: go, pivot, or kill. Revenue is truth. Speed beats perfection.",
}: CeoChallengeCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0B0B0F] border border-[#5A2A5A]/40 p-6 sm:p-7 md:p-8 shadow-md">
      {/* Subtle top-left ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#8C6A8C]/15 blur-2xl"
      />

      <div className="relative z-10">
        <h3 className="text-xl sm:text-2xl md:text-[26px] font-black tracking-tight text-[#FDFAF6]">
          {heading}
        </h3>

        <p className="mt-1 text-sm sm:text-base font-semibold italic text-[#8C6A8C]">
          {tagline}
        </p>

        <p className="mt-3.5 text-xs sm:text-sm md:text-[15px] font-normal leading-relaxed text-[#FAF5EE]/90 max-w-4xl">
          {description}
        </p>
      </div>
    </div>
  );
}
