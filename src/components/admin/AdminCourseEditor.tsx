"use client";

import { useState, useRef, useEffect } from "react";
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
  Search,
  Tag,
  Globe,
  Compass,
} from "lucide-react";
import type {
  CourseItem,
  CoursePhasesData,
  CourseChallenge,
  CourseCareerRoleItem,
  CourseProofData,
  CourseFaqItem,
} from "@/lib/content-db";
import type { CoursePhaseGroup } from "@/types/home";

const NEW_AGE_ONLINE_37_KEYWORDS = [
  "digital marketing classes near me",
  "search engine optimization in digital marketing",
  "digital marketing institute near me",
  "digital marketing certificate programs",
  "marketing courses online with certificate",
  "digital marketing online certification course",
  "advanced digital marketing course",
  "digital marketing course with placement",
  "best online digital marketing courses in india",
  "digital marketing classes online",
  "study digital marketing online",
  "best digital marketing courses",
  "best online marketing courses",
  "good digital marketing courses",
  "top digital marketing courses",
  "digital marketing certification course",
  "certificate in digital marketing course",
  "marketing strategy course",
  "professional certificate in digital marketing",
  "digital marketing course online",
  "marketing courses online",
  "online marketing classes",
  "marketing digital course online",
  "online marketing online course",
  "fundamentals of digital marketing",
  "learn digital marketing",
  "digital marketing course online india",
  "best online digital marketing courses",
  "learn digital marketing online",
  "digital marketing courses",
  "digital marketing classes",
  "digital marketing training courses",
  "diploma in digital marketing",
  "ai in marketing course",
  "digital marketing for students",
  "accredited digital marketing courses",
  "best online courses for marketing professionals",
];

