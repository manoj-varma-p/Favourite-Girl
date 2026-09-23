"use client";

import { useEffect, useState, useMemo, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  Search,
  RefreshCw,
  Download,
  Trash2,
  Filter,
  ExternalLink,
  Users,
  Sparkles,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  LogOut,
  Mail,
  Phone,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  X,
  MessageSquare,
} from "lucide-react";
import type { Lead } from "@/lib/leads-db";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const DEFAULT_PIN = "treqo2026";
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;

const emptySubscribe = () => () => {};
function useAdminSession() {
  return useSyncExternalStore(
    emptySubscribe,
    () => (typeof window !== "undefined" ? sessionStorage.getItem("treqo_admin_auth") === "true" : false),
    () => false
  );
}

export default function AdminLeadsPage() {
  const isSessionAuthed = useAdminSession();
  const [unlocked, setUnlocked] = useState(false);
  const isAuthenticated = isSessionAuthed || unlocked;

  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [leadsSortBy, setLeadsSortBy] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc" | "course-asc"
  >("newest");

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function getStoredPin(): string {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("treqo_admin_pin") || ADMIN_PIN;
  }

  function notifySuccess(msg: string) {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3500);
  }

  function notifyError(msg: string) {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4500);
  }

  const loadLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads", {
        headers: { "x-admin-pin": getStoredPin() },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      } else {
        notifyError("Failed to fetch student leads.");
      }
    } catch {
      notifyError("Network error fetching leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadLeads();
    }
  }, [isAuthenticated, loadLeads]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const trimmed = pinInput.trim();

    if (!trimmed) {
      setAuthError("Please enter your administrator PIN / password.");
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: trimmed }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("treqo_admin_auth", "true");
        sessionStorage.setItem("treqo_admin_pin", trimmed);
        setUnlocked(true);
        setPinInput("");
        setAuthError("");
      } else {
        setAuthError(data.error || "Incorrect PIN. Access denied.");
      }
    } catch {
      if (trimmed === ADMIN_PIN || trimmed === DEFAULT_PIN) {
        sessionStorage.setItem("treqo_admin_auth", "true");
        sessionStorage.setItem("treqo_admin_pin", trimmed);
        setUnlocked(true);
        setPinInput("");
      } else {
        setAuthError("Authentication service error. Access denied.");
      }
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("treqo_admin_auth");
    sessionStorage.removeItem("treqo_admin_pin");
    setUnlocked(false);
    setLeads([]);
  }

  async function handleConfirmDelete() {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(deletingLead.id)}`, {
        method: "DELETE",
        headers: { "x-admin-pin": getStoredPin() },
      });
      if (res.ok) {
        notifySuccess(`Deleted applicant ${deletingLead.name}`);
        setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
        setDeletingLead(null);
      } else {
        const err = await res.json();
        notifyError(err.error || "Failed to delete lead.");
      }
    } catch {
      notifyError("Network error deleting lead.");
    } finally {
      setIsDeleting(false);
    }
  }

  const courseOptions = useMemo(() => {
    const set = new Set(["All"]);
    leads.forEach((l) => {
      if (l.course) set.add(l.course);
    });
    return Array.from(set);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const list = leads.filter((lead) => {
      if (selectedCourse !== "All" && lead.course !== selectedCourse) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.background && lead.background.toLowerCase().includes(q)) ||
        (lead.source && lead.source.toLowerCase().includes(q))
      );
    });

    return [...list].sort((a, b) => {
      if (leadsSortBy === "newest") {
        return new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
      }
      if (leadsSortBy === "oldest") {
        return new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
      }
      if (leadsSortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
      }
      if (leadsSortBy === "name-desc") {
        return (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base" });
      }
      if (leadsSortBy === "course-asc") {
        return (a.course || "").localeCompare(b.course || "", undefined, { sensitivity: "base" });
      }
      return 0;
    });
  }, [leads, selectedCourse, searchQuery, leadsSortBy]);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return leads.filter((l) => l.submittedAt.startsWith(today)).length;
  }, [leads]);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#FDFAF6] text-[#0B0B0F] flex items-center justify-center p-4 ${plusJakarta.className}`}>
        <div className="w-full max-w-md rounded-2xl border border-[#3B0D3B]/15 bg-[#FAF5EE] p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B]">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-black text-[#0B0B0F] tracking-tight">Student Leads Console</h1>
            <p className="mt-1.5 text-xs text-[#5A4A5A]">
              Enter your Administrator PIN to view and export student applications.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Administrator PIN</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError("");
                  }}
                  placeholder="Enter administrator PIN"
                  className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-3 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A4A5A] hover:text-[#0B0B0F]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] py-3 text-sm font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Unlock Leads Console</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-[#5A4A5A] hover:text-[#0B0B0F] transition-colors">
                ← Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FDFAF6] text-[#0B0B0F] flex ${plusJakarta.className}`}>
      {/* 1. SIDEBAR */}
      <aside className="w-64 border-r border-[#3B0D3B]/15 bg-[#FAF5EE] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-6">
          <Link href="/" target="_blank" className="flex items-center gap-2.5">
            <span className="text-xl font-black text-[#0B0B0F] tracking-wider">TREQO</span>
            <span className="rounded bg-[#3B0D3B]/10 px-1.5 py-0.5 text-[9px] font-black text-[#3B0D3B] tracking-widest uppercase">
              ADMIN
            </span>
          </Link>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#F5EDE0] transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-[#5A4A5A]" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/programs"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#F5EDE0] transition-colors"
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-[#5A4A5A]" />
              <span>Programs &amp; Courses</span>
            </Link>

            <Link
              href="/admin/leads"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#3B0D3B] text-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 shrink-0 text-white" />
                <span>Student Leads</span>
              </div>
              <span className="text-[10px] text-white/80 font-black">{leads.length}</span>
            </Link>

            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#F5EDE0] transition-colors"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-[#5A4A5A]" />
              <span>Settings &amp; Blogs</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-[#3B0D3B]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#3B0D3B]/10 text-[#3B0D3B] font-bold text-xs flex items-center justify-center border border-[#3B0D3B]/20">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B0B0F] leading-tight">Admin</p>
              <p className="text-[10px] text-[#5A4A5A] leading-tight">Treqo HQ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 sm:px-8 flex items-center justify-between border-b border-[#3B0D3B]/15 bg-[#FDFAF6]/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black text-[#0B0B0F] tracking-tight">
              Student Leads &amp; Applications
            </h1>
            <span className="rounded-full bg-[#3B0D3B]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#3B0D3B]">
              {leads.length} total
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#5A4A5A] hover:text-[#0B0B0F] px-3 py-1.5 rounded-lg border border-[#3B0D3B]/15 hover:bg-[#FAF5EE] transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>

            <a
              href={`/api/leads?format=csv&pin=${encodeURIComponent(getStoredPin())}`}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </header>

        {/* Notifications Bar */}
        {saveMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{saveMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-[1350px] w-full">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-[#3B0D3B]/15 p-4 flex items-center gap-4 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 flex items-center justify-center shrink-0 text-[#3B0D3B]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#0B0B0F]">{leads.length}</div>
                <div className="text-[11px] text-[#5A4A5A] font-medium">Total Applicants</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#3B0D3B]/15 p-4 flex items-center gap-4 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">{todayCount}</div>
                <div className="text-[11px] text-[#5A4A5A] font-medium">Applied Today</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#3B0D3B]/15 p-4 flex items-center gap-4 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-[#3987E5]/10 border border-[#3987E5]/20 flex items-center justify-center shrink-0 text-[#3987E5]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#3987E5]">{courseOptions.length - 1}</div>
                <div className="text-[11px] text-[#5A4A5A] font-medium">Programs Selected</div>
              </div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4A5A]" />
                <input
                  type="text"
                  placeholder="Search students by name, email, phone, background..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white pl-10 pr-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              {courseOptions.length > 1 && (
                <div className="relative sm:w-60">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A4A5A] pointer-events-none" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#3B0D3B]/15 bg-white pl-9 pr-8 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none cursor-pointer transition-all"
                  >
                    {courseOptions.map((c) => (
                      <option key={c} value={c} className="bg-white text-[#0B0B0F]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative sm:w-52">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A4A5A] pointer-events-none" />
                <select
                  value={leadsSortBy}
                  onChange={(e) =>
                    setLeadsSortBy(
                      e.target.value as "newest" | "oldest" | "name-asc" | "name-desc" | "course-asc"
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-[#3B0D3B]/15 bg-white pl-9 pr-8 py-2.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none cursor-pointer transition-all"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="name-asc">Sort: Name (A → Z)</option>
                  <option value="name-desc">Sort: Name (Z → A)</option>
                  <option value="course-asc">Sort: Program (A → Z)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadLeads}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="rounded-2xl border border-[#3B0D3B]/15 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0B0B0F]">
                <thead className="bg-[#FAF5EE] text-[11px] font-bold uppercase tracking-wider text-[#5A4A5A] border-b border-[#3B0D3B]/10">
                  <tr>
                    <th
                      onClick={() =>
                        setLeadsSortBy(leadsSortBy === "name-asc" ? "name-desc" : "name-asc")
                      }
                      className="py-3 px-4 cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                      title="Click to sort by Name"
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <span>Student</span>
                        {leadsSortBy === "name-asc" && <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />}
                        {leadsSortBy === "name-desc" && <ArrowDown className="h-3 w-3 text-[#3B0D3B]" />}
                        {leadsSortBy !== "name-asc" && leadsSortBy !== "name-desc" && (
                          <ArrowUpDown className="h-3 w-3 text-[#5A4A5A]/40" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Contact</th>
                    <th
                      onClick={() => setLeadsSortBy("course-asc")}
                      className="py-3 px-4 cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                      title="Click to sort by Course"
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <span>Applied Course</span>
                        {leadsSortBy === "course-asc" ? (
                          <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-[#5A4A5A]/40" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4">Origin Page</th>
                    <th className="py-3 px-4">Background &amp; Source</th>
                    <th
                      onClick={() =>
                        setLeadsSortBy(leadsSortBy === "newest" ? "oldest" : "newest")
                      }
                      className="py-3 px-4 cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                      title="Click to sort by Date"
                    >
                      <div className="inline-flex items-center gap-1.5">
                        <span>Submitted At</span>
                        {leadsSortBy === "newest" && <ArrowDown className="h-3 w-3 text-[#3B0D3B]" />}
                        {leadsSortBy === "oldest" && <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />}
                        {leadsSortBy !== "newest" && leadsSortBy !== "oldest" && (
                          <ArrowUpDown className="h-3 w-3 text-[#5A4A5A]/40" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B0D3B]/10">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[#5A4A5A]">
                        No student applications match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#FAF5EE]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0B0B0F]">{lead.name}</div>
                          <div className="text-[10px] text-[#5A4A5A]">ID: {lead.id.slice(0, 8)}...</div>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[#0B0B0F]">
                            <Mail className="h-3 w-3 text-[#5A4A5A]" />
                            <a href={`mailto:${lead.email}`} className="hover:underline font-mono text-xs">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5A4A5A] text-[11px]">
                            <Phone className="h-3 w-3 text-[#5A4A5A]" />
                            <a href={`tel:${lead.phone}`} className="hover:underline font-mono">
                              {lead.phone}
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 px-2.5 py-1 text-xs font-bold text-[#3B0D3B]">
                            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                            <span>{lead.course || "New Age Digital Marketing"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={lead.pageUrl || lead.page || "/"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-[#3B0D3B]/15 text-[#0B0B0F] hover:text-[#3B0D3B] hover:bg-[#F5EDE0] hover:border-[#3B0D3B]/30 font-medium text-xs transition-colors group cursor-pointer max-w-[180px]"
                            title={`View lead source page: ${lead.page || "/"}`}
                          >
                            <Globe className="h-3.5 w-3.5 shrink-0 text-[#8C6A8C] group-hover:text-[#3B0D3B]" />
                            <span className="font-mono truncate">{lead.page || "/"}</span>
                            <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs space-y-1">
                          <div className="truncate text-[#0B0B0F] font-medium">{lead.background || "General Inquiry"}</div>
                          <div>
                            <span className="text-[10px] text-[#5A4A5A] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#3B0D3B]/10 font-medium inline-block">
                              {lead.source || "Website Form"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#5A4A5A]">
                          {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedLeadForDetail(lead)}
                              className="p-1.5 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] border border-[#3B0D3B]/15 rounded-lg transition-colors cursor-pointer"
                              title="View Full Profile"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-1.5 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] border border-[#3B0D3B]/15 rounded-lg transition-colors cursor-pointer"
                              title="Email Student"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-1.5 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] border border-[#3B0D3B]/15 rounded-lg transition-colors cursor-pointer"
                              title="Call Student"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setDeletingLead(lead)}
                              className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 bg-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                              title="Delete applicant"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Lead Details Modal */}
      {selectedLeadForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#3B0D3B]/15 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#3B0D3B] text-white font-bold flex items-center justify-center text-sm">
                  {selectedLeadForDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B0B0F]">{selectedLeadForDetail.name}</h3>
                  <p className="text-xs text-[#5A4A5A]">Student Applicant ID: {selectedLeadForDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForDetail(null)}
                className="p-1.5 text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-xl transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                  <div className="text-[10px] font-bold text-[#8C6A8C] uppercase">Email Address</div>
                  <a href={`mailto:${selectedLeadForDetail.email}`} className="font-bold text-[#3B0D3B] hover:underline break-all">
                    {selectedLeadForDetail.email}
                  </a>
                </div>
                <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                  <div className="text-[10px] font-bold text-[#8C6A8C] uppercase">Phone Number</div>
                  <a href={`tel:${selectedLeadForDetail.phone}`} className="font-bold text-[#3B0D3B] hover:underline">
                    {selectedLeadForDetail.phone}
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-[#3B0D3B]/5 p-4 border border-[#3B0D3B]/20 space-y-1">
                <div className="text-[10px] font-bold text-[#3B0D3B] uppercase tracking-wide flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Applied Course / Program</span>
                </div>
                <div className="font-black text-[#0B0B0F] text-base">{selectedLeadForDetail.course || "New Age Digital Marketing"}</div>
              </div>

              <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                <div className="text-[10px] font-bold text-[#8C6A8C] uppercase tracking-wide flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Origin Page (Where Form was Filled)</span>
                </div>
                <div>
                  <a
                    href={selectedLeadForDetail.pageUrl || selectedLeadForDetail.page || "/"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold font-mono text-[#3B0D3B] hover:underline"
                  >
                    <span>{selectedLeadForDetail.page || "/"}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                <div className="text-[10px] font-bold text-[#8C6A8C] uppercase">Educational / Professional Background</div>
                <div className="text-[#0B0B0F] font-medium leading-relaxed">
                  {selectedLeadForDetail.background || "No background details specified."}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                  <div className="text-[10px] font-bold text-[#8C6A8C] uppercase">Form Source</div>
                  <div className="font-semibold text-[#0B0B0F]">{selectedLeadForDetail.source || "Website Form"}</div>
                </div>
                <div className="rounded-2xl bg-[#FAF5EE]/60 p-4 border border-[#3B0D3B]/10 space-y-1">
                  <div className="text-[10px] font-bold text-[#8C6A8C] uppercase">Submitted At</div>
                  <div className="font-semibold text-[#0B0B0F]">
                    {new Date(selectedLeadForDetail.submittedAt).toLocaleString("en-US")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={`https://wa.me/${selectedLeadForDetail.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${selectedLeadForDetail.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#3B0D3B]/20 font-bold text-xs text-[#3B0D3B] hover:bg-[#FAF5EE] transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
              <a
                href={`mailto:${selectedLeadForDetail.email}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#3B0D3B] text-white font-bold text-xs hover:bg-[#2A082A] shadow-md transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0F]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2 rounded-xl bg-red-50 border border-red-200">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#0B0B0F]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[#5A4A5A] leading-relaxed">
              Are you sure you want to permanently delete applicant record for{" "}
              <strong className="text-[#0B0B0F]">&quot;{deletingLead.name}&quot;</strong> ({deletingLead.email})?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2 text-xs font-semibold text-[#5A4A5A] hover:bg-[#FAF5EE]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
