import { Play, User } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { alumniContent, alumniStories } from "@/data/home";

export default function AlumniShowcase() {
  return (
    <section className="relative z-0 overflow-hidden bg-brand-primary-deep pt-10 pb-14 sm:pt-10 sm:pb-16 lg:pt-15 lg:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/4 h-[380px] w-[380px] rounded-full bg-brand-secondary/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-primary/40 blur-3xl" />
      </div>

      <Container>
        <h2 className="text-2xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2.5rem]">
          {alumniContent.heading.line1}{" "}
          <span className="text-brand-secondary">{alumniContent.heading.line2}</span>
        </h2>
        <p className="mt-2 text-sm text-white/70 sm:text-base">{alumniContent.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-10 lg:grid-cols-4">
          {alumniStories.map((alumnus) => (
            <div
              key={alumnus.name}
              className="group relative aspect-[7/10] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary-deep via-brand-primary to-brand-primary-dark"
            >
              {/* Photo or placeholder */}
              {alumnus.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={alumnus.image}
                  alt={alumnus.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-16">
                    <User className="h-20 w-20 text-white/15 sm:h-24 sm:w-24" aria-hidden="true" />
                  </div>
                </>
              )}

              <div className="absolute inset-x-3 top-3 rounded-xl bg-surface/95 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:inset-x-4 sm:top-4 sm:px-4 sm:py-3">
                <p className="text-sm font-bold text-text-primary sm:text-base">{alumnus.name}</p>
                <p className="mt-0.5 text-[11px] text-text-secondary sm:text-xs">{alumnus.role}</p>
                <p className="text-[11px] text-text-secondary sm:text-xs">{alumnus.company}</p>
              </div>

              <button
                type="button"
                className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 sm:bottom-4 sm:left-4 sm:text-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                Watch Video
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:mt-10">
          <Link
            href={alumniContent.cta.href}
            className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(58,22,147,0.6)] transition-colors duration-200 hover:bg-brand-primary-dark sm:text-base"
          >
            {alumniContent.cta.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