const HOME_PAGE_10_KEYWORDS = [
  "digital marketing course near me",
  "digital marketing courses in Hyderabad",
  "Online marketing classes",
  "Best Digital marketing course in Hyderabad",
  "Digital marketing course fee",
  "online digital marketing course with certificate",
  "learn digital marketing online",
  "new age digital marketing course",
  "performance marketing course",
  "digital marketing course with placement",
];

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

  useEffect(() => {
    setCourse(initialCourse);
  }, [initialCourse]);

  // Upload image states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Active section inside the editor studio
  const [activeStudioTab, setActiveStudioTab] = useState<
    "hero" | "pricing" | "curriculum" | "challenge" | "careerRoles" | "proof" | "faqs" | "audience" | "seo"
  >("hero");

  // Keyword states
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [bulkKeywordInput, setBulkKeywordInput] = useState("");

  function isImage(file: File) {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) return true;
    return /\.(png|jpe?g|webp|svg|gif|avif|ico)$/i.test(file.name);
  }

  // Handle image upload
  async function handleImageUpload(file: File) {
    if (!file) return;
    if (!isImage(file)) {
      setStatusMsg({ type: "error", text: "Please select a valid image file (PNG, JPG, WEBP, SVG)." });
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

  // SEO Meta Keywords helpers
  function addKeyword(term: string) {
    const cleaned = term.trim();
    if (!cleaned) return;
    const current = Array.isArray(course.metaKeywords) ? course.metaKeywords : [];
    if (!current.some((k) => k.toLowerCase() === cleaned.toLowerCase())) {
      setCourse((prev) => ({
        ...prev,
        metaKeywords: [...current, cleaned],
      }));
    }
    setNewKeywordInput("");
  }

  function removeKeyword(index: number) {
    const current = Array.isArray(course.metaKeywords) ? course.metaKeywords : [];
    setCourse((prev) => ({
      ...prev,
      metaKeywords: current.filter((_, i) => i !== index),
    }));
  }

  function bulkAddKeywords(text: string) {
    if (!text.trim()) return;
    const terms = text
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const current = Array.isArray(course.metaKeywords) ? [...course.metaKeywords] : [];
    terms.forEach((term) => {
      if (!current.some((k) => k.toLowerCase() === term.toLowerCase())) {
        current.push(term);
      }
    });
    setCourse((prev) => ({ ...prev, metaKeywords: current }));
    setBulkKeywordInput("");
    setStatusMsg({ type: "success", text: `Added ${terms.length} keywords to "${course.title}". Remember to click "Save Course Changes".` });
  }

  function applyPresetKeywords(keywords: string[], presetName: string) {
    setCourse((prev) => ({
      ...prev,
      metaKeywords: [...keywords],
    }));
    setStatusMsg({ type: "success", text: `Applied ${keywords.length} keywords (${presetName}) to "${course.title}". Remember to click "Save Course Changes".` });
  }

  function clearAllKeywords() {
    setCourse((prev) => ({
      ...prev,
      metaKeywords: [],
    }));
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

  // Career Roles helpers
  const DEFAULT_CAREER_ROLES: CourseCareerRoleItem[] = [
    { title: "Performance Marketing Manager", description: "Google + Meta campaigns, ROAS optimisation, budget management, customer acquisition at scale." },
    { title: "Growth Marketing Specialist", description: "Full-funnel ownership, experiment-driven, data-heavy. The startup rocket fuel role." },
    { title: "Brand Strategist / Manager", description: "Brand identity, positioning, communication strategy for FMCG, luxury, consumer brands." },
    { title: "SEO & Content Lead", description: "Organic traffic, content engines, editorial calendars. Compound visibility over time." },
    { title: "Social Media Manager", description: "Brand presence across platforms. Strategy + execution + community + paid social." },
    { title: "Digital Marketing Analyst", description: "GA4, Looker Studio, attribution, cohort analysis. Data marketing decisions." },
    { title: "CRM & Lifecycle Marketing", description: "Retention, automated email & WhatsApp funnels, churn prevention & LTV expansion." },
    { title: "Marketplace & E-com Lead", description: "Amazon, Flipkart, Shopify store scaling, catalog health & marketplace ads." },
  ];

  const careerRolesList: CourseCareerRoleItem[] =
    course.careerRoles && course.careerRoles.length > 0 ? course.careerRoles : DEFAULT_CAREER_ROLES;

  function updateCareerRole(index: number, updated: Partial<CourseCareerRoleItem>) {
    const list = [...careerRolesList];
    list[index] = { ...list[index], ...updated };
    setCourse({ ...course, careerRoles: list });
  }

  function addCareerRole() {
    const newRole: CourseCareerRoleItem = {
      title: "New Career Role",
      description: "Hands-on role responsibilities, key competencies, and agency expectations.",
    };
    setCourse({ ...course, careerRoles: [...careerRolesList, newRole] });
  }

  function removeCareerRole(index: number) {
    const list = careerRolesList.filter((_, i) => i !== index);
    setCourse({ ...course, careerRoles: list });
  }

  // Proof & Results helpers
  const DEFAULT_PROOF: CourseProofData = {
    heading: "Proof & Results",
    description: "What our cohorts actually produced, not a projection.",
    stats: [
      { value: "30+", label: "Real brand campaigns shipped" },
      { value: "16+", label: "Industries covered" },
      { value: "12", label: "Phases, zero filler" },
      { value: "6", label: "Months, cohort to portfolio" },
    ],
  };

  const proofData: CourseProofData = course.proof || DEFAULT_PROOF;

  function updateProofHeading(heading: string) {
    setCourse({ ...course, proof: { ...proofData, heading } });
  }

  function updateProofDescription(description: string) {
    setCourse({ ...course, proof: { ...proofData, description } });
  }

  function updateProofStat(index: number, updated: Partial<{ value: string; label: string }>) {
    const stats = [...(proofData.stats || [])];
    stats[index] = { ...stats[index], ...updated };
    setCourse({ ...course, proof: { ...proofData, stats } });
  }

  function addProofStat() {
    const stats = [...(proofData.stats || []), { value: "100%", label: "New Outcome Metric" }];
    setCourse({ ...course, proof: { ...proofData, stats } });
  }

  function removeProofStat(index: number) {
    const stats = (proofData.stats || []).filter((_, i) => i !== index);
    setCourse({ ...course, proof: { ...proofData, stats } });
  }

  // Course FAQs helpers
  const DEFAULT_FAQS: CourseFaqItem[] = [
    {
      question: "Do I need marketing experience to start?",
      answer: "No. Phase 1 assumes zero background and gets you to working fluency before Phase 2 asks you to apply it.",
    },
    {
      question: "Is this live or self-paced?",
      answer: "Live. Sessions are scheduled and recorded, but the CEO Challenge and phase gates require you to show up and defend your work in real time.",
    },
    {
      question: "What happens if I fail Phase 4?",
      answer: "You rework it. Idea clarity is pass or rework, no partial credit, no parallel track. Most students rework once, and the second version is always sharper.",
    },
    {
      question: "Is placement guaranteed?",
      answer: "No, and anyone promising you that is selling something. We provide comprehensive career concierge, portfolio defense, and direct agency referrals.",
    },
    {
      question: "What do I actually walk away with?",
      answer: "A portfolio of 30+ real campaigns across 16+ industries, plus a verified certificate that links back to that work, not just a PDF.",
    },
  ];

  const faqsList: CourseFaqItem[] =
    course.faqs && course.faqs.length > 0 ? course.faqs : DEFAULT_FAQS;

  function updateFaq(index: number, updated: Partial<CourseFaqItem>) {
    const list = [...faqsList];
    list[index] = { ...list[index], ...updated };
    setCourse({ ...course, faqs: list });
  }

  function addFaq() {
    const newFaq: CourseFaqItem = {
      question: "Frequently Asked Question?",
      answer: "Clear, detailed answer explaining this aspect of the program.",
    };
    setCourse({ ...course, faqs: [...faqsList, newFaq] });
  }

  function removeFaq(index: number) {
    const list = faqsList.filter((_, i) => i !== index);
    setCourse({ ...course, faqs: list });
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#3B0D3B]/10 p-4 sm:p-5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE] hover:bg-[#F5EDE0] px-3 py-2 text-xs font-bold text-[#5A4A5A] hover:text-[#0B0B0F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Courses</span>
          </button>

          <div className="h-4 w-px bg-[#3B0D3B]/10 hidden sm:block" />

          {/* Quick Course Switcher Dropdown */}
          <div className="relative">
            <select
              value={course.id}
              onChange={(e) => {
                const target = allCourses.find((c) => c.id === e.target.value);
                if (target) onSelectCourse(target);
              }}
              className="appearance-none rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none cursor-pointer pr-8"
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
            className="inline-flex items-center gap-1 text-xs text-[#3B0D3B] hover:text-[#2A082A] font-semibold transition-colors"
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
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {course.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            <span>{course.isLocked ? "Enrollment Locked" : "Enrollment Open"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
      <div className="flex flex-wrap items-center gap-2 border-b border-[#3B0D3B]/10 pb-3">
        {[
          { id: "hero", label: "1. Hero Banner & Media", icon: Sparkles },
          { id: "pricing", label: "2. Tuition & EMI Plans", icon: DollarSign },
          { id: "curriculum", label: "3. Curriculum & Phases", icon: Layers },
          { id: "challenge", label: "4. CEO Challenge", icon: Trophy },
          { id: "careerRoles", label: "5. Career Roles", icon: Compass },
          { id: "proof", label: "6. Proof & Results", icon: Award },
          { id: "faqs", label: "7. Course FAQs", icon: HelpCircle },
          { id: "audience", label: "8. Target Audience", icon: FileText },
          { id: "seo", label: "9. SEO Meta Keywords", icon: Sliders },
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
                  ? "bg-[#3B0D3B] text-white shadow-xs"
                  : "text-[#5A4A5A] hover:text-[#0B0B0F] bg-white border border-[#3B0D3B]/10"
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
          <div className="relative overflow-hidden rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 lg:p-10 shadow-xs text-slate-950">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Editable Headlines, Badges, CTAs */}
              <div className="lg:col-span-7 space-y-4">
                {/* Cohort Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 bg-[#FAF5EE] p-1 rounded-xl border border-[#3B0D3B]/10">
                    <span className="text-[10px] font-bold text-[#8C6A8C] uppercase px-1.5">Badge:</span>
                    <input
                      type="text"
                      value={course.badge}
                      onChange={(e) => setCourse({ ...course, badge: e.target.value })}
                      placeholder="BATCH 2 · OPEN"
                      className="rounded-lg bg-[#3B0D3B] px-3 py-1 text-[11px] font-bold text-white uppercase focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#FAF5EE] p-1 rounded-xl border border-[#3B0D3B]/10">
                    <span className="text-[10px] font-bold text-[#8C6A8C] uppercase px-1.5">Batch:</span>
                    <input
                      type="text"
                      value={course.batch || ""}
                      onChange={(e) => setCourse({ ...course, batch: e.target.value })}
                      placeholder="Batch 2 · Sep 2026"
                      className="rounded-lg bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 border border-[#3B0D3B]/10 focus:outline-none"
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
                  <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                    Course Title:
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder="New Age Digital Marketing"
                    className="w-full text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0B0B0F] border-b border-[#3B0D3B]/20 focus:border-[#3B0D3B] focus:outline-none py-1 bg-transparent"
                  />
                </div>

                {/* Course Summary Description */}
                <div>
                  <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                    Course Summary &amp; Argument:
                  </label>
                  <textarea
                    rows={3}
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    placeholder="Four months, online. 12 phases in a fixed order, 30+ real brand projects..."
                    className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-3 text-xs sm:text-sm text-slate-700 leading-relaxed focus:bg-white focus:border-[#3B0D3B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Duration / Format Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                      Duration &amp; Format:
                    </label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={(e) => setCourse({ ...course, duration: e.target.value, meta: e.target.value })}
                      placeholder="4 months · Online"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                      Course URL Slug:
                    </label>
                    <input
                      type="text"
                      value={course.href}
                      onChange={(e) => setCourse({ ...course, href: e.target.value })}
                      placeholder="/categories/digital-marketing"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* CTAs Editing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                      Primary Apply Button:
                    </label>
                    <input
                      type="text"
                      value={course.applyCta || ""}
                      onChange={(e) => setCourse({ ...course, applyCta: e.target.value })}
                      placeholder="Apply for Batch 2"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/20 bg-[#FAF5EE] px-3 py-2 text-xs font-bold text-[#3B0D3B] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wider block">
                      Syllabus Button &amp; PDF:
                    </label>
                    <input
                      type="text"
                      value={course.curriculumPdf || ""}
                      onChange={(e) => setCourse({ ...course, curriculumPdf: e.target.value })}
                      placeholder="/treqo-curriculum.pdf"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
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
                    className="text-[10px] font-bold text-[#3B0D3B] hover:underline cursor-pointer"
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
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
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
                        ? "border-[#3B0D3B] bg-[#FAF5EE] shadow-xl"
                        : "border-[#3B0D3B]/15 bg-slate-900"
                    }`}
                  >
                    {course.image ? (
                      <div className="relative aspect-[16/10] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.image}
                          alt={course.title}
                          className={`h-full w-full object-cover transition-opacity ${course.isLocked ? "opacity-75" : "opacity-100"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Coming soon overlay when locked */}
                        {course.isLocked && (
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
                            <div className="flex items-center gap-1.5 rounded-full bg-black/80 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span>COMING SOON (Locked)</span>
                            </div>
                          </div>
                        )}

                        {/* Top Replace / Remove Pill */}
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="h-7 px-2.5 rounded-lg bg-black/70 hover:bg-[#3B0D3B] text-white border border-white/20 text-[11px] font-bold backdrop-blur-md shadow-md flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {isUploadingImage ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourse({ ...course, image: "" })}
                            className="h-7 w-7 rounded-lg bg-black/70 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md transition-colors"
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
                        className="aspect-[16/10] w-full flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-[#FAF5EE]/60 border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B] hover:bg-[#FAF5EE] transition-all"
                      >
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="h-6 w-6 text-[#3B0D3B] animate-spin" />
                            <span className="text-xs font-bold text-[#0B0B0F]">Uploading cover image...</span>
                          </div>
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 flex items-center justify-center text-[#3B0D3B] mb-2">
                              <Upload className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-[#0B0B0F]">Upload Course Cover Image</span>
                            <span className="text-[11px] text-[#5A4A5A] mt-0.5">Click or drag &amp; drop PNG, JPG</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Tag Input if not in photo */}
                {!course.image && (
                  <div>
                    <label className="text-[10px] font-bold text-[#5A4A5A] uppercase tracking-wider block">
                      Preview Label:
                    </label>
                    <input
                      type="text"
                      value={course.previewLabel || ""}
                      onChange={(e) => setCourse({ ...course, previewLabel: e.target.value })}
                      placeholder="CLASSROOM · CEO CHALLENGE REVIEW"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3 py-2 text-xs font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
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
        <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#0B0B0F]">Course Tuition &amp; EMI Breakdown</h3>
            <p className="text-xs text-[#5A4A5A] mt-0.5">
              Set the full upfront tuition fee, no-cost monthly EMI options, and admission notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE]/60 p-5 space-y-2">
              <label className="text-xs font-bold text-[#0B0B0F]">Total Course Fee</label>
              <input
                type="text"
                value={course.feeTotal || ""}
                onChange={(e) => setCourse({ ...course, feeTotal: e.target.value })}
                placeholder="e.g. ₹55,000"
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#3B0D3B] focus:border-[#3B0D3B] focus:outline-none"
              />
              <p className="text-[11px] text-[#5A4A5A]">Displayed in payment plans and sidebar.</p>
            </div>

            <div className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE]/60 p-5 space-y-2">
              <label className="text-xs font-bold text-[#0B0B0F]">Monthly EMI Plan</label>
              <input
                type="text"
                value={course.feeEmi || ""}
                onChange={(e) => setCourse({ ...course, feeEmi: e.target.value })}
                placeholder="e.g. ₹4,583 / month"
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#3B0D3B] focus:border-[#3B0D3B] focus:outline-none"
              />
              <p className="text-[11px] text-[#5A4A5A]">Zero-cost financing breakdown.</p>
            </div>

            <div className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE]/60 p-5 space-y-2">
              <label className="text-xs font-bold text-[#0B0B0F]">Cohort Batch Title</label>
              <input
                type="text"
                value={course.batch || ""}
                onChange={(e) => setCourse({ ...course, batch: e.target.value })}
                placeholder="e.g. Batch 2 · Sep 2026"
                className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
              <p className="text-[11px] text-[#5A4A5A]">Shown in sidebar and badges.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CURRICULUM & PHASES STUDIO (PhaseAccordion)        */}
      {/* ========================================================= */}
      {activeStudioTab === "curriculum" && (
        <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0B0B0F]">Curriculum &amp; Structured Phases</h3>
              <p className="text-xs text-[#5A4A5A] mt-0.5">
                Manage the structured execution phases shown on the public course page.
              </p>
            </div>
            <button
              type="button"
              onClick={addPhaseGroup}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Phase Module</span>
            </button>
          </div>

          {/* Section Heading & Argument */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF5EE]/60 p-4 rounded-2xl border border-[#3B0D3B]/10">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Section Title</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Curriculum Intro</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>
          </div>

          {/* Phase Cards List */}
          <div className="space-y-4">
            {phasesData.groups.map((group, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE]/30 p-5 space-y-3 hover:border-[#3B0D3B]/25 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={group.eyebrow}
                      onChange={(e) => updatePhaseGroup(idx, { eyebrow: e.target.value })}
                      placeholder="PHASE 01"
                      className="rounded-lg bg-white border border-[#3B0D3B]/20 px-2.5 py-1 text-[10px] font-bold text-[#3B0D3B] uppercase focus:border-[#3B0D3B] focus:outline-none w-28"
                    />
                    <span className="text-xs text-[#5A4A5A] font-bold">Module #{idx + 1}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePhaseGroup(idx)}
                    className="p-1.5 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Remove Module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5A4A5A] uppercase tracking-wider block">
                    Module Title:
                  </label>
                  <input
                    type="text"
                    value={group.heading}
                    onChange={(e) => updatePhaseGroup(idx, { heading: e.target.value })}
                    placeholder="e.g. MARKETING FOUNDATIONS &amp; POSITIONING"
                    className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5A4A5A] uppercase tracking-wider block">
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
                    className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
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
        <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#0B0B0F]">The CEO Challenge (Capstone Sprint)</h3>
            <p className="text-xs text-[#5A4A5A] mt-0.5">
              Every student defends their plan to a panel of founders. Configure the challenge prompt.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Challenge Title</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Problem Statement / Prompt</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3.5 text-xs text-[#0B0B0F] leading-relaxed focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Deliverables Expected (One per line)</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] leading-relaxed focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: CAREER ROLES STUDIO                                */}
      {/* ========================================================= */}
      {activeStudioTab === "careerRoles" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B0D3B]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B]">
                    <Compass className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold text-[#0B0B0F]">Career Outcomes &amp; Roles You Can Crack</h3>
                </div>
                <p className="text-xs text-[#5A4A5A] mt-1.5">
                  Configure the target job roles and competencies shown on this course page. On mobile, these blocks automatically render as an interactive card scroll stack.
                </p>
              </div>

              <button
                type="button"
                onClick={addCareerRole}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Career Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerRolesList.map((role, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-[#FAF5EE]/40 p-4 sm:p-5 flex flex-col justify-between gap-3 group hover:border-[#3B0D3B]/30 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                      Role #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeCareerRole(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete role"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#0B0B0F] block">Role Title</label>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => updateCareerRole(idx, { title: e.target.value })}
                        placeholder="e.g. Performance Marketing Manager"
                        className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3 py-2 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#0B0B0F] block">Role Summary &amp; Competencies</label>
                      <textarea
                        rows={2}
                        value={role.description || ""}
                        onChange={(e) => updateCareerRole(idx, { description: e.target.value })}
                        placeholder="Google + Meta campaigns, ROAS optimisation, budget management..."
                        className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-2.5 text-xs text-[#5A4A5A] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={addCareerRole}
                className="w-full rounded-2xl border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B]/40 bg-[#FAF5EE]/30 hover:bg-[#FAF5EE] py-3 text-xs font-bold text-[#3B0D3B] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Career Role</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: PROOF & RESULTS STUDIO                             */}
      {/* ========================================================= */}
      {activeStudioTab === "proof" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B0D3B]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B]">
                    <Award className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold text-[#0B0B0F]">Proof &amp; Results</h3>
                </div>
                <p className="text-xs text-[#5A4A5A] mt-1.5">
                  Outcome metrics, placement benchmarks, and deliverables numbers displayed on the course page.
                </p>
              </div>

              <button
                type="button"
                onClick={addProofStat}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Metric Stat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Section Heading</label>
                <input
                  type="text"
                  value={proofData.heading || "Proof & Results"}
                  onChange={(e) => updateProofHeading(e.target.value)}
                  placeholder="Proof & Results"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={proofData.description || ""}
                  onChange={(e) => updateProofDescription(e.target.value)}
                  placeholder="What our cohorts actually produced, not a projection."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                />
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div>
              <label className="text-xs font-bold text-[#0B0B0F] block mb-3">Outcome Metric Badges (4 cards recommended)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {(proofData.stats || []).map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 bg-[#FAF5EE]/50 p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#3B0D3B] uppercase">Stat #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProofStat(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete stat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#5A4A5A] uppercase">Display Value</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => updateProofStat(idx, { value: e.target.value })}
                          placeholder="e.g. 30+ or ₹14.2L"
                          className="mt-0.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-2.5 py-1.5 text-sm font-black text-[#3B0D3B] focus:border-[#3B0D3B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#5A4A5A] uppercase">Label / Description</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateProofStat(idx, { label: e.target.value })}
                          placeholder="Real brand campaigns shipped"
                          className="mt-0.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-2.5 py-1.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={addProofStat}
                className="w-full rounded-2xl border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B]/40 bg-[#FAF5EE]/30 hover:bg-[#FAF5EE] py-3 text-xs font-bold text-[#3B0D3B] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Metric Stat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: COURSE FAQS STUDIO                                 */}
      {/* ========================================================= */}
      {activeStudioTab === "faqs" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3B0D3B]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B]">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold text-[#0B0B0F]">Course FAQs (Accordion)</h3>
                </div>
                <p className="text-xs text-[#5A4A5A] mt-1.5">
                  Frequently asked questions displayed on this specific course page accordion.
                </p>
              </div>

              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {faqsList.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-[#FAF5EE]/30 p-4 sm:p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#3B0D3B] uppercase tracking-wider bg-white border border-[#3B0D3B]/10 px-2 py-0.5 rounded-full">
                      FAQ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0B0B0F] block">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, { question: e.target.value })}
                      placeholder="e.g. Do I need marketing experience to start?"
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs font-bold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0B0B0F] block">Answer</label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                      placeholder="Clear explanation..."
                      className="mt-1 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] leading-relaxed focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={addFaq}
                className="w-full rounded-2xl border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B]/40 bg-[#FAF5EE]/30 hover:bg-[#FAF5EE] py-3 text-xs font-bold text-[#3B0D3B] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another FAQ Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TARGET AUDIENCE (Who this is for)                   */}
      {/* ========================================================= */}
      {activeStudioTab === "audience" && (
        <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-[#0B0B0F]">Target Audience &amp; Candidate Profiles</h3>
            <p className="text-xs text-[#5A4A5A] mt-0.5">
              Who is this curriculum track specifically engineered for? (Shown under Overview).
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Who This Program Is Built For (Bullet points, one per line)</label>
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
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-4 text-xs text-[#0B0B0F] leading-relaxed focus:border-[#3B0D3B] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SEO META KEYWORDS (Category-Specific SEO)          */}
      {/* ========================================================= */}
      {activeStudioTab === "seo" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B]">
                    <Search className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-bold text-[#0B0B0F]">Category SEO &amp; Meta Keywords</h3>
                </div>
                <p className="text-xs text-[#5A4A5A] mt-1.5">
                  Configure search engine optimization meta tags and targeted keywords for{" "}
                  <span className="font-bold text-[#3B0D3B]">{course.title}</span> (Route:{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] font-mono">{course.href || `/categories/${course.id}`}</code>).
                </p>
              </div>

              {/* Tag counter badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3B0D3B]/5 border border-[#3B0D3B]/15 text-xs font-bold text-[#3B0D3B] self-start sm:self-auto">
                <Tag className="h-3.5 w-3.5" />
                <span>{Array.isArray(course.metaKeywords) ? course.metaKeywords.length : 0} Active Keywords</span>
              </div>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Search Engine SERP Preview</span>
              <div className="text-xs text-emerald-800 flex items-center gap-1 font-mono">
                <Globe className="h-3 w-3" />
                <span>https://treqo.org{course.href || `/categories/${course.id}`}</span>
              </div>
              <h4 className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">
                {course.title} | TREQO
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {course.description || "Explore TREQO's live mentorship track, practical deliverables, and verified career portfolios."}
              </p>
            </div>

            {/* Keyword Management Tools */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-[#0B0B0F] block">Add Single Keyword</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword(newKeywordInput);
                    }
                  }}
                  placeholder="e.g. digital marketing certification course"
                  className="flex-1 rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs text-[#0B0B0F] placeholder-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addKeyword(newKeywordInput)}
                  className="rounded-xl bg-[#3B0D3B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#2A082A] transition-colors cursor-pointer"
                >
                  Add Keyword
                </button>
              </div>

              {/* Active Keywords Tag Cloud */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0B0B0F]">
                    Current Meta Keywords ({Array.isArray(course.metaKeywords) ? course.metaKeywords.length : 0})
                  </span>
                  {Array.isArray(course.metaKeywords) && course.metaKeywords.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllKeywords}
                      className="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {Array.isArray(course.metaKeywords) && course.metaKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-72 overflow-y-auto">
                    {course.metaKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#3B0D3B]/15 px-2.5 py-1 text-xs font-medium text-[#0B0B0F] shadow-2xs group hover:border-[#3B0D3B]/30 transition-all"
                      >
                        <Tag className="h-3 w-3 text-[#3B0D3B]/50" />
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(idx)}
                          className="h-3.5 w-3.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-600 inline-flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove keyword"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                    No custom keywords added yet for this category. You can add them individually or use the bulk paste / preset buttons below.
                  </div>
                )}
              </div>

              {/* Bulk Paste Area */}
              <div className="pt-2 border-t border-[#3B0D3B]/10 space-y-2">
                <label className="text-xs font-bold text-[#0B0B0F] block">
                  Bulk Add Keywords (Paste comma or newline separated list)
                </label>
                <textarea
                  rows={4}
                  value={bulkKeywordInput}
                  onChange={(e) => setBulkKeywordInput(e.target.value)}
                  placeholder="keyword 1, keyword 2, keyword 3..."
                  className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3.5 text-xs text-[#0B0B0F] placeholder-slate-400 focus:border-[#3B0D3B] focus:outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => bulkAddKeywords(bulkKeywordInput)}
                  disabled={!bulkKeywordInput.trim()}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Import Keywords
                </button>
              </div>

              {/* One-Click Presets */}
              <div className="pt-3 border-t border-[#3B0D3B]/10 space-y-2">
                <span className="text-xs font-bold text-[#0B0B0F] block">One-Click Keyword Presets</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPresetKeywords(NEW_AGE_ONLINE_37_KEYWORDS, "New Age Online Flagship Track")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B0D3B]/20 bg-[#3B0D3B]/5 hover:bg-[#3B0D3B]/10 text-xs font-bold text-[#3B0D3B] cursor-pointer transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Apply New Age Online Preset (37 Keywords)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPresetKeywords(HOME_PAGE_10_KEYWORDS, "Hyderabad & Regional Preset")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-colors"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span>Apply Hyderabad Local Preset (10 Keywords)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between p-4 rounded-2xl bg-white/95 border border-[#3B0D3B]/15 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#5A4A5A] truncate">
            Editing: <span className="text-[#0B0B0F] font-black">{course.title}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-[#3B0D3B]/20 bg-white px-4 py-2 text-xs font-bold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Course Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
