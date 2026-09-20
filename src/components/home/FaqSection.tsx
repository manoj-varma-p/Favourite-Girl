"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { generalSettings } from "@/lib/cms-client";
import homeData from "@/content/pages/home.json";

const fallbackFaqs = [
  {
    question: "Do I need a marketing background?",
    answer:
      "No. Batch 1 came in from engineering, commerce and design. What you do need is the time, roughly 12 to 15 hours a week for four months, including the parts that aren't fun.",
  },
  {
    question: "Online or on campus?",
    answer:
      "The flagship runs online with live sessions and reviews. The 4M Program is on campus in Madhapur. Either way, come and sit in on a review before you decide.",
  },
  {
    question: "What happens if I fail Phase 4?",
    answer:
      "You rework it. Idea clarity is pass or rework, no partial credit, no parallel track. Most students rework once, and the second version is always sharper.",
  },
  {
    question: "Is placement guaranteed?",
    answer:
      "No, and anyone promising you that is selling something. Batch 1 was 100% placed or founding, out of a small batch. Plan B moves you to the front of the placement queue; neither plan buys a guarantee.",
  },
  {
    question: "Why are six courses marked 'building'?",
    answer:
      "Because they are. We'd rather show you the roadmap than list seven live programs and quietly stall you. Join a waitlist and you'll hear from us when there's a date.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = (homeData.faqs && homeData.faqs.length > 0) ? homeData.faqs : fallbackFaqs;
  const phone = generalSettings.supportPhone || "+91 99480 00491";

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section id="faq" className="bg-[#FDFAF6] pt-14 sm:pt-18 lg:pt-20 pb-8 sm:pb-10 lg:pb-12 scroll-mt-16 sm:scroll-mt-20 text-[#1A0A1A]">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
          {/* Left Column: Heading & Contact info */}
          <div className="flex flex-col items-start lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5A2A5A]">
              FAQ
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[3rem] font-black leading-[1.08] tracking-tight text-[#1A0A1A]">
              Straight answers
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-600">
              Something not here? Call{" "}
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="font-bold text-[#3B0D3B] hover:text-[#5A2A5A] hover:underline transition-colors"
              >
                {phone}
              </a>{" "}
              and ask.
            </p>
          </div>

          {/* Right Column: Minimalist Accordion */}
          <div className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="py-6 sm:py-7">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left transition-colors cursor-pointer group"
                  >
                    <span className="text-base sm:text-lg font-bold tracking-tight text-[#1A0A1A] group-hover:text-[#5A2A5A] transition-colors">
                      {faq.question}
                    </span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3B0D3B]">
                      {isOpen ? (
                        <X className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
