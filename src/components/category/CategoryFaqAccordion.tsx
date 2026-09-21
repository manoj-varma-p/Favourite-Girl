"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface CategoryFaqAccordionProps {
  faqs: FaqItem[];
}

export default function CategoryFaqAccordion({ faqs }: CategoryFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="p-4 sm:px-6 sm:py-5 transition-colors">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 text-left select-none active:scale-99 transition-transform"
              >
                <span className="text-xs sm:text-base font-bold text-text-primary leading-snug">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                    isOpen ? "bg-brand-primary text-white" : "bg-slate-100 text-text-secondary"
                  )}
                >
                  {isOpen ? (
                    <X className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
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
                  <p className="pt-2.5 text-xs sm:text-sm leading-relaxed text-text-secondary font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
