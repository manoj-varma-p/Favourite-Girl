import { getHomePageContent } from "@/lib/cms";
import { heroStats as fallbackStats } from "@/data/home";
import { cn } from "@/lib/utils";

interface HeroStatsProps {
  className?: string;
  stats?: Array<{ value: string; label: string }>;
}

export default function HeroStats({ className, stats: propStats }: HeroStatsProps) {
  const stats = (propStats && propStats.length > 0)
    ? propStats.slice(0, 3)
    : fallbackStats;

  return (
    <div
      className={cn(
        "w-full max-w-[490px] overflow-hidden rounded-2xl border border-[#3B0D3B]/15 bg-white/85 backdrop-blur-md shadow-xs transition-all hover:border-[#3B0D3B]/25 hover:bg-white/95",
        className
      )}
    >
      <div className="grid grid-cols-3 divide-x divide-[#3B0D3B]/10 py-3 sm:py-3.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center px-2 py-0.5 text-center sm:px-3"
          >
            <span className="text-2xl sm:text-[1.65rem] font-black tracking-tight text-[#3B0D3B] leading-tight">
              {stat.value}
            </span>
            <span className="mt-1 text-[11px] sm:text-xs font-semibold leading-tight text-[#5A4A5A] text-balance">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
