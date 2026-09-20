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

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const trimmed = pinInput.trim();

    if (!trimmed) {
      setAuthError("Please enter your administrator PIN / password.");
      return;
    }

    if (trimmed === ADMIN_PIN || trimmed === DEFAULT_PIN) {
      sessionStorage.setItem("treqo_admin_auth", "true");
      sessionStorage.setItem("treqo_admin_pin", trimmed);
      setUnlocked(true);
      setPinInput("");
    } else {
      setAuthError("Incorrect PIN. Access denied.");
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
    return leads.filter((lead) => {
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
  }, [leads, selectedCourse, searchQuery]);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return leads.filter((l) => l.submittedAt.startsWith(today)).length;
  }, [leads]);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 ${plusJakarta.className}`}>
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0e111a] p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#012A22]/10 border border-[#3B796A]/30 text-[#ABCAC2]">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-black text-white tracking-tight">Student Leads Console</h1>
            <p className="mt-1.5 text-xs text-slate-400">
              Enter your Administrator PIN to view and export student applications.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300">Administrator PIN</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError("");
                  }}
                  placeholder="Enter administrator PIN"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#3B796A] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-800/40 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] py-3 text-sm font-bold text-white shadow-lg transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Unlock Leads Console</span>
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ← Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#07090e] text-slate-100 flex ${plusJakarta.className}`}>
      {/* 1. SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0a0d14] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-6">
          <Link href="/" target="_blank" className="flex items-center gap-2.5">
            <span className="text-xl font-black text-white tracking-wider">TREQO</span>
            <span className="rounded bg-[#3B796A]/20 px-1.5 py-0.5 text-[9px] font-black text-[#ABCAC2] tracking-widest uppercase">
              ADMIN
            </span>
          </Link>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/programs"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span>Programs &amp; Courses</span>
            </Link>

            <Link
              href="/admin/leads"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#161a26] text-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
                <span>Student Leads</span>
              </div>
              <span className="text-[10px] text-[#ABCAC2] font-black">{leads.length}</span>
            </Link>

            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Settings &amp; Blogs</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#3B796A]/20 text-[#ABCAC2] font-bold text-xs flex items-center justify-center border border-[#3B796A]/30">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Admin</p>
              <p className="text-[10px] text-slate-500 leading-tight">Treqo HQ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-6 sm:px-8 flex items-center justify-between border-b border-slate-800/70 bg-[#07090e]/90 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
              Student Leads &amp; Applications
            </h1>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-300">
              {leads.length} total
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>

            <a
              href={`/api/leads?format=csv&pin=${encodeURIComponent(getStoredPin())}`}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </a>
          </div>
        </header>

        {/* Notifications Bar */}
        {saveMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{saveMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2 shadow-lg">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <main className="p-6 sm:p-8 space-y-6 flex-1 max-w-[1350px] w-full">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#0e111a] border border-slate-800/80 p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#ABCAC2]" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{leads.length}</div>
                <div className="text-[11px] text-slate-400 font-medium">Total Applicants</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0e111a] border border-slate-800/80 p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">{todayCount}</div>
                <div className="text-[11px] text-slate-400 font-medium">Applied Today</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0e111a] border border-slate-800/80 p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-400">{courseOptions.length - 1}</div>
                <div className="text-[11px] text-slate-400 font-medium">Programs Selected</div>
              </div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students by name, email, phone, background..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0e111a] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#3B796A] focus:outline-none"
                />
              </div>

              {courseOptions.length > 1 && (
                <div className="relative sm:w-60">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-800 bg-[#0e111a] pl-9 pr-8 py-2.5 text-xs text-white focus:border-[#3B796A] focus:outline-none cursor-pointer"
                  >
                    {courseOptions.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadLeads}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0e111a] px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0e111a] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#121622] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Selected Program</th>
                    <th className="py-3 px-4">Background</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        No student applications match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-[10px] text-slate-500">ID: {lead.id.slice(0, 8)}...</div>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="h-3 w-3 text-slate-500" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Phone className="h-3 w-3 text-slate-500" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">
                              {lead.phone}
                            </a>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-md bg-[#012A22]/60 border border-[#3B796A]/40 px-2 py-0.5 text-[10px] font-bold text-[#ABCAC2]">
                            {lead.course || "General Admission"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="truncate text-slate-300">{lead.background || "—"}</div>
                          <div className="text-[10px] text-slate-500">{lead.source || ""}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                          {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDeletingLead(lead)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete applicant"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-900/50 bg-[#0e111a] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2 rounded-xl bg-red-950/60 border border-red-800/50">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete applicant record for{" "}
              <strong className="text-white">&quot;{deletingLead.name}&quot;</strong> ({deletingLead.email})?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingLead(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
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
