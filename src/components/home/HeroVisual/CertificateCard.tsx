import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroVisualCards } from "@/data/home";

export default function CertificateCard({ className }: { className?: string }) {
  const { certificate } = heroVisualCards;

  return (
    <div
      className={cn(
        "w-[200px] rounded-2xl border border-border-subtle bg-surface p-4 shadow-[0_20px_40px_-16px_rgba(20,18,31,0.28)] sm:w-[222px]",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
          <Award className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-text-secondary">{certificate.eyebrow}</p>
          <p className="text-xs font-bold text-text-primary">{certificate.title}</p>
        </div>
      </div>
      <Link
        href="/#certs"
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:underline"
      >
        View Certificate
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}
