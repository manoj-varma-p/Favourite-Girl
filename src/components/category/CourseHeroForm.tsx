"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
} from "lucide-react";

interface CourseHeroFormProps {
  courseTitle: string;
  isLocked?: boolean;
}

export default function CourseHeroForm({
  courseTitle,
  isLocked = false,
}: CourseHeroFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 7) {
      setError("Please enter your complete WhatsApp number (at least 10 digits).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          course: courseTitle,
          background: "Applicant",
          source: "Course Hero Right Form",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your details and try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto lg:max-w-none">
      <div className="relative overflow-hidden rounded-3xl border border-[#E8DEC8] bg-white shadow-2xl shadow-[#3B0D3B]/10 transition-all">
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3B0D3B] via-[#C084FC] to-[#3B0D3B]" />

        {/* Card Header with Brand Styling */}
        <div className="relative overflow-hidden bg-[#3B0D3B] px-6 py-6 sm:px-7 sm:py-6 text-white">
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#C084FC]/25 blur-2xl"
          />

          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FDFAF6]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {isLocked ? "Waitlist Open" : "Fast-Track Application"}
            </span>
            <span className="text-[11px] font-medium text-white/70">
              {isLocked ? "Upcoming Track" : "Batch 2 Enrolling"}
            </span>
          </div>

          <h3 className="relative z-10 mt-3 text-xl sm:text-2xl font-black tracking-tight text-white">
            {isLocked ? "Join Priority Waitlist" : "Talk to an Admissions Advisor"}
          </h3>
          <p className="relative z-10 mt-1 text-xs sm:text-sm text-white/80 leading-relaxed">
            {isLocked
              ? "Get notified first when admissions open for this track."
              : "Get syllabus breakdown, scholarship check & 1-on-1 career review."}
          </p>
        </div>

        {/* Card Body */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center sm:p-10 animate-in fade-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-[#1A0A1A]">
              Application Received!
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-[#5A4A5A] max-w-xs leading-relaxed">
              Thank you, <span className="font-bold text-[#1A0A1A]">{name}</span>. An admissions mentor will reach out to you on WhatsApp within 2 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setPhone("+91 ");
                setSubmitted(false);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#3B0D3B] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#5A2A5A] active:scale-95 transition-all cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 p-6 sm:p-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hero-name" className="text-xs font-bold text-[#1A0A1A]">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A8C]" />
                <input
                  id="hero-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-[#E2D8CC] bg-[#FDFAF6]/60 pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A0A1A] placeholder:text-[#9C8A9C] focus:border-[#3B0D3B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B0D3B]/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hero-email" className="text-xs font-bold text-[#1A0A1A]">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A8C]" />
                <input
                  id="hero-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-[#E2D8CC] bg-[#FDFAF6]/60 pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A0A1A] placeholder:text-[#9C8A9C] focus:border-[#3B0D3B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B0D3B]/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hero-phone" className="text-xs font-bold text-[#1A0A1A]">
                WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A8C]" />
                <input
                  id="hero-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-[#E2D8CC] bg-[#FDFAF6]/60 pl-10 pr-4 py-2.5 sm:py-3 text-sm text-[#1A0A1A] placeholder:text-[#9C8A9C] focus:border-[#3B0D3B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3B0D3B]/10 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 group relative inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#3B0D3B] py-3.5 px-6 text-center text-sm sm:text-base font-bold text-white shadow-lg shadow-[#3B0D3B]/25 hover:bg-[#4E104E] hover:shadow-xl hover:shadow-[#3B0D3B]/35 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{submitting ? "Processing Application..." : isLocked ? "Join Priority Waitlist" : "Apply for Batch 2"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
