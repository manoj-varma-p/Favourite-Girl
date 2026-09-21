"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Save, Upload, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import type { GovCertsContent } from "@/lib/content-db";

interface Props {
  initialData?: GovCertsContent;
  adminPin: string;
  onSaved: (updated: GovCertsContent) => void;
}

const defaultGovCerts: GovCertsContent = {
  eyebrow: "Officially Recognised",
  title: "Government Certified",
  titleHighlight: "Institution",
  subtitle: "Recognised by official government initiatives & accredited ministries",
  certs: [
    { src: "/msme.png", label: "MSME Registered", sub: "Ministry of MSME, Govt. of India" },
    { src: "/001.png", label: "Recognized by DPIIT", sub: "Department for Promotion of Industry and Internal Trade" },
    { src: "/dpiit.png", label: "DPIIT Recognised", sub: "Startup India, Govt. of India" },
  ],
};

export default function AdminGovCertsTab({ initialData, adminPin, onSaved }: Props) {
  const [data, setData] = useState<GovCertsContent>(initialData || defaultGovCerts);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeCertUploadIdx = useRef<number | null>(null);

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
        govCerts: data,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({ type: "home", data: updatedHome }),
      });

      if (res.ok) {
        setStatusMsg({ type: "success", text: "Government Certifications section saved successfully!" });
        onSaved(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to save certifications." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error saving certifications." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  }

  function updateCert(index: number, field: "src" | "label" | "sub", val: string) {
    const next = [...(data.certs || defaultGovCerts.certs)];
    next[index] = { ...next[index], [field]: val };
    setData({ ...data, certs: next });
  }

  async function handleCertUpload(file: File, index: number) {
    if (!file || !file.type.startsWith("image/")) {
      setStatusMsg({ type: "error", text: "Please upload a valid image file." });
      return;
    }
    setUploadingIdx(index);

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
        updateCert(index, "src", resData.url);
        setStatusMsg({ type: "success", text: "Certificate logo uploaded!" });
      } else {
        setStatusMsg({ type: "error", text: resData.error || "Upload failed." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error during upload." });
    } finally {
      setUploadingIdx(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && activeCertUploadIdx.current !== null) {
            handleCertUpload(f, activeCertUploadIdx.current);
          }
          e.target.value = "";
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] text-[10px] font-bold uppercase tracking-wider mb-2">
            Homepage Section
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
            Government Accreditations &amp; Certifications
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4A5A]">
            Edit government recognition badges (MSME, DPIIT, Startup India) and official accredited ministry text.
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
        {/* Section Heading */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#3B0D3B]" />
            <span>Section Titles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Eyebrow Tag</label>
              <input
                type="text"
                value={data.eyebrow || ""}
                onChange={(e) => setData({ ...data, eyebrow: e.target.value })}
                placeholder="Officially Recognised"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Main Title</label>
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Government Certified"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#0B0B0F]">Highlighted Word</label>
              <input
                type="text"
                value={data.titleHighlight || ""}
                onChange={(e) => setData({ ...data, titleHighlight: e.target.value })}
                placeholder="Institution"
                className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#3B0D3B] font-bold focus:outline-none focus:border-[#3B0D3B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0B0B0F]">Subtitle Text</label>
            <input
              type="text"
              value={data.subtitle || ""}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              placeholder="Recognised by official government initiatives & accredited ministries"
              className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FDFAF6] px-3.5 py-2 text-xs text-[#5A4A5A] focus:outline-none focus:border-[#3B0D3B]"
            />
          </div>
        </div>

        {/* 3 Accreditation Badges */}
        <div className="rounded-xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#0B0B0F]">Government Badges &amp; Logos</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(data.certs || defaultGovCerts.certs).map((cert, idx) => (
              <div key={idx} className="rounded-xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-4 space-y-3">
                {/* Logo Preview & Uploader */}
                <div className="h-28 rounded-xl bg-white p-3 flex items-center justify-center relative overflow-hidden border border-[#3B0D3B]/10">
                  {cert.src ? (
                    <Image
                      src={cert.src}
                      alt={cert.label}
                      width={180}
                      height={90}
                      className="max-h-20 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xs text-[#8C6A8C] font-bold">No logo uploaded</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert.src}
                    onChange={(e) => updateCert(idx, "src", e.target.value)}
                    placeholder="/logo.png"
                    className="flex-1 rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-[11px] text-[#0B0B0F] focus:outline-none focus:border-[#3B0D3B]"
                  />
                  <button
                    type="button"
                    disabled={uploadingIdx === idx}
                    onClick={() => {
                      activeCertUploadIdx.current = idx;
                      fileInputRef.current?.click();
                    }}
                    className="p-1.5 rounded-md bg-[#3B0D3B] hover:bg-[#2A082A] text-white cursor-pointer"
                    title="Upload Badge Image"
                  >
                    <Upload className="h-3 w-3" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5A4A5A]">Badge Label</label>
                  <input
                    type="text"
                    value={cert.label}
                    onChange={(e) => updateCert(idx, "label", e.target.value)}
                    placeholder="MSME Registered"
                    className="mt-0.5 w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-xs text-[#0B0B0F] font-bold focus:outline-none focus:border-[#3B0D3B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5A4A5A]">Issuing Authority / Subtitle</label>
                  <input
                    type="text"
                    value={cert.sub}
                    onChange={(e) => updateCert(idx, "sub", e.target.value)}
                    placeholder="Ministry of MSME, Govt. of India"
                    className="mt-0.5 w-full rounded-md border border-[#3B0D3B]/15 bg-white px-2 py-1 text-[11px] text-[#5A4A5A] focus:outline-none focus:border-[#3B0D3B]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Government Certifications"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
