"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  ExternalLink,
} from "lucide-react";
import type {
  CertificationsContent,
  CertItem,
  ProviderBadgeItem,
} from "@/lib/content-db";

interface Props {
  initialData?: CertificationsContent;
  adminPin: string;
  onSaved: (updated: CertificationsContent) => void;
}

const defaultCertifications: CertificationsContent = {
  eyebrow: "Credentials Built For The",
  eyebrowHighlight: "Real Market",
  description:
    "Graduate with official revenue capstone validation, plus 30+ industry credentials recruiters actively search for.",
  treqoBadge: "CAPSTONE REVENUE PROOF",
  treqoTitle: "TREQO Certification",
  treqoDescription:
    "Awarded on completion of your capstone project: a real campaign, built & launched with real numbers attached.",
  treqoTags: ["Live Spend Defense", "Verified ROAS", "Agency Capstone"],
  treqoCertificateImage: "/images/treqo-official-certificate.webp",
  treqoCaption:
    "Verifiable credential directly reviewed by placement hiring managers.",
  industryBadge: "GLOBAL CREDENTIALS",
  industryTitle: "Other Industry Certification",
  industryDescription:
    "From Google & Meta to HubSpot & SEMrush, graduate with 30+ credentials recruiters look for.",
  industryCaption:
    "All 30+ exam vouchers and preparation guides included with tuition.",
  providerBadges: [
    { name: "Google", color: "#4285F4", count: "8 certs" },
    { name: "Meta", color: "#0082FB", count: "6 certs" },
    { name: "HubSpot", color: "#FF7A59", count: "6 certs" },
    { name: "SEMrush", color: "#FF642D", count: "4 certs" },
  ],
  industryCerts: [
    { name: "Google My Business", provider: "Google", color: "#34A853" },
    { name: "Google Analytics (GA4)", provider: "Google", color: "#4285F4" },
    { name: "Google Ads Shopping", provider: "Google", color: "#EA4335" },
    { name: "Performance Max", provider: "Google", color: "#FBBC04" },
    { name: "Google Ads Video", provider: "Google", color: "#EA4335" },
    { name: "Google Ads Display", provider: "Google", color: "#34A853" },
    { name: "Fundamentals of Digital Mkt", provider: "Google", color: "#4285F4" },
    { name: "Google Ads Search", provider: "Google", color: "#FBBC04" },
    { name: "Community Manager", provider: "Meta", price: "$99", color: "#0082FB" },
    { name: "Creative Strategy Pro", provider: "Meta", price: "$150", color: "#0082FB" },
    { name: "Media Planning Pro", provider: "Meta", price: "$150", color: "#0082FB" },
    { name: "Marketing Science Pro", provider: "Meta", price: "$150", color: "#0082FB" },
    { name: "Digital Marketing Assoc.", provider: "Meta", price: "$99", color: "#0082FB" },
    { name: "Media Buying Pro", provider: "Meta", price: "$150", color: "#0082FB" },
    { name: "SEO Certification", provider: "HubSpot", color: "#FF7A59" },
    { name: "Digital Marketing", provider: "HubSpot", color: "#FF7A59" },
    { name: "Social Media Marketing", provider: "HubSpot", color: "#FF7A59" },
    { name: "Email Marketing", provider: "HubSpot", color: "#FF7A59" },
    { name: "Inbound Marketing", provider: "HubSpot", color: "#FF7A59" },
    { name: "Content Marketing", provider: "HubSpot", color: "#FF7A59" },
    { name: "PPC Fundamentals", provider: "SEMrush", color: "#FF642D" },
    { name: "SEO Fundamentals", provider: "SEMrush", color: "#FF642D" },
    { name: "Social Media", provider: "SEMrush", color: "#FF642D" },
    { name: "Content Marketing", provider: "SEMrush", color: "#FF642D" },
  ],
};

const PROVIDER_COLORS: Record<string, string> = {
  Google: "#4285F4",
  Meta: "#0082FB",
  HubSpot: "#FF7A59",
  SEMrush: "#FF642D",
};

