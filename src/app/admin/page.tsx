"use client";

import { useEffect, useState, useMemo, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  Download,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Trash2,
  Filter,
  ArrowLeft,
  LogOut,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  Layers,
  Users,
  ShieldCheck,
  Settings,
  Sparkles,
  HelpCircle,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertCircle,
  Database,
  Image as ImageIcon,
  Save,
  X,
  Lock,
  Unlock,
  LogIn,
  LayoutDashboard,
  Clock,
  FileText,
  GraduationCap,
  MessageSquare,
  Send,
  Check,
  Upload,
  FolderOpen,
} from "lucide-react";
import type { Lead } from "@/lib/leads-db";
import type { BlogPost } from "@/data/blogs";
import type {
  GeneralSettings,
  LayoutSettings,
  NavigationSettings,
  HomePageContent,
  CourseItem,
  TutorItem,
  TestimonialItem,
  AlertSettings,
  FormSettings,
} from "@/lib/content-db";
import { defaultFormSettings } from "@/types/forms";
import AdminWhyTreqqoTab from "@/components/admin/AdminWhyTreqqoTab";
import AdminPlacementsTab from "@/components/admin/AdminPlacementsTab";
import AdminGovCertsTab from "@/components/admin/AdminGovCertsTab";
import AdminSixDecisionsTab from "@/components/admin/AdminSixDecisionsTab";
import AdminFooterTab from "@/components/admin/AdminFooterTab";
import AdminLayoutMetaTab from "@/components/admin/AdminLayoutMetaTab";
import AdminCourseEditor from "@/components/admin/AdminCourseEditor";
import { Award, Trophy, Compass, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_GRADIENTS = [
  "from-[#16213e] via-[#1a3ba8] to-[#2563eb]",
  "from-[#1e3a8a] via-[#3b82f6] to-[#1d4ed8]",
  "from-[#0f172a] via-[#1e293b] to-[#334155]",
];

function tutorInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const DEFAULT_PIN = "treqo2026";
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;

const emptySubscribe = () => () => { };
function useAdminSession() {
  return useSyncExternalStore(
    emptySubscribe,
    () => (typeof window !== "undefined" ? sessionStorage.getItem("treqo_admin_auth") === "true" : false),
    () => false
  );
}

export default function CustomAdminPanelPage() {
  const isSessionAuthed = useAdminSession();
  const [unlocked, setUnlocked] = useState(false);
  const isAuthenticated = isSessionAuthed || unlocked;

  // Login form state
  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tabs: overview | leads | courses | tutors | alerts | forms | layout | branding | banner | hero | whyTreqqo | placements | govCerts | sixDecisions | footer | faqs | blogs
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "leads"
    | "courses"
    | "tutors"
    | "alerts"
    | "forms"
    | "layout"
    | "branding"
    | "banner"
    | "hero"
    | "whyTreqqo"
    | "placements"
    | "govCerts"
    | "sixDecisions"
    | "footer"
    | "faqs"
    | "blogs"
  >("overview");

  const [currentTime, setCurrentTime] = useState("11:48 am IST");
  const [currentDate, setCurrentDate] = useState("Thursday, 10 September");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) + " IST"
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Notifications
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");

  // 2. Content States
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteTitle: "TREQO",
    logoText: "TREQO",
    logoImage: "",
    supportEmail: "admissions@treqo.org",
    supportPhone: "+91 99480 00491",
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    siteTitle: "TREQO",
    titleTemplate: "%s | TREQO",
    metaDescription:
      "TREQO is a digital marketing learning system built around 70% doing, live brand projects, and capstone revenue proof.",
    metaKeywords: [
      "Digital Marketing Course",
      "Performance Marketing",
      "Growth Marketing",
      "Marketing School Hyderabad",
      "Live Ad Campaigns",
      "Treqo",
    ],
    authorName: "Treqo School of Modern Learning",
    canonicalUrl: "https://treqo.org",
    ogTitle: "TREQO: LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
    ogDescription:
      "TREQO is a digital marketing learning system built around 70% doing, live brand projects, and capstone revenue proof.",
    ogImage: "/icon.svg",
    twitterTitle: "TREQO: The Marketing School",
    twitterDescription: "LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
    twitterCard: "summary_large_image",
    robotsIndex: true,
    robotsFollow: true,
    googleSiteVerification: "",
  });

  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>({
    bannerBadge: "BATCH 2 · 50 SEATS",
    bannerText: "Applications close on 25th September 2026.",
    bannerLinkText: "Explore the courses",
    bannerLinkHref: "/#courses",
  });

  const [homeContent, setHomeContent] = useState<HomePageContent>({
    hero: {
      eyebrow: "New Age Digital Marketing",
      headlineLines: ["LEARN THE SKILLS.", "BUILD THE MINDSET", "BREAK THE PATTERN.",],
      description:
        "Four months. 12 phases. A real client at every stage. You finish holding campaigns you ran, numbers you own, and answers that hold up in an interview.",
    },
    stats: [
      { value: "100%", label: "Live Brand Work" },
      { value: "12", label: "Structured Phases" },
      { value: "1:1", label: "Direct Mentorship" },
    ],
    faqs: [],
  });

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // 3. Courses State
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseForm, setCourseForm] = useState<CourseItem>({
    id: "",
    title: "",
    href: "",
    badge: "BATCH 2 · OPEN",
    duration: "4 months · Online",
    description: "",
    isFlagship: false,
    isLocked: false,
    batch: "Batch 2 · Sep 2026",
    feeTotal: "₹55,000",
    feeEmi: "₹4,583 / month",
    curriculumPdf: "/treqo-curriculum.pdf",
    overview: "",
    applyCta: "Apply for Batch 2",
    syllabusCta: "Download Curriculum",
    image: "",
    previewLabel: "CLASSROOM · CEO CHALLENGE REVIEW",
  });
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<"all" | "open" | "locked">("all");
  const [courseInStudio, setCourseInStudio] = useState<CourseItem | null>(null);
  const [isUploadingCourseImage, setIsUploadingCourseImage] = useState(false);
  const [isCourseDragActive, setIsCourseDragActive] = useState(false);
  const [showManualCourseUrl, setShowManualCourseUrl] = useState(false);
  const courseFileInputRef = useRef<HTMLInputElement | null>(null);

  // 4. Tutors / Mentors State
  const [tutors, setTutors] = useState<TutorItem[]>([]);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<TutorItem | null>(null);
  const [tutorForm, setTutorForm] = useState<TutorItem>({
    id: "",
    name: "",
    role: "",
    mentored: "500+",
    image: "",
  });
  const [isUploadingTutorImage, setIsUploadingTutorImage] = useState(false);
  const [isTutorDragActive, setIsTutorDragActive] = useState(false);
  const [showManualTutorUrl, setShowManualTutorUrl] = useState(false);
  const tutorFileInputRef = useRef<HTMLInputElement | null>(null);

  // 5. Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialItem>({
    id: "",
    name: "",
    role: "",
    company: "",
    quote: "",
    image: "",
  });
  const [isUploadingTestimonialImage, setIsUploadingTestimonialImage] = useState(false);
  const [isTestimonialDragActive, setIsTestimonialDragActive] = useState(false);
  const [showManualTestimonialUrl, setShowManualTestimonialUrl] = useState(false);
  const testimonialFileInputRef = useRef<HTMLInputElement | null>(null);

  // 6. Alerts State
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    notifyEmails: "admissions@treqo.org",
    notifyPhones: "+91 99480 00491",
    emailAlertsEnabled: true,
    smsAlertsEnabled: true,
    smsProvider: "fast2sms",
    smsApiKey: "",
    webhookUrl: "",
  });
  const [isSavingAlerts, setIsSavingAlerts] = useState(false);
  const [isTestingAlert, setIsTestingAlert] = useState(false);
  const [testAlertResult, setTestAlertResult] = useState<string | null>(null);

  // 7. Form Titles & Popups State
  const [formSettings, setFormSettings] = useState<FormSettings>(defaultFormSettings);
  const [isSavingForms, setIsSavingForms] = useState(false);

  // 8. Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category: "Performance Marketing" as BlogPost["category"],
    coverImage: "",
    excerpt: "",
    authorName: "Manoj Varma",
    authorRole: "Founder & Growth Architect, Treqo",
    readTime: "5 min read",
    tags: "Meta Ads, Growth, Strategy",
    body: "",
  });
  const [isUploadingBlogImage, setIsUploadingBlogImage] = useState(false);
  const [isBlogDragActive, setIsBlogDragActive] = useState(false);
  const [showManualBlogUrl, setShowManualBlogUrl] = useState(false);
  const blogFileInputRef = useRef<HTMLInputElement | null>(null);
  const [mediaFiles, setMediaFiles] = useState<Array<{ url: string; name: string; size: number }>>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // 9. FAQ Modal State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    category: "General",
    question: "",
    answer: "",
  });

  function getStoredPin(): string {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("treqo_admin_pin") || ADMIN_PIN;
  }

  function notifySuccess(msg: string) {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  }

  function notifyError(msg: string) {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  }

  // Fast concurrent data loading
  async function loadAllData() {
    try {
      const pin = getStoredPin();
      setLoadingLeads(true);

      const [leadsRes, contentRes] = await Promise.all([
        fetch("/api/leads", { headers: { "x-admin-pin": pin } }),
        fetch("/api/admin/content", { headers: { "x-admin-pin": pin } }),
      ]);

      if (leadsRes.ok) {
        const d = await leadsRes.json();
        setLeads(d.leads || []);
      }

      if (contentRes.ok) {
        const d = await contentRes.json();
        if (d.settings) setGeneralSettings(d.settings);
        if (d.layoutSettings) setLayoutSettings(d.layoutSettings);
        if (d.navigation) setNavigationSettings(d.navigation);
        if (d.homeContent) setHomeContent(d.homeContent);
        if (d.blogs) setBlogs(d.blogs);
        if (d.courses) setCourses(d.courses);
        if (d.tutors) setTutors(d.tutors);
        if (d.testimonials) setTestimonials(d.testimonials);
        if (d.alerts) setAlertSettings(d.alerts);
        if (d.forms) setFormSettings(d.forms);
      }
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoadingLeads(false);
    }
  }

  async function handleSaveForms(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingForms(true);
    try {
      const pin = getStoredPin();
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": pin },
        body: JSON.stringify({ type: "forms", data: formSettings }),
      });
      if (res.ok) {
        notifySuccess("Form titles and modal copy updated successfully!");
      } else {
        notifyError("Failed to save form titles.");
      }
    } catch {
      notifyError("Connection error while saving form titles.");
    } finally {
      setIsSavingForms(false);
    }
  }

  // Course Management Handlers
  async function handleToggleCourseLock(id: string) {
    const targetCourse = courses.find((c) => c.id === id);
    const newLockState = !targetCourse?.isLocked;
    const updated = courses.map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        isLocked: newLockState,
        actionText: newLockState ? "Get notified →" : "View course →",
        badge: newLockState
          ? "COMING SOON"
          : (c.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (c.badge || "BATCH 2 · OPEN")),
        badgeVariant: (newLockState
          ? "gray"
          : (c.badgeVariant === "gray" ? "blue" : (c.badgeVariant || "blue"))) as CourseItem["badgeVariant"],
        applyCta: newLockState
          ? "Notify Me When Open"
          : (c.applyCta === "Notify Me When Open" ? "Apply for Batch 2" : (c.applyCta || "Apply for Batch 2")),
        href: c.href || `/categories/${c.id}`,
        actionHref: c.actionHref || c.href || `/categories/${c.id}`,
      };
    });
    setCourses(updated);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "courses", data: updated }),
      });
      if (res.ok) {
        notifySuccess(
          newLockState
            ? `Locked "${targetCourse?.title}" (Displays "Get notified")`
            : `Unlocked "${targetCourse?.title}" (Displays "View course")`
        );
      } else {
        notifyError("Failed to update course lock state.");
      }
    } catch {
      notifyError("Network error updating lock state.");
    }
  }

  function openNewCourseModal() {
    setEditingCourse(null);
    setCourseForm({
      id: `course-${Date.now()}`,
      title: "",
      href: "/categories/new-track",
      badge: "BATCH 2 · OPEN",
      duration: "4 months · Online",
      description: "",
      isFlagship: false,
      isLocked: false,
      batch: "Batch 2 · Sep 2026",
      feeTotal: "₹55,000",
      feeEmi: "₹4,583 / month",
      curriculumPdf: "/treqo-curriculum.pdf",
      overview: "",
      applyCta: "Apply for Batch 2",
      syllabusCta: "Download Curriculum",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      previewLabel: "CLASSROOM · CEO CHALLENGE REVIEW",
    });
    setShowManualCourseUrl(false);
    setIsCourseDragActive(false);
    setIsCourseModalOpen(true);
  }

  function openCourseStudio(c: CourseItem) {
    setCourseInStudio(c);
  }

  function openNewCourseStudio() {
    const newCourse: CourseItem = {
      id: `course-${Date.now()}`,
      title: "New Curriculum Track",
      href: `/categories/track-${Date.now()}`,
      badge: "BATCH 2 · OPEN",
      badgeVariant: "blue",
      duration: "4 months · Online",
      meta: "4 months · Online",
      description: "Hands-on growth architecture with real client budgets, verified live campaigns, and mentor reviews.",
      isFlagship: false,
      isLocked: false,
      batch: "Batch 2 · Sep 2026",
      feeTotal: "₹55,000",
      feeEmi: "₹4,583 / month",
      curriculumPdf: "/treqo-curriculum.pdf",
      overview: "Graduates and early-career marketers wanting verifiable execution proof.\nWorking professionals seeking high-trajectory marketing roles.\nFounders scaling their own customer acquisition.",
      applyCta: "Apply for Batch 2",
      syllabusCta: "Download Curriculum",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      previewLabel: "CLASSROOM · CEO CHALLENGE REVIEW",
    };
    setCourseInStudio(newCourse);
  }

  function openEditCourseModal(c: CourseItem) {
    // Directly open the full Course Studio!
    openCourseStudio(c);
  }

  async function handleCourseImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notifyError("Image size exceeds 8MB limit.");
      return;
    }

    setIsUploadingCourseImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "courses");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": getStoredPin() },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCourseForm((prev) => ({ ...prev, image: data.url }));
        notifySuccess("Course cover photo uploaded successfully!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading cover photo.");
    } finally {
      setIsUploadingCourseImage(false);
      setIsCourseDragActive(false);
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (courseFilter === "open" && c.isLocked) return false;
      if (courseFilter === "locked" && !c.isLocked) return false;
      if (!courseSearch.trim()) return true;
      const q = courseSearch.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.batch && c.batch.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q))
      );
    });
  }, [courses, courseFilter, courseSearch]);

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: CourseItem[];
      if (editingCourse) {
        updated = courses.map((c) => (c.id === editingCourse.id ? courseForm : c));
      } else {
        const newCourse: CourseItem = {
          ...courseForm,
          id: courseForm.id || `course-${Date.now()}`,
        };
        updated = [...courses, newCourse];
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "courses", data: updated }),
      });
      if (res.ok) {
        setCourses(updated);
        setIsCourseModalOpen(false);
        notifySuccess("Course saved successfully!");
      } else {
        notifyError("Failed to save course.");
      }
    } catch {
      notifyError("Network error saving course.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCourse(id: string) {
    const target = courses.find((c) => c.id === id);
    if (!confirm(`Are you sure you want to delete the course "${target?.title || id}"?`)) return;
    const updated = courses.filter((c) => c.id !== id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "courses", data: updated }),
      });
      if (res.ok) {
        setCourses(updated);
        notifySuccess("Course deleted.");
      } else {
        notifyError("Failed to delete course.");
      }
    } catch {
      notifyError("Network error deleting course.");
    }
  }

  // Tutor / Mentor Management Handlers
  function openNewTutorModal() {
    setEditingTutor(null);
    setTutorForm({
      id: `tutor-${Date.now()}`,
      name: "",
      role: "Growth & Performance Lead",
      mentored: "500+",
      image: "",
    });
    setShowManualTutorUrl(false);
    setIsTutorDragActive(false);
    setIsTutorModalOpen(true);
  }

  function openEditTutorModal(t: TutorItem) {
    setEditingTutor(t);
    setTutorForm({ ...t });
    setShowManualTutorUrl(false);
    setIsTutorDragActive(false);
    setIsTutorModalOpen(true);
  }

  async function handleTutorImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notifyError("Image size exceeds 8MB limit.");
      return;
    }

    setIsUploadingTutorImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "tutors");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-pin": getStoredPin(),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setTutorForm((prev) => ({ ...prev, image: data.url }));
        notifySuccess("Mentor photo uploaded successfully!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading photo.");
    } finally {
      setIsUploadingTutorImage(false);
      setIsTutorDragActive(false);
    }
  }

  async function handleSaveTutor(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: TutorItem[];
      if (editingTutor) {
        updated = tutors.map((t) => (t.id === editingTutor.id ? tutorForm : t));
      } else {
        const newTutor: TutorItem = {
          ...tutorForm,
          id: tutorForm.id || `tutor-${Date.now()}`,
        };
        updated = [...tutors, newTutor];
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "tutors", data: updated }),
      });
      if (res.ok) {
        setTutors(updated);
        setIsTutorModalOpen(false);
        notifySuccess("Mentor details updated!");
      } else {
        notifyError("Failed to save mentor.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTutor(id: string) {
    if (!confirm("Are you sure you want to delete this mentor?")) return;
    const updated = tutors.filter((t) => t.id !== id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "tutors", data: updated }),
      });
      if (res.ok) {
        setTutors(updated);
        notifySuccess("Mentor removed.");
      } else {
        notifyError("Failed to delete mentor.");
      }
    } catch {
      notifyError("Network error.");
    }
  }

  // Testimonial Management Handlers
  function openNewTestimonialModal() {
    setEditingTestimonial(null);
    setTestimonialForm({
      id: `review-${Date.now()}`,
      name: "",
      role: "Growth Marketer",
      company: "Swiggy",
      quote: "",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    });
    setShowManualTestimonialUrl(false);
    setIsTestimonialDragActive(false);
    setIsTestimonialModalOpen(true);
  }

  function openEditTestimonialModal(item: TestimonialItem) {
    setEditingTestimonial(item);
    setTestimonialForm({ ...item });
    setShowManualTestimonialUrl(false);
    setIsTestimonialDragActive(false);
    setIsTestimonialModalOpen(true);
  }

  async function handleTestimonialImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notifyError("Image size exceeds 8MB limit.");
      return;
    }

    setIsUploadingTestimonialImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "testimonials");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-pin": getStoredPin(),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setTestimonialForm((prev) => ({ ...prev, image: data.url }));
        notifySuccess("Student photo uploaded successfully!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading photo.");
    } finally {
      setIsUploadingTestimonialImage(false);
      setIsTestimonialDragActive(false);
    }
  }

  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: TestimonialItem[];
      if (editingTestimonial) {
        updated = testimonials.map((item) => (item.id === editingTestimonial.id ? testimonialForm : item));
      } else {
        const newTestimonial: TestimonialItem = {
          ...testimonialForm,
          id: testimonialForm.id || `review-${Date.now()}`,
        };
        updated = [...testimonials, newTestimonial];
      }
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "testimonials", data: updated }),
      });
      if (res.ok) {
        setTestimonials(updated);
        setIsTestimonialModalOpen(false);
        notifySuccess("Testimonial saved!");
      } else {
        notifyError("Failed to save testimonial.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const updated = testimonials.filter((t) => t.id !== id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "testimonials", data: updated }),
      });
      if (res.ok) {
        setTestimonials(updated);
        notifySuccess("Testimonial deleted.");
      } else {
        notifyError("Failed to delete testimonial.");
      }
    } catch {
      notifyError("Network error.");
    }
  }

  // Alerts Management Handlers
  async function handleSaveAlertSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingAlerts(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "alerts", data: alertSettings }),
      });
      if (res.ok) {
        notifySuccess("Alert numbers and emails saved successfully!");
      } else {
        notifyError("Failed to save alert settings.");
      }
    } catch {
      notifyError("Network error saving alerts.");
    } finally {
      setIsSavingAlerts(false);
    }
  }

  async function handleTestAlert() {
    setIsTestingAlert(true);
    setTestAlertResult(null);
    try {
      const res = await fetch("/api/admin/test-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify(alertSettings),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess("Test alert dispatched!");
        setTestAlertResult(data.message || "Test alert sent to configured recipients.");
      } else {
        const errorMsg = data.message || data.error || "Failed to dispatch test alert.";
        notifyError(errorMsg);
        setTestAlertResult(`Error: ${errorMsg}`);
      }
    } catch {
      notifyError("Network error testing alert.");
      setTestAlertResult("Error: Network error testing alert.");
    } finally {
      setIsTestingAlert(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAllData();
    }
  }, [isAuthenticated]);

  // Handle Authentication
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN || pinInput.trim() === DEFAULT_PIN) {
      sessionStorage.setItem("treqo_admin_auth", "true");
      sessionStorage.setItem("treqo_admin_pin", pinInput.trim());
      setUnlocked(true);
      setAuthError("");
    } else {
      setAuthError("Invalid passcode. Please enter the authorized Treqo PIN.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("treqo_admin_auth");
    sessionStorage.removeItem("treqo_admin_pin");
    setUnlocked(false);
    setPinInput("");
  }

  // -------------------------------------------------------------
  // SAVE CONTENT HANDLERS
  // -------------------------------------------------------------
  async function saveSettings(data: GeneralSettings) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "settings", data }),
      });
      if (res.ok) {
        notifySuccess("Branding and logo settings saved to database!");
      } else {
        notifyError("Failed to save settings.");
      }
    } catch {
      notifyError("Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveBanner(data: NavigationSettings) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "navigation", data }),
      });
      if (res.ok) {
        notifySuccess("Announcement banner updated successfully!");
      } else {
        notifyError("Failed to save banner.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveHeroContent(data: HomePageContent) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "home", data }),
      });
      if (res.ok) {
        notifySuccess("Homepage hero and content updated!");
      } else {
        notifyError("Failed to save content.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setIsSaving(false);
    }
  }

  // Blog Management
  function openNewBlogModal() {
    setEditingBlog(null);
    setBlogForm({
      title: "",
      slug: "",
      category: "Performance Marketing",
      coverImage: "",
      excerpt: "",
      authorName: "Manoj Varma",
      authorRole: "Founder & Growth Architect, Treqo",
      readTime: "5 min read",
      tags: "Marketing, Growth, Experiments",
      body: "",
    });
    setShowManualBlogUrl(false);
    setIsBlogModalOpen(true);
  }

  function openEditBlogModal(blog: BlogPost) {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      coverImage: blog.coverImage,
      excerpt: blog.excerpt,
      authorName: blog.author.name,
      authorRole: blog.author.role,
      readTime: blog.readTime,
      tags: blog.tags.join(", "),
      body: Array.isArray(blog.content) ? blog.content.join("\n\n") : String(blog.content),
    });
    setShowManualBlogUrl(false);
    setIsBlogModalOpen(true);
  }

  async function handleBlogImageUpload(file: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notifyError("Image size exceeds 8MB limit.");
      return;
    }

    setIsUploadingBlogImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": getStoredPin() },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setBlogForm((prev) => ({ ...prev, coverImage: data.url }));
        notifySuccess("Blog cover photo uploaded successfully!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading cover photo.");
    } finally {
      setIsUploadingBlogImage(false);
      setIsBlogDragActive(false);
    }
  }

  async function fetchMediaFiles() {
    setIsLoadingMedia(true);
    try {
      const res = await fetch("/api/admin/upload", {
        headers: { "x-admin-pin": getStoredPin() },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.files) {
          setMediaFiles(data.files);
        }
      }
    } catch (e) {
      console.error("Failed to load media files", e);
    } finally {
      setIsLoadingMedia(false);
    }
  }

  async function handleBlogSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blogForm.coverImage.trim()) {
      notifyError("Please upload a cover image or enter an image URL.");
      return;
    }
    setIsSaving(true);
    try {
      const generatedSlug = blogForm.slug.trim()
        ? blogForm.slug.trim().toLowerCase().replace(/\s+/g, "-")
        : blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

      const blogData: BlogPost = {
        id: generatedSlug,
        slug: generatedSlug,
        title: blogForm.title,
        category: blogForm.category,
        excerpt: blogForm.excerpt,
        content: blogForm.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
        coverImage: blogForm.coverImage,
        author: {
          name: blogForm.authorName,
          role: blogForm.authorRole,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        },
        publishedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        readTime: blogForm.readTime,
        tags: blogForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        featured: true,
      };

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify(blogData),
      });

      if (res.ok) {
        notifySuccess("Blog article published to database!");
        setIsBlogModalOpen(false);
        // Refresh blogs list
        const refreshed = await fetch("/api/admin/blogs");
        if (refreshed.ok) {
          const d = await refreshed.json();
          setBlogs(d.blogs || []);
        }
      } else {
        notifyError("Failed to save blog post.");
      }
    } catch {
      notifyError("Network error saving blog.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteBlog(slug: string) {
    if (!confirm(`Are you sure you want to delete the blog post "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blogs?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: { "x-admin-pin": getStoredPin() },
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.slug !== slug));
        notifySuccess("Blog post deleted.");
      }
    } catch {
      notifyError("Failed to delete blog.");
    }
  }

  // FAQ Handlers
  async function handleAddFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    const updatedFaqs = [
      ...(homeContent.faqs || []),
      { category: faqForm.category, question: faqForm.question, answer: faqForm.answer },
    ];
    const updatedContent = { ...homeContent, faqs: updatedFaqs };
    setHomeContent(updatedContent);
    await saveHeroContent(updatedContent);
    setFaqForm({ category: "General", question: "", answer: "" });
    setIsFaqModalOpen(false);
  }

  async function handleDeleteFaq(index: number) {
    const updatedFaqs = (homeContent.faqs || []).filter((_, i) => i !== index);
    const updatedContent = { ...homeContent, faqs: updatedFaqs };
    setHomeContent(updatedContent);
    await saveHeroContent(updatedContent);
    notifySuccess("FAQ removed.");
  }

  // Leads Actions
  async function handleDeleteLead(id: string) {
    if (!confirm("Are you sure you want to delete this applicant lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-pin": getStoredPin() },
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        notifySuccess("Lead deleted.");
      }
    } catch {
      notifyError("Failed to delete lead.");
    }
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.phone.includes(searchQuery);

      const matchesCourse = selectedCourse === "All" || l.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });
  }, [leads, searchQuery, selectedCourse]);

  const coursesList = useMemo(() => {
    const set = new Set(leads.map((l) => l.course).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [leads]);

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED ACCESS GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col justify-between bg-[#08090d] text-white p-6 sm:p-10 ${plusJakarta.className}`}>
        {/* Top Spacer */}
        <div className="w-full h-8" />

        {/* Centered Minimalist Form */}
        <div className="w-full max-w-[390px] mx-auto my-auto space-y-7">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/25">
              <span className="text-sm font-black text-[#ABCAC2] tracking-wider">TREQO</span>
              <span className="rounded bg-[#3B796A]/20 px-1 py-0.2 text-[8px] font-bold text-[#ABCAC2] uppercase tracking-widest">
                HQ
              </span>
            </div>
            <h1 className="text-3xl sm:text-[2.1rem] font-bold text-white tracking-tight leading-tight">
              Welcome to Treqo Admin Panel
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-normal leading-relaxed">
              Use the passcode provided by your administrator.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="text-xs text-red-400 font-medium bg-red-950/40 border border-red-500/30 rounded-lg p-2.5">
                {authError}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="adminPin" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                PASSCODE
              </label>
              <div className="relative flex items-center rounded-xl bg-[#1b202e] border border-slate-800/80 px-3.5 focus-within:border-slate-600 transition-colors">
                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  id="adminPin"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6e8ec] hover:bg-white py-3.5 text-sm font-semibold text-[#0f1117] transition-all active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <LogIn className="h-4 w-4 stroke-[2.2]" />
              <span>Sign in</span>
            </button>
          </form>
        </div>

        {/* Bottom subtle return link */}
        <div className="w-full text-center py-2">
          <Link
            href="/"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED MASTER CONSOLE
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen bg-[#07090e] text-slate-100 flex ${plusJakarta.className}`}>
      {/* Toast Feedback Messages */}
      {saveMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-950 border border-emerald-500/50 px-4 py-3 text-xs font-bold text-emerald-200 shadow-2xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{saveMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-red-950 border border-red-500/50 px-4 py-3 text-xs font-bold text-red-200 shadow-2xl animate-in fade-in slide-in-from-top-3">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 shrink-0 bg-[#090b11] border-r border-slate-800/70 flex flex-col justify-between min-h-screen sticky top-0 h-screen overflow-y-auto z-40">
        <div>
          {/* Top Brand Logo */}
          <div className="h-16 px-6 flex items-center border-b border-slate-800/60">
            <Link href="/" target="_blank" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tight text-[#ABCAC2] group-hover:text-[#ABCAC2] transition-colors">
                TREQO
              </span>
              <span className="rounded-md bg-[#3B796A]/20 border border-[#3B796A]/30 px-1.5 py-0.5 text-[9px] font-bold text-[#ABCAC2] uppercase tracking-widest">
                HQ
              </span>
            </Link>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Admissions &amp; Leads
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "overview" || activeTab === "leads"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
                <span>Student Submissions</span>
              </div>
              <span className="text-[10px] bg-[#012A22]/80 text-[#ABCAC2] border border-[#3B796A]/40 rounded-md px-1.5 py-0.5 font-bold">
                {leads.length}
              </span>
            </button>

            <Link
              href="/admin/leads"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Leads Console</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("alerts")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "alerts"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
                <span>Email Alerts</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("forms")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "forms"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
                <span>Form Titles &amp; Modals</span>
              </div>
            </button>

            {/* SECTION 2: HOMEPAGE SECTIONS */}
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Homepage Sections
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("hero")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "hero"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Layers className="h-4 w-4 shrink-0 text-blue-400" />
              <span>Hero &amp; Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("whyTreqqo")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "whyTreqqo"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Compass className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
              <span>Why Treqo (CEO Challenge)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("placements")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "placements"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Trophy className="h-4 w-4 shrink-0 text-blue-400" />
              <span>Batch 1 Placements</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tutors")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "tutors"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Mentors &amp; Faculty</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{tutors.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("govCerts")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "govCerts"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Award className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Gov Certifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sixDecisions")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "sixDecisions"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#ABCAC2]" />
              <span>Six Decisions (Why Us)</span>
            </button>


            <button
              type="button"
              onClick={() => setActiveTab("faqs")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "faqs"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />
                <span>FAQ Manager</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{homeContent.faqs?.length || 0}</span>
            </button>

            {/* SECTION 3: COURSES, CONTENT & BRAND */}
            <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tracks, Blog &amp; Brand
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("courses");
                setCourseInStudio(null);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "courses" && !courseInStudio
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Courses &amp; Tracks</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{courses.length}</span>
            </button>

            {courseInStudio && activeTab === "courses" && (
              <div className="ml-3 pl-3 border-l-2 border-[#3B796A]/40 py-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#ABCAC2] truncate">
                  Studio: {courseInStudio.title}
                </span>
                <span className="h-2 w-2 rounded-full bg-[#ABCAC2] animate-pulse shrink-0" />
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("blogs")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "blogs"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Blog Articles</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">{blogs.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("banner")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "banner"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Announcement Banner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("branding")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "branding"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Settings className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Branding &amp; Logo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("layout")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "layout"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <Globe className="h-4 w-4 shrink-0 text-sky-400" />
              <span>Layout &amp; SEO Meta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("footer")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "footer"
                  ? "bg-[#161a26] text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-red-400" />
              <span>Footer &amp; Contact Info</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: User Profile & Logout */}
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

      {/* 2. RIGHT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 flex items-center justify-between border-b border-slate-800/70 bg-[#07090e]/90 backdrop-blur-md sticky top-0 z-30">
          {/* Center Search Bar */}
          <div className="relative w-80 sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search applicants, courses, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-[#12151f] border border-slate-800/80 pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>

          {/* Right Header Items (Bell, Sun, Top Right Logo, Profile) */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>

            {/* Top Right Logo */}
            <div className="flex items-center gap-3 pl-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 group px-3 py-1.5 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/25 hover:bg-[#3B796A]/20 transition-all"
                title="Treqo Public Site"
              >
                <span className="text-sm font-black text-[#ABCAC2] tracking-wider">TREQO</span>
                <span className="rounded bg-[#3B796A]/20 px-1 py-0.2 text-[8px] font-bold text-[#ABCAC2] uppercase tracking-widest">
                  HQ
                </span>
              </Link>
              <div className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="p-6 sm:p-8 space-y-7 flex-1 max-w-[1300px] w-full">
          {/* ========================================================= */}
          {/* TAB 0: STUDENT FORM SUBMISSIONS (PRIMARY DASHBOARD)       */}
          {/* ========================================================= */}
          {(activeTab === "overview" || activeTab === "leads") && (
            <div className="space-y-6">
              {/* Top Greeting & Live Clock Card */}
              <div className="rounded-2xl bg-[#0e111a] border border-slate-800/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Good morning, <span className="text-[#3b82f6]">Admin</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 font-normal">
                    Student Details &amp; Live Form Submissions from your Treqo website
                  </p>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-[#161a26] border border-slate-800 px-4 py-2.5 rounded-xl shrink-0">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div className="text-right">
                    <div className="font-bold text-white text-xs">{currentTime}</div>
                    <div className="text-[10px] text-slate-400">{currentDate}</div>
                  </div>
                </div>
              </div>

              {/* 4 Clean Student Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="rounded-2xl bg-[#0e111a] border border-slate-800/70 p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-[#ABCAC2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-white tracking-tight">{leads.length}</div>
                    <div className="text-[11px] text-slate-400 font-medium truncate">Total Students</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0e111a] border border-slate-800/70 p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-white tracking-tight">
                      {leads.filter((l) => l.submittedAt.startsWith(new Date().toISOString().split("T")[0])).length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium truncate">Applied Today</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0e111a] border border-slate-800/70 p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-white tracking-tight">
                      {courses.length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium truncate">Active Courses</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0e111a] border border-slate-800/70 p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#ABCAC2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-[#ABCAC2] tracking-tight">
                      {alertSettings.emailAlertsEnabled ? "Active" : "Paused"}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium truncate">Email Alerts</div>
                  </div>
                </div>
              </div>

              {/* Action Bar: Search, Course Filter, Refresh, Export */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-1 flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search students by name, email, phone, background..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-[#0e111a] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-slate-700 focus:outline-none"
                    />
                  </div>

                  {coursesList.length > 1 && (
                    <div className="relative sm:w-60">
                      <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-800 bg-[#0e111a] pl-9 pr-8 py-2.5 text-xs text-white focus:border-slate-700 focus:outline-none cursor-pointer"
                      >
                        {coursesList.map((c) => (
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
                    onClick={loadAllData}
                    disabled={loadingLeads}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0e111a] px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingLeads ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>

                  <a
                    href={`/api/leads?format=csv&pin=${encodeURIComponent(getStoredPin())}`}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Students Details Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0e111a] shadow-xl">
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center space-y-2">
                    <Users className="h-8 w-8 text-slate-600 mx-auto stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-300">No student submissions found</p>
                    <p className="text-xs text-slate-500">
                      When students fill the application form on the website, their full details appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/30 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3.5 font-bold">Student</th>
                          <th className="px-5 py-3.5 font-bold">Contact Details</th>
                          <th className="px-5 py-3.5 font-bold">Enrolled Track</th>
                          <th className="px-5 py-3.5 font-bold">Background / Education</th>
                          <th className="px-5 py-3.5 font-bold">Submission Source</th>
                          <th className="px-5 py-3.5 font-bold">Date &amp; Time</th>
                          <th className="px-5 py-3.5 font-bold text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#3B796A]/20 border border-[#3B796A]/30 text-[#ABCAC2] font-bold text-xs flex items-center justify-center shrink-0">
                                  {lead.name ? lead.name.charAt(0).toUpperCase() : "S"}
                                </div>
                                <div>
                                  <span className="font-bold text-white text-xs block">{lead.name}</span>
                                  <span className="text-[10px] text-slate-500">ID: {lead.id.slice(-6)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 space-y-1">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="hover:text-[#ABCAC2] transition-colors text-xs font-mono"
                                >
                                  {lead.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="hover:text-[#ABCAC2] transition-colors text-xs font-mono"
                                >
                                  {lead.phone}
                                </a>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-block rounded-lg bg-[#012A22]/70 border border-[#3B796A]/40 px-2.5 py-1 text-[11px] font-semibold text-[#ABCAC2]">
                                {lead.course}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-300 text-xs">
                              {lead.background || "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {lead.source || "Website Form"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                              <div>
                                {new Date(lead.submittedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(lead.submittedAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BRANDING & LOGO                                    */}
          {/* ========================================================= */}
          {activeTab === "branding" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Branding &amp; Site Identity</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Change your website logo, company title, and admissions contact numbers.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300">Site Title</label>
                  <input
                    type="text"
                    value={generalSettings.siteTitle}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Logo Text (Default)</label>
                  <input
                    type="text"
                    value={generalSettings.logoText}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, logoText: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">Displayed in the header when no image logo is set.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Logo Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://your-domain.com/logo.png"
                    value={generalSettings.logoImage || ""}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, logoImage: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Provide a direct URL to your logo (SVG or PNG). Leave empty to use text logo.
                  </p>
                </div>

                {/* Logo Live Preview */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Header Preview</span>
                    <div className="mt-2">
                      {generalSettings.logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={generalSettings.logoImage} alt="Logo" className="h-8 w-auto object-contain" />
                      ) : (
                        <span className="text-2xl font-black text-[#ABCAC2] tracking-tight">{generalSettings.logoText}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Admissions Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Admissions Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={generalSettings.supportPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveSettings(generalSettings)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Branding Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ANNOUNCEMENT BANNER                                */}
          {/* ========================================================= */}
          {activeTab === "banner" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Top Announcement Banner</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Update the urgent notification bar displayed across the top of every page.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300">Badge Tag</label>
                  <input
                    type="text"
                    value={navigationSettings.bannerBadge}
                    onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerBadge: e.target.value })}
                    placeholder="e.g. BATCH 2 · 50 SEATS"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Banner Announcement Copy</label>
                  <input
                    type="text"
                    value={navigationSettings.bannerText}
                    onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerText: e.target.value })}
                    placeholder="e.g. Applications close on 25th September 2026."
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Button Label</label>
                    <input
                      type="text"
                      value={navigationSettings.bannerLinkText}
                      onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerLinkText: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Target Link URL</label>
                    <input
                      type="text"
                      value={navigationSettings.bannerLinkHref}
                      onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerLinkHref: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Banner Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Preview</span>
                  <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-800 bg-[#0a0c10] py-2.5 px-4 text-center text-xs text-white flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-md bg-[#012A22] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      {navigationSettings.bannerBadge}
                    </span>
                    <span className="text-slate-200">{navigationSettings.bannerText}</span>
                    <span className="font-bold underline text-white">{navigationSettings.bannerLinkText}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveBanner(navigationSettings)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Banner Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: HERO & COPY                                        */}
          {/* ========================================================= */}
          {activeTab === "hero" && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Homepage Hero &amp; Copy</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Directly edit the primary headline lines, eyebrow badge, and stats counters.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300">Eyebrow Badge</label>
                  <input
                    type="text"
                    value={homeContent.hero.eyebrow}
                    onChange={(e) =>
                      setHomeContent({
                        ...homeContent,
                        hero: { ...homeContent.hero, eyebrow: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Headline Lines (Stacked)</label>
                  <div className="space-y-2 mt-1.5">
                    {homeContent.hero.headlineLines.map((line, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={line}
                        onChange={(e) => {
                          const newLines = [...homeContent.hero.headlineLines];
                          newLines[idx] = e.target.value;
                          setHomeContent({
                            ...homeContent,
                            hero: { ...homeContent.hero, headlineLines: newLines },
                          });
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white focus:border-[#012A22] focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Description Text</label>
                  <textarea
                    rows={3}
                    value={homeContent.hero.description}
                    onChange={(e) =>
                      setHomeContent({
                        ...homeContent,
                        hero: { ...homeContent.hero, description: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                {/* Stats Counters */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Hero Stats Counters</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                    {homeContent.stats.map((stat, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-700 bg-slate-800/80 p-3 space-y-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...homeContent.stats];
                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                            setHomeContent({ ...homeContent, stats: newStats });
                          }}
                          placeholder="e.g. 100%"
                          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-[#ABCAC2]"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...homeContent.stats];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            setHomeContent({ ...homeContent, stats: newStats });
                          }}
                          placeholder="Label"
                          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveHeroContent(homeContent)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Hero Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: FAQ MANAGER                                        */}
          {/* ========================================================= */}
          {activeTab === "faqs" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Manage the accordion questions displayed in the FAQ section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-3">
                {(homeContent.faqs || []).map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="rounded-md bg-[#012A22]/80 border border-[#3B796A]/40 px-2 py-0.5 text-[10px] font-bold text-[#ABCAC2]">
                        {faq.category || "General"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">{faq.question}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: BLOG ARTICLES                                      */}
          {/* ========================================================= */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Blog &amp; Field Notes Studio</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Write and publish real growth case studies with cover photos and custom tags.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNewBlogModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Write New Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((blog) => (
                  <div
                    key={blog.slug}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-[#3B796A]/40 transition-all"
                  >
                    <div className="relative aspect-[16/9] w-full bg-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#ABCAC2]">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] text-slate-400">
                          {blog.publishedAt} · {blog.readTime}
                        </div>
                        <h3 className="mt-1 font-bold text-base text-white line-clamp-2">{blog.title}</h3>
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2">{blog.excerpt}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditBlogModal(blog)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="rounded-lg bg-[#012A22] px-3 py-1 text-xs font-bold text-white hover:bg-[#001F18]"
                          >
                            View
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: COURSES & CURRICULUM TRACKS MANAGER                  */}
          {/* ========================================================= */}
          {activeTab === "courses" && (
            courseInStudio ? (
              <AdminCourseEditor
                course={courseInStudio}
                allCourses={courses}
                adminPin={getStoredPin()}
                onBack={() => setCourseInStudio(null)}
                onSelectCourse={(c) => setCourseInStudio(c)}
                onSaved={(updatedList, savedCourse) => {
                  setCourses(updatedList);
                  setCourseInStudio(savedCourse);
                  notifySuccess(`Course "${savedCourse.title}" saved successfully!`);
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Courses &amp; Curriculum Tracks</h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Manage curriculum tracks, toggle lock/open enrollment status, edit pricing, or open in Course Studio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewCourseStudio}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Course</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0e111a] p-3 rounded-2xl border border-slate-800">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search courses by title, description, or batch..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                    {courseSearch && (
                      <button
                        type="button"
                        onClick={() => setCourseSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCourseFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "all" ? "bg-[#012A22] text-white shadow-sm" : "text-slate-400 hover:text-white"
                        }`}
                    >
                      All ({courses.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseFilter("open")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "open" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                        }`}
                    >
                      Open ({courses.filter((c) => !c.isLocked).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseFilter("locked")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "locked" ? "bg-[#012A22] text-white shadow-sm" : "text-slate-400 hover:text-white"
                        }`}
                    >
                      Coming Soon ({courses.filter((c) => c.isLocked).length})
                    </button>
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center bg-[#0e111a]/50">
                    <GraduationCap className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white">No courses match your criteria</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {courseSearch || courseFilter !== "all"
                        ? "Try clearing your search query or status filter."
                        : "Click 'Add New Course' above to create your first track."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 justify-between ${course.isLocked
                            ? "border-slate-200/80 bg-slate-50/60"
                            : "border-slate-200/90"
                          }`}
                      >
                        {/* Card Image Header (Identical to Frontend) */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                            alt={course.title}
                            className={`h-full w-full object-cover transition-transform duration-500 ${course.isLocked
                                ? "opacity-60 grayscale-[35%]"
                                : "opacity-90 group-hover:opacity-100 group-hover:scale-105"
                              }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                          {/* Coming Soon Overlay if locked */}
                          {course.isLocked && (
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-[#3B796A]/40 px-3.5 py-1.5 text-xs font-bold text-[#ABCAC2] shadow-xl backdrop-blur-md">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Coming Soon</span>
                              </div>
                            </div>
                          )}

                          {/* Top-Left: Lock Status Toggle Badge */}
                          <div className="absolute top-3 left-3 z-20">
                            <button
                              type="button"
                              onClick={() => handleToggleCourseLock(course.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-md shadow-md transition-all cursor-pointer ${course.isLocked
                                  ? "bg-red-950/80 text-red-200 border border-red-500/40 hover:bg-red-900"
                                  : "bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-900"
                                }`}
                              title="Click to toggle lock/unlock"
                            >
                              {course.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                              <span>{course.isLocked ? "Locked" : "Open"}</span>
                            </button>
                          </div>

                          {/* Top-Right: Edit & Delete Buttons */}
                          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditCourseModal(course)}
                              className="h-7 px-2.5 rounded-lg bg-black/75 hover:bg-[#012A22] text-white border border-white/15 backdrop-blur-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer"
                              title="Edit Course"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(course.id)}
                              className="h-7 w-7 rounded-lg bg-black/75 hover:bg-red-600 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all shadow-md cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Bottom Preview Label Badge */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <span className="rounded-md bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/90 uppercase border border-white/10 truncate max-w-[200px]">
                              {course.previewLabel || "COURSE PREVIEW"}
                            </span>
                            {course.isFlagship && (
                              <span className="rounded-md bg-amber-500 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm shrink-0">
                                FLAGSHIP
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Body Content (Identical to Frontend) */}
                        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                          <div>
                            {/* Badge + Meta row */}
                            <div className="flex items-center gap-2.5">
                              {course.isLocked ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 border border-[#3B796A]/40 px-2 py-0.5 text-[10px] font-black tracking-wide text-[#ABCAC2] uppercase">
                                  <Clock className="h-3 w-3" />
                                  <span>COMING SOON</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-[#012A22] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                                  {course.badge || "OPEN"}
                                </span>
                              )}
                              <span className="text-xs font-medium text-slate-500">
                                {course.duration || course.meta || "4 months · Online"}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#012A22] transition-colors line-clamp-1">
                              {course.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
                              {course.description || "Comprehensive hands-on digital growth program with real brands."}
                            </p>

                            {/* Batch & Pricing Chips */}
                            <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px]">
                              <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Batch
                                </span>
                                <span className="font-bold text-slate-800 truncate block mt-0.5">
                                  {course.batch || "Batch 2 · Sep 2026"}
                                </span>
                              </div>
                              <div className="rounded-xl bg-slate-50 p-2 border border-slate-200/80">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Fee &amp; EMI
                                </span>
                                <span className="font-bold text-slate-800 truncate block mt-0.5">
                                  {course.feeTotal || "₹55,000"} {course.feeEmi ? `(${course.feeEmi})` : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer: Action Buttons */}
                          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCourseLock(course.id)}
                              className={`text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${course.isLocked
                                  ? "text-emerald-600 hover:text-emerald-700"
                                  : "text-amber-600 hover:text-amber-700"
                                }`}
                            >
                              {course.isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                              <span>{course.isLocked ? "Unlock Enrollment" : "Lock Enrollment"}</span>
                            </button>

                            <div className="flex items-center gap-3">
                              <Link
                                href={course.href || `/categories/${course.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-slate-500 hover:text-[#012A22] transition-colors inline-flex items-center gap-1"
                                title="Preview live course page"
                              >
                                <span>View Page</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => openCourseStudio(course)}
                                className="text-xs sm:text-sm font-bold text-[#012A22] hover:text-[#001F18] transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Studio →</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Direct Add New Course Card in Grid */}
                    <button
                      type="button"
                      onClick={openNewCourseStudio}
                      className="rounded-3xl border-2 border-dashed border-slate-700 hover:border-[#3B796A] bg-[#0e111a]/40 hover:bg-[#012A22]/10 min-h-[380px] flex flex-col items-center justify-center p-6 text-center group transition-all cursor-pointer"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center text-[#ABCAC2] group-hover:scale-110 group-hover:bg-[#012A22] group-hover:text-white transition-all">
                        <Plus className="h-7 w-7" />
                      </div>
                      <span className="mt-4 text-base font-bold text-white group-hover:text-[#ABCAC2]">
                        Add New Course
                      </span>
                      <span className="text-xs text-slate-400 mt-1 max-w-[200px]">
                        Create a new curriculum track with syllabus, cover image &amp; pricing
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {/* ========================================================= */}
          {/* TAB: TUTORS & MENTORS MANAGER                             */}
          {/* ========================================================= */}
          {activeTab === "tutors" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Mentors &amp; Faculty Tutors</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Manage instructors, mentors, photos, and roles displayed across the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewTutorModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-4 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Mentor</span>
                </button>
              </div>

              {tutors.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
                  <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white">No mentors added yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click &quot;Add Mentor&quot; above to add mentors with photos and bios.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                  {tutors.map((tutor, index) => (
                    <div
                      key={tutor.id}
                      className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-800 bg-[#0e111a] shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[#3B796A]/50"
                    >
                      {/* Photo or placeholder matching live site exactly */}
                      {tutor.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tutor.image}
                          alt={tutor.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br transition-transform duration-300 group-hover:scale-105",
                              AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]
                            )}
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-[0.14]"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 text-base sm:text-lg font-bold text-white backdrop-blur-sm">
                              {tutorInitials(tutor.name)}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Top-Right Mentored Badge (live look) */}
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 border border-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md z-20 shadow-sm">
                        {tutor.mentored}
                      </span>

                      {/* Top-Left Action Buttons: Edit & Delete */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditTutorModal(tutor);
                          }}
                          className="h-7 px-2.5 rounded-lg bg-black/75 hover:bg-[#012A22] text-white border border-white/15 backdrop-blur-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-md hover:scale-105 cursor-pointer"
                          title="Edit Mentor"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTutor(tutor.id);
                          }}
                          className="h-7 w-7 rounded-lg bg-black/75 hover:bg-red-600 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
                          title="Delete Mentor"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Click whole card to edit */}
                      <div
                        onClick={() => openEditTutorModal(tutor)}
                        className="absolute inset-0 z-10 cursor-pointer"
                      />

                      {/* Bottom Gradient Overlay: Name & Role (live look) */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3.5 pt-12 z-15 pointer-events-none">
                        <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                          {tutor.name}
                        </p>
                        <p className="text-[11px] text-white/75 mt-0.5 truncate">
                          {tutor.role}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Direct Add New Mentor Block in Grid */}
                  <button
                    type="button"
                    onClick={openNewTutorModal}
                    className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-800 hover:border-[#3B796A]/60 bg-[#0e111a]/40 hover:bg-[#012A22]/10 flex flex-col items-center justify-center p-4 text-center group transition-all cursor-pointer"
                  >
                    <div className="h-11 w-11 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center text-[#ABCAC2] group-hover:scale-110 group-hover:bg-[#012A22] group-hover:text-white transition-all">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="mt-3 text-xs sm:text-sm font-bold text-white group-hover:text-[#ABCAC2]">Add Mentor</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Upload photo &amp; bio</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: EMAIL ALERTS & NOTIFICATIONS                         */}
          {/* ========================================================= */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Real-Time Student Lead Email Alerts
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Whenever a student fills out the application form on the website, automatically send an instant alert with their details.
                </p>
              </div>

              {/* Alert Status Card */}
              <div className="rounded-2xl border border-slate-800 bg-[#0e111a] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#ABCAC2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Email Alert Dispatch: {alertSettings.emailAlertsEnabled ? "Active" : "Paused"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {alertSettings.emailAlertsEnabled ? "✓ Instant Student Lead Alerts Active" : "✗ Email Alerts Paused"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestAlert}
                  disabled={isTestingAlert}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#3B796A]/30 bg-[#3B796A]/20 hover:bg-[#3B796A]/20 px-4 py-2 text-xs font-bold text-[#ABCAC2] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isTestingAlert ? "Dispatching..." : "Send Test Email Alert"}</span>
                </button>
              </div>

              {testAlertResult && (
                <div
                  className={`rounded-xl border p-4 text-xs ${testAlertResult.startsWith("Error:")
                      ? "border-rose-500/30 bg-rose-950/40 text-rose-300"
                      : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                    }`}
                >
                  <div className="font-semibold">{testAlertResult}</div>
                  {testAlertResult.includes("Resend Sandbox Restriction") && (
                    <div className="mt-2.5 text-[11px] text-rose-200/90 leading-relaxed border-t border-rose-500/20 pt-2">
                      💡 <strong>Why this happens:</strong> Resend&apos;s free development sandbox (<code>onboarding@resend.dev</code>) only delivers to the Resend account owner&apos;s email (<code>plmanojvarma@gmail.com</code>).
                      <br />
                      <strong>To send to other emails:</strong> You can either test with <code>plmanojvarma@gmail.com</code>, or add and verify your custom domain (e.g. <code>treqo.org</code>) at{" "}
                      <a
                        href="https://resend.com/domains"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold text-white hover:text-rose-100"
                      >
                        resend.com/domains
                      </a>
                      , then set <code>RESEND_FROM_EMAIL=admissions@treqo.org</code>.
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSaveAlertSettings} className="space-y-6">
                {/* Email Configuration Card */}
                <div className="rounded-2xl border border-slate-800 bg-[#0e111a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-[#ABCAC2]" />
                      <h3 className="text-sm font-bold text-white">Email Addresses for Notifications</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertSettings.emailAlertsEnabled}
                        onChange={(e) =>
                          setAlertSettings({ ...alertSettings, emailAlertsEnabled: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#012A22]" />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">
                      Notification Emails (Separate multiple emails with commas)
                    </label>
                    <input
                      type="text"
                      required
                      value={alertSettings.notifyEmails}
                      onChange={(e) =>
                        setAlertSettings({ ...alertSettings, notifyEmails: e.target.value })
                      }
                      placeholder="admissions@treqo.org, founder@treqo.org"
                      className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151f] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-slate-700 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      When a student submits any application or syllabus form, their full details will be emailed to these inboxes immediately.
                    </p>
                    <p className="text-[11px] text-amber-400/90 mt-1.5 bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg leading-relaxed">
                      ⚠️ <strong>Resend Free Sandbox Note:</strong> While using <code>onboarding@resend.dev</code>, Resend only allows delivery to the account owner (<code>plmanojvarma@gmail.com</code>). To receive leads on other emails, verify your domain at Resend.com.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-slate-300">Resend.com Email Delivery Service</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      Connected &amp; Active
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingAlerts}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSavingAlerts ? "Saving Settings..." : "Save Email Settings"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: FORM TITLES & POPUPS                                 */}
          {/* ========================================================= */}
          {activeTab === "forms" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Form Titles &amp; Popup Modals</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Customize headlines, subtitles, and button text across your application forms, curriculum download popups, and success screens.
                </p>
              </div>

              <form onSubmit={handleSaveForms} className="space-y-6">
                {/* 1. HERO APPLICATION FORM */}
                <div className="rounded-2xl border border-slate-800 bg-[#0e111a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ABCAC2]" />
                      <h3 className="text-sm font-bold text-white">Homepage Hero Application Form</h3>
                    </div>
                    <span className="text-[10px] text-[#ABCAC2] bg-[#3B796A]/20 border border-[#3B796A]/30 px-2 py-0.5 rounded font-bold uppercase">
                      Homepage
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Form Header Title</label>
                      <input
                        type="text"
                        value={formSettings.heroFormTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormTitle: e.target.value })}
                        placeholder="e.g. Fast Track Application"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Submit Button Label</label>
                      <input
                        type="text"
                        value={formSettings.heroFormButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormButtonText: e.target.value })}
                        placeholder="e.g. Apply for Batch 2"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Form Subtitle / Note</label>
                    <input
                      type="text"
                      value={formSettings.heroFormSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, heroFormSubtitle: e.target.value })}
                      placeholder="e.g. Live cohort starts soon · Limited seats"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Success Screen Headline</label>
                      <input
                        type="text"
                        value={formSettings.heroFormSuccessTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormSuccessTitle: e.target.value })}
                        placeholder="Submitted"
                        className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151f] px-3.5 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Success Screen Description</label>
                      <input
                        type="text"
                        value={formSettings.heroFormSuccessMessage || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormSuccessMessage: e.target.value })}
                        placeholder="Thank you! Your details have been received successfully."
                        className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151f] px-3.5 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. APPLICATION POPUP MODAL */}
                <div className="rounded-2xl border border-slate-800 bg-[#0e111a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <h3 className="text-sm font-bold text-white">Application Popup Modal (&quot;Apply Now&quot; across site)</h3>
                    </div>
                    <span className="text-[10px] text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded font-bold uppercase">
                      Site-wide Modal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Modal Header Title</label>
                      <input
                        type="text"
                        value={formSettings.applyModalTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalTitle: e.target.value })}
                        placeholder="e.g. Apply for Batch 2"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Submit Button Text</label>
                      <input
                        type="text"
                        value={formSettings.applyModalButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalButtonText: e.target.value })}
                        placeholder="e.g. Submit Application"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Modal Subtitle / Value Proposition</label>
                    <input
                      type="text"
                      value={formSettings.applyModalSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, applyModalSubtitle: e.target.value })}
                      placeholder="e.g. Leave with work you can show in an interview, not a certificate."
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
                    <div>
                      <label className="text-xs font-bold text-slate-400">Modal Success Headline</label>
                      <input
                        type="text"
                        value={formSettings.applyModalSuccessTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalSuccessTitle: e.target.value })}
                        placeholder="Submitted"
                        className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151f] px-3.5 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400">Modal Success Description</label>
                      <input
                        type="text"
                        value={formSettings.applyModalSuccessMessage || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalSuccessMessage: e.target.value })}
                        placeholder="Thank you! Your details have been received successfully."
                        className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151f] px-3.5 py-2 text-xs text-white focus:border-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CURRICULUM DOWNLOAD MODAL */}
                <div className="rounded-2xl border border-slate-800 bg-[#0e111a] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <h3 className="text-sm font-bold text-white">Curriculum &amp; Syllabus Download Modal</h3>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                      Brochure Modal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Modal Header Title</label>
                      <input
                        type="text"
                        value={formSettings.curriculumModalTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, curriculumModalTitle: e.target.value })}
                        placeholder="e.g. Download Curriculum"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Submit Button Text</label>
                      <input
                        type="text"
                        value={formSettings.curriculumModalButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, curriculumModalButtonText: e.target.value })}
                        placeholder="e.g. Download Syllabus Now"
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Modal Subtitle / Note</label>
                    <input
                      type="text"
                      value={formSettings.curriculumModalSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, curriculumModalSubtitle: e.target.value })}
                      placeholder="e.g. Get the full week-by-week phase roadmap, deliverables & toolstack."
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingForms}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSavingForms ? "Saving..." : "Save Form Titles & Popups"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: WHY TREQO & CEO CHALLENGE                            */}
          {/* ========================================================= */}
          {activeTab === "whyTreqqo" && (
            <AdminWhyTreqqoTab
              initialData={homeContent.whyTreqqo}
              adminPin={getStoredPin()}
              onSaved={(updated) => setHomeContent((prev) => ({ ...prev, whyTreqqo: updated }))}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: BATCH 1 PLACEMENTS / ALUMNI PROOF                    */}
          {/* ========================================================= */}
          {activeTab === "placements" && (
            <AdminPlacementsTab
              initialData={homeContent.executionProof}
              adminPin={getStoredPin()}
              onSaved={(updated) => setHomeContent((prev) => ({ ...prev, executionProof: updated }))}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: GOVERNMENT CERTIFICATIONS                            */}
          {/* ========================================================= */}
          {activeTab === "govCerts" && (
            <AdminGovCertsTab
              initialData={homeContent.govCerts}
              adminPin={getStoredPin()}
              onSaved={(updated) => setHomeContent((prev) => ({ ...prev, govCerts: updated }))}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: SIX DECISIONS (WHY US)                               */}
          {/* ========================================================= */}
          {activeTab === "sixDecisions" && (
            <AdminSixDecisionsTab
              initialData={homeContent.sixDecisions}
              adminPin={getStoredPin()}
              onSaved={(updated) => setHomeContent((prev) => ({ ...prev, sixDecisions: updated }))}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: FOOTER & CAMPUS CONTACT                              */}
          {/* ========================================================= */}
          {activeTab === "footer" && (
            <AdminFooterTab
              initialData={generalSettings}
              adminPin={getStoredPin()}
              onSaved={(updated) => setGeneralSettings(updated)}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: LAYOUT & SEO META                                    */}
          {/* ========================================================= */}
          {activeTab === "layout" && (
            <AdminLayoutMetaTab
              initialData={layoutSettings}
              adminPin={getStoredPin()}
              onSaved={(updated) => setLayoutSettings(updated)}
            />
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: WRITE / EDIT BLOG POST                             */}
      {/* ========================================================= */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingBlog ? "Edit Blog Post" : "Write New Article"}
              </h3>
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Why Running Real Ad Budgets Beats 100 Theoretical Case Studies"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, category: e.target.value as BlogPost["category"] })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  >
                    <option value="Performance Marketing">Performance Marketing</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Career Strategy">Career Strategy</option>
                    <option value="Founders">Founders</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Upload (Direct File Manager & Drag & Drop & Media Library) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-[#ABCAC2]" />
                    Cover Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMediaPickerOpen(true);
                        fetchMediaFiles();
                      }}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FolderOpen className="h-3 w-3 text-[#ABCAC2]" />
                      Browse Media
                    </button>
                    <span className="text-slate-600 text-xs">·</span>
                    <button
                      type="button"
                      onClick={() => setShowManualBlogUrl(!showManualBlogUrl)}
                      className="text-[11px] text-[#ABCAC2] hover:text-[#ABCAC2] transition-colors cursor-pointer"
                    >
                      {showManualBlogUrl ? "Switch to File Upload" : "or enter URL manually"}
                    </button>
                  </div>
                </div>

                <input
                  ref={blogFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBlogImageUpload(file);
                    e.target.value = "";
                  }}
                />

                {!showManualBlogUrl ? (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsBlogDragActive(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsBlogDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsBlogDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsBlogDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleBlogImageUpload(file);
                      }}
                      onClick={() => !isUploadingBlogImage && blogFileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition-all cursor-pointer ${isBlogDragActive
                          ? "border-[#ABCAC2] bg-[#3B796A]/20 scale-[1.01] shadow-lg shadow-[#012A22]/30"
                          : "border-slate-700/80 bg-[#12151f] hover:border-[#3B796A]/50 hover:bg-slate-900/80"
                        }`}
                    >
                      {isUploadingBlogImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#ABCAC2] animate-spin" />
                          <p className="text-xs font-bold text-white">Uploading cover image...</p>
                          <p className="text-[10px] text-slate-400">Saving file to media library</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center py-1">
                          <div className="h-9 w-9 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/25 flex items-center justify-center text-[#ABCAC2]">
                            <Upload className="h-4 w-4" />
                          </div>
                          <p className="text-xs font-bold text-white">
                            <span className="text-[#ABCAC2] underline underline-offset-2">Click to take from file manager</span> or drag to upload
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, or SVG up to 8MB</p>
                        </div>
                      )}
                    </div>

                    {blogForm.coverImage && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blogForm.coverImage}
                            alt="Cover Preview"
                            className="h-12 w-20 rounded-lg object-cover border border-[#3B796A]/30 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80";
                            }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {blogForm.coverImage.startsWith("/uploads/")
                                ? blogForm.coverImage.split("/").pop()
                                : blogForm.coverImage}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <Check className="h-3 w-3 shrink-0" /> Cover image attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => blogFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm((prev) => ({ ...prev, coverImage: "" }))}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={blogForm.coverImage}
                      onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                    {blogForm.coverImage && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-[#151926] border border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blogForm.coverImage}
                          alt="Cover Preview"
                          className="h-10 w-16 rounded object-cover border border-slate-700 shrink-0"
                        />
                        <span className="text-xs text-slate-300 truncate">{blogForm.coverImage}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Short Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="A 2-sentence summary of key insights..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  placeholder="Meta Ads, CAC, Unit Economics"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Article Body (Paragraphs)</label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.body}
                  onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                  placeholder="Write your article paragraphs here. Separate paragraphs with an empty line..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white focus:border-[#012A22] focus:outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingBlog ? "Save Updates" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD FAQ                                            */}
      {/* ========================================================= */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Add New FAQ Question</h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Category</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  placeholder="e.g. General, Curriculum, Placements"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. What is the batch size?"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide the direct, honest answer..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT COURSE                               */}
      {/* ========================================================= */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingCourse ? "Edit Course Track" : "Add New Course Track"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set program duration, curriculum details, and lock status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Cover Image Upload (Direct File Manager & Drag & Drop) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Course Cover Image</label>
                  <button
                    type="button"
                    onClick={() => setShowManualCourseUrl(!showManualCourseUrl)}
                    className="text-[11px] text-[#ABCAC2] hover:text-[#ABCAC2] transition-colors cursor-pointer"
                  >
                    {showManualCourseUrl ? "Switch to File Upload" : "or enter URL manually"}
                  </button>
                </div>

                <input
                  ref={courseFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCourseImageUpload(file);
                    e.target.value = "";
                  }}
                />

                {!showManualCourseUrl ? (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCourseDragActive(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCourseDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCourseDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCourseDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleCourseImageUpload(file);
                      }}
                      onClick={() => !isUploadingCourseImage && courseFileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition-all cursor-pointer ${isCourseDragActive
                          ? "border-[#ABCAC2] bg-[#3B796A]/20 scale-[1.01]"
                          : "border-slate-700/80 bg-[#12151f] hover:border-[#3B796A]/50 hover:bg-slate-900/80"
                        }`}
                    >
                      {isUploadingCourseImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#ABCAC2] animate-spin" />
                          <p className="text-xs font-bold text-white">Uploading cover image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <Upload className="h-5 w-5 text-[#ABCAC2]" />
                          <p className="text-xs font-bold text-white">
                            <span className="text-[#ABCAC2] underline">Click to upload cover photo</span> or drag &amp; drop
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 8MB</p>
                        </div>
                      )}
                    </div>

                    {courseForm.image && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={courseForm.image}
                            alt="Preview"
                            className="h-12 w-20 rounded-lg object-cover border border-[#3B796A]/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {courseForm.title || "Cover Photo"}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <Check className="h-3 w-3 shrink-0" /> Photo attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => courseFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseForm({ ...courseForm, image: "" })}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={courseForm.image || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Performance Marketing &amp; Growth Architecture"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Image Preview Tag</label>
                  <input
                    type="text"
                    value={courseForm.previewLabel || ""}
                    onChange={(e) => setCourseForm({ ...courseForm, previewLabel: e.target.value })}
                    placeholder="e.g. CLASSROOM · CEO CHALLENGE REVIEW"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300">Badge Text</label>
                  <input
                    type="text"
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                    placeholder="e.g. BATCH 2 · OPEN"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Duration &amp; Format</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 4 months · Online"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Course URL / Slug</label>
                <input
                  type="text"
                  value={courseForm.href}
                  onChange={(e) => setCourseForm({ ...courseForm, href: e.target.value })}
                  placeholder="/courses/digital-marketing"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Course Summary Description</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Real ad budgets, CRO, creative testing, analytics, client sprints..."
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                />
              </div>

              {/* Course Page Specific Data */}
              <div className="pt-2 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#ABCAC2]">Course Page Data &amp; Pricing</span>
                  <div className="h-px bg-[#3B796A]/20 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Batch / Cohort Label</label>
                    <input
                      type="text"
                      value={courseForm.batch || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, batch: e.target.value })}
                      placeholder="e.g. Batch 2 · Sep 2026"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Curriculum PDF URL</label>
                    <input
                      type="text"
                      value={courseForm.curriculumPdf || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, curriculumPdf: e.target.value })}
                      placeholder="e.g. /treqo-curriculum.pdf"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Total Course Fee</label>
                    <input
                      type="text"
                      value={courseForm.feeTotal || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, feeTotal: e.target.value })}
                      placeholder="e.g. ₹55,000"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Monthly EMI Plan</label>
                    <input
                      type="text"
                      value={courseForm.feeEmi || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, feeEmi: e.target.value })}
                      placeholder="e.g. ₹4,583 / month"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Apply Button Label</label>
                    <input
                      type="text"
                      value={courseForm.applyCta || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, applyCta: e.target.value })}
                      placeholder="e.g. Apply for Batch 2"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Syllabus Button Label</label>
                    <input
                      type="text"
                      value={courseForm.syllabusCta || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, syllabusCta: e.target.value })}
                      placeholder="e.g. Download Curriculum"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Course Page Overview Text</label>
                  <textarea
                    rows={2}
                    value={courseForm.overview || ""}
                    onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })}
                    placeholder="Extended overview text shown on the public course page..."
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">CEO Challenge Problem Statement / Prompt</label>
                  <textarea
                    rows={2}
                    value={courseForm.challenge?.prompt || ""}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        challenge: {
                          ...(courseForm.challenge || {}),
                          prompt: e.target.value,
                          title: courseForm.challenge?.title || "The CEO Challenge",
                        },
                      })
                    }
                    placeholder="e.g. You are handed a brand with declining CAC and customer churn. Defend your recovery plan..."
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Toggles: Flagship & Lock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseForm.isLocked}
                    onChange={(e) => setCourseForm({ ...courseForm, isLocked: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-[#012A22] focus:ring-[#3B796A]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Lock Course</span>
                    <span className="text-[10px] text-slate-400">Shows &quot;🔒 Locked&quot; badge</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseForm.isFlagship}
                    onChange={(e) => setCourseForm({ ...courseForm, isFlagship: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-[#012A22] focus:ring-[#3B796A]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Flagship Program</span>
                    <span className="text-[10px] text-slate-400">Highlighted on public site</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT TUTOR / MENTOR                       */}
      {/* ========================================================= */}
      {isTutorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingTutor ? "Edit Mentor Profile" : "Add New Mentor"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTutorModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTutor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Mentor Full Name</label>
                <input
                  type="text"
                  required
                  value={tutorForm.name}
                  onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                  placeholder="e.g. Manoj Varma"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Role / Specialization</label>
                <input
                  type="text"
                  required
                  value={tutorForm.role}
                  onChange={(e) => setTutorForm({ ...tutorForm, role: e.target.value })}
                  placeholder="e.g. Founder &amp; Growth Architect"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Students Mentored</label>
                <input
                  type="text"
                  value={tutorForm.mentored}
                  onChange={(e) => setTutorForm({ ...tutorForm, mentored: e.target.value })}
                  placeholder="e.g. 500+ or 1,200+"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Mentor Profile Photo</label>
                  <button
                    type="button"
                    onClick={() => setShowManualTutorUrl(!showManualTutorUrl)}
                    className="text-[11px] text-[#ABCAC2] hover:text-[#ABCAC2] transition-colors cursor-pointer"
                  >
                    {showManualTutorUrl ? "Switch to Drag & Drop Upload" : "or enter URL manually"}
                  </button>
                </div>

                {/* Hidden File Input for click-to-upload */}
                <input
                  ref={tutorFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleTutorImageUpload(file);
                    e.target.value = "";
                  }}
                />

                {!showManualTutorUrl ? (
                  <div className="space-y-3">
                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsTutorDragActive(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsTutorDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsTutorDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsTutorDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleTutorImageUpload(file);
                      }}
                      onClick={() => !isUploadingTutorImage && tutorFileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 transition-all cursor-pointer ${isTutorDragActive
                          ? "border-[#ABCAC2] bg-[#3B796A]/20 scale-[1.01] shadow-lg shadow-[#012A22]/30"
                          : "border-slate-700/80 bg-[#12151f] hover:border-[#3B796A]/50 hover:bg-slate-900/80"
                        }`}
                    >
                      {isUploadingTutorImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#ABCAC2] animate-spin" />
                          <p className="text-xs font-bold text-white">Uploading photo...</p>
                          <p className="text-[11px] text-slate-400">Saving file to media library</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="h-10 w-10 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/25 flex items-center justify-center text-[#ABCAC2]">
                            <Upload className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              <span className="text-[#ABCAC2] underline underline-offset-2">Click to upload</span> or drag &amp; drop
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP, or SVG up to 8MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Preview Card if Photo Exists */}
                    {tutorForm.image && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#151926] border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tutorForm.image}
                            alt="Mentor preview"
                            className="h-12 w-12 rounded-xl object-cover border border-[#3B796A]/30 shadow-md shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {tutorForm.name || "Mentor Photo"}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium truncate">
                              <Check className="h-3 w-3 shrink-0" /> Photo attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => tutorFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setTutorForm({ ...tutorForm, image: "" })}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={tutorForm.image}
                      onChange={(e) => setTutorForm({ ...tutorForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-[#012A22] focus:outline-none"
                    />
                    {tutorForm.image && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tutorForm.image}
                          alt="Preview"
                          className="h-12 w-12 rounded-xl object-cover border border-slate-700"
                        />
                        <span className="text-[11px] text-emerald-400 font-medium">Image preview loaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTutorModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#012A22] hover:bg-[#001F18] px-5 py-2 text-xs font-bold text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingTutor ? "Update Mentor" : "Add Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* MODAL: MEDIA LIBRARY / RECENT UPLOADS PICKER               */}
      {/* ========================================================= */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0e111a] p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#3B796A]/20 border border-[#3B796A]/30 flex items-center justify-center text-[#ABCAC2]">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Media Library</h3>
                  <p className="text-xs text-slate-400">Choose from previously uploaded images or upload a new file</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {mediaFiles.length} {mediaFiles.length === 1 ? "file" : "files"} available
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMediaFiles}
                  disabled={isLoadingMedia}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingMedia ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaPickerOpen(false);
                    blogFileInputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#012A22] hover:bg-[#001F18] text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  Upload from File Manager
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[380px] pr-1">
              {isLoadingMedia ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#ABCAC2]" />
                  <p className="text-xs">Loading media files...</p>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl p-6">
                  <FolderOpen className="h-10 w-10 text-slate-600 mb-2" />
                  <p className="text-sm font-semibold text-white">No uploaded images yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Upload an image using your file manager or drag-and-drop to see it stored here.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMediaPickerOpen(false);
                      blogFileInputRef.current?.click();
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#012A22] hover:bg-[#001F18] text-xs font-bold text-white cursor-pointer"
                  >
                    Upload Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaFiles.map((file) => {
                    const isSelected = blogForm.coverImage === file.url;
                    return (
                      <div
                        key={file.url}
                        onClick={() => {
                          setBlogForm((prev) => ({ ...prev, coverImage: file.url }));
                          setIsMediaPickerOpen(false);
                          notifySuccess("Image selected as blog cover!");
                        }}
                        className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer bg-[#131722] hover:border-[#3B796A] ${isSelected ? "border-[#3B796A] ring-2 ring-[#3B796A]/40" : "border-slate-800"
                          }`}
                      >
                        <div className="h-28 w-full bg-slate-950 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#012A22] text-white rounded-full p-1 shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-[#ABCAC2]" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
