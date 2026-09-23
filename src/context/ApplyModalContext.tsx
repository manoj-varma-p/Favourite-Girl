"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { FormSettings } from "@/types/forms";
import { defaultFormSettings } from "@/types/forms";

interface ApplyModalContextType {
  isOpen: boolean;
  courseName: string;
  openApplyModal: (course?: string) => void;
  closeApplyModal: () => void;

  // Curriculum Download Modal
  isCurriculumOpen: boolean;
  curriculumCourse: string;
  curriculumPdfUrl: string;
  openCurriculumModal: (course?: string, pdfUrl?: string) => void;
  closeCurriculumModal: () => void;

  // Form Titles & Labels
  forms: FormSettings;
}

const ApplyModalContext = createContext<ApplyModalContextType | undefined>(undefined);

export function ApplyModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [courseName, setCourseName] = useState("New Age Digital Marketing");

  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [curriculumCourse, setCurriculumCourse] = useState("New Age Digital Marketing");
  const [curriculumPdfUrl, setCurriculumPdfUrl] = useState("/curriculum/new-age-digital-marketing-curriculum.pdf");

  const [forms, setForms] = useState<FormSettings>(defaultFormSettings);

  useEffect(() => {
    fetch("/api/forms")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.forms) {
          setForms(data.forms);
        }
      })
      .catch(() => {});
  }, []);

const courseSlugMap: Record<string, string> = {
  "digital-marketing": "New Age Digital Marketing",
  "fundamentals": "Fundamentals of Digital Marketing",
  "4m-program": "New Age Digital Marketing (On Campus)",
  "pgdm": "Treqo PGDM in Modern Marketing",
  "founder-semester": "The Founder Semester",
  "performance-growth": "Performance & Growth Specialist",
  "brand-strategy": "Executive Growth & Brand Strategy",
  "ai-first-marketing": "AI-First Performance Marketing",
  "creative-strategy": "Creative Strategy & High-Converting Content",
  "marketing-analytics": "Marketing Analytics & Attribution",
  "social-growth": "Social Media & Community Growth",
  "martech": "MarTech, Automation & Funnel Architecture",
};

function detectCourseFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const path = window.location.pathname;
  if (path.startsWith("/categories/")) {
    const slug = path.replace(/^\/categories\//, "").replace(/\/.*$/, "").trim();
    if (courseSlugMap[slug]) return courseSlugMap[slug];
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return undefined;
}

  function openApplyModal(course?: string) {
    const targetCourse = course || detectCourseFromUrl() || "New Age Digital Marketing";
    setCourseName(targetCourse);
    setIsOpen(true);
  }

  function closeApplyModal() {
    setIsOpen(false);
  }

  function openCurriculumModal(course?: string, pdfUrl?: string) {
    const targetCourse = course || detectCourseFromUrl() || "New Age Digital Marketing";
    setCurriculumCourse(targetCourse);
    if (pdfUrl) {
      setCurriculumPdfUrl(pdfUrl);
    } else {
      setCurriculumPdfUrl("/curriculum/new-age-digital-marketing-curriculum.pdf");
    }
    setIsCurriculumOpen(true);
  }

  function closeCurriculumModal() {
    setIsCurriculumOpen(false);
  }

  useEffect(() => {
    function handleCustomEvent(e: Event) {
      const customEvent = e as CustomEvent<{ course?: string }>;
      openApplyModal(customEvent.detail?.course);
    }

    window.addEventListener("open-apply-modal", handleCustomEvent);
    return () => {
      window.removeEventListener("open-apply-modal", handleCustomEvent);
    };
  }, []);

  return (
    <ApplyModalContext.Provider
      value={{
        isOpen,
        courseName,
        openApplyModal,
        closeApplyModal,
        isCurriculumOpen,
        curriculumCourse,
        curriculumPdfUrl,
        openCurriculumModal,
        closeCurriculumModal,
        forms,
      }}
    >
      {children}
    </ApplyModalContext.Provider>
  );
}

export function useApplyModal() {
  const context = useContext(ApplyModalContext);
  if (!context) {
    throw new Error("useApplyModal must be used within an ApplyModalProvider");
  }
  return context;
}

export function triggerApplyModal(course?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-apply-modal", { detail: { course } })
    );
  }
}