export default function AdminCertificationsTab({
  initialData,
  adminPin,
  onSaved,
}: Props) {
  const [data, setData] = useState<CertificationsContent>(
    initialData || defaultCertifications
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // New item inputs
  const [newTagInput, setNewTagInput] = useState("");
  const [newCertName, setNewCertName] = useState("");
  const [newCertProvider, setNewCertProvider] = useState<string>("Google");
  const [newCertPrice, setNewCertPrice] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

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
        certifications: data,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": adminPin,
        },
        body: JSON.stringify({ type: "home", data: updatedHome }),
      });

      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: "Certifications section saved successfully!",
        });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save certifications." });
      }
    } catch {
      setStatusMsg({
        type: "error",
        text: "Network error saving certifications.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function isImage(file: File) {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) return true;
    return /\.(png|jpe?g|webp|svg|gif|avif|ico)$/i.test(file.name);
  }

  async function handleImageUpload(file: File) {
    if (!isImage(file)) {
      setStatusMsg({
        type: "error",
        text: "Please upload a valid image file (PNG, JPG, WEBP).",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "certs");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": adminPin },
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        const updatedCertifications = {
          ...data,
          treqoCertificateImage: resData.url,
        };
        setData(updatedCertifications);

        // Auto-save immediately to database so user doesn't need to manually click save
        try {
          const getRes = await fetch("/api/admin/content", {
            headers: { "x-admin-pin": adminPin },
          });
          const current = await getRes.json();
          const updatedHome = {
            ...(current.homeContent || {}),
            certifications: updatedCertifications,
          };

          const saveRes = await fetch("/api/admin/content", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-pin": adminPin,
            },
            body: JSON.stringify({ type: "home", data: updatedHome }),
          });

          if (saveRes.ok) {
            setStatusMsg({
              type: "success",
              text: "Certificate uploaded and published to website!",
            });
            onSaved(updatedCertifications);
          } else {
            setStatusMsg({
              type: "success",
              text: "Uploaded! Click 'Save Certifications' below to publish.",
            });
          }
        } catch {
          setStatusMsg({
            type: "success",
            text: "Uploaded! Click 'Save Certifications' below to publish.",
          });
        }
      } else {
        setStatusMsg({
          type: "error",
          text: resData.error || "Upload failed.",
        });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error during upload." });
    } finally {
      setIsUploadingImage(false);
    }
  }

  // Tag helper functions
  function handleAddTag() {
    if (!newTagInput.trim()) return;
    const currentTags = data.treqoTags || defaultCertifications.treqoTags || [];
    setData({
      ...data,
      treqoTags: [...currentTags, newTagInput.trim()],
    });
    setNewTagInput("");
  }

  function handleRemoveTag(index: number) {
    const currentTags = data.treqoTags || defaultCertifications.treqoTags || [];
    setData({
      ...data,
      treqoTags: currentTags.filter((_, i) => i !== index),
    });
  }

  // Provider badge helper
  function updateProviderBadge(
    index: number,
    field: keyof ProviderBadgeItem,
    value: string
  ) {
    const currentBadges = [
      ...(data.providerBadges || defaultCertifications.providerBadges || []),
    ];
    currentBadges[index] = { ...currentBadges[index], [field]: value };
    setData({ ...data, providerBadges: currentBadges });
  }

  // Industry certs helper functions
  function handleAddCert() {
    if (!newCertName.trim()) return;
    const currentCerts = [
      ...(data.industryCerts || defaultCertifications.industryCerts || []),
    ];
    const newCert: CertItem = {
      name: newCertName.trim(),
      provider: newCertProvider,
      color: PROVIDER_COLORS[newCertProvider] || "#3B0D3B",
      price: newCertPrice.trim() || undefined,
    };
    setData({
      ...data,
      industryCerts: [newCert, ...currentCerts],
    });
    setNewCertName("");
    setNewCertPrice("");
  }

  function handleRemoveCert(index: number) {
    const currentCerts = [
      ...(data.industryCerts || defaultCertifications.industryCerts || []),
    ];
    setData({
      ...data,
      industryCerts: currentCerts.filter((_, i) => i !== index),
    });
  }

  function updateCertItem(
    index: number,
    field: keyof CertItem,
    value: string
  ) {
    const currentCerts = [
      ...(data.industryCerts || defaultCertifications.industryCerts || []),
    ];
    currentCerts[index] = {
      ...currentCerts[index],
      [field]: value,
      ...(field === "provider" && PROVIDER_COLORS[value]
        ? { color: PROVIDER_COLORS[value] }
        : {}),
    };
    setData({ ...data, industryCerts: currentCerts });
  }

  const treqoTags = data.treqoTags || defaultCertifications.treqoTags || [];
  const providerBadges =
    data.providerBadges || defaultCertifications.providerBadges || [];
  const industryCerts =
    data.industryCerts || defaultCertifications.industryCerts || [];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Certificate */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            handleImageUpload(f);
          }
          e.target.value = "";
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-2">
            Credentials &amp; Compliance
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Program Certifications
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A5A]">
            Manage TREQO Capstone Certificate and Industry Marquee Credentials (Google, Meta, HubSpot, SEMrush).
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
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section Heading & Subtitle */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#3B0D3B]" />
            <span>Section Header</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Title Prefix / Main Text
              </label>
              <input
                type="text"
                value={data.eyebrow || ""}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="Credentials Built For The"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Title Highlight (Serif Italic)
              </label>
              <input
                type="text"
                value={data.eyebrowHighlight || ""}
                onChange={(e) =>
                  setData({ ...data, eyebrowHighlight: e.target.value })
                }
                placeholder="Real Market"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B0B0F]">
              Section Description
            </label>
            <textarea
              rows={2}
              value={data.description || ""}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              placeholder="Graduate with official revenue capstone validation, plus 30+ industry credentials recruiters actively search for."
              className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
            />
          </div>
        </div>

        {/* 2-Column Editor: Left (TREQO) and Right (Industry) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE: TREQO CERTIFICATION */}
          <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#3B0D3B]" />
                <span>Left Side: TREQO Certification</span>
              </h3>
              <span className="text-[10px] font-bold text-[#3B0D3B] bg-[#3B0D3B]/10 px-2 py-0.5 rounded-full">
                50% Column
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={data.treqoBadge || ""}
                  onChange={(e) =>
                    setData({ ...data, treqoBadge: e.target.value })
                  }
                  placeholder="CAPSTONE REVENUE PROOF"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Card Title
                </label>
                <input
                  type="text"
                  value={data.treqoTitle || ""}
                  onChange={(e) =>
                    setData({ ...data, treqoTitle: e.target.value })
                  }
                  placeholder="TREQO Certification"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Card Description
              </label>
              <textarea
                rows={2}
                value={data.treqoDescription || ""}
                onChange={(e) =>
                  setData({ ...data, treqoDescription: e.target.value })
                }
                placeholder="Awarded on completion of your capstone project..."
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            {/* Feature Tags / Badges */}
            <div>
              <label className="text-xs font-bold text-[#0B0B0F] block mb-1.5">
                Highlight Chips / Feature Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {treqoTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#FDFAF6] border border-[#3B0D3B]/15 text-[#3B0D3B] font-semibold"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a new tag (e.g. Live Spend Defense)"
                  className="flex-1 rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-1.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-xl bg-[#3B0D3B] text-white text-xs font-bold hover:bg-[#5A2A5A] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Certificate Image Upload & Preview */}
            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-[#0B0B0F] block mb-1">
                Official Certificate Image
              </label>
              <p className="text-[11px] text-slate-500 mb-3">
                Upload the high-resolution certificate mockup displayed on the left column.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-48 h-32 rounded-xl border border-dashed border-[#3B0D3B]/20 bg-[#FDFAF6] flex items-center justify-center overflow-hidden shrink-0 group">
                  {data.treqoCertificateImage ? (
                    <Image
                      src={data.treqoCertificateImage}
                      alt="Certificate Preview"
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <Award className="h-6 w-6 text-[#3B0D3B]/40 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={data.treqoCertificateImage || ""}
                    onChange={(e) =>
                      setData({ ...data, treqoCertificateImage: e.target.value })
                    }
                    placeholder="/images/treqo-official-certificate.png"
                    className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B0D3B]/20 bg-white text-xs font-bold text-[#3B0D3B] hover:bg-[#FDFAF6] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {isUploadingImage ? "Uploading..." : "Upload New File"}
                      </span>
                    </button>
                    {data.treqoCertificateImage && (
                      <a
                        href={data.treqoCertificateImage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:text-[#3B0D3B]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Caption */}
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Sub-caption Below Certificate
              </label>
              <input
                type="text"
                value={data.treqoCaption || ""}
                onChange={(e) =>
                  setData({ ...data, treqoCaption: e.target.value })
                }
                placeholder="Verifiable credential directly reviewed by placement hiring managers."
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>

          {/* RIGHT SIDE: OTHER INDUSTRY CERTIFICATION */}
          <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
                <Award className="h-4 w-4 text-[#3B0D3B]" />
                <span>Right Side: Other Industry Certification</span>
              </h3>
              <span className="text-[10px] font-bold text-[#3B0D3B] bg-[#3B0D3B]/10 px-2 py-0.5 rounded-full">
                50% Column
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={data.industryBadge || ""}
                  onChange={(e) =>
                    setData({ ...data, industryBadge: e.target.value })
                  }
                  placeholder="GLOBAL CREDENTIALS"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">
                  Card Title
                </label>
                <input
                  type="text"
                  value={data.industryTitle || ""}
                  onChange={(e) =>
                    setData({ ...data, industryTitle: e.target.value })
                  }
                  placeholder="Other Industry Certification"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Card Description
              </label>
              <textarea
                rows={2}
                value={data.industryDescription || ""}
                onChange={(e) =>
                  setData({ ...data, industryDescription: e.target.value })
                }
                placeholder="From Google & Meta to HubSpot & SEMrush, graduate with 30+ credentials recruiters look for."
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>

            {/* Provider Summary Badges */}
            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-[#0B0B0F] block mb-1.5">
                Provider Badges Row (Counters)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {providerBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl border border-slate-200 bg-[#FDFAF6] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-black"
                        style={{ color: badge.color }}
                      >
                        {badge.name}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={badge.count}
                      onChange={(e) =>
                        updateProviderBadge(idx, "count", e.target.value)
                      }
                      placeholder="8 certs"
                      className="w-full text-[10px] font-semibold bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 focus:outline-none focus:border-[#3B0D3B]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Caption */}
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">
                Sub-caption Below Marquee
              </label>
              <input
                type="text"
                value={data.industryCaption || ""}
                onChange={(e) =>
                  setData({ ...data, industryCaption: e.target.value })
                }
                placeholder="All 30+ exam vouchers and preparation guides included with tuition."
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>
        </div>

        {/* Marquee Industry Certifications Manager */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#3B0D3B]" />
                <span>Industry Marquee Certifications List ({industryCerts.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                These cards dynamically scroll inside the dual vertical marquee columns.
              </p>
            </div>
          </div>

          {/* Add New Certification Card Form */}
          <div className="p-4 rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] space-y-3">
            <span className="text-xs font-extrabold text-[#3B0D3B] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Certification</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="text-[11px] font-bold text-[#0B0B0F]">
                  Certification Name
                </label>
                <input
                  type="text"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  placeholder="e.g. Meta Performance Marketing"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] font-bold text-[#0B0B0F]">
                  Provider
                </label>
                <select
                  value={newCertProvider}
                  onChange={(e) => setNewCertProvider(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                >
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="HubSpot">HubSpot</option>
                  <option value="SEMrush">SEMrush</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#0B0B0F]">
                  Price / Exam Tag
                </label>
                <input
                  type="text"
                  value={newCertPrice}
                  onChange={(e) => setNewCertPrice(e.target.value)}
                  placeholder="e.g. $150 (or blank)"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#3B0D3B] text-white text-xs font-bold hover:bg-[#5A2A5A] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Cert</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {industryCerts.map((cert, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-[#3B0D3B]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${cert.color || "#3B0D3B"}15`,
                      color: cert.color || "#3B0D3B",
                      border: `1px solid ${cert.color || "#3B0D3B"}30`,
                    }}
                  >
                    {cert.provider}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(idx)}
                    className="text-slate-400 hover:text-red-600 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Delete certificate"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertItem(idx, "name", e.target.value)}
                  className="text-xs font-bold text-[#1A0A1A] w-full border-b border-transparent hover:border-slate-300 focus:border-[#3B0D3B] bg-transparent focus:outline-none py-0.5 mb-2"
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <input
                    type="text"
                    value={cert.price || ""}
                    onChange={(e) =>
                      updateCertItem(idx, "price", e.target.value)
                    }
                    placeholder="Included"
                    className="text-[10px] font-bold text-slate-500 w-24 bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-400">
                    #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-[#3B0D3B]/15 shadow-lg">
          <button
            type="button"
            onClick={() => setData(defaultCertifications)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Reset to Defaults
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#3B0D3B] text-white text-xs font-bold hover:bg-[#5A2A5A] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving Section..." : "Save Certifications"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
