"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Save, Upload, Sparkles, CheckCircle2, AlertCircle, Trash2, Plus } from "lucide-react";
import type { ExecutionProofContent } from "@/lib/content-db";

interface Props {
  initialData?: ExecutionProofContent;
  adminPin: string;
  onSaved: (updated: ExecutionProofContent) => void;
}

const defaultExecutionProof: ExecutionProofContent = {
  eyebrow: "BATCH 1 · ALREADY HAPPENED",
  title: "Four names. All checkable.",
  description: "One batch is a small sample and we won't dress it up as an industry statistic. What we will say: every outcome below is a person you can look up.",
  outcomes: [
    { tag: "FOUNDER", name: "Somu Shekar", description: "Never went job-hunting. Co-founded Gesture Co while still in the course.", photoUrl: "/uploads/alumni/somu-shekar.jpg" },
    { tag: "FOUNDER", name: "Subhani", description: "Turned his capstone into a company. Founded JASS Media.", photoUrl: "/uploads/alumni/subhani.jpg" },
    { tag: "PLACED IN 30 DAYS", name: "Dikshtha", description: "At Bristle Tech within a month of finishing.", photoUrl: "/uploads/alumni/dikshtha.jpg" },
    { tag: "HIRED ON PORTFOLIO", name: "Harshit", description: "Placed at TCS on the strength of the work, not the résumé.", photoUrl: "/uploads/alumni/harshit.jpg" },
  ],
  metrics: [
    { value: "100%", label: "of Batch 1 placed or founding" },
    { value: "₹5L+", label: "earned for a client, mid-course" },
  ],
  companies: [
    { name: "Gesture Co", logo: "/images/dark-gesture.png" },
    { name: "JASS Media", logo: "/images/dark-jass-media.png" },
    { name: "Bristle Tech", logo: "/images/dark-bristletech.png" },
  ],
  story: "That ₹5L came out of Gesture Co's Diwali campaign briefed, built, run and reported by students who hadn't graduated yet. Batch 2 gets measured against it.",
};

