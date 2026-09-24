import {
  Megaphone,
  Code2,
  Palette,
  Briefcase,
  BarChart3,
  Bot,
  BookOpen,
  FileText,
  Wrench,
  LayoutTemplate,
  FolderKanban,
  Mic2,
} from "lucide-react";
import type { MegaMenuData, NavItem } from "@/types/navigation";

export const announcementBannerData = {
  badge: "BATCH 2 · 50 SEATS",
  text: "Enrollments close on 4th October 2026.",
  linkText: "Explore the courses",
  linkHref: "/#courses",
};

export const primaryNavItems: NavItem[] = [
  { key: "courses", label: "Courses", href: "/#courses" },
  { key: "method", label: "Method", href: "/#method" },
  { key: "placements", label: "Placements", href: "/#placements" },
  { key: "why-treqo", label: "Why Treqo", href: "/#why-treqo" },
  { key: "blog", label: "Blog", href: "/blog", isHighlighted: true, badge: "New" },
  { key: "faq", label: "FAQ", href: "/#faq" },
];

export const megaMenuData: MegaMenuData = {
  columns: [
    {
      title: "Learn by Category",
      links: [
        { label: "Digital Marketing", href: "/categories/digital-marketing", icon: Megaphone },
        { label: "Development", href: "/categories/development", icon: Code2 },
        { label: "Design", href: "/categories/design", icon: Palette },
        { label: "Business", href: "/categories/business", icon: Briefcase },
        { label: "Data & Analytics", href: "/categories/data-analytics", icon: BarChart3 },
        { label: "AI & Automation", href: "/categories/ai-automation", icon: Bot },
      ],
    },
    {
      title: "Popular Courses",
      links: [
        { label: "New Age Digital Marketing", href: "/courses/digital-marketing" },
        { label: "Campus Edition (On Campus)", href: "/courses/4m-program" },
        { label: "Fundamentals of Marketing", href: "/courses/fundamentals" },
        { label: "Treqo PGDM", href: "/courses/pgdm" },
        { label: "The Founder Semester", href: "/courses/founder-semester" },
        { label: "Performance & Growth Specialist", href: "/courses/performance-growth" },
      ],
    },
    {
      title: "Career Paths",
      links: [
        { label: "Performance Marketing Lead", href: "/#placements" },
        { label: "Growth Marketing Specialist", href: "/#placements" },
        { label: "Brand & Creative Strategist", href: "/#placements" },
        { label: "SEO & Content Lead", href: "/#placements" },
        { label: "Social Media & Media Buyer", href: "/#placements" },
        { label: "Founder & Venture Builder", href: "/#placements" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog & Field Notes", href: "/blog", icon: BookOpen },
        { label: "Verified Certifications", href: "/#certs", icon: FileText },
        { label: "Curriculum Syllabus (PDF)", href: "/curriculum/new-age-digital-marketing-curriculum.pdf", icon: Wrench },
        { label: "Practitioner Mentors", href: "/#tutors", icon: LayoutTemplate },
        { label: "The CEO Challenge Method", href: "/#method", icon: FolderKanban },
        { label: "Frequently Asked Questions", href: "/#faq", icon: Mic2 },
      ],
    },
  ],
  promo: {
    eyebrow: "Not sure where to start?",
    heading: "Find the right skill track for you.",
    ctaLabel: "Apply for Batch 2",
    ctaHref: "/#apply",
  },
};

export const navExtras = {
  searchLabel: "Search",
  searchPlaceholder: "Search courses, career paths...",
  ctaLabel: "Apply now",
  ctaHref: "/#apply",
};
