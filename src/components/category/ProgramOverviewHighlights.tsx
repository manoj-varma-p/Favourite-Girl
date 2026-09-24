import React from "react";

export default function ProgramOverviewHighlights() {
  return (
    <section aria-label="Program Overview and Highlights" className="space-y-8">
      {/* ======================================================== */}
      {/* DESKTOP VIEW (Visible on md and larger screens - Image 3)*/}
      {/* ======================================================== */}
      <div className="hidden md:block space-y-6">
        {/* Program Overview */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Program Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            <strong className="font-bold text-slate-900">TreQo: The Marketing School</strong> delivers an industry-recognized{" "}
            <strong className="font-bold text-slate-900">New-Age Digital Marketing Course Online</strong> engineered for
            ambitious undergraduates, working professionals, and aspiring startup founders. Taught live by growth leaders
            and entrepreneurs, this{" "}
            <strong className="font-bold text-slate-900">AI-native digital marketing training program</strong> covers
            full-funnel performance marketing, Meta Ads Manager, Google Ads (Search, Display &amp; PMax), GA4 analytics,
            conversion rate optimization (CRO), and advanced SEO strategies.
          </p>
        </div>

        {/* Key Program Highlights */}
        <div className="space-y-3.5 pt-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Key Program Highlights
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">AI-Native Digital Marketing Curriculum</strong>{" "}
                <span className="text-slate-600 font-normal">
                  (Prompt Engineering, Creative AI &amp; Marketing Automation)
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">70% Live Campaign Execution</strong>{" "}
                <span className="text-slate-600 font-normal">
                  (Hands-on Funnel Building &amp; Ad Spend Allocation)
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Real Ad Spend Testing &amp; Optimization</strong>{" "}
                <span className="text-slate-600 font-normal">
                  (Meta CBO/Pixel/CAPI &amp; Google Search Performance)
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Proof-of-Work Portfolio</strong>{" "}
                <span className="text-slate-600 font-normal">
                  (30+ Real Brand Projects Across 16+ Industries)
                </span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">&quot;The CEO Challenge&quot; Business Capstone</strong>{" "}
                <span className="text-slate-600 font-normal">(Simulated Growth &amp; Revenue Strategy)</span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">
                  100% Dedicated Digital Marketing Placement Assistance
                </strong>{" "}
                <span className="text-slate-600 font-normal">(Resume Prep &amp; Job Referrals)</span>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">
                  1-on-1 Mentorship for Career Upskilling &amp; Business Launch
                </strong>
              </span>
            </li>

            <li className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Flexible Online Interactive Classes</strong>{" "}
                <span className="text-slate-600 font-normal">
                  (Designed for College Students &amp; Working Professionals)
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE VIEW (Visible on mobile/small screens - Image 4)   */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-5">
        {/* Program Overview */}
        <div className="space-y-2.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Program Overview
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            <strong className="font-bold text-slate-900">TreQo: The Marketing School</strong> offers an industry-recognized{" "}
            <strong className="font-bold text-slate-900">New-Age Digital Marketing Course Online</strong> engineered for
            ambitious undergraduates, working professionals, and aspiring business founders. Taught live by growth experts
            and entrepreneurs, this{" "}
            <strong className="font-bold text-slate-900">AI-native digital marketing training program</strong> covers
            full-funnel performance marketing, Meta Ads, Google Ads, GA4 analytics, and SEO strategies.
          </p>
        </div>

        {/* Program Highlights */}
        <div className="space-y-3 pt-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Program Highlights
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">AI-Native Digital Marketing Curriculum</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">70% Live Campaign Execution</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Real Ad Spend Testing &amp; Optimization</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Proof-of-Work Portfolio</strong>{" "}
                <span className="text-slate-600 font-normal">(30+ Real Projects)</span>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">&quot;The CEO Challenge&quot; Business Capstone</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">100% Dedicated Placement Assistance</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">1-on-1 Career &amp; Business Mentorship</strong>
              </span>
            </li>

            <li className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-slate-700 bg-transparent"
                aria-hidden="true"
              />
              <span>
                <strong className="font-bold text-slate-900">Flexible Online Schedule</strong>{" "}
                <span className="text-slate-600 font-normal">(Fits Around College &amp; Work Hours)</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
