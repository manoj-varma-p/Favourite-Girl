import type { LucideIcon } from "lucide-react";

export interface FeaturePill {
  icon: LucideIcon;
  label: string;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroContentData {
  eyebrow: string;
  headline: {
    lines: string[];
    /** Line (by index) that gets the emphasized gradient/underline treatment (-1 if none). */
    emphasizedLine?: number;
  };
  description: string;
  featurePills?: FeaturePill[];
  highlights?: string[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
}

export interface HeroStat {
  icon?: LucideIcon;
  value: string;
  label: string;
}

export interface HeroVisualCardData {
  eyebrow: string;
  title: string;
}

export interface WhyTreqqoPillar {
  icon: LucideIcon;
  label: string;
  heading: string;
  description: string;
  quote: string;
  bullets: { label: string; text: string }[];
}

export interface WhyTreqqoContent {
  eyebrow: string;
  heading: string;
  description: string;
}

export interface LearningSystemContent {
  heading: { line1: string; line2: string };
  description: string;
}

export interface LearningSystemCourse {
  category: string;
  title: string;
  description: string;
  href: string;
  features: { icon: LucideIcon; label: string }[];
  /** Content for the full category/program page, see app/categories/[slug]. */
  detail?: CourseDetail;
}

export interface CourseDetail {
  badge: string;
  batch: string;
  description: string;
  stats: { label: string; value: string }[];
  applyCtaLabel: string;
  breakdownCtaLabel: string;

  /** Sub-nav tab label for the phases section, e.g. "18 phases". */
  phasesNavLabel: string;
  /** Sub-nav tab label for the capstone section, e.g. "CEO Challenge". */
  challengeNavLabel: string;

  overview: {
    whoForHeading: string;
    whoFor: string[];
    differentiators: { value: string; label: string }[];
  };

  phases: {
    heading: string;
    intro: string;
    groups: CoursePhaseGroup[];
  };

  challenge: {
    heading: string;
    description: string;
    bullets: string[];
  };

  fees: {
    heading: string;
    description: string;
    plans: CourseFeePlan[];
  };

  proof: {
    heading: string;
    description: string;
    stats: { value: string; label: string }[];
  };

  faqs: { question: string; answer: string }[];

  sidebar: CourseSidebar;
}

export interface CoursePhaseGroup {
  eyebrow: string;
  heading: string;
  /** Numbered range covered by this group, e.g. "01-02". */
  range: string;
  lessons: string[];
}

export interface CourseFeePlan {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export interface CourseSidebar {
  batchLabel: string;
  starts: string;
  format: string;
  feePlans: string;
  seats: string;
  applyLabel: string;
  downloadLabel: string;
  admissionsNote: string;
  phone: string;
  email: string;
}

export interface TaughtByContent {
  heading: { line1: string; line2: string };
  description: string;
  subheading: string;
}

export interface TutorProfile {
  name: string;
  role: string;
  mentored: string;
  image?: string;
}

export interface CertificatePreview {
  label: string;
  heading: string;
  quote: string;
  bullets: { label: string; text: string }[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
}

export interface AlumniStory {
  name: string;
  role: string;
  company: string;
  image?: string;
}

export interface AlumniContent {
  heading: { line1: string; line2: string };
  description: string;
  cta: HeroCta;
}

export interface ExecutionPillar {
  navTitle: string;
  label: string;
  heading: string;
  quote: string;
  bullets: { label: string; text: string }[];
}

export interface ExecutionContent {
  heading: { line1: string; line2: string };
  description: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
}

export interface ToolItem {
  name: string;
  icon: LucideIcon;
  color: string;
  isAI?: boolean;
}

export interface ToolsContent {
  heading: { line1: string; line2: string };
  description: string;
  cta: HeroCta;
}

export interface FaqCategory {
  label: string;
  faqs: { question: string; answer: string }[];
}

export interface FaqContent {
  heading: { line1: string; line2: string };
  cta: HeroCta;
}
