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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Video,
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
  PageSeoItem,
} from "@/lib/content-db";
import { defaultFormSettings } from "@/types/forms";
import AdminWhyTreqqoTab from "@/components/admin/AdminWhyTreqqoTab";
import AdminPlacementsTab from "@/components/admin/AdminPlacementsTab";
import AdminGovCertsTab from "@/components/admin/AdminGovCertsTab";
import AdminCertificationsTab from "@/components/admin/AdminCertificationsTab";
import AdminSixDecisionsTab from "@/components/admin/AdminSixDecisionsTab";
import AdminFooterTab from "@/components/admin/AdminFooterTab";
import AdminLayoutMetaTab from "@/components/admin/AdminLayoutMetaTab";
import AdminPageKeywordsTab from "@/components/admin/AdminPageKeywordsTab";
import AdminPageDescriptionsTab from "@/components/admin/AdminPageDescriptionsTab";
import AdminCourseEditor from "@/components/admin/AdminCourseEditor";
import AdminSidebar from "@/components/admin/ui/AdminSidebar";
import AdminHeader from "@/components/admin/ui/AdminHeader";
import CommandPalette from "@/components/admin/ui/CommandPalette";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import StatBlock from "@/components/admin/ui/StatBlock";
import ActionList from "@/components/admin/ui/ActionList";
import DropdownMenu from "@/components/admin/ui/DropdownMenu";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Award, Trophy, Compass, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const TAB_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  overview: { title: "Overview Dashboard", breadcrumb: "Workspace" },
  leads: { title: "Student Applications", breadcrumb: "Admissions & CRM" },
  courses: { title: "Courses & Curriculum", breadcrumb: "Learning & Programs" },
  tutors: { title: "Mentors & Faculty", breadcrumb: "Learning & Programs" },
  whyTreqqo: { title: "CEO Challenge & Defense", breadcrumb: "Learning & Programs" },
  placements: { title: "Batch Placements", breadcrumb: "Learning & Programs" },
  govCerts: { title: "Accreditations & Certificates", breadcrumb: "Credentials & Compliance" },
  certifications: { title: "Program Certifications", breadcrumb: "Credentials & Compliance" },
  sixDecisions: { title: "Six Decisions Framework", breadcrumb: "Credentials & Compliance" },
  blogs: { title: "Articles & Insights", breadcrumb: "Content & Marketing" },
  faqs: { title: "Frequently Asked Questions", breadcrumb: "Content & Marketing" },
  hero: { title: "Hero & Key Metrics", breadcrumb: "Content & Marketing" },
  pageKeywords: { title: "Page-Wise SEO & Keywords", breadcrumb: "System & Settings" },
  pageDescriptions: { title: "Page-Wise Meta Descriptions", breadcrumb: "System & Settings" },
  banner: { title: "Announcement Banner", breadcrumb: "Content & Marketing" },
  alerts: { title: "Email Notifications & Alerts", breadcrumb: "System & Settings" },
  forms: { title: "Form Titles & Modals", breadcrumb: "System & Settings" },
  branding: { title: "Branding & Logos", breadcrumb: "System & Settings" },
  layout: { title: "Layout & SEO Meta", breadcrumb: "System & Settings" },
  footer: { title: "Footer & Contact Details", breadcrumb: "System & Settings" },
};

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

  // Command Palette & Mobile Menu state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Theme Mode: "light" | "dark" (persisted in localStorage)
  const [adminTheme, setAdminTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("treqo_admin_theme");
      if (stored === "light" || stored === "dark") {
        setAdminTheme(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleAdminTheme = () => {
    setAdminTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("treqo_admin_theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    | "certifications"
    | "sixDecisions"
    | "footer"
    | "faqs"
    | "blogs"
    | "pageKeywords"
    | "pageDescriptions"
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
  const [leadsSortBy, setLeadsSortBy] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc" | "course-asc"
  >("newest");

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

  const [pageSeo, setPageSeo] = useState<PageSeoItem[]>([]);

  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>({
    bannerBadge: "BATCH 2 Ã‚Â· 50 SEATS",
    bannerText: "Enrollments close on 4th October 2026.",
    bannerLinkText: "Explore the courses",
    bannerLinkHref: "/#courses",
  });

  const [homeContent, setHomeContent] = useState<HomePageContent>({
    hero: {
      eyebrow: "COHORT ADMISSIONS OPEN Ã‚Â· 2026",
      headlineLines: ["Leave with Skills", "you can implement.", "Not just a certificate"],
      description:
        "Four months. 12 phases. A real client at every stage. You finish holding campaigns you ran, numbers you own, and answers that hold up in an interview.",
    },
    stats: [
      { value: "100%", label: "Live Brand Work", detail: "Real ad spends, not simulations" },
      { value: "12", label: "Structured Phases", detail: "Zero to full-stack marketer" },
      { value: "1:1", label: "Direct Mentorship", detail: "Every student assigned a coach" },
      { value: "30+", label: "Verified Tools", detail: "Hands-on mastery guaranteed" },
    ],
    faqs: [],
    whyTreqqo: {
      eyebrow: "THE CEO CHALLENGE",
      titleLines: ["Every phase ends", "with a problem", "someone actually has."],
      description:
        "70% doing, 30% theory enforced, not aspirational. A right answer with no evidence behind it does not pass. You submit four things and defend them out loud.",
      submissions: [
        {
          tag: "01",
          title: "The problem",
          description: "One sentence. If it takes three, you haven't found the problem yet.",
          rule: "Criterion: Exactly 1 sentence",
        },
        {
          tag: "02",
          title: "The market logic",
          description: "Why this market behaves the way you claim. Assertion is not logic.",
          rule: "Criterion: Causal logic & proof",
        },
        {
          tag: "03",
          title: "The experiment",
          description: "Something small, live and measurable. Report it even when it flopped.",
          rule: "Criterion: Real spend & live data",
        },
        {
          tag: "04",
          title: "The revenue plan",
          description: "A business without a path to revenue is just an expensive idea.",
          rule: "Criterion: Board-level financial model",
        },
      ],
      banner: {
        title: "Phase 4 is a wall, not a checkpoint.",
        description:
          "Idea clarity is graded pass or rework. No partial credit, no parallel track. Nobody carries a weak idea into execution least of all the students in a hurry.",
      },
    },
    executionProof: {
      eyebrow: "BATCH 1 Ã‚Â· ALREADY HAPPENED",
      title: "Four names. All checkable.",
      description:
        "One batch is a small sample and we won't dress it up as an industry statistic. What we will say: every outcome below is a person you can look up.",
      outcomes: [
        {
          tag: "FOUNDER",
          name: "Somu Shekar",
          description: "Never went job-hunting. Co-founded Gesture Co while still in the course.",
          photoUrl: "/uploads/alumni/somu-shekar.jpg",
        },
        {
          tag: "FOUNDER",
          name: "Subhani",
          description: "Turned his capstone into a company. Founded JASS Media.",
          photoUrl: "/uploads/alumni/subhani.jpg",
        },
        {
          tag: "PLACED IN 30 DAYS",
          name: "Dikshtha",
          description: "At Bristle Tech within a month of finishing.",
          photoUrl: "/uploads/alumni/dikshtha.jpg",
        },
        {
          tag: "HIRED ON PORTFOLIO",
          name: "Harshit",
          description: "Placed at TCS on the strength of the work, not the rÃƒÂ©sumÃƒÂ©.",
          photoUrl: "/uploads/alumni/harshit.jpg",
        },
      ],
      metrics: [
        { value: "100%", label: "of Batch 1 placed or founding" },
        { value: "Ã¢â€šÂ¹5L+", label: "earned for a client, mid-course" },
      ],
      companies: [
        { name: "Gesture Co", logo: "/images/dark-gesture.png" },
        { name: "JASS Media", logo: "/images/dark-jass-media.png" },
        { name: "Bristle Tech", logo: "/images/dark-bristletech.png" },
      ],
    },
    mentors: {
      eyebrow: "PRACTITIONER MENTORSHIP",
      title: "Taught by people still doing the work.",
      description:
        "Every tutor runs active accounts and active brands. When algorithms change on a Tuesday, your Wednesday session reflects it.",
      highlightChips: [
        "100% Active Account Operators",
        "1:1 Real Budget Defenses",
        "Verified Career Outcomes",
      ],
      guaranteeHighlight: "Zero Academic Theory:",
      guaranteeText:
        "Every mentor actively manages enterprise budgets, live client acquisition accounts, and direct-response campaigns.",
    },
  });

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingMentorsSection, setIsSavingMentorsSection] = useState(false);

  // 3. Courses State
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseForm, setCourseForm] = useState<CourseItem>({
    id: "",
    title: "",
    href: "",
    badge: "BATCH 2 Ã‚Â· OPEN",
    duration: "4 months Ã‚Â· Online",
    description: "",
    isFlagship: false,
    isLocked: false,
    batch: "Batch 2 Ã‚Â· Sep 2026",
    feeTotal: "Ã¢â€šÂ¹55,000",
    feeEmi: "Ã¢â€šÂ¹4,583 / month",
    curriculumPdf: "/treqo-curriculum.pdf",
    overview: "",
    applyCta: "Apply for Batch 2",
    syllabusCta: "Download Curriculum",
    image: "",
    previewLabel: "CLASSROOM Ã‚Â· CEO CHALLENGE REVIEW",
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
    brandMetric: "",
    specialty: "",
    focus: "",
    isLocked: false,
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

  // Hero Artwork Upload States
  const [isUploadingDesktopHero, setIsUploadingDesktopHero] = useState(false);
  const [isUploadingMobileHero, setIsUploadingMobileHero] = useState(false);
  const desktopHeroFileInputRef = useRef<HTMLInputElement | null>(null);
  const mobileHeroFileInputRef = useRef<HTMLInputElement | null>(null);

  // Branding Logo Upload State
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);

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
        if (d.pageSeo) setPageSeo(d.pageSeo);
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
        actionText: newLockState ? "Get notified Ã¢â€ â€™" : "View course Ã¢â€ â€™",
        badge: newLockState
          ? "COMING SOON"
          : (c.badge === "COMING SOON" ? "BATCH 2 Ã‚Â· OPEN" : (c.badge || "BATCH 2 Ã‚Â· OPEN")),
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
      badge: "BATCH 2 Ã‚Â· OPEN",
      duration: "4 months Ã‚Â· Online",
      description: "",
      isFlagship: false,
      isLocked: false,
      batch: "Batch 2 Ã‚Â· Sep 2026",
      feeTotal: "Ã¢â€šÂ¹55,000",
      feeEmi: "Ã¢â€šÂ¹4,583 / month",
      curriculumPdf: "/treqo-curriculum.pdf",
      overview: "",
      applyCta: "Apply for Batch 2",
      syllabusCta: "Download Curriculum",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      previewLabel: "CLASSROOM Ã‚Â· CEO CHALLENGE REVIEW",
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
      badge: "BATCH 2 Ã‚Â· OPEN",
      badgeVariant: "blue",
      duration: "4 months Ã‚Â· Online",
      meta: "4 months Ã‚Â· Online",
      description: "Hands-on growth architecture with real client budgets, verified live campaigns, and mentor reviews.",
      isFlagship: false,
      isLocked: false,
      batch: "Batch 2 Ã‚Â· Sep 2026",
      feeTotal: "Ã¢â€šÂ¹55,000",
      feeEmi: "Ã¢â€šÂ¹4,583 / month",
      curriculumPdf: "/treqo-curriculum.pdf",
      overview: "Graduates and early-career marketers wanting verifiable execution proof.\nWorking professionals seeking high-trajectory marketing roles.\nFounders scaling their own customer acquisition.",
      applyCta: "Apply for Batch 2",
      syllabusCta: "Download Curriculum",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      previewLabel: "CLASSROOM Ã‚Â· CEO CHALLENGE REVIEW",
    };
    setCourseInStudio(newCourse);
  }

  function openEditCourseModal(c: CourseItem) {
    // Directly open the full Course Studio!
    openCourseStudio(c);
  }

  function isValidImageFile(file: File): boolean {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) return true;
    return /\.(png|jpe?g|webp|svg|gif|avif|ico)$/i.test(file.name);
  }

  async function handleCourseImageUpload(file: File) {
    if (!file) return;
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifyError("Image size exceeds 10MB limit.");
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

  async function handleDesktopHeroImageUpload(file: File) {
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      notifyError("Image size exceeds 12MB limit.");
      return;
    }
    setIsUploadingDesktopHero(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": getStoredPin() },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setHomeContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, desktopImage: data.url },
        }));
        notifySuccess("Desktop hero artwork uploaded!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading image.");
    } finally {
      setIsUploadingDesktopHero(false);
    }
  }

  async function handleMobileHeroImageUpload(file: File) {
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      notifyError("Image size exceeds 12MB limit.");
      return;
    }
    setIsUploadingMobileHero(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": getStoredPin() },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setHomeContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, mobileImage: data.url },
        }));
        notifySuccess("Mobile hero artwork uploaded!");
      } else {
        notifyError(data.error || "Failed to upload image.");
      }
    } catch {
      notifyError("Network error while uploading image.");
    } finally {
      setIsUploadingMobileHero(false);
    }
  }

  async function handleLogoImageUpload(file: File) {
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      notifyError("Image size exceeds 8MB limit.");
      return;
    }
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "branding");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": getStoredPin() },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setGeneralSettings((prev) => ({ ...prev, logoImage: data.url }));
        notifySuccess("Brand logo uploaded successfully!");
      } else {
        notifyError(data.error || "Failed to upload logo.");
      }
    } catch {
      notifyError("Network error while uploading logo.");
    } finally {
      setIsUploadingLogo(false);
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
      brandMetric: "",
      specialty: "",
      focus: "",
      isLocked: false,
    });
    setShowManualTutorUrl(false);
    setIsTutorDragActive(false);
    setIsTutorModalOpen(true);
  }

  function openEditTutorModal(t: TutorItem) {
    setEditingTutor(t);
    setTutorForm({
      id: t.id,
      name: t.name,
      role: t.role,
      mentored: t.mentored,
      image: t.image || "",
      brandMetric: t.brandMetric || "",
      specialty: t.specialty || "",
      focus: t.focus || "",
      isLocked: Boolean(t.isLocked),
    });
    setShowManualTutorUrl(false);
    setIsTutorDragActive(false);
    setIsTutorModalOpen(true);
  }

  async function handleTutorImageUpload(file: File) {
    if (!file) return;
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifyError("Image size exceeds 10MB limit.");
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
      notifyError("Photo upload error.");
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

  async function handleToggleTutorLock(id: string) {
    const target = tutors.find((t) => t.id === id);
    const newLockState = !target?.isLocked;
    const updated = tutors.map((t) =>
      t.id === id ? { ...t, isLocked: newLockState } : t
    );
    setTutors(updated);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "tutors", data: updated }),
      });
      if (res.ok) {
        notifySuccess(
          newLockState
            ? `Locked "${target?.name}" (Shows Coming Soon mode)`
            : `Unlocked "${target?.name}" (Actual profile revealed)`
        );
      } else {
        notifyError("Failed to update mentor lock state.");
      }
    } catch {
      notifyError("Network error updating lock state.");
    }
  }

  async function handleLockAllTutors(lockState: boolean) {
    const updated = tutors.map((t) => ({ ...t, isLocked: lockState }));
    setTutors(updated);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "tutors", data: updated }),
      });
      if (res.ok) {
        notifySuccess(
          lockState
            ? "All mentor blocks locked (Showing Coming Soon)"
            : "All mentor blocks unlocked (Revealing actual content)"
        );
      } else {
        notifyError("Failed to update mentor blocks.");
      }
    } catch {
      notifyError("Network error updating mentor blocks.");
    }
  }

  async function handleSaveMentorsSection(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingMentorsSection(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": getStoredPin() },
        body: JSON.stringify({ type: "home", data: homeContent }),
      });
      if (res.ok) {
        notifySuccess("Mentors section settings saved!");
      } else {
        notifyError("Failed to save mentors section settings.");
      }
    } catch {
      notifyError("Network error saving mentors section.");
    } finally {
      setIsSavingMentorsSection(false);
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
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifyError("Image size exceeds 10MB limit.");
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

  useEffect(() => {
    function handleDataUpdated() {
      loadAllData();
    }
    window.addEventListener("treqo_data_updated", handleDataUpdated);
    return () => window.removeEventListener("treqo_data_updated", handleDataUpdated);
  }, []);

  // Handle Authentication
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const enteredPin = pinInput.trim();
    if (!enteredPin) {
      setAuthError("Please enter your admin passcode.");
      return;
    }
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: enteredPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("treqo_admin_auth", "true");
        sessionStorage.setItem("treqo_admin_pin", enteredPin);
        setUnlocked(true);
        setAuthError("");
      } else {
        setAuthError(data.error || "Invalid passcode. Please enter the authorized Treqo PIN.");
      }
    } catch {
      if (enteredPin === ADMIN_PIN || enteredPin === DEFAULT_PIN) {
        sessionStorage.setItem("treqo_admin_auth", "true");
        sessionStorage.setItem("treqo_admin_pin", enteredPin);
        setUnlocked(true);
        setAuthError("");
      } else {
        setAuthError("Authentication service error. Please check connectivity.");
      }
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
    if (!isValidImageFile(file)) {
      notifyError("Please select a valid image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifyError("Image size exceeds 10MB limit.");
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
    const list = leads.filter((l) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        l.name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.phone.includes(searchQuery);

      const matchesCourse = selectedCourse === "All" || l.course === selectedCourse;
      return matchesSearch && matchesCourse;
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
  }, [leads, searchQuery, selectedCourse, leadsSortBy]);

  const coursesList = useMemo(() => {
    const set = new Set(leads.map((l) => l.course).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [leads]);

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED ACCESS GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${adminTheme === "dark" ? "admin-dark bg-[#0B0B0F] text-[#F3F4F6]" : "bg-[#FDFAF6] text-[#0B0B0F]"} p-6 sm:p-10 transition-colors duration-200 ${plusJakarta.className}`}>
        {/* Top Spacer with Quick Theme Toggle */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={toggleAdminTheme}
            className="p-2 rounded-xl border border-[#3B0D3B]/10 bg-white text-[#5A4A5A] hover:text-[#3B0D3B] transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title={adminTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {adminTheme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-[#3B0D3B]" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Centered Minimalist Form */}
        <div className="w-full max-w-[420px] mx-auto my-auto bg-white border border-[#3B0D3B]/10 rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#3B0D3B]/5 space-y-7">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#3B0D3B]/15">
              <span className="text-xs font-black text-[#3B0D3B] tracking-wider">TREQO</span>
              <span className="rounded bg-[#3B0D3B] px-1.5 py-0.2 text-[8px] font-bold text-white uppercase tracking-widest">
                HQ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0F] tracking-tight leading-tight">
              Sign in to Treqo HQ
            </h1>
            <p className="text-xs text-[#5A4A5A] font-medium leading-relaxed">
              Enter the administrator passcode to access admissions, courses, and site configuration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="text-xs text-red-700 font-medium bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="adminPin" className="block text-[11px] font-bold uppercase tracking-wider text-[#5A4A5A]">
                PASSCODE
              </label>
              <div className="relative flex items-center rounded-xl bg-[#FAF5EE]/60 border border-[#3B0D3B]/15 px-3.5 focus-within:border-[#3B0D3B] focus-within:bg-white transition-all">
                <Lock className="h-4 w-4 text-[#8C6A8C] shrink-0" />
                <input
                  id="adminPin"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter your passcode"
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-[#0B0B0F] placeholder:text-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8C6A8C] hover:text-[#3B0D3B] transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] py-3.5 text-sm font-bold text-white transition-all active:scale-[0.99] cursor-pointer shadow-md shadow-[#3B0D3B]/20"
            >
              <LogIn className="h-4 w-4 stroke-[2.2]" />
              <span>Enter Workspace</span>
            </button>
          </form>
        </div>

        {/* Bottom subtle return link */}
        <div className="w-full text-center py-2">
          <Link
            href="/"
            className="text-xs font-semibold text-[#5A4A5A] hover:text-[#3B0D3B] transition-colors"
          >
            Ã¢â€ Â Return to public website
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED MASTER CONSOLE
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen ${adminTheme === "dark" ? "admin-dark bg-[#0B0B0F] text-[#F3F4F6]" : "bg-[#FDFAF6] text-[#0B0B0F]"} flex transition-colors duration-200 ${plusJakarta.className}`}>
      {/* Toast Feedback Messages */}
      {saveMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-white border border-[#3B0D3B]/20 px-4 py-3 text-xs font-bold text-[#0B0B0F] shadow-2xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-white border border-red-300 px-4 py-3 text-xs font-bold text-red-700 shadow-2xl animate-in fade-in slide-in-from-top-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. BRANDED SIDEBAR (COLLAPSIBLE & MOBILE DRAWER) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId as any)}
        onLogout={handleLogout}
        leadsCount={leads.length}
        coursesCount={courses.length}
        tutorsCount={tutors.length}
        blogsCount={blogs.length}
        faqsCount={homeContent.faqs?.length || 0}
        emailAlertsActive={alertSettings.emailAlertsEnabled}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        theme={adminTheme}
        onToggleTheme={toggleAdminTheme}
      />

      {/* 2. COMMAND PALETTE (CMD+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId as any)}
        leads={leads}
        courses={courses}
        onSelectLead={(lead) => {
          setActiveTab("leads");
          setSelectedLeadForDetail(lead);
        }}
      />

      {/* 3. RIGHT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={TAB_TITLES[activeTab]?.title || "Workspace"}
          breadcrumb={TAB_TITLES[activeTab]?.breadcrumb || "TREQO HQ"}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onRefreshData={loadAllData}
          isRefreshing={loadingLeads}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          theme={adminTheme}
          onToggleTheme={toggleAdminTheme}
        />

        {/* Main Content Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-[1400px] w-full mx-auto">
          {/* ========================================================= */}
          {/* TAB: OVERVIEW DASHBOARD                                   */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome & Context Banner */}
              <div className="rounded-3xl bg-gradient-to-br from-[#3B0D3B] via-[#2A082A] to-[#180518] p-6 sm:p-8 text-white shadow-xl shadow-[#3B0D3B]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-[#FDFAF6]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Admissions Portal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Welcome to Treqo HQ Console
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FDFAF6]/80 font-normal max-w-xl leading-relaxed">
                    Track live applicant submissions, monitor cohort enrollments, configure structured curriculum phases, and update marketing content.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 text-left">
                    <div className="text-[10px] font-bold text-[#FDFAF6]/70 uppercase tracking-wider">Local IST Time</div>
                    <div className="text-sm font-black text-white">{currentTime}</div>
                    <div className="text-[10px] text-[#FDFAF6]/70">{currentDate}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="rounded-2xl bg-white text-[#3B0D3B] px-5 py-3 text-xs font-black hover:bg-[#FAF5EE] transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    View All CRM Leads Ã¢â€ â€™
                  </button>
                </div>

                {/* Subtle Decorative Background Circles */}
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute right-32 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
              </div>

              {/* Typography-Driven Stat Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBlock
                  title="Total Applications"
                  value={leads.length}
                  trend={{ value: `${leads.length} verified`, isPositive: true }}
                  icon={Users}
                  description="Lifetime student submissions"
                />
                <StatBlock
                  title="Applied Today"
                  value={leads.filter((l) => l.submittedAt.startsWith(new Date().toISOString().split("T")[0])).length}
                  trend={{ value: "Live tracker", isPositive: true }}
                  icon={Sparkles}
                  description="Submissions in last 24h"
                />
                <StatBlock
                  title="Active Programs"
                  value={`${courses.filter((c) => !c.isLocked).length} Open`}
                  badge={`${courses.length} total tracks`}
                  icon={GraduationCap}
                  description="Courses available for enrollment"
                />
                <StatBlock
                  title="Email Alerts"
                  value={alertSettings.emailAlertsEnabled ? "Active" : "Paused"}
                  badge={`${(alertSettings.notifyEmails || "").split(",").filter(Boolean).length} Admins`}
                  icon={Mail}
                  description="Live dispatch on form submit"
                />
              </div>

              {/* Action-First Attention Section */}
              <ActionList
                title="Needs Your Attention"
                items={[
                  {
                    id: "leads-review",
                    title: `Review Student Applications (${leads.filter((l) => l.submittedAt.startsWith(new Date().toISOString().split("T")[0])).length} today)`,
                    description: "Verify applicant phone numbers, backgrounds, and track choices before scheduling founder interviews.",
                    severity: leads.length > 0 ? "warning" : "info",
                    actionLabel: "Open CRM",
                    onAction: () => setActiveTab("leads"),
                  },
                  {
                    id: "courses-batch",
                    title: "Program Batches & Locked Status",
                    description: "Keep batch start dates and coming soon labels synchronized with upcoming enrollment cycles.",
                    severity: "info",
                    actionLabel: "Manage Courses",
                    onAction: () => setActiveTab("courses"),
                  },
                  {
                    id: "email-check",
                    title: alertSettings.emailAlertsEnabled ? "Instant Email Alerts Operational" : "Email Alerts Currently Paused",
                    description: alertSettings.emailAlertsEnabled
                      ? `Notifications routed to ${alertSettings.notifyEmails || "configured admins"}.`
                      : "Enable alerts to instantly receive new lead submissions via email.",
                    severity: alertSettings.emailAlertsEnabled ? "info" : "critical",
                    actionLabel: "Configure Alerts",
                    onAction: () => setActiveTab("alerts"),
                  },
                ]}
              />

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseForm({
                      id: "",
                      title: "",
                      description: "",
                      badge: "BATCH 2 Ã‚Â· OPEN",
                      duration: "4 months Ã‚Â· Online",
                      href: "/courses/",
                      image: "",
                      previewLabel: "CLASSROOM Ã‚Â· SESSIONS",
                      isLocked: false,
                      isFlagship: false,
                      batch: "Batch 2 Ã‚Â· Sep 2026",
                      feeTotal: "Ã¢â€šÂ¹55,000",
                      feeEmi: "Ã¢â€šÂ¹4,583 / month",
                      applyCta: "Apply for Batch 2",
                      syllabusCta: "Download Curriculum",
                      curriculumPdf: "/treqo-curriculum.pdf",
                      overview: "",
                      challenge: { title: "The CEO Challenge", prompt: "" },
                    });
                    setIsCourseModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-white border border-[#3B0D3B]/10 hover:border-[#3B0D3B]/30 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B] flex items-center justify-center mb-3 group-hover:bg-[#3B0D3B] group-hover:text-white transition-colors">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-[#0B0B0F] text-sm">Add New Course Track</div>
                  <div className="text-xs text-[#5A4A5A] mt-0.5">Publish a cohort program</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("leads")}
                  className="p-5 rounded-2xl bg-white border border-[#3B0D3B]/10 hover:border-[#3B0D3B]/30 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B] flex items-center justify-center mb-3 group-hover:bg-[#3B0D3B] group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-[#0B0B0F] text-sm">View Student CRM</div>
                  <div className="text-xs text-[#5A4A5A] mt-0.5">{leads.length} applicants enrolled</div>
                </button>

                <button
                  type="button"
                  onClick={handleTestAlert}
                  disabled={isTestingAlert}
                  className="p-5 rounded-2xl bg-white border border-[#3B0D3B]/10 hover:border-[#3B0D3B]/30 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B] flex items-center justify-center mb-3 group-hover:bg-[#3B0D3B] group-hover:text-white transition-colors">
                    <Send className={`h-5 w-5 ${isTestingAlert ? "animate-spin" : ""}`} />
                  </div>
                  <div className="font-bold text-[#0B0B0F] text-sm">Send Test Alert</div>
                  <div className="text-xs text-[#5A4A5A] mt-0.5">Validate email dispatch</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
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
                      tags: "Performance, Growth, AI",
                      body: "",
                    });
                    setIsBlogModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-white border border-[#3B0D3B]/10 hover:border-[#3B0D3B]/30 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 text-[#3B0D3B] flex items-center justify-center mb-3 group-hover:bg-[#3B0D3B] group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-[#0B0B0F] text-sm">Publish Article</div>
                  <div className="text-xs text-[#5A4A5A] mt-0.5">Create blog or teardown</div>
                </button>
              </div>

              {/* Recent Student Applications Preview */}
              <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0B0B0F]">Recent Student Applications</h3>
                    <p className="text-xs text-[#5A4A5A] mt-0.5">Latest admissions submissions from the website</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-bold text-[#3B0D3B] hover:underline cursor-pointer"
                  >
                    View all in CRM ({leads.length}) Ã¢â€ â€™
                  </button>
                </div>

                {leads.length === 0 ? (
                  <EmptyState
                    title="No student applications yet"
                    description="When students fill out forms on the live website, their submissions will appear here instantly."
                  />
                ) : (
                  <div className="divide-y divide-[#3B0D3B]/10">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF5EE]/50 px-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-[#3B0D3B]/10 text-[#3B0D3B] font-bold text-xs flex items-center justify-center shrink-0">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#0B0B0F] truncate">{lead.name}</div>
                            <div className="text-[11px] text-[#5A4A5A] truncate">{lead.email} Ã‚Â· {lead.phone}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <StatusBadge status="active" label={lead.course} />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("leads");
                              setSelectedLeadForDetail(lead);
                            }}
                            className="text-xs font-semibold text-[#3B0D3B] hover:underline cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: STUDENT SUBMISSIONS / CRM                            */}
          {/* ========================================================= */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              {/* Header with Search, Filter, Export */}
              <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B0B0F] tracking-tight">Student Applications CRM</h2>
                    <p className="text-xs text-[#5A4A5A] mt-0.5">
                      Direct form submissions with applicant contact details, track choices, and backgrounds.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadAllData}
                      disabled={loadingLeads}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#3B0D3B]/20 bg-white px-3.5 py-2 text-xs font-bold text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${loadingLeads ? "animate-spin" : ""}`} />
                      <span>Refresh</span>
                    </button>

                    <a
                      href={`/api/leads?format=csv&pin=${encodeURIComponent(getStoredPin())}`}
                      download
                      className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export CSV</span>
                    </a>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6A8C]" />
                    <input
                      type="text"
                      placeholder="Search students by name, email, phone, background..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 pl-10 pr-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#8C6A8C] focus:bg-white focus:border-[#3B0D3B] focus:outline-none transition-all"
                    />
                  </div>

                  {coursesList.length > 1 && (
                    <div className="relative sm:w-60">
                      <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C6A8C] pointer-events-none" />
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 pl-9 pr-8 py-2.5 text-xs font-semibold text-[#0B0B0F] focus:bg-white focus:border-[#3B0D3B] focus:outline-none cursor-pointer"
                      >
                        {coursesList.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="relative sm:w-52">
                    <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C6A8C] pointer-events-none" />
                    <select
                      value={leadsSortBy}
                      onChange={(e) =>
                        setLeadsSortBy(
                          e.target.value as "newest" | "oldest" | "name-asc" | "name-desc" | "course-asc"
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 pl-9 pr-8 py-2.5 text-xs font-semibold text-[#0B0B0F] focus:bg-white focus:border-[#3B0D3B] focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="oldest">Sort: Oldest First</option>
                      <option value="name-asc">Sort: Name (A Ã¢â€ â€™ Z)</option>
                      <option value="name-desc">Sort: Name (Z Ã¢â€ â€™ A)</option>
                      <option value="course-asc">Sort: Course (A Ã¢â€ â€™ Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-hidden rounded-3xl border border-[#3B0D3B]/10 bg-white shadow-sm">
                {filteredLeads.length === 0 ? (
                  <EmptyState
                    title="No student submissions found"
                    description="Try adjusting your search query or filter to see results."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF5EE] border-b border-[#3B0D3B]/10 text-[11px] uppercase tracking-wider text-[#5A4A5A]">
                        <tr>
                          <th
                            onClick={() =>
                              setLeadsSortBy(leadsSortBy === "name-asc" ? "name-desc" : "name-asc")
                            }
                            className="px-5 py-3.5 font-bold cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                            title="Click to sort by Name"
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <span>Student</span>
                              {leadsSortBy === "name-asc" && <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />}
                              {leadsSortBy === "name-desc" && <ArrowDown className="h-3 w-3 text-[#3B0D3B]" />}
                              {leadsSortBy !== "name-asc" && leadsSortBy !== "name-desc" && (
                                <ArrowUpDown className="h-3 w-3 text-[#8C6A8C]/40" />
                              )}
                            </div>
                          </th>
                          <th className="px-5 py-3.5 font-bold">Contact Details</th>
                          <th
                            onClick={() => setLeadsSortBy("course-asc")}
                            className="px-5 py-3.5 font-bold cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                            title="Click to sort by Course"
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <span>Applied Course</span>
                              {leadsSortBy === "course-asc" ? (
                                <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3 text-[#8C6A8C]/40" />
                              )}
                            </div>
                          </th>
                          <th className="px-5 py-3.5 font-bold">Origin Page</th>
                          <th className="px-5 py-3.5 font-bold">Background &amp; Source</th>
                          <th
                            onClick={() =>
                              setLeadsSortBy(leadsSortBy === "newest" ? "oldest" : "newest")
                            }
                            className="px-5 py-3.5 font-bold cursor-pointer select-none hover:text-[#3B0D3B] transition-colors"
                            title="Click to sort by Date"
                          >
                            <div className="inline-flex items-center gap-1.5">
                              <span>Date &amp; Time</span>
                              {leadsSortBy === "newest" && <ArrowDown className="h-3 w-3 text-[#3B0D3B]" />}
                              {leadsSortBy === "oldest" && <ArrowUp className="h-3 w-3 text-[#3B0D3B]" />}
                              {leadsSortBy !== "newest" && leadsSortBy !== "oldest" && (
                                <ArrowUpDown className="h-3 w-3 text-[#8C6A8C]/40" />
                              )}
                            </div>
                          </th>
                          <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3B0D3B]/10">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-[#FAF5EE]/40 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#3B0D3B]/10 border border-[#3B0D3B]/15 text-[#3B0D3B] font-bold text-xs flex items-center justify-center shrink-0">
                                  {lead.name ? lead.name.charAt(0).toUpperCase() : "S"}
                                </div>
                                <div>
                                  <span className="font-bold text-[#0B0B0F] text-xs block">{lead.name}</span>
                                  <span className="text-[10px] text-[#5A4A5A]">ID: {lead.id.slice(-6)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 space-y-1">
                              <div className="flex items-center gap-1.5 text-[#0B0B0F]">
                                <Mail className="h-3 w-3 text-[#8C6A8C] shrink-0" />
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="hover:text-[#3B0D3B] transition-colors text-xs font-mono font-medium"
                                >
                                  {lead.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-1.5 text-[#0B0B0F]">
                                <Phone className="h-3 w-3 text-[#8C6A8C] shrink-0" />
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="hover:text-[#3B0D3B] transition-colors text-xs font-mono font-medium"
                                >
                                  {lead.phone}
                                </a>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 text-[#3B0D3B] font-bold text-xs">
                                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                <span>{lead.course || "New Age Digital Marketing"}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <a
                                href={lead.pageUrl || lead.page || "/"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5EE] border border-[#3B0D3B]/15 text-[#0B0B0F] hover:text-[#3B0D3B] hover:bg-[#F5EDE0] hover:border-[#3B0D3B]/30 font-medium text-xs transition-colors group cursor-pointer max-w-[200px]"
                                title={`View lead source page: ${lead.page || "/"}`}
                              >
                                <Globe className="h-3.5 w-3.5 shrink-0 text-[#8C6A8C] group-hover:text-[#3B0D3B]" />
                                <span className="font-mono truncate">{lead.page || "/"}</span>
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 shrink-0" />
                              </a>
                            </td>
                            <td className="px-5 py-4 space-y-1">
                              <div className="text-xs text-[#0B0B0F] font-medium">{lead.background || "General Inquiry"}</div>
                              <div>
                                <span className="text-[10px] text-[#5A4A5A] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#3B0D3B]/10 font-medium inline-block">
                                  {lead.source || "Website Form"}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-[#5A4A5A] text-xs whitespace-nowrap">
                              <div className="font-semibold text-[#0B0B0F]">
                                {new Date(lead.submittedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-[10px] text-[#8C6A8C]">
                                {new Date(lead.submittedAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLeadForDetail(lead)}
                                  className="p-1.5 rounded-lg border border-[#3B0D3B]/15 bg-white text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                  title="View Full Profile"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="p-1.5 rounded-lg border border-[#3B0D3B]/15 bg-white text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                  title="Email Student"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </a>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="p-1.5 rounded-lg border border-[#3B0D3B]/15 bg-white text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                                  title="Call Student"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setLeadToDelete(lead)}
                                  className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:text-white hover:bg-red-600 transition-colors cursor-pointer shadow-2xs"
                                  title="Delete Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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

              {/* Lead Delete Confirmation Modal */}
              {leadToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#3B0D3B]/15 p-6 sm:p-7 shadow-2xl space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0B0B0F]">Delete Applicant Record</h3>
                        <p className="text-xs text-[#5A4A5A]">This action will permanently delete this lead from CRM.</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-3.5 text-xs text-[#0B0B0F] space-y-1.5">
                      <p><span className="font-bold text-[#5A4A5A]">Student:</span> {leadToDelete.name}</p>
                      <p><span className="font-bold text-[#5A4A5A]">Email:</span> {leadToDelete.email}</p>
                      <p><span className="font-bold text-[#5A4A5A]">Course:</span> {leadToDelete.course}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#3B0D3B]/10">
                      <button
                        type="button"
                        onClick={() => setLeadToDelete(null)}
                        className="px-4 py-2 rounded-xl border border-[#3B0D3B]/15 text-xs font-semibold text-[#5A4A5A] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await handleDeleteLead(leadToDelete.id);
                          setLeadToDelete(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BRANDING & LOGO                                    */}
          {/* ========================================================= */}
          {activeTab === "branding" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Branding &amp; Site Identity</h2>
                <p className="text-xs sm:text-sm text-[#5A4A5A]">
                  Change your website logo, company title, and admissions contact numbers.
                </p>
              </div>

              <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Site Title</label>
                  <input
                    type="text"
                    value={generalSettings.siteTitle}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Logo Text (Default)</label>
                  <input
                    type="text"
                    value={generalSettings.logoText}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, logoText: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#5A4A5A]">Displayed in the header when no image logo is set.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0B0B0F]">Logo Image (Optional)</label>
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B0D3B] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{isUploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                    </button>
                  </div>

                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleLogoImageUpload(f);
                      e.target.value = "";
                    }}
                  />

                  <input
                    type="text"
                    placeholder="https://your-domain.com/logo.png or /logo.png"
                    value={generalSettings.logoImage || ""}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, logoImage: e.target.value })}
                    className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#5A4A5A]">
                    Upload a file or provide a direct URL to your logo (SVG or PNG). Leave empty to use text logo.
                  </p>
                </div>

                {/* Logo Live Preview */}
                <div className="rounded-2xl border border-[#3B0D3B]/10 bg-[#FAF5EE] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A4A5A]">Header Preview</span>
                    <div className="mt-2">
                      {generalSettings.logoImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={generalSettings.logoImage} alt="Logo" className="h-8 w-auto object-contain" />
                      ) : (
                        <span className="text-2xl font-black text-[#3B0D3B] tracking-tight">{generalSettings.logoText}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Admissions Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Admissions Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={generalSettings.supportPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveSettings(generalSettings)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
                <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Top Announcement Banner</h2>
                <p className="text-xs sm:text-sm text-[#5A4A5A]">
                  Update the urgent notification bar displayed across the top of every page.
                </p>
              </div>

              <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Badge Tag</label>
                  <input
                    type="text"
                    value={navigationSettings.bannerBadge}
                    onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerBadge: e.target.value })}
                    placeholder="e.g. BATCH 2 Ã‚Â· 50 SEATS"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Banner Announcement Copy</label>
                  <input
                    type="text"
                    value={navigationSettings.bannerText}
                    onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerText: e.target.value })}
                    placeholder="e.g. Enrollments close on 4th October 2026."
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Button Label</label>
                    <input
                      type="text"
                      value={navigationSettings.bannerLinkText}
                      onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerLinkText: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Target Link URL</label>
                    <input
                      type="text"
                      value={navigationSettings.bannerLinkHref}
                      onChange={(e) => setNavigationSettings({ ...navigationSettings, bannerLinkHref: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Banner Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A4A5A]">Live Preview</span>
                  <div className="mt-1.5 overflow-hidden rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE] py-2.5 px-4 text-center text-xs text-[#0B0B0F] flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-md bg-[#3B0D3B] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      {navigationSettings.bannerBadge}
                    </span>
                    <span className="text-[#0B0B0F]">{navigationSettings.bannerText}</span>
                    <span className="font-bold underline text-[#3B0D3B]">{navigationSettings.bannerLinkText}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveBanner(navigationSettings)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Banner Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: HERO — VISUAL WYSIWYG EDITOR                       */}
          {/* ========================================================= */}
          {activeTab === "hero" && (
            <div className="space-y-5 max-w-5xl">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Homepage Hero Editor</h2>
                  <p className="text-xs text-[#5A4A5A] mt-0.5">Click any text to edit it directly. Upload images by clicking the image areas. Save when done.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSavingForms}
                    onClick={(e) => handleSaveForms(e as unknown as React.FormEvent)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#3B0D3B]/20 bg-white hover:bg-[#FAF5EE] px-4 py-2 text-xs font-bold text-[#3B0D3B] shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSavingForms ? "Saving..." : "Save Form"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => saveHeroContent(homeContent)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSaving ? "Saving..." : "Publish Changes"}</span>
                  </button>
                </div>
              </div>

              {/* WYSIWYG Hero Preview */}
              <div className="rounded-3xl border-2 border-dashed border-[#3B0D3B]/15 overflow-hidden bg-[#FDFAF6] shadow-lg">

                {/* Edit hint bar */}
                <div className="flex items-center gap-2 bg-[#3B0D3B]/5 border-b border-[#3B0D3B]/10 px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3B0D3B] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#3B0D3B] uppercase tracking-wider">Live Edit Mode — Click any element below to edit</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px]">

                  {/* LEFT: Text Content */}
                  <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5">

                    {/* Eyebrow Badge */}
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#3B0D3B]/15 bg-white/90 px-3.5 py-1 shadow-xs">
                      <span className="h-2 w-2 rounded-full bg-[#0CA30C]" />
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, eyebrow: e.currentTarget.textContent || "" } })}
                        className="text-xs font-extrabold text-[#1A0A1A] outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded px-0.5 min-w-[60px] focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all"
                        title="Click to edit eyebrow badge"
                      >
                        {homeContent.hero.eyebrow}
                      </span>
                    </div>

                    {/* Headline Lines */}
                    <div className="space-y-0.5">
                      {homeContent.hero.headlineLines.map((line, idx) => (
                        <div key={idx} className="group flex items-start gap-2">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newLines = [...homeContent.hero.headlineLines];
                              newLines[idx] = e.currentTarget.textContent || "";
                              setHomeContent({ ...homeContent, hero: { ...homeContent.hero, headlineLines: newLines } });
                            }}
                            className={`text-3xl font-black leading-tight outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded px-1 block min-w-[100px] focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all ${idx === homeContent.hero.headlineLines.length - 1 ? "text-[#5A2A5A]" : "text-[#1A0A1A]"}`}
                            title="Click to edit headline"
                          >
                            {line}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newLines = homeContent.hero.headlineLines.filter((_, i) => i !== idx);
                              setHomeContent({ ...homeContent, hero: { ...homeContent.hero, headlineLines: newLines } });
                            }}
                            className="opacity-0 group-hover:opacity-100 mt-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer shrink-0"
                            title="Remove line"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, headlineLines: [...homeContent.hero.headlineLines, "New line"] } })}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B0D3B]/50 hover:text-[#3B0D3B] cursor-pointer mt-1 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add line
                      </button>
                    </div>

                    {/* Description */}
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, description: e.currentTarget.textContent || "" } })}
                      className="text-sm leading-relaxed text-[#5A4A5A] outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded-lg px-2 py-1 min-h-[48px] focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all"
                      title="Click to edit description"
                    >
                      {homeContent.hero.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {/* Primary */}
                      <div className="group relative">
                        <div className="rounded-xl bg-[#3B0D3B] px-5 py-3 text-sm font-bold text-white shadow-lg">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, primaryCtaLabel: e.currentTarget.textContent || "" } })}
                            className="outline-none cursor-text"
                            title="Click to edit primary button label"
                          >
                            {homeContent.hero.primaryCtaLabel || "Browse Courses"}
                          </span>
                        </div>
                        <div className="absolute -bottom-5 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <input
                            type="text"
                            value={homeContent.hero.primaryCtaHref || ""}
                            onChange={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, primaryCtaHref: e.target.value } })}
                            placeholder="link href"
                            className="w-full text-[10px] border border-[#3B0D3B]/20 rounded px-2 py-0.5 bg-white text-[#3B0D3B] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Secondary */}
                      <div className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#1A0A1A]">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, secondaryCtaLabel: e.currentTarget.textContent || "" } })}
                          className="outline-none cursor-text"
                          title="Click to edit secondary button label"
                        >
                          {homeContent.hero.secondaryCtaLabel || "Book a demo"}
                        </span>
                      </div>

                      {/* Watch Video */}
                      <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-xs font-bold text-[#1A0A1A] flex items-center gap-2">
                        <Video className="h-3.5 w-3.5 text-[#3B0D3B]" />
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setHomeContent({ ...homeContent, hero: { ...homeContent.hero, watchVideoLabel: e.currentTarget.textContent || "" } })}
                          className="outline-none cursor-text"
                          title="Click to edit watch video label"
                        >
                          {homeContent.hero.watchVideoLabel || "Watch Video"}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#3B0D3B]/8">
                      {homeContent.stats.map((stat, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const s = [...homeContent.stats];
                              s[idx] = { ...s[idx], value: e.currentTarget.textContent || "" };
                              setHomeContent({ ...homeContent, stats: s });
                            }}
                            className="text-xl font-black text-[#3B0D3B] outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded px-1 focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all"
                            title="Click to edit stat value"
                          >
                            {stat.value}
                          </div>
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const s = [...homeContent.stats];
                              s[idx] = { ...s[idx], label: e.currentTarget.textContent || "" };
                              setHomeContent({ ...homeContent, stats: s });
                            }}
                            className="text-[10px] font-bold text-[#5A4A5A] outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded px-1 focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all"
                            title="Click to edit stat label"
                          >
                            {stat.label}
                          </div>
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const s = [...homeContent.stats];
                              s[idx] = { ...s[idx], detail: e.currentTarget.textContent || "" };
                              setHomeContent({ ...homeContent, stats: s });
                            }}
                            className="text-[9px] text-[#8C6A8C] outline-none cursor-text hover:bg-[#3B0D3B]/5 rounded px-1 focus:bg-[#3B0D3B]/8 focus:ring-1 focus:ring-[#3B0D3B]/20 transition-all"
                            title="Click to edit stat detail"
                          >
                            {stat.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: Images + Application Form */}
                  <div className="p-6 flex flex-col gap-4 bg-[#FAF5EE]/40 border-l border-[#3B0D3B]/8">

                    {/* Desktop Image */}
                    <div className="relative group rounded-2xl overflow-hidden border border-[#3B0D3B]/10 bg-white aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={homeContent.hero.desktopImage || "/images/maiiin.webp"}
                        alt="Desktop Hero"
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-[#3B0D3B]/0 group-hover:bg-[#3B0D3B]/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => desktopHeroFileInputRef.current?.click()}
                          disabled={isUploadingDesktopHero}
                          className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 text-xs font-bold text-[#3B0D3B] shadow-lg cursor-pointer hover:bg-[#FAF5EE] transition-all"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isUploadingDesktopHero ? "Uploading..." : "Replace Desktop Image"}
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 text-[9px] font-bold text-[#3B0D3B]/50 bg-white/80 rounded px-1.5 py-0.5">DESKTOP</span>
                    </div>

                    {/* Mobile Image */}
                    <div className="relative group rounded-2xl overflow-hidden border border-[#3B0D3B]/10 bg-white aspect-[16/7]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={homeContent.hero.mobileImage || "/images/mainnnn-bg.webp"}
                        alt="Mobile Hero"
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-[#3B0D3B]/0 group-hover:bg-[#3B0D3B]/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => mobileHeroFileInputRef.current?.click()}
                          disabled={isUploadingMobileHero}
                          className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 text-xs font-bold text-[#3B0D3B] shadow-lg cursor-pointer hover:bg-[#FAF5EE] transition-all"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isUploadingMobileHero ? "Uploading..." : "Replace Mobile Image"}
                        </button>
                      </div>
                      <span className="absolute top-2 left-2 text-[9px] font-bold text-[#3B0D3B]/50 bg-white/80 rounded px-1.5 py-0.5">MOBILE</span>
                    </div>

                    {/* Application Form Preview */}
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setFormSettings({ ...formSettings, heroFormTitle: e.currentTarget.textContent || "" })}
                          className="text-sm font-black text-slate-900 outline-none cursor-text hover:bg-slate-100 rounded px-1 transition-all"
                          title="Click to edit form title"
                        >
                          {formSettings.heroFormTitle || "Fast Track Application"}
                        </p>
                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setFormSettings({ ...formSettings, heroFormSubtitle: e.currentTarget.textContent || "" })}
                          className="mt-0.5 text-xs text-slate-500 outline-none cursor-text hover:bg-slate-100 rounded px-1 transition-all"
                          title="Click to edit form subtitle"
                        >
                          {formSettings.heroFormSubtitle || "Live cohort starts soon · Limited seats"}
                        </p>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        <div className="h-8 rounded-lg bg-slate-100 text-[10px] text-slate-400 flex items-center px-3">Full name</div>
                        <div className="h-8 rounded-lg bg-slate-100 text-[10px] text-slate-400 flex items-center px-3">Email address</div>
                        <div className="h-8 rounded-lg bg-slate-100 text-[10px] text-slate-400 flex items-center px-3">WhatsApp number</div>
                        <div className="rounded-xl bg-[#3B0D3B] px-4 py-2 text-center text-xs font-bold text-white cursor-text">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => setFormSettings({ ...formSettings, heroFormButtonText: e.currentTarget.textContent || "" })}
                            className="outline-none"
                            title="Click to edit button text"
                          >
                            {formSettings.heroFormButtonText || "Apply for Batch 2"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input ref={desktopHeroFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDesktopHeroImageUpload(f); e.target.value = ""; }} />
              <input ref={mobileHeroFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMobileHeroImageUpload(f); e.target.value = ""; }} />
            </div>
          )}
          {/* ========================================================= */}
          {/* TAB 5: FAQ MANAGER                                        */}
          {/* ========================================================= */}
          {activeTab === "faqs" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Frequently Asked Questions</h2>
                  <p className="text-xs sm:text-sm text-[#5A4A5A]">
                    Manage the accordion questions displayed in the FAQ section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-3">
                {(homeContent.faqs || []).map((faq, idx) => (
                  <div key={idx} className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-5 sm:p-6 flex items-start justify-between gap-4 shadow-sm">
                    <div className="space-y-1.5 flex-1">
                      <span className="rounded-md bg-[#FAF5EE] border border-[#3B0D3B]/15 px-2 py-0.5 text-[10px] font-bold text-[#3B0D3B]">
                        {faq.category || "General"}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#0B0B0F]">{faq.question}</h3>
                      <p className="text-xs sm:text-sm text-[#5A4A5A] leading-relaxed">{faq.answer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="p-2 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
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
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Blog &amp; Field Notes Studio</h2>
                  <p className="text-xs sm:text-sm text-[#5A4A5A]">
                    Write and publish real growth case studies with cover photos and custom tags.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNewBlogModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Write New Article</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((blog) => (
                  <div
                    key={blog.slug}
                    className="rounded-3xl border border-[#3B0D3B]/10 bg-white overflow-hidden flex flex-col justify-between hover:border-[#3B0D3B]/30 hover:shadow-xl transition-all shadow-sm"
                  >
                    <div className="relative aspect-[16/9] w-full bg-[#FAF5EE]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#3B0D3B] shadow-sm">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] text-[#5A4A5A]">
                          {blog.publishedAt} Ã‚Â· {blog.readTime}
                        </div>
                        <h3 className="mt-1 font-bold text-base text-[#0B0B0F] line-clamp-2">{blog.title}</h3>
                        <p className="mt-2 text-xs text-[#5A4A5A] line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                      </div>

                      <div className="pt-3 border-t border-[#3B0D3B]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditBlogModal(blog)}
                            className="rounded-lg border border-[#3B0D3B]/20 bg-white px-3 py-1 text-xs font-semibold text-[#0B0B0F] hover:bg-[#FAF5EE] cursor-pointer transition-colors"
                          >
                            Edit
                          </button>
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="rounded-lg bg-[#3B0D3B] px-3 py-1 text-xs font-bold text-white hover:bg-[#2A082A] transition-colors"
                          >
                            View
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="text-[#5A4A5A] hover:text-red-600 p-1 cursor-pointer transition-colors"
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
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Courses &amp; Curriculum Tracks</h2>
                    <p className="text-xs sm:text-sm text-[#5A4A5A]">
                      Manage curriculum tracks, toggle lock/open enrollment status, edit pricing, or open in Course Studio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewCourseStudio}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Course</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#3B0D3B]/10 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C6A8C]" />
                    <input
                      type="text"
                      placeholder="Search courses by title, description, or batch..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 pl-10 pr-4 py-2 text-xs text-[#0B0B0F] placeholder:text-[#8C6A8C] focus:bg-white focus:border-[#3B0D3B] focus:outline-none transition-all"
                    />
                    {courseSearch && (
                      <button
                        type="button"
                        onClick={() => setCourseSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6A8C] hover:text-[#0B0B0F]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-[#FAF5EE] p-1 rounded-xl border border-[#3B0D3B]/10">
                    <button
                      type="button"
                      onClick={() => setCourseFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "all" ? "bg-[#3B0D3B] text-white shadow-sm" : "text-[#5A4A5A] hover:text-[#0B0B0F]"
                        }`}
                    >
                      All ({courses.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseFilter("open")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "open" ? "bg-[#3B0D3B] text-white shadow-sm" : "text-[#5A4A5A] hover:text-[#0B0B0F]"
                        }`}
                    >
                      Open ({courses.filter((c) => !c.isLocked).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseFilter("locked")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${courseFilter === "locked" ? "bg-[#3B0D3B] text-white shadow-sm" : "text-[#5A4A5A] hover:text-[#0B0B0F]"
                        }`}
                    >
                      Coming Soon ({courses.filter((c) => c.isLocked).length})
                    </button>
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <EmptyState
                    title="No courses match your criteria"
                    description={
                      courseSearch || courseFilter !== "all"
                        ? "Try clearing your search query or status filter."
                        : "Click 'Add New Course' above to create your first track."
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 justify-between ${course.isLocked
                          ? "border-[#3B0D3B]/10 bg-white"
                          : "border-[#3B0D3B]/15"
                          }`}
                      >
                        {/* Card Image Header */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={course.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"}
                            alt={course.title}
                            className={`h-full w-full object-cover transition-transform duration-500 ${course.isLocked
                              ? "opacity-75"
                              : "opacity-90 group-hover:opacity-100 group-hover:scale-105"
                              }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                          {/* Coming Soon Overlay if locked */}
                          {course.isLocked && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="flex items-center gap-1.5 rounded-full bg-[#3B0D3B]/90 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
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
                                ? "bg-slate-900/80 text-white border border-white/20 hover:bg-slate-900"
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
                              className="h-7 px-2.5 rounded-lg bg-black/75 hover:bg-[#3B0D3B] text-white border border-white/15 backdrop-blur-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer"
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

                        {/* Card Body Content */}
                        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                          <div>
                            {/* Badge + Meta row */}
                            <div className="flex items-center gap-2.5">
                              {course.isLocked ? (
                                <StatusBadge status="neutral" label="COMING SOON" />
                              ) : (
                                <StatusBadge status="active" label={course.badge || "OPEN"} />
                              )}
                              <span className="text-xs font-semibold text-[#5A4A5A]">
                                {course.duration || course.meta || "4 months Ã‚Â· Online"}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-[#0B0B0F] group-hover:text-[#3B0D3B] transition-colors line-clamp-1">
                              {course.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5A4A5A] line-clamp-2">
                              {course.description || "Comprehensive hands-on digital growth program with real brands."}
                            </p>

                            {/* Batch & Pricing Chips */}
                            <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-[#3B0D3B]/10 text-[11px]">
                              <div className="rounded-2xl bg-[#FAF5EE]/60 p-2.5 border border-[#3B0D3B]/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A8C] block">
                                  Batch
                                </span>
                                <span className="font-bold text-[#0B0B0F] truncate block mt-0.5">
                                  {course.batch || "Batch 2 Ã‚Â· Sep 2026"}
                                </span>
                              </div>
                              <div className="rounded-2xl bg-[#FAF5EE]/60 p-2.5 border border-[#3B0D3B]/10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A8C] block">
                                  Fee &amp; EMI
                                </span>
                                <span className="font-bold text-[#3B0D3B] truncate block mt-0.5">
                                  {course.feeTotal || "Ã¢â€šÂ¹55,000"} {course.feeEmi ? `(${course.feeEmi})` : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer: Action Buttons */}
                          <div className="mt-5 flex items-center justify-between border-t border-[#3B0D3B]/10 pt-4">
                            <button
                              type="button"
                              onClick={() => handleToggleCourseLock(course.id)}
                              className={`text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${course.isLocked
                                ? "text-emerald-600 hover:text-emerald-700"
                                : "text-amber-600 hover:text-amber-700"
                                }`}
                            >
                              {course.isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                              <span>{course.isLocked ? "Unlock Track" : "Lock Track"}</span>
                            </button>

                            <div className="flex items-center gap-3">
                              <Link
                                href={course.href || `/categories/${course.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#5A4A5A] hover:text-[#3B0D3B] transition-colors inline-flex items-center gap-1"
                                title="Preview live course page"
                              >
                                <span>View Page</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => openCourseStudio(course)}
                                className="text-xs sm:text-sm font-bold text-[#3B0D3B] hover:text-[#2A082A] transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Studio Ã¢â€ â€™</span>
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
                      className="rounded-3xl border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B] bg-[#FAF5EE]/40 hover:bg-[#FAF5EE] min-h-[380px] flex flex-col items-center justify-center p-6 text-center group transition-all cursor-pointer"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/15 flex items-center justify-center text-[#3B0D3B] group-hover:scale-110 group-hover:bg-[#3B0D3B] group-hover:text-white transition-all">
                        <Plus className="h-7 w-7" />
                      </div>
                      <span className="mt-4 text-base font-bold text-[#0B0B0F] group-hover:text-[#3B0D3B]">
                        Add New Course
                      </span>
                      <span className="text-xs text-[#5A4A5A] mt-1 max-w-[200px]">
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
            <div className="space-y-8">
              {/* Mentors Section Header & Configuration */}
              <div className="rounded-2xl border border-[#3B0D3B]/15 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3B0D3B]/10 pb-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0B0B0F] flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#3B0D3B]" />
                      <span>Mentors Section Header &amp; Guarantee</span>
                    </h3>
                    <p className="text-xs text-[#5A4A5A] mt-0.5">
                      Configure the headline, narrative, highlight badges, and guarantee banner of the mentorship section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveMentorsSection}
                    disabled={isSavingMentorsSection}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-sm cursor-pointer transition-all disabled:opacity-50 self-start sm:self-auto"
                  >
                    {isSavingMentorsSection ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>{isSavingMentorsSection ? "Saving..." : "Save Section Settings"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Section Eyebrow</label>
                    <input
                      type="text"
                      value={homeContent.mentors?.eyebrow || ""}
                      onChange={(e) =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            eyebrow: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. PRACTITIONER MENTORSHIP"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Section Main Title</label>
                    <input
                      type="text"
                      value={homeContent.mentors?.title || ""}
                      onChange={(e) =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            title: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Taught by people still doing the work."
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#0B0B0F]">Section Description</label>
                    <textarea
                      rows={2}
                      value={homeContent.mentors?.description || ""}
                      onChange={(e) =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            description: e.target.value,
                          },
                        }))
                      }
                      placeholder="Every tutor runs active accounts and active brands..."
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Highlight Chips */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#0B0B0F]">
                        Key Highlights Badges (Shown below title)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentChips = homeContent.mentors?.highlightChips || [
                            "100% Active Account Operators",
                            "1:1 Real Budget Defenses",
                            "Verified Career Outcomes",
                          ];
                          setHomeContent((prev) => ({
                            ...prev,
                            mentors: {
                              ...(prev.mentors || {}),
                              highlightChips: [...currentChips, "New Highlight Badge"],
                            },
                          }));
                        }}
                        className="text-[11px] font-bold text-[#3B0D3B] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Badge
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(homeContent.mentors?.highlightChips || [
                        "100% Active Account Operators",
                        "1:1 Real Budget Defenses",
                        "Verified Career Outcomes",
                      ]).map((chip, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={chip}
                            onChange={(e) => {
                              const newChips = [...(homeContent.mentors?.highlightChips || [
                                "100% Active Account Operators",
                                "1:1 Real Budget Defenses",
                                "Verified Career Outcomes",
                              ])];
                              newChips[idx] = e.target.value;
                              setHomeContent((prev) => ({
                                ...prev,
                                mentors: {
                                  ...(prev.mentors || {}),
                                  highlightChips: newChips,
                                },
                              }));
                            }}
                            className="flex-1 rounded-xl border border-[#3B0D3B]/15 bg-white px-3 py-1.5 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                          />
                          {(homeContent.mentors?.highlightChips?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newChips = (homeContent.mentors?.highlightChips || []).filter(
                                  (_, i) => i !== idx
                                );
                                setHomeContent((prev) => ({
                                  ...prev,
                                  mentors: {
                                    ...(prev.mentors || {}),
                                    highlightChips: newChips,
                                  },
                                }));
                              }}
                              className="p-1.5 text-[#5A4A5A] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Badge"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Guarantee Banner */}
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Bottom Guarantee Prefix</label>
                    <input
                      type="text"
                      value={homeContent.mentors?.guaranteeHighlight || ""}
                      onChange={(e) =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            guaranteeHighlight: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Zero Academic Theory:"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Bottom Guarantee Narrative</label>
                    <input
                      type="text"
                      value={homeContent.mentors?.guaranteeText || ""}
                      onChange={(e) =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            guaranteeText: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Every mentor actively manages enterprise budgets..."
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Section-wide Coming Soon toggle */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/70">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shadow-2xs", homeContent.mentors?.isLocked ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                        {homeContent.mentors?.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0B0B0F]">
                          {homeContent.mentors?.isLocked ? "Section Locked (All blocks show Coming Soon)" : "Section Active (Profiles displayed)"}
                        </p>
                        <p className="text-[10px] text-[#5A4A5A]">
                          When locked, all mentor blocks on the live website automatically switch to &apos;Coming Soon&apos; mode.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setHomeContent((prev) => ({
                          ...prev,
                          mentors: {
                            ...(prev.mentors || {}),
                            isLocked: !prev.mentors?.isLocked,
                          },
                        }))
                      }
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto",
                        homeContent.mentors?.isLocked
                          ? "bg-amber-600 text-white hover:bg-amber-500"
                          : "bg-[#3B0D3B] text-white hover:bg-[#2A082A]"
                      )}
                    >
                      {homeContent.mentors?.isLocked ? "Unlock Section" : "Lock Entire Section"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Individual Mentor Profiles Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Mentors &amp; Faculty Profiles</h2>
                  <p className="text-xs sm:text-sm text-[#5A4A5A]">
                    Manage individual instructors, lock/unlock blocks, photos, credentials, and bio quotes.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => handleLockAllTutors(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-600/30 bg-amber-50 hover:bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 shadow-xs cursor-pointer transition-all"
                    title="Lock all mentor blocks to show Coming Soon"
                  >
                    <Lock className="h-3.5 w-3.5 text-amber-700" />
                    <span>Lock All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLockAllTutors(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 shadow-xs cursor-pointer transition-all"
                    title="Unlock all mentor blocks to reveal actual content"
                  >
                    <Unlock className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Unlock All</span>
                  </button>
                  <button
                    type="button"
                    onClick={openNewTutorModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Mentor</span>
                  </button>
                </div>
              </div>

              {tutors.length === 0 ? (
                <EmptyState
                  title="No mentors added yet"
                  description="Click 'Add Mentor' above to add mentors with photos, roles, and backgrounds."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                  {tutors.map((tutor, index) => (
                    <div
                      key={tutor.id}
                      className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#3B0D3B]/15 bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-[#3B0D3B]/40"
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

                      {/* Top-Left Action: Lock / Unlock Toggle Button (z-30 ensures it is always in front) */}
                      <div className="absolute top-2.5 left-2.5 z-30">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTutorLock(tutor.id);
                          }}
                          className={cn(
                            "h-7 px-2.5 rounded-xl border text-[11px] font-black flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 cursor-pointer backdrop-blur-md",
                            tutor.isLocked
                              ? "bg-amber-500 hover:bg-amber-400 text-black border-amber-300 ring-2 ring-amber-400/40"
                              : "bg-black/75 hover:bg-[#3B0D3B] text-white border-white/20"
                          )}
                          title={tutor.isLocked ? "Click to unlock and reveal actual mentor profile" : "Click to lock and display Coming Soon"}
                        >
                          {tutor.isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                          <span>{tutor.isLocked ? "Unlock" : "Live"}</span>
                        </button>
                      </div>

                      {/* Top-Right Actions: Edit & Delete (z-30) */}
                      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditTutorModal(tutor);
                          }}
                          className="h-7 px-2 rounded-lg bg-black/75 hover:bg-[#3B0D3B] text-white border border-white/20 backdrop-blur-md text-[11px] font-bold flex items-center gap-1 transition-all shadow-md hover:scale-105 cursor-pointer"
                          title="Edit Mentor"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTutor(tutor.id);
                          }}
                          className="h-7 w-7 rounded-lg bg-black/75 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
                          title="Delete Mentor"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Center Coming Soon Indicator if locked (pointer-events-none so it doesn't block clicks) */}
                      {tutor.isLocked && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-15 flex flex-col items-center justify-center pointer-events-none p-3 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 border border-amber-400/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-xl backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {/* Click whole card to edit (z-10 beneath action buttons) */}
                      <div
                        onClick={() => openEditTutorModal(tutor)}
                        className="absolute inset-0 z-10 cursor-pointer"
                      />

                      {/* Bottom Gradient Overlay: Name & Role & Credential */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3.5 pt-12 z-20 pointer-events-none">
                        <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                          {tutor.name}
                        </p>
                        <p className="text-[11px] text-white/75 mt-0.5 truncate">
                          {tutor.role}
                        </p>
                        {tutor.brandMetric && (
                          <p className="text-[10px] font-bold text-[#F5EDE0] mt-1 truncate">
                            {tutor.brandMetric}
                          </p>
                        )}
                        {tutor.isLocked && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTutorLock(tutor.id);
                            }}
                            className="mt-1.5 text-[10px] font-black text-amber-300 hover:text-white flex items-center gap-1 pointer-events-auto cursor-pointer underline underline-offset-2"
                          >
                            <Unlock className="h-3 w-3" />
                            <span>Click to Unlock Profile</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Direct Add New Mentor Block in Grid */}
                  <button
                    type="button"
                    onClick={openNewTutorModal}
                    className="aspect-[3/4] rounded-3xl border-2 border-dashed border-[#3B0D3B]/20 hover:border-[#3B0D3B] bg-[#FAF5EE]/40 hover:bg-[#FAF5EE] flex flex-col items-center justify-center p-4 text-center group transition-all cursor-pointer"
                  >
                    <div className="h-11 w-11 rounded-2xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/15 flex items-center justify-center text-[#3B0D3B] group-hover:scale-110 group-hover:bg-[#3B0D3B] group-hover:text-white transition-all">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="mt-3 text-xs sm:text-sm font-bold text-[#0B0B0F] group-hover:text-[#3B0D3B]">Add Mentor</span>
                    <span className="text-[10px] text-[#5A4A5A] mt-0.5">Upload photo &amp; bio</span>
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
                <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">
                  Real-Time Student Lead Email Alerts
                </h2>
                <p className="text-xs sm:text-sm text-[#5A4A5A]">
                  Whenever a student fills out the application form on the website, automatically send an instant alert with their details.
                </p>
              </div>

              {/* Alert Status Card */}
              <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/15 flex items-center justify-center shrink-0 text-[#3B0D3B]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B0B0F]">
                      Email Alert Dispatch: {alertSettings.emailAlertsEnabled ? "Active" : "Paused"}
                    </h3>
                    <p className="text-xs text-[#5A4A5A]">
                      {alertSettings.emailAlertsEnabled ? "Ã¢Å“â€œ Instant Student Lead Alerts Active" : "Ã¢Å“â€” Email Alerts Paused"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestAlert}
                  disabled={isTestingAlert}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#3B0D3B]/20 bg-[#FAF5EE] hover:bg-[#FAF5EE]/80 px-4 py-2 text-xs font-bold text-[#3B0D3B] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isTestingAlert ? "Dispatching..." : "Send Test Email Alert"}</span>
                </button>
              </div>

              {testAlertResult && (
                <div
                  className={`rounded-2xl border p-4 text-xs ${testAlertResult.startsWith("Error:")
                    ? "border-rose-300 bg-rose-50 text-rose-800"
                    : "border-emerald-300 bg-emerald-50 text-emerald-800"
                    }`}
                >
                  <div className="font-semibold">{testAlertResult}</div>
                  {testAlertResult.includes("Resend Sandbox Restriction") && (
                    <div className="mt-2.5 text-[11px] text-rose-700 leading-relaxed border-t border-rose-200 pt-2">
                      Ã°Å¸â€™Â¡ <strong>Why this happens:</strong> Resend&apos;s free development sandbox (<code>onboarding@resend.dev</code>) only delivers to the Resend account owner&apos;s email (<code>plmanojvarma@gmail.com</code>).
                      <br />
                      <strong>To send to other emails:</strong> You can either test with <code>plmanojvarma@gmail.com</code>, or add and verify your custom domain (e.g. <code>treqo.org</code>) at{" "}
                      <a
                        href="https://resend.com/domains"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold text-[#3B0D3B]"
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
                <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-[#3B0D3B]" />
                      <h3 className="text-sm font-bold text-[#0B0B0F]">Email Addresses for Notifications</h3>
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
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B0D3B]" />
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">
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
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#5A4A5A] mt-1">
                      When a student submits any application or syllabus form, their full details will be emailed to these inboxes immediately.
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1.5 bg-amber-50 border border-amber-200 p-2.5 rounded-xl leading-relaxed">
                      Ã¢Å¡Â Ã¯Â¸Â <strong>Resend Free Sandbox Note:</strong> While using <code>onboarding@resend.dev</code>, Resend only allows delivery to the account owner (<code>plmanojvarma@gmail.com</code>). To receive leads on other emails, verify your domain at Resend.com.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#3B0D3B]/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-[#5A4A5A]">Resend.com Email Delivery Service</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      Connected &amp; Active
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingAlerts}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer transition-all disabled:opacity-50"
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
                <h2 className="text-xl sm:text-2xl font-black text-[#0B0B0F] tracking-tight">Form Titles &amp; Popup Modals</h2>
                <p className="text-xs sm:text-sm text-[#5A4A5A]">
                  Customize headlines, subtitles, and button text across your application forms, curriculum download popups, and success screens.
                </p>
              </div>

              <form onSubmit={handleSaveForms} className="space-y-6">
                {/* 1. HERO APPLICATION FORM */}
                <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3B0D3B]" />
                      <h3 className="text-sm font-bold text-[#0B0B0F]">Homepage Hero Application Form</h3>
                    </div>
                    <span className="text-[10px] text-[#3B0D3B] bg-[#FAF5EE] border border-[#3B0D3B]/15 px-2 py-0.5 rounded font-bold uppercase">
                      Homepage
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Form Header Title</label>
                      <input
                        type="text"
                        value={formSettings.heroFormTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormTitle: e.target.value })}
                        placeholder="e.g. Fast Track Application"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Submit Button Label</label>
                      <input
                        type="text"
                        value={formSettings.heroFormButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormButtonText: e.target.value })}
                        placeholder="e.g. Apply for Batch 2"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Form Subtitle / Note</label>
                    <input
                      type="text"
                      value={formSettings.heroFormSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, heroFormSubtitle: e.target.value })}
                      placeholder="e.g. Live cohort starts soon Ã‚Â· Limited seats"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#3B0D3B]/10">
                    <div>
                      <label className="text-xs font-bold text-[#5A4A5A]">Success Screen Headline</label>
                      <input
                        type="text"
                        value={formSettings.heroFormSuccessTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormSuccessTitle: e.target.value })}
                        placeholder="Submitted"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#5A4A5A]">Success Screen Description</label>
                      <input
                        type="text"
                        value={formSettings.heroFormSuccessMessage || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, heroFormSuccessMessage: e.target.value })}
                        placeholder="Thank you! Your details have been received successfully."
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. APPLICATION POPUP MODAL */}
                <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3B0D3B]" />
                      <h3 className="text-sm font-bold text-[#0B0B0F]">Application Popup Modal (&quot;Apply Now&quot; across site)</h3>
                    </div>
                    <span className="text-[10px] text-[#3B0D3B] bg-[#FAF5EE] border border-[#3B0D3B]/15 px-2 py-0.5 rounded font-bold uppercase">
                      Site-wide Modal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Modal Header Title</label>
                      <input
                        type="text"
                        value={formSettings.applyModalTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalTitle: e.target.value })}
                        placeholder="e.g. Apply for Batch 2"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Submit Button Text</label>
                      <input
                        type="text"
                        value={formSettings.applyModalButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalButtonText: e.target.value })}
                        placeholder="e.g. Submit Application"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Modal Subtitle / Value Proposition</label>
                    <input
                      type="text"
                      value={formSettings.applyModalSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, applyModalSubtitle: e.target.value })}
                      placeholder="e.g. Leave with work you can show in an interview, not a certificate."
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#3B0D3B]/10">
                    <div>
                      <label className="text-xs font-bold text-[#5A4A5A]">Modal Success Headline</label>
                      <input
                        type="text"
                        value={formSettings.applyModalSuccessTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalSuccessTitle: e.target.value })}
                        placeholder="Submitted"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#5A4A5A]">Modal Success Description</label>
                      <input
                        type="text"
                        value={formSettings.applyModalSuccessMessage || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, applyModalSuccessMessage: e.target.value })}
                        placeholder="Thank you! Your details have been received successfully."
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-[#FAF5EE]/40 px-3.5 py-2 text-xs text-[#0B0B0F] focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CURRICULUM DOWNLOAD MODAL */}
                <div className="rounded-3xl border border-[#3B0D3B]/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h3 className="text-sm font-bold text-[#0B0B0F]">Curriculum &amp; Syllabus Download Modal</h3>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                      Brochure Modal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Modal Header Title</label>
                      <input
                        type="text"
                        value={formSettings.curriculumModalTitle || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, curriculumModalTitle: e.target.value })}
                        placeholder="e.g. Download Curriculum"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0B0B0F]">Submit Button Text</label>
                      <input
                        type="text"
                        value={formSettings.curriculumModalButtonText || ""}
                        onChange={(e) => setFormSettings({ ...formSettings, curriculumModalButtonText: e.target.value })}
                        placeholder="e.g. Download Syllabus Now"
                        className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Modal Subtitle / Note</label>
                    <input
                      type="text"
                      value={formSettings.curriculumModalSubtitle || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, curriculumModalSubtitle: e.target.value })}
                      placeholder="e.g. Get the full week-by-week phase roadmap, deliverables & toolstack."
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-slate-400 focus:border-[#3B0D3B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingForms}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer transition-all disabled:opacity-50"
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
          {/* TAB: PROGRAM CERTIFICATIONS (TREQO & INDUSTRY)            */}
          {/* ========================================================= */}
          {activeTab === "certifications" && (
            <AdminCertificationsTab
              initialData={homeContent.certifications}
              adminPin={getStoredPin()}
              onSaved={(updated) => setHomeContent((prev) => ({ ...prev, certifications: updated }))}
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
          {/* TAB: PAGE-WISE SEO & KEYWORD MANAGER                      */}
          {/* ========================================================= */}
          {activeTab === "pageKeywords" && (
            <AdminPageKeywordsTab
              initialPages={pageSeo}
              adminPin={getStoredPin()}
              onSwitchToDescriptions={() => setActiveTab("pageDescriptions")}
              onSaved={(updated) => {
                setPageSeo(updated);
                notifySuccess("All page-wise keywords and SEO settings saved successfully!");
              }}
            />
          )}

          {/* ========================================================= */}
          {/* TAB: PAGE-WISE META DESCRIPTION MANAGER                   */}
          {/* ========================================================= */}
          {activeTab === "pageDescriptions" && (
            <AdminPageDescriptionsTab
              initialPages={pageSeo}
              adminPin={getStoredPin()}
              onSwitchToKeywords={() => setActiveTab("pageKeywords")}
              onSaved={(updated) => {
                setPageSeo(updated);
                notifySuccess("All page-wise meta descriptions saved successfully!");
              }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-[#0B0B0F]">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-4">
              <h3 className="text-lg font-bold text-[#0B0B0F]">
                {editingBlog ? "Edit Blog Post" : "Write New Article"}
              </h3>
              <button
                type="button"
                onClick={() => setIsBlogModalOpen(false)}
                className="text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-lg p-1.5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Why Running Real Ad Budgets Beats 100 Theoretical Case Studies"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, category: e.target.value as BlogPost["category"] })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  >
                    <option value="Performance Marketing">Performance Marketing</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Career Strategy">Career Strategy</option>
                    <option value="Founders">Founders</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Cover Image Upload (Direct File Manager & Drag & Drop & Media Library) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0B0B0F] flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-[#3B0D3B]" />
                    Cover Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMediaPickerOpen(true);
                        fetchMediaFiles();
                      }}
                      className="text-[11px] text-[#5A4A5A] hover:text-[#3B0D3B] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <FolderOpen className="h-3 w-3 text-[#3B0D3B]" />
                      Browse Media
                    </button>
                    <span className="text-[#3B0D3B]/20 text-xs">Ã‚Â·</span>
                    <button
                      type="button"
                      onClick={() => setShowManualBlogUrl(!showManualBlogUrl)}
                      className="text-[11px] text-[#3B0D3B] hover:underline font-medium transition-colors cursor-pointer"
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
                        ? "border-[#3B0D3B] bg-[#3B0D3B]/5 scale-[1.01] shadow-md shadow-[#3B0D3B]/10"
                        : "border-[#3B0D3B]/20 bg-[#FAF5EE]/70 hover:border-[#3B0D3B]/40 hover:bg-[#FAF5EE]"
                        }`}
                    >
                      {isUploadingBlogImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#3B0D3B] animate-spin" />
                          <p className="text-xs font-bold text-[#0B0B0F]">Uploading cover image...</p>
                          <p className="text-[10px] text-[#5A4A5A]">Saving file to media library</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center py-1">
                          <div className="h-9 w-9 rounded-xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 flex items-center justify-center text-[#3B0D3B]">
                            <Upload className="h-4 w-4" />
                          </div>
                          <p className="text-xs font-bold text-[#0B0B0F]">
                            <span className="text-[#3B0D3B] underline underline-offset-2">Click to browse file</span> or drag to upload
                          </p>
                          <p className="text-[10px] text-[#5A4A5A]">PNG, JPG, WEBP, or SVG up to 8MB</p>
                        </div>
                      )}
                    </div>

                    {blogForm.coverImage && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#3B0D3B]/15 shadow-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={blogForm.coverImage}
                            alt="Cover Preview"
                            className="h-12 w-20 rounded-lg object-cover border border-[#3B0D3B]/15 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80";
                            }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#0B0B0F] block truncate">
                              {blogForm.coverImage.startsWith("/uploads/")
                                ? blogForm.coverImage.split("/").pop()
                                : blogForm.coverImage}
                            </span>
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                              <Check className="h-3 w-3 shrink-0" /> Cover image attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => blogFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#0B0B0F] hover:bg-[#FAF5EE] bg-white rounded-lg border border-[#3B0D3B]/15 cursor-pointer transition-colors"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm((prev) => ({ ...prev, coverImage: "" }))}
                            className="p-1.5 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
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
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                    {blogForm.coverImage && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#3B0D3B]/15 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blogForm.coverImage}
                          alt="Cover Preview"
                          className="h-10 w-16 rounded object-cover border border-[#3B0D3B]/15 shrink-0"
                        />
                        <span className="text-xs text-[#5A4A5A] truncate">{blogForm.coverImage}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Short Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="A 2-sentence summary of key insights..."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  placeholder="Meta Ads, CAC, Unit Economics"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Article Body (Paragraphs)</label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.body}
                  onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                  placeholder="Write your article paragraphs here. Separate paragraphs with an empty line..."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none font-mono text-xs leading-relaxed transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#3B0D3B]/10">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2 text-xs font-bold text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#0B0B0F] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 sm:p-8 shadow-2xl space-y-5 text-[#0B0B0F]">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-4">
              <h3 className="text-lg font-bold text-[#0B0B0F]">Add New FAQ Question</h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-lg p-1.5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Category</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  placeholder="e.g. General, Curriculum, Placements"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. What is the batch size?"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide the direct, honest answer..."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-sm text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#3B0D3B]/10">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2 text-xs font-bold text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#0B0B0F] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-[#0B0B0F]">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B0B0F]">
                  {editingCourse ? "Edit Course Track" : "Add New Course Track"}
                </h3>
                <p className="text-xs text-[#5A4A5A] mt-0.5">
                  Set program duration, curriculum details, and lock status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-lg p-1.5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Cover Image Upload (Direct File Manager & Drag & Drop) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0B0B0F]">Course Cover Image</label>
                  <button
                    type="button"
                    onClick={() => setShowManualCourseUrl(!showManualCourseUrl)}
                    className="text-[11px] text-[#3B0D3B] hover:underline font-medium transition-colors cursor-pointer"
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
                        ? "border-[#3B0D3B] bg-[#3B0D3B]/5 scale-[1.01] shadow-md shadow-[#3B0D3B]/10"
                        : "border-[#3B0D3B]/20 bg-[#FAF5EE]/70 hover:border-[#3B0D3B]/40 hover:bg-[#FAF5EE]"
                        }`}
                    >
                      {isUploadingCourseImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#3B0D3B] animate-spin" />
                          <p className="text-xs font-bold text-[#0B0B0F]">Uploading cover image...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <Upload className="h-5 w-5 text-[#3B0D3B]" />
                          <p className="text-xs font-bold text-[#0B0B0F]">
                            <span className="text-[#3B0D3B] underline">Click to upload cover photo</span> or drag &amp; drop
                          </p>
                          <p className="text-[10px] text-[#5A4A5A]">PNG, JPG, WEBP up to 8MB</p>
                        </div>
                      )}
                    </div>

                    {courseForm.image && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#3B0D3B]/15 shadow-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={courseForm.image}
                            alt="Preview"
                            className="h-12 w-20 rounded-lg object-cover border border-[#3B0D3B]/15 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#0B0B0F] block truncate">
                              {courseForm.title || "Cover Photo"}
                            </span>
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                              <Check className="h-3 w-3 shrink-0" /> Photo attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => courseFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#0B0B0F] hover:bg-[#FAF5EE] bg-white rounded-lg border border-[#3B0D3B]/15 cursor-pointer transition-colors"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseForm({ ...courseForm, image: "" })}
                            className="p-1.5 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
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
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Performance Marketing &amp; Growth Architecture"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Image Preview Tag</label>
                  <input
                    type="text"
                    value={courseForm.previewLabel || ""}
                    onChange={(e) => setCourseForm({ ...courseForm, previewLabel: e.target.value })}
                    placeholder="e.g. CLASSROOM Ã‚Â· CEO CHALLENGE REVIEW"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Badge Text</label>
                  <input
                    type="text"
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                    placeholder="e.g. BATCH 2 Ã‚Â· OPEN"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Duration &amp; Format</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 4 months Ã‚Â· Online"
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Course URL / Slug</label>
                <input
                  type="text"
                  value={courseForm.href}
                  onChange={(e) => setCourseForm({ ...courseForm, href: e.target.value })}
                  placeholder="/courses/digital-marketing"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Course Summary Description</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Real ad budgets, CRO, creative testing, analytics, client sprints..."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              {/* Course Page Specific Data */}
              <div className="pt-2 border-t border-[#3B0D3B]/10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#3B0D3B]">Course Page Data &amp; Pricing</span>
                  <div className="h-px bg-[#3B0D3B]/15 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Batch / Cohort Label</label>
                    <input
                      type="text"
                      value={courseForm.batch || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, batch: e.target.value })}
                      placeholder="e.g. Batch 2 Ã‚Â· Sep 2026"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Curriculum PDF URL</label>
                    <input
                      type="text"
                      value={courseForm.curriculumPdf || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, curriculumPdf: e.target.value })}
                      placeholder="e.g. /treqo-curriculum.pdf"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Total Course Fee</label>
                    <input
                      type="text"
                      value={courseForm.feeTotal || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, feeTotal: e.target.value })}
                      placeholder="e.g. Ã¢â€šÂ¹55,000"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Monthly EMI Plan</label>
                    <input
                      type="text"
                      value={courseForm.feeEmi || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, feeEmi: e.target.value })}
                      placeholder="e.g. Ã¢â€šÂ¹4,583 / month"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Apply Button Label</label>
                    <input
                      type="text"
                      value={courseForm.applyCta || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, applyCta: e.target.value })}
                      placeholder="e.g. Apply for Batch 2"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B0B0F]">Syllabus Button Label</label>
                    <input
                      type="text"
                      value={courseForm.syllabusCta || ""}
                      onChange={(e) => setCourseForm({ ...courseForm, syllabusCta: e.target.value })}
                      placeholder="e.g. Download Curriculum"
                      className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">Course Page Overview Text</label>
                  <textarea
                    rows={2}
                    value={courseForm.overview || ""}
                    onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })}
                    placeholder="Extended overview text shown on the public course page..."
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B0B0F]">CEO Challenge Problem Statement / Prompt</label>
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
                    className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white p-3 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Status Toggles: Flagship & Lock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#3B0D3B]/15 bg-white cursor-pointer hover:bg-[#FAF5EE]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={courseForm.isLocked}
                    onChange={(e) => setCourseForm({ ...courseForm, isLocked: e.target.checked })}
                    className="h-4 w-4 rounded border-[#3B0D3B]/20 text-[#3B0D3B] accent-[#3B0D3B] focus:ring-[#3B0D3B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0B0B0F] block">Lock Course</span>
                    <span className="text-[10px] text-[#5A4A5A]">Shows &quot;Ã°Å¸â€â€™ Locked&quot; badge</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#3B0D3B]/15 bg-white cursor-pointer hover:bg-[#FAF5EE]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={courseForm.isFlagship}
                    onChange={(e) => setCourseForm({ ...courseForm, isFlagship: e.target.checked })}
                    className="h-4 w-4 rounded border-[#3B0D3B]/20 text-[#3B0D3B] accent-[#3B0D3B] focus:ring-[#3B0D3B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0B0B0F] block">Flagship Program</span>
                    <span className="text-[10px] text-[#5A4A5A]">Highlighted on public site</span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#3B0D3B]/10">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2 text-xs font-bold text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#0B0B0F] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 sm:p-8 shadow-2xl space-y-5 text-[#0B0B0F]">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-4">
              <h3 className="text-lg font-bold text-[#0B0B0F]">
                {editingTutor ? "Edit Mentor Profile" : "Add New Mentor"}
              </h3>
              <button
                type="button"
                onClick={() => setIsTutorModalOpen(false)}
                className="text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] rounded-lg p-1.5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTutor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Mentor Full Name</label>
                <input
                  type="text"
                  required
                  value={tutorForm.name}
                  onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                  placeholder="e.g. Manoj Varma"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Role / Specialization</label>
                <input
                  type="text"
                  required
                  value={tutorForm.role}
                  onChange={(e) => setTutorForm({ ...tutorForm, role: e.target.value })}
                  placeholder="e.g. Founder &amp; Growth Architect"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Students Mentored</label>
                <input
                  type="text"
                  value={tutorForm.mentored}
                  onChange={(e) => setTutorForm({ ...tutorForm, mentored: e.target.value })}
                  placeholder="e.g. 500+ or 1,200+"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Credential / Metric Highlight</label>
                <input
                  type="text"
                  value={tutorForm.brandMetric || ""}
                  onChange={(e) => setTutorForm({ ...tutorForm, brandMetric: e.target.value })}
                  placeholder="e.g. Ã¢â€šÂ¹10Cr+ Ad Spend Managed, Ex-Amex Lead, or 3.8x Avg ROAS"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
                <p className="text-[10px] text-[#5A4A5A] mt-1">Displayed as the verified credential badge on the mentor card.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Domain Specialty / Area</label>
                <input
                  type="text"
                  value={tutorForm.specialty || ""}
                  onChange={(e) => setTutorForm({ ...tutorForm, specialty: e.target.value })}
                  placeholder="e.g. Funnel Economics &amp; Scaling, Paid Acquisition, Brand Strategy"
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                />
                <p className="text-[10px] text-[#5A4A5A] mt-1">Displayed at the bottom footer of the mentor card.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0B0B0F]">Practitioner Bio Quote / Execution Focus</label>
                <textarea
                  rows={2}
                  value={tutorForm.focus || ""}
                  onChange={(e) => setTutorForm({ ...tutorForm, focus: e.target.value })}
                  placeholder="e.g. Direct-response unit economics and turning raw campaign data into profitable spend."
                  className="mt-1.5 w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all resize-none"
                />
                <p className="text-[10px] text-[#5A4A5A] mt-1">Displayed as the practitioner quote on the mentor card.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0B0B0F]">Mentor Profile Photo</label>
                  <button
                    type="button"
                    onClick={() => setShowManualTutorUrl(!showManualTutorUrl)}
                    className="text-[11px] text-[#3B0D3B] hover:underline font-medium transition-colors cursor-pointer"
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
                        ? "border-[#3B0D3B] bg-[#3B0D3B]/5 scale-[1.01] shadow-md shadow-[#3B0D3B]/10"
                        : "border-[#3B0D3B]/20 bg-[#FAF5EE]/70 hover:border-[#3B0D3B]/40 hover:bg-[#FAF5EE]"
                        }`}
                    >
                      {isUploadingTutorImage ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <RefreshCw className="h-6 w-6 text-[#3B0D3B] animate-spin" />
                          <p className="text-xs font-bold text-[#0B0B0F]">Uploading photo...</p>
                          <p className="text-[11px] text-[#5A4A5A]">Saving file to media library</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="h-10 w-10 rounded-xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 flex items-center justify-center text-[#3B0D3B]">
                            <Upload className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0B0B0F]">
                              <span className="text-[#3B0D3B] underline underline-offset-2">Click to upload</span> or drag &amp; drop
                            </p>
                            <p className="text-[11px] text-[#5A4A5A] mt-0.5">PNG, JPG, WEBP, or SVG up to 8MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Preview Card if Photo Exists */}
                    {tutorForm.image && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#3B0D3B]/15 shadow-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tutorForm.image}
                            alt="Mentor preview"
                            className="h-12 w-12 rounded-xl object-cover border border-[#3B0D3B]/15 shadow-sm shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#0B0B0F] block truncate">
                              {tutorForm.name || "Mentor Photo"}
                            </span>
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold truncate">
                              <Check className="h-3 w-3 shrink-0" /> Photo attached
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => tutorFileInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#0B0B0F] hover:bg-[#FAF5EE] bg-white rounded-lg border border-[#3B0D3B]/15 transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setTutorForm({ ...tutorForm, image: "" })}
                            className="p-1.5 text-[#5A4A5A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                      className="w-full rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2.5 text-xs text-[#0B0B0F] placeholder:text-[#5A4A5A]/50 focus:border-[#3B0D3B] focus:ring-1 focus:ring-[#3B0D3B]/20 focus:outline-none transition-all"
                    />
                    {tutorForm.image && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-white rounded-xl border border-[#3B0D3B]/15 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tutorForm.image}
                          alt="Preview"
                          className="h-12 w-12 rounded-xl object-cover border border-[#3B0D3B]/15"
                        />
                        <span className="text-[11px] text-emerald-600 font-semibold">Image preview loaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mentor Lock / Unlock Status Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#3B0D3B]/15 bg-white cursor-pointer hover:bg-[#FAF5EE]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(tutorForm.isLocked)}
                    onChange={(e) => setTutorForm({ ...tutorForm, isLocked: e.target.checked })}
                    className="h-4 w-4 rounded border-[#3B0D3B]/20 text-[#3B0D3B] accent-[#3B0D3B] focus:ring-[#3B0D3B]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0B0B0F] block">
                      {tutorForm.isLocked ? "Ã°Å¸â€â€™ Lock Mentor (Coming Soon Mode)" : "Ã°Å¸â€â€œ Mentor Profile Active (Live)"}
                    </span>
                    <span className="text-[10px] text-[#5A4A5A]">
                      {tutorForm.isLocked
                        ? "Check to lock this mentor. Uncheck to unlock and reveal real photo & bio on website."
                        : "Active on website. Check this box if you want to temporarily hide real credentials."}
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#3B0D3B]/10">
                <button
                  type="button"
                  onClick={() => setIsTutorModalOpen(false)}
                  className="rounded-xl border border-[#3B0D3B]/15 bg-white px-4 py-2 text-xs font-bold text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#0B0B0F] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] px-5 py-2 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0B0F]/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#3B0D3B]/15 bg-[#FDFAF6] p-6 sm:p-7 shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-[#0B0B0F]">
            <div className="flex items-center justify-between border-b border-[#3B0D3B]/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#3B0D3B]/10 border border-[#3B0D3B]/20 flex items-center justify-center text-[#3B0D3B]">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B0B0F]">Media Library</h3>
                  <p className="text-xs text-[#5A4A5A]">Choose from previously uploaded images or upload a new file</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-[#5A4A5A]">
                {mediaFiles.length} {mediaFiles.length === 1 ? "file" : "files"} available
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMediaFiles}
                  disabled={isLoadingMedia}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3B0D3B]/15 bg-white text-xs text-[#5A4A5A] hover:text-[#0B0B0F] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  Upload from File Manager
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[380px] pr-1">
              {isLoadingMedia ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#5A4A5A] gap-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#3B0D3B]" />
                  <p className="text-xs">Loading media files...</p>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#3B0D3B]/20 rounded-2xl p-6 bg-white/50">
                  <FolderOpen className="h-10 w-10 text-[#5A4A5A]/50 mb-2" />
                  <p className="text-sm font-semibold text-[#0B0B0F]">No uploaded images yet</p>
                  <p className="text-xs text-[#5A4A5A] mt-1 max-w-sm">
                    Upload an image using your file manager or drag-and-drop to see it stored here.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMediaPickerOpen(false);
                      blogFileInputRef.current?.click();
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#3B0D3B] hover:bg-[#2A082A] text-xs font-bold text-white shadow-sm cursor-pointer transition-colors"
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
                        className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer bg-white hover:border-[#3B0D3B] shadow-sm ${isSelected ? "border-[#3B0D3B] ring-2 ring-[#3B0D3B]/30" : "border-[#3B0D3B]/10"
                          }`}
                      >
                        <div className="h-28 w-full bg-[#FAF5EE] overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#3B0D3B] text-white rounded-full p-1 shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-[#0B0B0F] truncate group-hover:text-[#3B0D3B]" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[10px] text-[#5A4A5A] mt-0.5">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#3B0D3B]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#3B0D3B]/15 bg-white text-xs font-bold text-[#5A4A5A] hover:bg-[#FAF5EE] hover:text-[#0B0B0F] cursor-pointer transition-colors"
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
