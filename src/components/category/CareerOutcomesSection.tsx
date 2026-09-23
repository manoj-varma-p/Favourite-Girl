"use client";

export interface CareerRole {
  title: string;
  description?: string;
}

interface CareerOutcomesSectionProps {
  roles?: CareerRole[];
}

const defaultRoles: CareerRole[] = [
  {
    title: "Performance Marketing Manager",
    description: "Google + Meta campaigns, ROAS optimisation, budget management, customer acquisition at scale.",
  },
  {
    title: "Growth Marketing Specialist",
    description: "Full-funnel ownership, experiment-driven, data-heavy. The startup rocket fuel role.",
  },
  {
    title: "Brand Strategist / Manager",
    description: "Brand identity, positioning, communication strategy for FMCG, luxury, consumer brands.",
  },
  {
    title: "SEO & Content Lead",
    description: "Organic traffic, content engines, editorial calendars. Compound visibility over time.",
  },
  {
    title: "Social Media Manager",
    description: "Brand presence across platforms. Strategy + execution + community + paid social.",
  },
  {
    title: "Digital Marketing Analyst",
    description: "GA4, Looker Studio, attribution, cohort analysis. Data marketing decisions.",
  },
  {
    title: "CRM & Lifecycle Marketing",
    description: "Retention, automated email & WhatsApp funnels, churn prevention & LTV expansion.",
  },
  {
    title: "Marketplace & E-com Lead",
    description: "Amazon, Flipkart, Shopify store scaling, catalog health & marketplace ads.",
  },
];

export default function CareerOutcomesSection({ roles }: CareerOutcomesSectionProps = {}) {
  const displayRoles = roles && roles.length > 0 ? roles : defaultRoles;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div>
        <p className="text-[11px] sm:text-xs font-black tracking-[0.2em] text-slate-600 uppercase">
          CAREER OUTCOMES
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950 leading-tight">
          Roles You Can Crack{" "}
          <span className="text-[#5A2A5A]">at Top Companies</span>
        </h2>
        <div className="mt-3.5 h-1.5 w-16 rounded-full bg-[#3B0D3B]" />
      </div>

      {/* Cards Container: Mobile Sticky Scroll Stack | Desktop 2-Column Grid */}
      <div className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
        {displayRoles.map((role, idx) => (
          <div
            key={role.title}
            style={
              {
                "--stack-top": `${112 + idx * 8}px`,
                "--stack-z": idx + 1,
              } as React.CSSProperties
            }
            className="sticky md:static top-[var(--stack-top)] md:top-auto z-[var(--stack-z)] md:z-auto flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md md:shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {role.title}
                </h3>
                <span className="md:hidden text-[10px] font-bold text-slate-500 bg-slate-100/90 rounded-full px-2 py-0.5">
                  0{idx + 1}
                </span>
              </div>
              {role.description && (
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                  {role.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
