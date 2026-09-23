"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X, CheckCircle2, ChevronDown, ArrowRight } from "lucide-react";
import { useApplyModal } from "@/context/ApplyModalContext";

export default function ApplyModal() {
  const { isOpen, courseName, closeApplyModal, forms } = useApplyModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [selectedCourse, setSelectedCourse] = useState(courseName);
  const [background, setBackground] = useState("Student");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prevCourseName, setPrevCourseName] = useState(courseName);
  if (courseName !== prevCourseName) {
    setPrevCourseName(courseName);
    if (courseName) {
      setSelectedCourse(courseName);
    }
  }

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setSubmitted(false);
      setError(null);
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeApplyModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeApplyModal]);

  if (!isOpen) return null;

  const isBookDemo = courseName === "Book a Demo";

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
    const appliedCourse = isBookDemo
      ? `${selectedCourse || courseName || "New Age Digital Marketing"} (Live Demo)`
      : (selectedCourse || courseName || "New Age Digital Marketing");

    setSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          course: appliedCourse,
          background,
          source: isBookDemo ? "Book a Demo Pop-up" : "Apply for Batch 2 Modal",
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

  function handleReset() {
    setName("");
    setEmail("");
    setPhone("+91 ");
    setError(null);
    setSubmitted(false);
    closeApplyModal();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim & Blur Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeApplyModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* Top Header */}
        <div className="relative bg-[#3B0D3B] px-6 py-6 sm:px-8 sm:py-7 text-white">
          <button
            type="button"
            onClick={closeApplyModal}
            aria-label="Close modal"
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <h2 id="apply-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white pr-10">
            {isBookDemo
              ? "Book a Live Demo"
              : (forms?.applyModalTitle || "Apply for Batch 2")}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#FDFAF6]/85">
            {isBookDemo
              ? "Experience live campaign dashboards, real client teardowns, and curriculum overview."
              : (forms?.applyModalSubtitle || "Leave with work you can show in an interview, not a certificate.")}
          </p>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12 animate-in fade-in duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#0CA30C] mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
              {forms?.applyModalSuccessTitle || "Submitted"}
            </h3>

            <p className="mt-2 text-sm text-slate-600 max-w-xs">
              {forms?.applyModalSuccessMessage || "Thank you! Your details have been received successfully."}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3B0D3B] px-8 py-3 text-sm font-bold text-[#FDFAF6] shadow-md hover:bg-[#5A2A5A] active:scale-98 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 sm:p-8">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-fullName" className="text-xs sm:text-sm font-bold text-slate-800">
                Full name <span className="text-rose-500">*</span>
              </label>
              <input
                id="modal-fullName"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-email" className="text-xs sm:text-sm font-bold text-slate-800">
                Email address <span className="text-rose-500">*</span>
              </label>
              <input
                id="modal-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-phone" className="text-xs sm:text-sm font-bold text-slate-800">
                WhatsApp number <span className="text-rose-500">*</span>
              </label>
              <input
                id="modal-phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all"
              />
            </div>

            {/* Program of application (Dedicated to the specific page's course) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                Program
              </label>
              <div className="flex items-center justify-between rounded-xl border border-[#5A2A5A]/20 bg-[#FAF5EE] px-4 py-3 shadow-2xs">
                <span className="text-sm font-bold text-[#3B0D3B]">
                  {selectedCourse || "New Age Digital Marketing"}
                </span>
                <span className="rounded-md bg-[#3B0D3B] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FDFAF6]">
                  Batch 2
                </span>
              </div>
              <input type="hidden" name="course" value={selectedCourse || "New Age Digital Marketing"} />
            </div>

            {/* Current Position */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-background" className="text-xs sm:text-sm font-bold text-slate-800">
                Current position
              </label>
              <div className="relative">
                <select
                  id="modal-background"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 focus:border-[#3B0D3B] focus:outline-none focus:ring-2 focus:ring-[#3B0D3B]/20 transition-all cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Business Holder">Business Founder</option>
                  <option value="Working Professional">Working Professional</option>
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
              className="mt-2 w-full rounded-xl bg-[#3B0D3B] py-3.5 px-4 text-center text-sm sm:text-base font-bold text-[#FDFAF6] shadow-md hover:bg-[#5A2A5A] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0D3B] focus-visible:ring-offset-2 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>{isBookDemo ? "Booking your demo..." : "Submitting application..."}</span>
              ) : (
                <>
                  <span>
                    {isBookDemo
                      ? "Confirm Demo Booking"
                      : (forms?.applyModalButtonText || "Submit Application")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Disclaimer */}
            <p className="text-[11px] leading-relaxed text-slate-500 text-center">
              No spam. 20-minute admissions discussion only. We&apos;ll be honest if the program isn&apos;t a fit.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
