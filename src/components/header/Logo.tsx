import Link from "next/link";
import { cn } from "@/lib/utils";
import { generalSettings } from "@/lib/cms-client";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light"; // "light" = light text for dark backgrounds, "dark" = dark text for light backgrounds
}

export default function Logo({ className, variant = "light" }: LogoProps) {
  const { logoText = "TREQO", logoImage } = generalSettings;

  return (
    <Link
      href="/"
      aria-label={`${logoText} home`}
      className={cn(
        "inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C6A8C] focus-visible:ring-offset-2 rounded-md",
        className
      )}
    >
      {logoImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoImage}
          alt={logoText}
          className="h-10 sm:h-12 w-auto object-contain"
        />
      ) : (
        <span
          className={cn(
            "text-3xl sm:text-4xl lg:text-[2.35rem] font-black tracking-tight transition-colors select-none leading-none",
            variant === "light"
              ? "text-[#FDFAF6] hover:text-[#8C6A8C]"
              : "text-[#3B0D3B] hover:text-[#5A2A5A]"
          )}
        >
          {logoText}
        </span>
      )}
    </Link>
  );
}
