import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { certificatePreview } from "@/data/home";

export default function CertificateShowcase() {
  return (
    <section className="relative overflow-hidden bg-surface-muted pt-10 pb-14 sm:pt-10 sm:pb-16 lg:pt-15 lg:pb-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:min-h-[480px] lg:grid-cols-2 lg:gap-10">
          {/* Certificate visual - placed directly without an enclosing block */}
          <div className="flex items-center justify-center">
            <div className="relative transition-all duration-300 hover:scale-[1.02]">
              <Image
                src="/images/treqo-official-certificate.png"
                alt="TREQO Certificate of Completion in Digital Marketing"
                width={792}
                height={1024}
                className="h-[470px] sm:h-[530px] lg:h-[560px] w-auto max-w-full rounded-xl border border-slate-300/90 bg-white shadow-xl shadow-black/12 object-contain block"
                priority
              />
            </div>
          </div>

          {/* Content panel */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-brand-primary uppercase sm:text-sm">
              {certificatePreview.label}
            </p>

            <h3 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight text-text-primary uppercase sm:text-3xl">
              {certificatePreview.heading}
            </h3>

            <blockquote className="mt-5 rounded-r-lg border-l-4 border-brand-primary bg-surface-alt px-4 py-3 text-sm font-medium text-text-primary italic">
              &ldquo;{certificatePreview.quote}&rdquo;
            </blockquote>

            <ul className="mt-5 space-y-2.5">
              {certificatePreview.bullets.map((bullet) => (
                <li key={bullet.label} className="text-sm leading-relaxed text-text-secondary">
                  <span className="font-bold text-text-primary">{bullet.label}: </span>
                  {bullet.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href={certificatePreview.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-primary/25 px-7 py-3.5 text-sm font-semibold text-brand-primary transition-colors duration-200 hover:border-brand-primary hover:bg-brand-primary/5 sm:w-auto"
              >
                {certificatePreview.secondaryCta.label}
              </Link>
              <Link
                href={certificatePreview.primaryCta.href}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(58,22,147,0.6)] transition-colors duration-200 hover:bg-brand-primary-dark sm:w-auto"
              >
                {certificatePreview.primaryCta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
