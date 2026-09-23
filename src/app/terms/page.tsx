import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header/Header";
import AnnouncementBanner from "@/components/header/AnnouncementBanner";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";
import {
  Scale,
  ShieldCheck,
  Building2,
  FileCheck,
  AlertTriangle,
  Mail,
  CreditCard,
  Layers,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getPageSeoByPath } from "@/lib/content-db";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/terms");
  return {
    title: pageSeo?.title || pageSeo?.metaTitle || "Terms & Conditions | TREQO: Student Agreement & Service Terms",
    description:
      pageSeo?.metaDescription ||
      "Legally enforceable terms and conditions governing enrollment, admissions, cohorts, fee plans, intellectual property, and platform use at Treqo School of Modern Learning Pvt. Ltd.",
    ...(pageSeo?.metaKeywords && pageSeo.metaKeywords.length > 0 ? { keywords: pageSeo.metaKeywords } : {}),
  };
}

const parts = [
  { id: "part-1", title: "Part I: Preliminary & Definitions" },
  { id: "part-2", title: "Part II: Eligibility & Enrollment" },
  { id: "part-3", title: "Part III: Programs & Studio Sprints" },
  { id: "part-4", title: "Part IV: Tuition Fees & Invoicing" },
  { id: "part-5", title: "Part V: Intellectual Property & Code of Conduct" },
  { id: "part-6", title: "Part VI: Disclaimers, Liability & Dispute Resolution" },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFAF6]">
      <Header variant="standard" banner={<AnnouncementBanner />} />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#0B0B0F] py-16 sm:py-20 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-[#3B0D3B]/40 blur-[100px]" />
        </div>

        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5A2A5A]/40 bg-[#5A2A5A]/20 px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-[#FDFAF6] backdrop-blur-xs">
              <Scale className="h-3.5 w-3.5 text-[#0CA30C]" />
              Legal Document
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
              Terms &amp; Conditions
            </h1>

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-300/90 max-w-xl mx-auto">
              A legally binding agreement between You and Treqo School of Modern Learning Private Limited governing program admissions, studio floor access, and learning platforms.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5A2A5A]" />
                Treqo School of Modern Learning Pvt. Ltd.
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0CA30C]" />
                IT Act 2000 &amp; Consumer Protection Act 2019
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3987E5]" />
                Hyderabad, Telangana, India
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-12 items-start">
            {/* Table of Contents Sidebar */}
            <aside className="hidden lg:block sticky top-28 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Jump to Part
              </span>
              <nav className="flex flex-col gap-1.5 text-xs">
                {parts.map((part) => (
                  <a
                    key={part.id}
                    href={`#${part.id}`}
                    className="text-slate-600 hover:text-[#012A22] hover:font-bold py-1 px-2 rounded-lg transition-colors hover:bg-[#F2F6F4] truncate"
                  >
                    {part.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Document Content */}
            <div className="flex flex-col gap-10 max-w-3xl">
              {/* PART I */}
              <div id="part-1" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART I
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Preliminary &amp; Definitions
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                      Section 01
                    </span>
                    <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                      Preamble and Nature of Agreement
                    </h2>

                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
                      <div className="pl-4 border-l-2 border-[#3B796A]/30">
                        <p className="font-bold text-xs text-[#012A22] mb-1">1.1</p>
                        <p>
                          These Terms and Conditions (&ldquo;Agreement&rdquo; or &ldquo;Terms&rdquo;) constitute a legally enforceable agreement between Treqo School of Modern Learning Private Limited, incorporated under the Companies Act, 2013, having its registered office and studio at Madhapur, Hyderabad 500081, Telangana, India, operating under the trade name &ldquo;Treqo&rdquo; (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), and any individual, fellow, student, or corporate entity accessing or enrolling in our programs (&ldquo;Fellow&rdquo;, &ldquo;User&rdquo;, or &ldquo;You&rdquo;).
                        </p>
                      </div>

                      <div className="pl-4 border-l-2 border-[#3B796A]/30">
                        <p className="font-bold text-xs text-[#012A22] mb-1">1.2. Electronic Record</p>
                        <p>
                          This Agreement is an electronic contract under Section 2(1)(t) of the Information Technology Act, 2000 and the IT (Intermediary Guidelines) Rules, 2021. It does not require physical signatures to be legally valid and binding.
                        </p>
                      </div>

                      <div className="pl-4 border-l-2 border-[#3B796A]/30">
                        <p className="font-bold text-xs text-[#012A22] mb-1">1.3. Acceptance by Conduct</p>
                        <p>
                          By submitting an application form, paying tuition fees, accessing online phase materials, or attending studio floor sprints at our Madhapur campus, you unconditionally accept and agree to all provisions of this Agreement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                      Section 02
                    </span>
                    <h2 className="mt-1 text-lg sm:text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                      Definitions
                    </h2>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#0A0F24] text-white">
                          <tr>
                            <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-[11px] w-1/3">Expression</th>
                            <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-[11px]">Meaning</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          <tr>
                            <td className="py-2.5 px-4 font-bold text-slate-900">Applicable Law</td>
                            <td className="py-2.5 px-4 text-slate-600">All Indian statutes including the Indian Contract Act 1872, IT Act 2000, Consumer Protection Act 2019, Copyright Act 1957, and DPDPA 2023.</td>
                          </tr>
                          <tr className="bg-slate-50/60">
                            <td className="py-2.5 px-4 font-bold text-slate-900">Programs &amp; Tracks</td>
                            <td className="py-2.5 px-4 text-slate-600">All educational offerings by Treqo: New Age Digital Marketing Flagship (On Campus &amp; Online), Treqo PGDM, Founder Semester, and Performance Growth Specialist.</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-4 font-bold text-slate-900">CEO Challenge / Capstone</td>
                            <td className="py-2.5 px-4 text-slate-600">The mandatory live portfolio review and strategic performance defense conducted before a panel of practitioners and brand founders.</td>
                          </tr>
                          <tr className="bg-slate-50/60">
                            <td className="py-2.5 px-4 font-bold text-slate-900">Verified Certificate</td>
                            <td className="py-2.5 px-4 text-slate-600">A tamper-evident credential issued upon completing phase milestones, directly linking to verified project deliverables.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART II */}
              <div id="part-2" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART II
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Eligibility &amp; Enrollment
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4 text-sm leading-relaxed text-slate-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                    Section 03
                  </span>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    Admissions Criteria &amp; Fellow Responsibility
                  </h2>

                  <div className="space-y-3 mt-4">
                    <p>3.1. To be eligible for Treqo cohorts, applicants must satisfy:</p>
                    <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                      <li>Minimum age of 18 years, or 16+ years with written parental/guardian consent;</li>
                      <li>Competence in conversational English and basic computer operation;</li>
                      <li>Access to a reliable laptop/workstation with stable high-speed internet; and</li>
                      <li>Satisfactory completion of the 20-minute admissions advisory profile discussion.</li>
                    </ul>

                    <p className="pt-2">
                      3.2. Treqo cohorts are capped to maintain strict 1-on-1 mentor review standards. Treqo reserves the right to decline or cancel enrollment if an applicant provides fabricated background credentials or violates community safety standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* PART III */}
              <div id="part-3" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART III
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Programs &amp; Studio Sprints
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4 text-sm leading-relaxed text-slate-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                    Section 04
                  </span>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    Pedagogy, Phase Gates &amp; Capstones
                  </h2>

                  <div className="space-y-3 mt-4">
                    <p>
                      4.1. <strong>70% Doing, 30% Theory:</strong> Treqo operates on a rigorous agency model. Fellows work on real brand briefs, live Meta &amp; Google Ads deployment, dynamic creative testing, and unit economics modeling.
                    </p>
                    <p>
                      4.2. <strong>Phase Gate Standard:</strong> Key checkpoints (such as Phase 4 Offer &amp; Audience Clarity) require a passing evaluation before advancing to live spend deployment. If a submission does not meet performance standards, the fellow must rework it under mentor guidance.
                    </p>
                    <p>
                      4.3. <strong>On-Campus Studio Floor:</strong> Fellows enrolled in the On-Campus track at Madhapur agree to follow studio workplace ethics, attend weekday standups, and care for campus infrastructure and hardware.
                    </p>
                  </div>
                </div>
              </div>

              {/* PART IV */}
              <div id="part-4" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART IV
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tuition Fees &amp; Invoicing
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4 text-sm leading-relaxed text-slate-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                    Section 05
                  </span>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    Payment Plans &amp; Refund Policy
                  </h2>

                  <div className="space-y-3 mt-4">
                    <p>
                      5.1. <strong>Pricing Structure:</strong> All displayed program fees are in Indian Rupees (₹) and include applicable GST (18%). Invoices are dispatched to the fellow&apos;s registered email upon successful transaction clearance.
                    </p>
                    <p>
                      5.2. <strong>Payment Methods:</strong> Tuition fees may be fulfilled via UPI, Net Banking, Debit/Credit Cards, or authorized education financing partners.
                    </p>
                    <p>
                      5.3. <strong>Refund &amp; Cancellation Policy:</strong> Due to limited seat allocations per batch, tuition payments are non-refundable once cohort sessions commence. If an applicant requests cancellation at least 7 calendar days before the official batch kickoff, a refund minus administrative processing charges (₹2,500) will be issued.
                    </p>
                  </div>
                </div>
              </div>

              {/* PART V */}
              <div id="part-5" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART V
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Intellectual Property &amp; Conduct
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4 text-sm leading-relaxed text-slate-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                    Section 06
                  </span>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    IP Rights &amp; Code of Conduct
                  </h2>

                  <div className="space-y-3 mt-4">
                    <p>
                      6.1. <strong>Treqo IP:</strong> All proprietary frameworks, video masterclasses, audit checklists, SOPs, and learning platform source code remain the exclusive intellectual property of Treqo School of Modern Learning Private Limited. Unauthorized recording, redistributing, or commercial reselling of materials is prohibited.
                    </p>
                    <p>
                      6.2. <strong>Fellow Deliverables:</strong> Fellows retain full ownership of their original creative campaign assets, copywriting briefs, and portfolio case studies created during the program. Fellows grant Treqo a non-exclusive license to showcase student work in verified outcome showcases and alumni highlights.
                    </p>
                    <p>
                      6.3. <strong>Community Code of Conduct:</strong> Treqo maintains zero tolerance for harassment, discrimination, or abusive conduct in physical studio sprints, Slack/Discord channels, or peer review sessions.
                    </p>
                  </div>
                </div>
              </div>

              {/* PART VI */}
              <div id="part-6" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-md bg-[#012A22] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    PART VI
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Disclaimers &amp; Jurisdiction
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4 text-sm leading-relaxed text-slate-600">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                    Section 07
                  </span>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    Outcome Disclaimers &amp; Governing Law
                  </h2>

                  <div className="space-y-3 mt-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex gap-3 items-start text-xs sm:text-sm text-amber-950">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>Honest Outcome Disclosure:</strong> While Treqo provides comprehensive career sprints, hiring partner interview rounds, and portfolio defense support, we do not promise automatic job guarantees. Career outcomes depend on your dedication, quality of portfolio defense, and industry demand.
                      </p>
                    </div>

                    <p className="pt-2">
                      7.1. <strong>Governing Law &amp; Jurisdiction:</strong> This Agreement shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana, India.
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                    <a
                      href="mailto:legal@treqo.org"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0A0F24] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-[#ABCAC2]" />
                      <span>legal@treqo.org</span>
                    </a>
                    <a
                      href="tel:+919948000491"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#F2F6F4] border border-[#012A22]/20 px-4 py-2.5 text-xs font-bold text-[#012A22] shadow-2xs hover:bg-[#E2E7E5] transition-colors"
                    >
                      <span>+91 99480 00491</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
