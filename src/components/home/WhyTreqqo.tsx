import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { WhyTreqqoContent } from "@/lib/content-db";

interface SubmissionItem {
  tag: string;
  title: string;
  description: string;
  rule?: string;
}

const defaultSubmissions: SubmissionItem[] = [
  {
    tag: "01",
    title: "The problem",
    description: "One sentence. If it takes three, you haven't found the problem yet.",
    rule: "Criterion: Exactly 1 sentence",
  },
  {
    tag: "02",
    title: "The market logic",
    description: "Why this market behaves the way you claim. Assertion is not logic.",
    rule: "Criterion: Causal logic & proof",
  },
  {
    tag: "03",
    title: "The experiment",
    description: "Something small, live and measurable. Report it even when it flopped.",
    rule: "Criterion: Real spend & live data",
  },
  {
    tag: "04",
    title: "The revenue plan",
    description: "A business without a path to revenue is just an expensive idea.",
    rule: "Criterion: Board-level financial model",
  },
];

const DEFAULT_DESCRIPTION =
  "70% doing, 30% theory enforced, not aspirational. A right answer with no evidence behind it does not pass. You submit four things and defend them out loud.";

function renderSubmissionCard(item: SubmissionItem, index: number) {
  const isHighlighted = index === 3;
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <div
      key={index}
      className={cn(
        "rounded-none p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between min-h-[190px] sm:min-h-[210px] relative border",
        isHighlighted
          ? "bg-[#3B0D3B] text-white border-[#5A2A5A] border-t-[3px] border-t-[#8C6A8C] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          : "bg-white text-[#1A0A1A] border-[#E5E0D5] border-t-[3px] border-t-[#3B0D3B] shadow-xs hover:border-[#3B0D3B] hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <div>
        {/* Single distinct number in top right - no duplicate numbering */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-[10px] font-mono font-bold uppercase tracking-widest",
              isHighlighted ? "text-[#FAF5EE]/70" : "text-[#8C6A8C]"
            )}
          >
            Defense Deliverable
          </span>
          <span
            className={cn(
              "text-2xl sm:text-3xl font-mono font-black leading-none",
              isHighlighted ? "text-[#FDFAF6]" : "text-[#3B0D3B]"
            )}
          >
            {numStr}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mt-4 text-base sm:text-lg font-black tracking-tight",
            isHighlighted ? "text-[#FDFAF6]" : "text-[#1A0A1A]"
          )}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "mt-2 text-xs sm:text-[13px] leading-relaxed font-medium",
            isHighlighted ? "text-[#FAF5EE]/85" : "text-[#5A4A5A]"
          )}
        >
          {item.description}
        </p>
      </div>

      {/* Bottom Proof Standard Strip */}
      <div
        className={cn(
          "mt-5 pt-3 border-t flex items-center justify-between text-[11px] font-mono",
          isHighlighted
            ? "border-white/15 text-[#FAF5EE]/70"
            : "border-[#F0ECE1] text-slate-500"
        )}
      >
        <span>{item.rule || `Criterion ${numStr}`}</span>
        <span
          className={cn(
            "h-1.5 w-1.5",
            isHighlighted ? "bg-[#0CA30C]" : "bg-[#3B0D3B]"
          )}
        />
      </div>
    </div>
  );
}

export default function WhyTreqqo({ content }: { content?: WhyTreqqoContent }) {
  const eyebrow = content?.eyebrow || "THE CEO CHALLENGE";
  const titleLines =
    content?.titleLines && content.titleLines.length > 0
      ? content.titleLines
      : ["Every phase ends", "with a problem", "someone actually has."];
  const submissions =
    content?.submissions && content.submissions.length > 0
      ? content.submissions
      : defaultSubmissions;
  const description =
    content?.description && content.description.trim().length > 3
      ? content.description
      : DEFAULT_DESCRIPTION;
  const bannerTitle =
    content?.banner?.title || "Phase 4 is a wall, not a checkpoint.";
  const bannerDesc =
    content?.banner?.description ||
    "Idea clarity is graded pass or rework. No partial credit, no parallel track. Nobody carries a weak idea into execution least of all the students in a hurry.";

  // Desktop columns: Left has Card 1 & Card 2; Right has Card 3 & Card 4 (forming [1 3] on top, [2 4] below)
  const colLeft = [submissions[0], submissions[1]];
  const colRight = [submissions[2], submissions[3]];

  return (
    <section
      id="method"
      className="relative z-0 overflow-visible bg-[#F9F8F3] py-14 sm:py-18 lg:py-22 scroll-mt-16 sm:scroll-mt-20 text-[#1A0A1A] border-y border-[#E5E0D5]"
    >
      <Container className="relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: All Section Content */}
          <div className="flex flex-col items-start lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3B0D3B]/20 bg-[#3B0D3B]/5 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#3B0D3B] shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0ca30c]" />
              {eyebrow}
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.85rem] font-black leading-[1.08] tracking-tight text-[#1A0A1A]">
              {titleLines.map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#5A4A5A] font-medium">
              {description}
            </p>

            {/* Phase 4 Wall Banner Card */}
            <div className="mt-7 w-full rounded-none border-l-4 border-l-[#3B0D3B] border-y border-r border-[#E2DDD3] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#3B0D3B]" />
                <h4 className="text-sm font-bold text-[#1A0A1A] tracking-wide">
                  {bannerTitle}
                </h4>
              </div>
              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#5A4A5A] font-normal">
                {bannerDesc}
              </p>
            </div>
          </div>

          {/* Right Column: 4 Submission Boxes in [1 3] / [2 4] with Single Numbering & Unique Styling */}
          <div className="lg:col-span-7">
            {/* Mobile (under 640px): Scroll Stack / Stacking Cards */}
            <div className="flex flex-col gap-6 sm:hidden relative pb-10">
              {submissions.map((item, i) => (
                <div
                  key={i}
                  className="sticky transition-all duration-300"
                  style={{
                    top: `calc(72px + ${i * 14}px)`,
                    zIndex: 10 + i,
                  }}
                >
                  <div className="shadow-lg">
                    {renderSubmissionCard(item, i)}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop: 1 3 (top) / 2 4 (bottom) with uneven/staggered offset */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4 lg:gap-5 items-start">
              {/* Column 1: Card 1 & Card 2 */}
              <div className="flex flex-col gap-4 lg:gap-5">
                {colLeft[0] && renderSubmissionCard(colLeft[0], 0)}
                {colLeft[1] && renderSubmissionCard(colLeft[1], 1)}
              </div>

              {/* Column 2: Card 3 & Card 4 (Highlighted in Logo Color, staggered down) */}
              <div className="flex flex-col gap-4 lg:gap-5 sm:mt-8 lg:mt-10">
                {colRight[0] && renderSubmissionCard(colRight[0], 2)}
                {colRight[1] && renderSubmissionCard(colRight[1], 3)}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
