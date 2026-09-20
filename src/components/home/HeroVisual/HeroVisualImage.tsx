import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVisualImageProps {
  /** Configurable so the production photo can be swapped without touching layout code. */
  src?: string;
  alt?: string;
  className?: string;
}

const DEFAULT_SRC = "/images/treqo-hero-learner.png";

export default function HeroVisualImage({
  src = DEFAULT_SRC,
  alt = "Treqqo learner studying with a laptop",
  className,
}: HeroVisualImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 rounded-[2.5rem] border-2 border-dashed border-brand-primary/25 bg-gradient-to-b from-brand-primary/12 via-surface-alt to-brand-secondary/12 px-6 text-center",
          className
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-brand-primary shadow-sm">
          <ImageIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="max-w-[200px] text-sm font-medium text-brand-primary/60">Learner photo goes here</p>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 620px, 90vw"
        className="object-contain object-bottom drop-shadow-[0_30px_50px_rgba(20,18,31,0.25)]"
      />
    </div>
  );
}