export default function AdminPlacementsTab({ initialData, adminPin, onSaved }: Props) {
  const [data, setData] = useState<ExecutionProofContent>(initialData || defaultExecutionProof);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingCompanyIdx, setUploadingCompanyIdx] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Synchronize state when initialData updates from parent
  useEffect(() => {
    if (initialData) {
      const fallbackCompanies = defaultExecutionProof.companies || [];
      const companies = (initialData.companies || fallbackCompanies).filter(
        (c) => c.name !== "TCS"
      );
      setData({
        ...defaultExecutionProof,
        ...initialData,
        companies,
        metrics:
          initialData.metrics && initialData.metrics.length > 0
            ? initialData.metrics
            : defaultExecutionProof.metrics,
      });
    }
  }, [initialData]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeStudentUploadIdx = useRef<number | null>(null);

  const companyFileInputRef = useRef<HTMLInputElement | null>(null);
  const activeCompanyUploadIdx = useRef<number | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const getRes = await fetch("/api/admin/content", {
        headers: { "x-admin-pin": adminPin },
      });
      const current = await getRes.json();
      const updatedHome = {
        ...(current.homeContent || {}),
        executionProof: data,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "home", data: updatedHome }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Batch 1 Placements section saved successfully to live website!" });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save placements section." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving placements section." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function updateOutcome(index: number, field: "tag" | "name" | "description" | "photoUrl", val: string) {
    const next = [...(data.outcomes || defaultExecutionProof.outcomes)];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, outcomes: next });
  }

  function updateMetric(index: number, field: "value" | "label", val: string) {
    const next = [...(data.metrics || defaultExecutionProof.metrics || [])];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, metrics: next });
  }

  function updateCompany(index: number, field: "name" | "logo", val: string) {
    const next = [...(data.companies || defaultExecutionProof.companies || [])];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, companies: next });
  }

  function isImage(file: File) {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) return true;
    return /\.(png|jpe?g|webp|svg|gif|avif|ico)$/i.test(file.name);
  }

  async function handleImageFile(file: File, index: number) {
    if (!isImage(file)) {
      setStatusMsg({ type: "error", text: "Please upload a valid image file (PNG, JPG, WEBP, SVG)." });
      return;
    }
    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "alumni");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": adminPin },
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        updateOutcome(index, "photoUrl", resData.url);
        setStatusMsg({ type: "success", text: "Passport photo uploaded!" });
      } else {
        setStatusMsg({ type: "error", text: resData.error || "Upload failed." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error during upload." });
    } finally {
      setUploadingIndex(null);
    }
  }

  async function handleCompanyLogoFile(file: File, index: number) {
    if (!isImage(file)) {
      setStatusMsg({ type: "error", text: "Please upload a valid image file (PNG, JPG, WEBP, SVG)." });
      return;
    }
    setUploadingCompanyIdx(index);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "companies");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": adminPin },
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        updateCompany(index, "logo", resData.url);
        setStatusMsg({ type: "success", text: "Company logo uploaded!" });
      } else {
        setStatusMsg({ type: "error", text: resData.error || "Upload failed." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error during logo upload." });
    } finally {
      setUploadingCompanyIdx(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && activeStudentUploadIdx.current !== null) {
            handleImageFile(f, activeStudentUploadIdx.current);
          }
          e.target.value = "";
        }}
      />
      <input
        type="file"
        ref={companyFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && activeCompanyUploadIdx.current !== null) {
            handleCompanyLogoFile(f, activeCompanyUploadIdx.current);
          }
          e.target.value = "";
        }}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-2">
            Homepage Section
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Batch 1 Placements &amp; Alumni Proof
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A5A]">
            Edit the 4 student outcome profiles, their passport photos, outcome metrics, and company partner badges.
          </p>
        </div>

        {statusMsg && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {statusMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Header & Title Block */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#3B0D3B]" />
            <span>Section Header &amp; Subtitle</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Eyebrow Tag</label>
              <input
                type="text"
                value={data.eyebrow || ""}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="BATCH 1 · ALREADY HAPPENED"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Main Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Four names. All checkable."
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B0B0F]">Subtitle Description</label>
            <textarea
              rows={2}
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="One batch is a small sample..."
              className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#5A4A5A] focus:border-[#3B0D3B] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 2. Four Student Outcome Cards */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B0D3B]" />
              <span>The 4 Student Outcome Profiles</span>
            </h3>
            <span className="text-[10px] text-[#8C6A8C] font-medium">Passport Photo Ratio (3.5 : 4.5)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(data.outcomes || defaultExecutionProof.outcomes).map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-4 flex flex-col justify-between space-y-3">
                <div>
                  {/* Passport Photo Frame & Uploader */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-[#3B0D3B]/10">
                    <div className="relative w-24 aspect-[3.5/4.5] overflow-hidden rounded-lg border border-[#3B0D3B]/10 bg-[#FDFAF6] shadow-inner mb-2.5">
                      {item.photoUrl ? (
                        <Image
                          src={item.photoUrl}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="100px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 bg-[#FAF5EE] text-center">
                          <span className="text-[8px] font-bold text-[#8C6A8C] uppercase leading-tight">
                            Passport Photo
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={uploadingIndex === idx}
                      onClick={() => {
                        activeStudentUploadIdx.current = idx;
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3B0D3B] hover:text-[#2A082A] bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{uploadingIndex === idx ? "Uploading..." : "Upload Photo"}</span>
                    </button>
                  </div>

                  {/* Tag, Name, Description */}
                  <div className="mt-3 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider">Badge Tag</label>
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => updateOutcome(idx, "tag", e.target.value)}
                        placeholder="FOUNDER"
                        className="mt-0.5 w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-xs text-[#3B0D3B] font-black focus:outline-none focus:border-[#3B0D3B]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider">Candidate Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateOutcome(idx, "name", e.target.value)}
                        placeholder="Candidate Name"
                        className="mt-0.5 w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-xs text-[#0B0B0F] font-bold focus:outline-none focus:border-[#3B0D3B]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider">Description</label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => updateOutcome(idx, "description", e.target.value)}
                        placeholder="Outcome description..."
                        className="mt-0.5 w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-[11px] text-[#5A4A5A] focus:outline-none focus:border-[#3B0D3B] resize-none leading-snug"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Placement Metrics & Companies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Key Metrics */}
          <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Batch 1 Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {(data.metrics || defaultExecutionProof.metrics || []).map((m, idx) => (
                <div key={idx} className="rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-3 space-y-2">
                  <label className="text-[10px] font-bold text-[#8C6A8C]">Metric #{idx + 1}</label>
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(idx, "value", e.target.value)}
                    placeholder="100%"
                    className="w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-base font-black text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                  />
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(idx, "label", e.target.value)}
                    placeholder="of Batch 1 placed or founding"
                    className="w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-[11px] text-[#5A4A5A] focus:outline-none focus:border-[#3B0D3B]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Companies */}
          <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Where Batch 1 Went (Companies)</h3>
            <div className="grid grid-cols-2 gap-3">
              {(data.companies || defaultExecutionProof.companies || []).map((c, idx) => (
                <div key={idx} className="rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-3 space-y-2">
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCompany(idx, "name", e.target.value)}
                    placeholder="Company Name"
                    className="w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-xs text-[#0B0B0F] font-bold focus:outline-none focus:border-[#3B0D3B]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={c.logo}
                      onChange={(e) => updateCompany(idx, "logo", e.target.value)}
                      placeholder="/images/logo.png"
                      className="w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-[10px] text-[#5A4A5A] focus:outline-none focus:border-[#3B0D3B]"
                    />
                    <button
                      type="button"
                      disabled={uploadingCompanyIdx === idx}
                      onClick={() => {
                        activeCompanyUploadIdx.current = idx;
                        companyFileInputRef.current?.click();
                      }}
                      className="p-1 rounded bg-[#3B0D3B]/10 hover:bg-[#3B0D3B]/20 text-[#3B0D3B] cursor-pointer"
                      title="Upload Logo"
                    >
                      <Upload className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Text Box */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-5 space-y-2 shadow-xs">
          <label className="text-xs font-bold text-[#0B0B0F] uppercase tracking-wider">Diwali Campaign Story Text</label>
          <textarea
            rows={2}
            value={data.story || ""}
            onChange={(e) => setData({ ...data, story: e.target.value })}
            placeholder="That ₹5L came out of Gesture Co's Diwali campaign..."
            className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#5A4A5A] focus:border-[#3B0D3B] focus:outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Placements & Outcomes Section"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
