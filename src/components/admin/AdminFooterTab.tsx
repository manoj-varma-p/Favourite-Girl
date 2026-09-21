"use client";

import { useState } from "react";
import { Save, MapPin, Mail, Phone, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import type { GeneralSettings } from "@/lib/content-db";

interface Props {
  initialData?: GeneralSettings;
  adminPin: string;
  onSaved: (updated: GeneralSettings) => void;
}

const defaultSettings: GeneralSettings = {
  siteTitle: "TREQO",
  logoText: "TREQO",
  logoImage: "",
  supportEmail: "admissions@treqo.org",
  supportPhone: "+91 99480 00491",
  address: "Plot No. 286, 4th Floor, Road No 16, Ayyappa Society Main Rd, Madhapur, Telangana 500081",
  instagramUrl: "https://instagram.com/treqo.ed",
  linkedinUrl: "https://linkedin.com/company/treqo",
  youtubeUrl: "https://youtube.com/@treqo",
  twitterUrl: "",
  copyrightText: "© 2026 Treqo School of Modern Learning Pvt. Ltd. All rights reserved.",
};

export default function AdminFooterTab({ initialData, adminPin, onSaved }: Props) {
  const [settings, setSettings] = useState<GeneralSettings>(initialData || defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "settings", data: settings }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Footer and contact info saved successfully to live website!" });
        onSaved(settings);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save settings." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving settings." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-2">
            Site-wide Footer &amp; Contact
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Footer, Campus Address &amp; Social Links
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A5A]">
            Control the contact phone numbers, admissions email, Madhapur campus address, and official social media handles.
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
        {/* Contact & Campus Info */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#3B0D3B]" />
            <span>Campus Location &amp; Admissions Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#8C6A8C]" />
                <span>Admissions Email</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail || ""}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="admissions@treqo.org"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#8C6A8C]" />
                <span>Official Contact Phone</span>
              </label>
              <input
                type="text"
                value={settings.supportPhone || ""}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                placeholder="+91 99480 00491"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B0B0F] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#8C6A8C]" />
              <span>Campus Address (Automatically linked to Google Maps in Footer)</span>
            </label>
            <textarea
              rows={2}
              value={settings.address || ""}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Plot No. 286, 4th Floor, Road No 16, Ayyappa Society Main Rd, Madhapur, Telangana 500081"
              className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B] resize-none"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#3B0D3B]" />
            <span>Social Media Handles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Instagram Profile URL</label>
              <input
                type="text"
                value={settings.instagramUrl || ""}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/treqo.ed"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">LinkedIn Company URL</label>
              <input
                type="text"
                value={settings.linkedinUrl || ""}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/treqo"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.youtubeUrl || ""}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/@treqo"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Twitter / X URL</label>
              <input
                type="text"
                value={settings.twitterUrl || ""}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                placeholder="https://x.com/treqo"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F]">Legal &amp; Copyright Notice</h3>

          <div>
            <label className="text-xs font-bold text-[#0B0B0F]">Copyright Line</label>
            <input
              type="text"
              value={settings.copyrightText || ""}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              placeholder="© 2026 Treqo School of Modern Learning Pvt. Ltd. All rights reserved."
              className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Footer & Contact Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
