"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useApplyModal } from "@/context/ApplyModalContext";
import type { GeneralSettings } from "@/lib/content-db";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
  isApplyAction?: boolean;
}

const schoolLinks: FooterLink[] = [
  { label: "Method & Challenge", href: "/#method" },
  { label: "Why Treqo", href: "/#why-treqo" },
  { label: "Batch 1 Outcomes", href: "/#placements" },
  { label: "Mentors & Faculty", href: "/#tutors" },
  { label: "Verified Certifications", href: "/#certs" },
  { label: "Frequently Asked Questions", href: "/#faq" },
];

export default function Footer({ settings }: { settings?: GeneralSettings }) {
  const { openApplyModal } = useApplyModal();

  const phone = settings?.supportPhone || "+91 99480 00491";
  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/919948000491";
  const email = settings?.supportEmail || "admissions@treqo.org";
  const address = settings?.address || "Plot No. 286, 4th Floor, Road No 16, Ayyappa Society Main Rd, Madhapur, Telangana 500081";
  const copyright = settings?.copyrightText || "© 2026 Treqo School of Modern Learning Pvt. Ltd. All rights reserved.";
  const instagram = settings?.instagramUrl || "https://instagram.com/treqo.ed";

  const talkLinks: FooterLink[] = [
    { label: "Apply for Batch 2", href: "/#apply", isApplyAction: true },
    {
      label: "WhatsApp: +91 99480 00491",
      href: whatsappUrl,
      isExternal: true,
    },
    {
      label: "Visit Madhapur Campus",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      isExternal: true,
    },
    { label: email, href: `mailto:${email}`, isExternal: true },
    { label: phone, href: `tel:${phone.replace(/\s+/g, "")}`, isExternal: true },
  ];

  return (
    <footer className="bg-[#0B0B0F] text-slate-400 pt-10 sm:pt-16 lg:pt-20 pb-10 border-t border-[#5A2A5A]/30">
      <Container>
        {/* Mobile Version: Compact Layout without Courses */}
        <div className="md:hidden flex flex-col space-y-6">
          {/* Brand & Social Header */}
          <div>
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center">
                <span className="text-2xl font-black tracking-tight text-[#FDFAF6] leading-none">
                  TREQO
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Treqo on WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#0CA30C] hover:border-[#0CA30C] hover:bg-[#0CA30C]/10 transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Treqo on Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 hover:border-[#8C6A8C] hover:text-[#8C6A8C] transition-colors"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              The Marketing School.
            </p>

            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              Madhapur Studio Floor: Plot 286, Rd 16, Ayyappa Society, Hyderabad 500081
            </p>
          </div>

          {/* 2-Column Links Grid on Mobile: The School & Talk to Us */}
          <div className="grid grid-cols-2 gap-5 border-t border-white/10 pt-5">
            {/* The School Column */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C6A8C] block mb-2.5">
                THE SCHOOL
              </span>
              <ul className="flex flex-col gap-2 text-xs">
                {schoolLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors block leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Talk to Us Column */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C6A8C] block mb-2.5">
                TALK TO US
              </span>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => openApplyModal()}
                    className="text-left font-bold text-[#FAF5EE] hover:text-white hover:underline cursor-pointer leading-snug"
                  >
                    Apply for Batch 2 →
                  </button>
                </li>
                {talkLinks.slice(1).map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-slate-400 hover:text-white transition-colors block leading-snug"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors block leading-snug"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Version: 3-Column Balanced Layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Column 1: Brand & Contact Info */}
          <div className="flex flex-col items-start lg:col-span-6">
            <Link href="/" className="inline-flex items-center">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                TREQO
              </span>
            </Link>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 max-w-md">
              The Marketing School.
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Plot+No.+286,+4th+Floor,+Road+No+16,+Ayyappa+Society+Main+Rd,+Madhapur,+Telangana+500081"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-xs leading-relaxed text-slate-400 hover:text-white transition-colors max-w-md"
            >
              <span className="font-semibold text-slate-300">Campus Address:</span><br />
              Plot No. 286, 4th Floor, Road No 16, Ayyappa Society Main Rd, Madhapur, Telangana 500081
            </a>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8C6A8C]">
                CONNECT WITH US
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Treqo on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#0CA30C] hover:border-[#0CA30C] hover:bg-[#0CA30C]/10 hover:scale-110 active:scale-95 transition-all shadow-xs"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Treqo on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 hover:border-[#8C6A8C] hover:text-[#8C6A8C] hover:scale-110 active:scale-95 transition-all shadow-xs"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: The School */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8C6A8C]">
              THE SCHOOL
            </span>
            <ul className="flex flex-col gap-2.5 mt-1 text-xs sm:text-sm">
              {schoolLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Talk to Us / Admissions */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8C6A8C]">
              TALK TO US
            </span>
            <ul className="flex flex-col gap-2.5 mt-1 text-xs sm:text-sm">
              {talkLinks.map((link) => (
                <li key={link.label}>
                  {link.isApplyAction ? (
                    <button
                      type="button"
                      onClick={() => openApplyModal()}
                      className="text-left font-bold text-[#FAF5EE] hover:underline transition-colors cursor-pointer"
                    >
                      {link.label} →
                    </button>
                  ) : link.isExternal ? (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-8 md:mt-14 border-t border-slate-800/70 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>{copyright}</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/#hero" className="hover:text-slate-400 transition-colors">
              Back to top ↑
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
