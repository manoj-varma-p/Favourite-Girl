import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header/Header";
import AnnouncementBanner from "@/components/header/AnnouncementBanner";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";
import {
  ShieldCheck,
  Lock,
  FileText,
  AlertTriangle,
  Mail,
  MessageSquare,
  Search,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Package,
  Scale,
  UserCheck,
} from "lucide-react";
import { getPageSeoByPath } from "@/lib/content-db";

export async function generateMetadata(): Promise<Metadata> {
  const pageSeo = await getPageSeoByPath("/privacy");
  return {
    title: pageSeo?.title || pageSeo?.metaTitle || "Privacy Policy | TREQO: Digital Personal Data Protection",
    description:
      pageSeo?.metaDescription ||
      "How Treqo School of Modern Learning Pvt. Ltd. collects, processes, stores, and protects your personal data in compliance with the Digital Personal Data Protection Act (DPDPA), 2023.",
    ...(pageSeo?.metaKeywords && pageSeo.metaKeywords.length > 0 ? { keywords: pageSeo.metaKeywords } : {}),
  };
}

const sections = [
  { id: "s1", title: "1. Introduction & Scope" },
  { id: "s2", title: "2. Data Controller & Entity" },
  { id: "s3", title: "3. Personal Data Collected" },
  { id: "s4", title: "4. Purposes & Legal Bases" },
  { id: "s5", title: "5. Disclosure of Data" },
  { id: "s6", title: "6. Cross-Border Transfers" },
  { id: "s7", title: "7. Data Retention Schedule" },
  { id: "s8", title: "8. Security Measures" },
  { id: "s9", title: "9. Cookie Policy" },
  { id: "s10", title: "10. Your Rights (DPDPA 2023)" },
  { id: "s11", title: "11. Third-Party Links" },
  { id: "s12", title: "12. Children's Privacy" },
  { id: "s13", title: "13. Amendments & Contact" },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-3.5 w-3.5 text-[#0CA30C]" />
              Legal Document
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
              Privacy Policy
            </h1>

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-300/90 max-w-xl mx-auto">
              How Treqo School of Modern Learning collects, uses, and safeguards your personal data across our digital platforms, programs, and studio operations.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0CA30C]" />
                Treqo School of Modern Learning Pvt. Ltd.
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5A2A5A]" />
                Madhapur, Hyderabad, India
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3987E5]" />
                DPDPA 2023 Compliant
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
                Contents
              </span>
              <nav className="flex flex-col gap-1.5 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="text-slate-600 hover:text-[#012A22] hover:font-bold py-1 px-2 rounded-lg transition-colors hover:bg-[#F2F6F4] truncate"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Document Content Sections */}
            <div className="flex flex-col gap-8 max-w-3xl">
              {/* Section 1 */}
              <section id="s1" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 01
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Introduction and Scope
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                  <div className="pl-4 border-l-2 border-[#3B796A]/30">
                    <p className="font-bold text-xs text-[#012A22] mb-1">1.1</p>
                    <p>
                      This Privacy Policy (&ldquo;Policy&rdquo;) describes how Treqo School of Modern Learning Private Limited, operating under the trade name &ldquo;Treqo&rdquo; (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), collects, uses, stores, discloses, transfers, and protects your personal data in connection with your use of the Treqo Platform, on-campus studio programs in Madhapur, online flagship cohorts, and all related educational services.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-[#3B796A]/30">
                    <p className="font-bold text-xs text-[#012A22] mb-1">1.2. Compliance Framework</p>
                    <p>This Policy is issued in strict compliance with:</p>
                    <ul className="mt-2 space-y-1.5 list-disc pl-5 text-slate-700">
                      <li>Section 43A and Section 72A of the Information Technology Act, 2000;</li>
                      <li>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&ldquo;SPDI Rules&rdquo;);</li>
                      <li>The Digital Personal Data Protection Act, 2023 (&ldquo;DPDPA 2023&rdquo;) and rules framed thereunder; and</li>
                      <li>The Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules, 2020.</li>
                    </ul>
                  </div>

                  <div className="pl-4 border-l-2 border-[#3B796A]/30">
                    <p className="font-bold text-xs text-[#012A22] mb-1">1.3</p>
                    <p>
                      This Policy applies to all personal data processed by Treqo through our website (www.treqo.org), admissions portal, webinar registrations, offline studio admissions, capstone portfolios, and institutional campus partnerships.
                    </p>
                  </div>

                  <div className="pl-4 border-l-2 border-[#3B796A]/30">
                    <p className="font-bold text-xs text-[#012A22] mb-1">1.4. User Consent</p>
                    <p>
                      By using any Treqo Service or submitting your details through our admission or curriculum download forms, you signify your consent to the collection and processing of your personal data as outlined in this Policy. For individuals under eighteen (18) years of age, parental or guardian consent is mandatory.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="s2" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 02
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Data Controller
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  2.1. The data fiduciary and controller responsible for your personal data is:
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#0A0F24] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Field</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Entity Name</td>
                        <td className="py-3 px-4 text-slate-600">Treqo School of Modern Learning Private Limited</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-bold text-slate-900">Registered Office & Campus</td>
                        <td className="py-3 px-4 text-slate-600">Plot No. 286, 4th Floor, Road No 16, Ayyappa Society Main Rd, Madhapur, Hyderabad 500081, Telangana, India</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900">Data Privacy Email</td>
                        <td className="py-3 px-4"><a href="mailto:legal@treqo.org" className="text-[#012A22] font-bold hover:underline">legal@treqo.org</a></td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-bold text-slate-900">Admissions & Support</td>
                        <td className="py-3 px-4"><a href="mailto:admissions@treqo.org" className="text-[#012A22] font-bold hover:underline">admissions@treqo.org</a> / <a href="mailto:support@treqo.org" className="text-[#012A22] font-bold hover:underline">support@treqo.org</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 3 */}
              <section id="s3" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 03
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Categories of Personal Data Collected
                </h2>

                <div className="mt-5 space-y-6 text-sm leading-relaxed text-slate-600">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">3.1. Data Provided Directly by You</h3>
                    <ul className="space-y-2">
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F6F4] text-[10px] font-black text-[#012A22]">a</span>
                        <span><strong>Application & Lead Data:</strong> Full legal name, email address, WhatsApp/mobile telephone number, current career background, educational status, and target program selection.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F6F4] text-[10px] font-black text-[#012A22]">b</span>
                        <span><strong>Academic & Professional Data:</strong> Résumé, portfolio links, GitHub/Figma repositories, prior marketing experience, and capstone project submissions.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F6F4] text-[10px] font-black text-[#012A22]">c</span>
                        <span><strong>Financial & Invoicing Data:</strong> Billing address, GSTIN (for corporate/B2B invoicing), and payment confirmation tokens. Treqo does not store full credit card numbers, CVVs, or UPI PINs.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F6F4] text-[10px] font-black text-[#012A22]">d</span>
                        <span><strong>Communications:</strong> Notes, transcripts, and records of admissions advisory discussions, counseling calls, and mentor feedback sessions.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">3.2. Data Collected Automatically</h3>
                    <ul className="space-y-2">
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-700">a</span>
                        <span><strong>Technical Data:</strong> IP address, browser type, operating system, device identifiers, screen resolution, and network latency.</span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-700">b</span>
                        <span><strong>Usage & Interaction Data:</strong> Page visit flow, syllabus download events, video watch completion rate, and referral sources.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="s4" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 04
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Purposes and Legal Bases for Processing
                </h2>

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#0A0F24] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Purpose</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Data Used</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Legal Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Cohort Admissions & Counseling</td>
                        <td className="py-3 px-4 text-slate-600">Name, email, WhatsApp, profile</td>
                        <td className="py-3 px-4 text-slate-600">Contractual necessity / Consent</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">Curriculum & Resource Delivery</td>
                        <td className="py-3 px-4 text-slate-600">Email, WhatsApp number</td>
                        <td className="py-3 px-4 text-slate-600">Legitimate interest / Consent</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Tuition & Invoicing (GST Compliance)</td>
                        <td className="py-3 px-4 text-slate-600">Billing details, GSTIN, transaction ID</td>
                        <td className="py-3 px-4 text-slate-600">Legal obligation (GST Act, 2017)</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">Career Placement & Referrals</td>
                        <td className="py-3 px-4 text-slate-600">Portfolio, deliverables, capstone score</td>
                        <td className="py-3 px-4 text-slate-600">Explicit consent (per fellow)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Platform Security & Fraud Prevention</td>
                        <td className="py-3 px-4 text-slate-600">IP address, telemetry logs</td>
                        <td className="py-3 px-4 text-slate-600">Legitimate interest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 5 */}
              <section id="s5" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 05
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Disclosure of Personal Data
                </h2>

                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex gap-3 items-start text-xs sm:text-sm text-emerald-950">
                  <Lock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>No Data Brokerage:</strong> Treqo does not sell, rent, or trade your personal data to any third party for independent advertising or commercial purposes.
                  </p>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600">
                  <p>Personal data is disclosed only to verified service providers under binding data processing agreements:</p>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                    <li><strong>Cloud Infrastructure:</strong> Secure cloud database and server hosting within India.</li>
                    <li><strong>Communications Providers:</strong> WhatsApp Business API and email gateways for admissions notifications and curriculum dispatch.</li>
                    <li><strong>Hiring Partners (Placement Track):</strong> Fellow work samples and portfolio summaries are forwarded to recruiting agencies and companies solely upon the fellow&apos;s explicit request.</li>
                    <li><strong>Legal & Regulatory Authorities:</strong> Where mandated by court orders, lawful requests, or statutory obligations under Indian law.</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section id="s6" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 06
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Cross-Border Data Transfers
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  6.1. Treqo stores all student and applicant data primarily on servers located within India. In scenarios where auxiliary SaaS processing tools operate globally, transfers are conducted strictly under contractual safeguards that guarantee privacy standards equivalent to the Digital Personal Data Protection Act, 2023.
                </p>
              </section>

              {/* Section 7 */}
              <section id="s7" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 07
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Data Retention Schedule
                </h2>

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#0A0F24] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Data Category</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Retention Period</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Statutory Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Enrolled Fellow Records</td>
                        <td className="py-3 px-4 text-slate-600">Course duration + 3 years</td>
                        <td className="py-3 px-4 text-slate-600">Educational record & alumni services</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">Verified Credentials & Certs</td>
                        <td className="py-3 px-4 text-slate-600">Permanent / Indefinitely</td>
                        <td className="py-3 px-4 text-slate-600">Employer verification & proof</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Financial & Invoicing Invoices</td>
                        <td className="py-3 px-4 text-slate-600">7 years from invoice date</td>
                        <td className="py-3 px-4 text-slate-600">Section 36, CGST Act, 2017</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">Admissions Lead Inquiries</td>
                        <td className="py-3 px-4 text-slate-600">12 months from inquiry date</td>
                        <td className="py-3 px-4 text-slate-600">Consent & admissions cycle</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 8 */}
              <section id="s8" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 08
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Security Measures & Data Protection
                </h2>

                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                  <p>8.1. Treqo implements industry-standard organizational and technical security measures:</p>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                    <li>TLS 1.3 encryption across all public and internal web endpoints;</li>
                    <li>Restricted, role-based access control (RBAC) to student and applicant personal data;</li>
                    <li>Secure tokenized authentication without plaintext password storage;</li>
                    <li>Encrypted at-rest storage for all admission database tables; and</li>
                    <li>Regular security audits and continuous automated dependency vulnerability scanning.</li>
                  </ul>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex gap-3 items-start text-xs sm:text-sm text-amber-950">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>8.2 Incident Notification:</strong> In the unlikely event of a security breach affecting personal data, Treqo will notify affected individuals and the Data Protection Board of India within 72 hours as mandated by DPDPA 2023.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 9 */}
              <section id="s9" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 09
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Cookie Policy & Analytics
                </h2>

                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#0A0F24] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Cookie Type</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Purpose</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Essential / Core</td>
                        <td className="py-3 px-4 text-slate-600">Modal state, navigation, form session management</td>
                        <td className="py-3 px-4 text-slate-600">Session</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="py-3 px-4 font-semibold text-slate-900">Performance & Analytics</td>
                        <td className="py-3 px-4 text-slate-600">Aggregated user navigation trends (IP anonymized)</td>
                        <td className="py-3 px-4 text-slate-600">12 months</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900">Marketing & Pixels</td>
                        <td className="py-3 px-4 text-slate-600">Ad campaign attribution for admissions cohorts</td>
                        <td className="py-3 px-4 text-slate-600">90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 10 */}
              <section id="s10" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 10
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Your Rights as a Data Principal (DPDPA 2023)
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  10.1. As a data principal under Indian law, you have the following enforceable rights:
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <Search className="h-4 w-4" />
                      <span>Right to Access</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Request a summary of your personal data processed by Treqo and the identity of third-party processors.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Right to Correction</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Request correction of inaccurate or misleading personal data, or completion of incomplete records.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <Trash2 className="h-4 w-4" />
                      <span>Right to Erasure</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Request deletion of your data where continued retention is no longer necessary for admissions or legal compliance.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <RotateCcw className="h-4 w-4" />
                      <span>Right to Withdraw Consent</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Withdraw consent for admissions outreach or newsletters at any time via written request.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <Scale className="h-4 w-4" />
                      <span>Right to Grievance Redressal</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Submit grievances directly to Treqo&apos;s Grievance Officer, with escalation rights to the Data Protection Board of India.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-[#012A22] font-bold text-xs">
                      <UserCheck className="h-4 w-4" />
                      <span>Right to Nominate</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Nominate an individual to exercise data principal rights in the event of death or incapacity.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#3B796A]/30 bg-[#F2F6F4] p-4 text-xs sm:text-sm text-slate-700">
                  <p>
                    <strong>10.2 How to Exercise Your Rights:</strong> Email <a href="mailto:legal@treqo.org" className="text-[#012A22] font-bold underline">legal@treqo.org</a> with the subject line <em>&ldquo;Data Rights Request, [Your Name]&rdquo;</em>. We acknowledge requests within 3 working days and respond substantively within 15 working days.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="s11" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 11
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Third-Party Links
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  11.1. Our website may contain references or links to client brands, alumni startup portals, or partner tools. Treqo is not responsible for the privacy practices of external platforms, and users are encouraged to inspect third-party privacy notices independently.
                </p>
              </section>

              {/* Section 12 */}
              <section id="s12" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 12
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Children&apos;s Privacy
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  12.1. Treqo does not knowingly enroll or process personal data of individuals under thirteen (13) years of age. Applicants between 13 and 18 years must register with verified parental or guardian consent.
                </p>
              </section>

              {/* Section 13 */}
              <section id="s13" className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#012A22]">
                  Section 13
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                  Amendments and Contact Details
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  13.1. This Policy is effective as of September 2026 and may be updated periodically to reflect statutory updates or operational enhancements.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="mailto:legal@treqo.org"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A0F24] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#ABCAC2]" />
                    <span>legal@treqo.org</span>
                  </a>
                  <a
                    href="mailto:admissions@treqo.org"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F2F6F4] border border-[#012A22]/20 px-4 py-2.5 text-xs font-bold text-[#012A22] shadow-2xs hover:bg-[#F2F6F4]/60 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-[#012A22]" />
                    <span>admissions@treqo.org</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
