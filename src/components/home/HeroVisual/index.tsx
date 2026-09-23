"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { useApplyModal } from "@/context/ApplyModalContext";

export default function HeroVisual() {
  const { forms } = useApplyModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [position, setPosition] = useState("Student");
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

    const currentOriginPage = typeof window !== "undefined" ? window.location.pathname : "/";
    const currentOriginUrl = typeof window !== "undefined" ? window.location.href : "";

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          course: "New Age Digital Marketing",
          background: position,
          position,
          source: "Hero Direct Application",
          page: currentOriginPage,
          pageUrl: currentOriginUrl,
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
    <div id="apply" className="w-full max-w-md mx-auto lg:max-w-none scroll-mt-28">
      <div id="fees" className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg scroll-mt-28">
        {/* Optional Form Header */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            {forms?.heroFormTitle || "Fast Track Application"}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 font-medium">
            {forms?.heroFormSubtitle || "Live cohort starts soon · Limited seats"}
          </p>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12 animate-in fade-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {forms?.heroFormSuccessTitle || "Submitted"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              {forms?.heroFormSuccessMessage || "Thank you! Your details have been received successfully."}
            </p>
            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setPhone("+91 ");
                setPosition("Student");
                setSubmitted(false);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3B0D3B] px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#2B052B] active:scale-95 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 sm:p-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs sm:text-sm font-bold text-slate-800">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs sm:text-sm font-bold text-slate-800">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs sm:text-sm font-bold text-slate-800">
                WhatsApp number <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* Current position */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="position" className="text-xs sm:text-sm font-bold text-slate-800">
                Current position
              </label>
              <div className="relative">
                <select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Aspiring Business Founder">Aspiring Business Founder</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-xl bg-[#3B0D3B] py-3.5 px-4 text-center text-sm sm:text-base font-extrabold text-white shadow-xs transition-all hover:bg-[#2B052B] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0D3B] focus-visible:ring-offset-2 cursor-pointer"
            >
              {submitting ? "Sending..." : (forms?.heroFormButtonText || "Apply for Batch 2")}
            </button>

            {/* Footer Disclaimer */}
            <p className="text-xs leading-relaxed text-slate-500">
              No spam. One call from an advisor, and we&apos;ll tell you honestly if this isn&apos;t for you.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
