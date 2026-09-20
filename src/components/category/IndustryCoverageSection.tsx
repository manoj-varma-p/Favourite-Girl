"use client";

interface IndustryItem {
  industry: string;
  company: string;
}

const industries: IndustryItem[] = [
  { industry: "LUXURY", company: "Tanishq" },
  { industry: "HEALTHCARE", company: "Apollo 24|7" },
  { industry: "TRAVEL", company: "MakeMyTrip" },
  { industry: "EV / AUTO", company: "Ola Electric" },
  { industry: "GAMING", company: "Dream11" },
  { industry: "FMCG", company: "Amul" },
  { industry: "TELECOM", company: "Airtel" },
  { industry: "INSURTECH", company: "Policybazaar" },
  { industry: "HOME SVC", company: "Urban Co." },
  { industry: "FOOD", company: "Zomato" },
  { industry: "FITNESS", company: "Cult.fit" },
  { industry: "FINTECH", company: "Zerodha" },
  { industry: "SPORTS", company: "Nike India" },
  { industry: "HOTELS", company: "OYO" },
  { industry: "MUSIC", company: "Spotify" },
  { industry: "F&B", company: "Starbucks" },
];

export default function IndustryCoverageSection() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div>
        <p className="text-[11px] sm:text-xs font-black tracking-[0.2em] text-slate-600 uppercase">
          INDUSTRY COVERAGE
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950 leading-tight">
          16 Industries. 50+ Companies.{" "}
          <span className="text-[#5A2A5A]">One Portfolio.</span>
        </h2>
        <div className="mt-3.5 h-1.5 w-16 rounded-full bg-[#3B0D3B]" />
      </div>

      {/* 4x4 Grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {industries.map((item) => (
          <div
            key={item.industry}
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 text-center shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <p className="text-xs sm:text-[13px] font-black tracking-wider text-slate-900 uppercase">
              {item.industry}
            </p>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-medium text-slate-600">
              {item.company}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
