"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  ExternalLink,
  Plus,
  Check,
  Clock,
  Sparkles,
  Layers,
  Award,
  DollarSign,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trophy,
} from "lucide-react";
import type { CourseItem, CoursePhasesData, CourseChallenge } from "@/lib/content-db";
import type { CoursePhaseGroup } from "@/types/home";

interface Props {
  course: CourseItem;
  allCourses: CourseItem[];
  adminPin: string;
  onBack: () => void;
  onSelectCourse: (course: CourseItem) => void;
  onSaved: (updatedList: CourseItem[], savedCourse: CourseItem) => void;
}

export default function AdminCourseEditor({
  course: initialCourse,
  allCourses,
  adminPin,
  onBack,
  onSelectCourse,
  onSaved,
}: Props) {
  const [course, setCourse] = useState<CourseItem>(initialCourse);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Upload image states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Active section inside the editor studio
  const [activeStudioTab, setActiveStudioTab] = useState<
    "hero" | "pricing" | "curriculum" | "challenge" | "audience"
  >("hero");

  // Handle image upload
  async function handleImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatusMsg({ type: "error", text: "Please select a valid image file (PNG, JPG, WEBP)." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatusMsg({ type: "error", text: "Image size exceeds 10MB limit." });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "courses");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": adminPin },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCourse((prev) => ({ ...prev, image: data.url }));
        setStatusMsg({ type: "success", text: "Cover image uploaded successfully!" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to upload image." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while uploading cover photo." });
    } finally {
      setIsUploadingImage(false);
      setIsDragActive(false);
    }
  }

  // Save course to DB
  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const updatedList = allCourses.map((c) => (c.id === course.id ? course : c));
      // If course is new and not in list yet, append it
      if (!allCourses.some((c) => c.id === course.id)) {
        updatedList.push(course);
      }

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "courses", data: updatedList }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: `"${course.title}" saved successfully!` });
        onSaved(updatedList, course);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save course changes." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error while saving course." });
    } finally {
      setIsSaving(false);
    }
  }

  // Helper to toggle lock state
  function toggleLockState() {
    setCourse((prev) => {
      const nextLocked = !prev.isLocked;
      return {
        ...prev,
        isLocked: nextLocked,
        actionText: nextLocked ? "Get notified →" : "View course →",
        badge: nextLocked ? "COMING SOON" : (prev.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (prev.badge || "BATCH 2 · OPEN")),
        badgeVariant: nextLocked ? "gray" : (prev.badgeVariant === "gray" ? "blue" : (prev.badgeVariant || "blue")),
        applyCta: nextLocked ? "Notify Me When Open" : (prev.applyCta === "Notify Me When Open" ? "Apply for Batch 2" : (prev.applyCta || "Apply for Batch 2")),
        href: prev.href || `/categories/${prev.id}`,
        actionHref: prev.actionHref || prev.href || `/categories/${prev.id}`,
      };
    });
  }

  // Phases helpers
  const phasesData: CoursePhasesData = course.phases || {
    heading: "The 12 phases",
    intro:
      "Foundations, customer insights, funnels, discovery, execution, brand, media, social, growth, revenue, automation, and leadership, in that order.",
    groups: [
      {
        eyebrow: "PHASE 01",
        heading: "MARKETING FOUNDATIONS",
        range: "01",
        lessons: ["Understand what marketing actually is, before touching a tool, ad or campaign."],
      },
      {
        eyebrow: "PHASE 02",
        heading: "CUSTOMER + MARKET UNDERSTANDING",
        range: "02",
        lessons: ["Learn how customers think, what they want, and what makes them choose one brand over another."],
      },
      {
        eyebrow: "PHASE 03",
        heading: "FUNNELS + METRICS",
        range: "03",
        lessons: ["Understand how people move from attention to purchase, and where businesses lose them."],
      },
    ],
  };

  function updatePhaseGroup(index: number, updated: Partial<CoursePhaseGroup>) {
    const newGroups = [...phasesData.groups];
    newGroups[index] = { ...newGroups[index], ...updated };
    setCourse({
      ...course,
      phases: { ...phasesData, groups: newGroups },
    });
  }

  function addPhaseGroup() {
    const count = phasesData.groups.length + 1;
    const pad = count < 10 ? `0${count}` : `${count}`;
    const newGroup: CoursePhaseGroup = {
      eyebrow: `PHASE ${pad}`,
      heading: `NEW SYLLABUS MODULE ${count}`,
      range: pad,
      lessons: ["Hands-on client sprint, campaign deliverables, and tactical teardowns."],
    };
    setCourse({
      ...course,
      phases: { ...phasesData, groups: [...phasesData.groups, newGroup] },
    });
  }

  function removePhaseGroup(index: number) {
    const newGroups = phasesData.groups.filter((_, i) => i !== index);
    setCourse({
      ...course,
      phases: { ...phasesData, groups: newGroups },
    });
  }

  // Challenge helpers
  const challengeData: CourseChallenge = course.challenge || {
    title: "The CEO Challenge",
    prompt:
      "You are handed a brand with declining CAC and severe customer churn. Defend your recovery plan in front of a live panel of founders and growth leaders.",
    deliverables: [
      "Full funnel diagnostic & conversion dropoff teardown",
      "Paid acquisition & creative experimentation blueprint",
      "Live P&L defense & unit economics forecast",
    ],
  };

  // Audience helper
  const audiencePoints = course.overview
    ? course.overview.split("\n").filter(Boolean)
    : [
        "Graduates and early-career marketers who want practical proof, not just a theoretical certificate",
        "Working professionals switching to modern growth & performance marketing",
        "Founders and builders scaling their own direct-to-consumer and B2B ventures",
      ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e111a] border border-slate-800/80 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Courses</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Quick Course Switcher Dropdown */}
          <div className="relative">
            <select
              value={course.id}
              onChange={(e) => {
                const target = allCourses.find((c) => c.id === e.target.value);
                if (target) onSelectCourse(target);
              }}
              className="appearance-none rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white focus:border-[#012A22] focus:outline-none cursor-pointer pr-8"
            >
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} {c.isLocked ? "(Locked)" : ""}
                </option>
              ))}
            </select>
          </div>

          <Link
            href={course.href || `/categories/${course.id}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-[#ABCAC2] hover:text-[#ABCAC2] font-semibold transition-colors"
          >
            <span>Public Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Lock State Toggle & Save Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleLockState}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              course.isLocked
                ? "bg-red-950/80 text-red-200 border border-red-500/40 hover:bg-red-900"
                : "bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-900"
            }`}
          >
            {course.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            <span>{course.isLocked ? "Enrollment Locked" : "Enrollment Open"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Course Changes"}</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusMsg && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-xs font-semibold ${
            statusMsg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-500/30 text-emerald-200"
              : "bg-red-950/70 border border-red-500/30 text-red-200"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Editor Sub-Navigation Tabs (Matching course page sections) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "hero", label: "1. Hero Banner & Media", icon: Sparkles },
          { id: "pricing", label: "2. Tuition & EMI Plans", icon: DollarSign },
          { id: "curriculum", label: "3. Curriculum & Phases", icon: Layers },
          { id: "challenge", label: "4. CEO Challenge", icon: Trophy },
          { id: "audience", label: "5. Target Audience", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStudioTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveStudioTab(tab.id as typeof activeStudioTab)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#012A22] text-white shadow-md"
                  : "text-slate-400 hover:text-white bg-[#0e111a] border border-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HERO BANNER & MEDIA (EXACT FRONTEND BLOCKS)        */}
      {/* ========================================================= */}
      {activeStudioTab === "hero" && (
        <div className="space-y-6">
          {/* Live Interactive Hero Canvas (Exact Visual of category/[slug]) */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xl text-slate-950">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Editable Headlines, Badges, CTAs */}
              <div className="lg:col-span-7 space-y-4">
                {/* Cohort Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Badge:</span>
                    <input
                      type="text"
                      value={course.badge}
                      onChange={(e) => setCourse({ ...course, badge: e.target.value })}
                      placeholder="BATCH 2 · OPEN"
                      className="rounded-lg bg-[#012A22] px-3 py-1 text-[11px] font-bold text-white uppercase focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase px-1.5">Batch:</span>
                    <input
                      type="text"
                      value={course.batch || ""}
                      onChange={(e) => setCourse({ ...course, batch: e.target.value })}
                      placeholder="Batch 2 · Sep 2026"
                      className="rounded-lg bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(course.isFlagship)}
                      onChange={(e) => setCourse({ ...course, isFlagship: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-[10px] font-black uppercase text-amber-800">Flagship</span>
                  </label>
                </div>

                {/* Course Title */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Course Title:
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder="New Age Digital Marketing"
                    className="w-full text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 border-b border-slate-200 focus:border-[#012A22] focus:outline-none py-1 bg-transparent"
                  />
                </div>

                {/* Course Summary Description */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Course Summary &amp; Argument:
                  </label>
                  <textarea
                    rows={3}
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    placeholder="Four months, online. 12 phases in a fixed order, 30+ real brand projects..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-700 leading-relaxed focus:bg-white focus:border-[#012A22] focus:outline-none transition-colors"
                  />
                </div>

                {/* Duration / Format Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Duration &amp; Format:
                    </label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value, meta: e.target.value })}
                      placeholder="4 months · Online"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Course URL Slug:
                    </label>
                    <input
                      type="text"
                      value={course.href}
                      onChange={(e) => setCourse({ ...course, href: e.target.value })}
                      placeholder="/categories/digital-marketing"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                {/* CTAs Editing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Primary Apply Button:
                    </label>
                    <input
                      type="text"
                      value={course.applyCta || ""}
                      onChange={(e) => setCourse({ ...course, applyCta: e.target.value })}
                      placeholder="Apply for Batch 2"
                      className="mt-1 w-full rounded-xl border border-[#3B796A]/30 bg-[#F2F6F4] px-3 py-2 text-xs font-bold text-[#012A22] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Syllabus Button &amp; PDF:
                    </label>
                    <input
                      type="text"
                      value={course.curriculumPdf || ""}
                      onChange={(e) => setCourse({ ...course, curriculumPdf: e.target.value })}
                      placeholder="/treqo-curriculum.pdf"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase Card with Image Upload */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Program Visual Card (16:9 / 4:3)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[10px] font-bold text-[#012A22] hover:underline cursor-pointer"
                  >
                    {showManualUrl ? "Switch to File Upload" : "Enter Image URL"}
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />

                {showManualUrl ? (
                  <div>
                    <input
                      type="url"
                      value={course.image || ""}
                      onChange={(e) => setCourse({ ...course, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                ) : (
                  /* Drag & Drop Visual Card */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className={`relative overflow-hidden rounded-2xl border-2 transition-all group ${
                      isDragActive
                        ? "border-[#012A22] bg-[#F2F6F4] shadow-xl"
                        : "border-slate-200 bg-slate-900"
                    }`}
                  >
                    {course.image ? (
                      <div className="relative aspect-[16/10] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Top Replace / Remove Pill */}
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="h-7 px-2.5 rounded-lg bg-black/70 hover:bg-[#012A22] text-white border border-white/20 text-[11px] font-bold backdrop-blur-md shadow-md flex items-center gap-1 cursor-pointer"
                          >
                            {isUploadingImage ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourse({ ...course, image: "" })}
                            className="h-7 w-7 rounded-lg bg-black/70 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <input
                            type="text"
                            value={course.previewLabel || ""}
                            onChange={(e) => setCourse({ ...course, previewLabel: e.target.value })}
                            placeholder="CLASSROOM · CEO CHALLENGE REVIEW"
                            className="w-full rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 focus:outline-none focus:bg-black/80"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[16/10] w-full flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#012A22] hover:bg-[#F2F6F4] transition-all"
                      >
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="h-6 w-6 text-[#012A22] animate-spin" />
                            <span className="text-xs font-bold text-slate-800">Uploading cover image...</span>
                          </div>
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-xl bg-[#ABCAC2]/20 flex items-center justify-center text-[#012A22] mb-2">
                              <Upload className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">Upload Course Cover Image</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">Click or drag &amp; drop PNG, JPG</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Tag Input if not in photo */}
                {!course.image && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Preview Label:
                    </label>
                    <input
                      type="text"
                      value={course.previewLabel || ""}
                      onChange={(e) => setCourse({ ...course, previewLabel: e.target.value })}
                      placeholder="CLASSROOM · CEO CHALLENGE REVIEW"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TUITION & EMI PLANS                                */}
      {/* ========================================================= */}
      {activeStudioTab === "pricing" && (
        <div className="rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Course Tuition &amp; EMI Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set the full upfront tuition fee, no-cost monthly EMI options, and admission notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <label className="text-xs font-bold text-slate-300">Total Course Fee</label>
              <input
                type="text"
                value={course.feeTotal || ""}
                onChange={(e) => setCourse({ ...course, feeTotal: e.target.value })}
                placeholder="e.g. ₹55,000"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-emerald-400 focus:border-[#012A22] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">Displayed in payment plans and sidebar.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <label className="text-xs font-bold text-slate-300">Monthly EMI Plan</label>
              <input
                type="text"
                value={course.feeEmi || ""}
                onChange={(e) => setCourse({ ...course, feeEmi: e.target.value })}
                placeholder="e.g. ₹4,583 / month"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-[#ABCAC2] focus:border-[#012A22] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">Zero-cost financing breakdown.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <label className="text-xs font-bold text-slate-300">Cohort Batch Title</label>
              <input
                type="text"
                value={course.batch || ""}
                onChange={(e) => setCourse({ ...course, batch: e.target.value })}
                placeholder="e.g. Batch 2 · Sep 2026"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-bold text-white focus:border-[#012A22] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">Shown in sidebar and badges.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CURRICULUM & PHASES STUDIO (PhaseAccordion)        */}
      {/* ========================================================= */}
      {activeStudioTab === "curriculum" && (
        <div className="rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Curriculum &amp; Structured Phases</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage the structured execution phases shown on the public course page.
              </p>
            </div>
            <button
              type="button"
              onClick={addPhaseGroup}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Phase Module</span>
            </button>
          </div>

          {/* Section Heading & Argument */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300">Section Title</label>
              <input
                type="text"
                value={phasesData.heading || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    phases: { ...phasesData, heading: e.target.value },
                  })
                }
                placeholder="The 12 phases"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300">Curriculum Intro</label>
              <input
                type="text"
                value={phasesData.intro || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    phases: { ...phasesData, intro: e.target.value },
                  })
                }
                placeholder="The order is the curriculum. Foundations through leadership..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Phase Cards List */}
          <div className="space-y-4">
            {phasesData.groups.map((group, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={group.eyebrow}
                      onChange={(e) => updatePhaseGroup(idx, { eyebrow: e.target.value })}
                      placeholder="PHASE 01"
                      className="rounded-lg bg-[#012A22]/80 border border-[#3B796A]/40 px-2.5 py-1 text-[10px] font-bold text-[#ABCAC2] uppercase focus:outline-none w-28"
                    />
                    <span className="text-xs text-slate-400 font-bold">Module #{idx + 1}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePhaseGroup(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                    title="Remove Module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Module Title:
                  </label>
                  <input
                    type="text"
                    value={group.heading}
                    onChange={(e) => updatePhaseGroup(idx, { heading: e.target.value })}
                    placeholder="e.g. MARKETING FOUNDATIONS &amp; POSITIONING"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lessons &amp; Real Deliverables (Comma or newline separated):
                  </label>
                  <textarea
                    rows={2}
                    value={group.lessons.join("\n")}
                    onChange={(e) =>
                      updatePhaseGroup(idx, {
                        lessons: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Understand customer logic, customer funnels, brand audit..."
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CEO CHALLENGE STUDIO                               */}
      {/* ========================================================= */}
      {activeStudioTab === "challenge" && (
        <div className="rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">The CEO Challenge (Capstone Sprint)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every student defends their plan to a panel of founders. Configure the challenge prompt.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300">Challenge Title</label>
              <input
                type="text"
                value={challengeData.title || "The CEO Challenge"}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    challenge: { ...challengeData, title: e.target.value },
                  })
                }
                placeholder="The CEO Challenge"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Problem Statement / Prompt</label>
              <textarea
                rows={4}
                value={challengeData.prompt || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    challenge: { ...challengeData, prompt: e.target.value },
                  })
                }
                placeholder="You are handed a brand with declining CAC and customer churn. Defend your recovery plan in front of a live panel..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3.5 text-xs text-slate-200 leading-relaxed focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Deliverables Expected (One per line)</label>
              <textarea
                rows={3}
                value={(challengeData.deliverables || []).join("\n")}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    challenge: {
                      ...challengeData,
                      deliverables: e.target.value.split("\n").filter(Boolean),
                    },
                  })
                }
                placeholder="Full funnel diagnostic&#10;Paid ad creative experimentation&#10;Live unit economics defense"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-200 leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TARGET AUDIENCE (Who this is for)                   */}
      {/* ========================================================= */}
      {activeStudioTab === "audience" && (
        <div className="rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Target Audience &amp; Candidate Profiles</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Who is this curriculum track specifically engineered for? (Shown under Overview).
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300">Who This Program Is Built For (Bullet points, one per line)</label>
              <textarea
                rows={6}
                value={audiencePoints.join("\n")}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: e.target.value,
                  })
                }
                placeholder="Graduates looking for real execution proof&#10;Career switchers needing verifiable skills&#10;Founders managing their own marketing spend"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-xs text-slate-200 leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between p-4 rounded-2xl bg-[#0e111a]/95 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 truncate">
            Editing: <span className="text-white">{course.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-lg cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Course Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
