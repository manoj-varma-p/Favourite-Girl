import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getMongoDb } from "./mongodb";
import type { BlogPost } from "@/data/blogs";
import { blogPosts as fallbackBlogs } from "@/data/blogs";
import generalSettingsData from "@/content/settings/general.json";
import navigationSettingsData from "@/content/settings/navigation.json";
import layoutSettingsData from "@/content/settings/layout.json";
import pageSeoData from "@/content/settings/page-seo.json";
import homePageContentData from "@/content/pages/home.json";
import type { FormSettings } from "@/types/forms";
import { defaultFormSettings } from "@/types/forms";

export interface PageSeoItem {
  id: string;
  path: string;
  name: string;
  category?: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  updatedAt?: string;
}

export interface LayoutSettings {
  siteTitle: string;
  titleTemplate?: string;
  metaDescription: string;
  metaKeywords: string[];
  authorName?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  googleSiteVerification?: string;
}

export interface GeneralSettings {
  siteTitle: string;
  logoText: string;
  logoImage?: string;
  supportEmail: string;
  supportPhone: string;
  address?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  copyrightText?: string;
}

export interface NavigationSettings {
  bannerBadge: string;
  bannerText: string;
  bannerLinkText: string;
  bannerLinkHref: string;
}

export interface WhyTreqqoContent {
  eyebrow: string;
  titleLines: string[];
  description?: string;
  submissions: Array<{
    tag: string;
    title: string;
    description: string;
    rule?: string;
  }>;
  methodCard?: {
    tag: string;
    title: string;
    subtitle?: string;
    image?: string;
  };
  banner?: {
    title: string;
    description: string;
  };
}

export interface ExecutionProofContent {
  eyebrow: string;
  title: string;
  description: string;
  outcomes: Array<{
    tag: string;
    name: string;
    description: string;
    photoUrl?: string;
  }>;
  metrics?: Array<{
    value: string;
    label: string;
    detail?: string;
  }>;
  companies?: Array<{
    name: string;
    logo: string;
  }>;
  story?: string;
}

export interface GovCertsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  certs: Array<{
    src: string;
    label: string;
    sub: string;
  }>;
}

export interface DecisionItem {
  num: string;
  title: string;
  description: string;
  protocolTag?: string;
  statusTag?: string;
  standardWay?: string;
  treqoEnforcement?: string;
}

export interface SixDecisionsContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footerNote?: string;
  decisions: DecisionItem[];
}

export interface HeroContent {
  eyebrow?: string;
  headlineLines: string[];
  description: string;
  desktopImage?: string;
  mobileImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  watchVideoLabel?: string;
}

export interface HomePageContent {
  hero: HeroContent;
  stats: Array<{
    value: string;
    label: string;
    detail?: string;
  }>;
  faqs?: Array<{
    category: string;
    question: string;
    answer: string;
  }>;
  whyTreqqo?: WhyTreqqoContent;
  executionProof?: ExecutionProofContent;
  govCerts?: GovCertsContent;
  sixDecisions?: SixDecisionsContent;
  mentors?: MentorsSectionContent;
  certifications?: CertificationsContent;
}

export interface MentorsSectionContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  highlightChips?: string[];
  guaranteeHighlight?: string;
  guaranteeText?: string;
  isLocked?: boolean;
}

export interface CertItem {
  name: string;
  provider: "SEMrush" | "HubSpot" | "Google" | "Meta" | string;
  color?: string;
  price?: string;
}

export interface ProviderBadgeItem {
  name: string;
  color: string;
  count: string;
}

export interface CertificationsContent {
  eyebrow?: string;
  eyebrowHighlight?: string;
  description?: string;
  treqoBadge?: string;
  treqoTitle?: string;
  treqoDescription?: string;
  treqoTags?: string[];
  treqoCertificateImage?: string;
  treqoCaption?: string;
  industryBadge?: string;
  industryTitle?: string;
  industryDescription?: string;
  industryCaption?: string;
  providerBadges?: ProviderBadgeItem[];
  industryCerts?: CertItem[];
}

import type { CoursePhaseGroup } from "@/types/home";

export interface CoursePhasesData {
  heading?: string;
  intro?: string;
  groups: CoursePhaseGroup[];
}

export interface CourseChallenge {
  heading?: string;
  description?: string;
  bullets?: string[];
  title?: string;
  prompt?: string;
  panel?: string[];
  deliverables?: string[];
  rules?: string[];
}

export interface CourseCareerRoleItem {
  title: string;
  description?: string;
}

export interface CourseProofData {
  heading?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
}

export interface CourseFaqItem {
  question: string;
  answer: string;
}

export interface CourseItem {
  id: string;
  title: string;
  href: string;
  badge: string;
  badgeVariant?: "blue" | "amber" | "gray" | "emerald";
  duration: string;
  meta?: string;
  description: string;
  isFlagship?: boolean;
  isLocked: boolean;
  batch?: string;
  feeTotal?: string;
  feeEmi?: string;
  curriculumPdf?: string;
  overview?: string;
  applyCta?: string;
  syllabusCta?: string;
  image?: string;
  previewLabel?: string;
  actionText?: string;
  actionHref?: string;
  tags?: string[];
  order?: number;
  phases?: CoursePhasesData;
  challenge?: CourseChallenge;
  careerRoles?: CourseCareerRoleItem[];
  proof?: CourseProofData;
  faqs?: CourseFaqItem[];
  careerOutcomes?: Array<{
    role: string;
    salary?: string;
    description?: string;
  }>;
  metaKeywords?: string[];
  perks?: Array<{ title: string; description: string; tag?: string } | string>;
}

export type ProgramItem = CourseItem;

export type { FormSettings } from "@/types/forms";
export { defaultFormSettings } from "@/types/forms";

export interface TutorItem {
  id: string;
  name: string;
  role: string;
  mentored: string;
  image?: string;
  brandMetric?: string;
  focus?: string;
  specialty?: string;
  isLocked?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  quote?: string;
  image?: string;
}

export interface AlertSettings {
  notifyEmails: string;
  notifyPhones: string;
  emailAlertsEnabled: boolean;
  smsAlertsEnabled: boolean;
  smsProvider?: string;
  smsApiKey?: string;
  resendApiKey?: string;
  webhookUrl?: string;
}

// -----------------------------------------------------------------
// 1. SETTINGS & BRANDING
// -----------------------------------------------------------------
export async function getGeneralSettingsFromDb(): Promise<GeneralSettings> {
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "general" as unknown as undefined });
      if (doc) {
        return {
          siteTitle: doc.siteTitle || generalSettingsData.siteTitle,
          logoText: doc.logoText || generalSettingsData.logoText,
          logoImage: doc.logoImage !== undefined ? doc.logoImage : (generalSettingsData as unknown as GeneralSettings).logoImage,
          supportEmail: doc.supportEmail || generalSettingsData.supportEmail,
          supportPhone: doc.supportPhone || generalSettingsData.supportPhone,
          address: doc.address || (generalSettingsData as unknown as GeneralSettings).address,
          instagramUrl: doc.instagramUrl !== undefined ? doc.instagramUrl : (generalSettingsData as unknown as GeneralSettings).instagramUrl,
          whatsappUrl: doc.whatsappUrl !== undefined ? doc.whatsappUrl : (generalSettingsData as unknown as GeneralSettings).whatsappUrl,
          linkedinUrl: doc.linkedinUrl !== undefined ? doc.linkedinUrl : (generalSettingsData as unknown as GeneralSettings).linkedinUrl,
          youtubeUrl: doc.youtubeUrl !== undefined ? doc.youtubeUrl : (generalSettingsData as unknown as GeneralSettings).youtubeUrl,
          twitterUrl: doc.twitterUrl !== undefined ? doc.twitterUrl : (generalSettingsData as unknown as GeneralSettings).twitterUrl,
          copyrightText: doc.copyrightText || (generalSettingsData as unknown as GeneralSettings).copyrightText,
        };
      }
    }
  } catch (err) {
    console.error("[getGeneralSettingsFromDb] MongoDB read failed, using local:", err);
  }

  return generalSettingsData as unknown as GeneralSettings;
}

export async function saveGeneralSettingsToDb(settings: GeneralSettings): Promise<void> {
  // Update local file backup
  try {
    const filePath = path.join(process.cwd(), "content/settings/general.json");
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local settings write error (non-fatal):", e);
  }

  // Update MongoDB
  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "general" as unknown as undefined },
      { $set: { ...settings, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// -----------------------------------------------------------------
// 1.1 LAYOUT & SEO META SETTINGS
// -----------------------------------------------------------------
export async function getLayoutSettingsFromDb(): Promise<LayoutSettings> {
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "layout" as unknown as undefined });
      if (doc) {
        return {
          siteTitle: doc.siteTitle || layoutSettingsData.siteTitle,
          titleTemplate: doc.titleTemplate || layoutSettingsData.titleTemplate,
          metaDescription: doc.metaDescription || layoutSettingsData.metaDescription,
          metaKeywords: Array.isArray(doc.metaKeywords) ? doc.metaKeywords : layoutSettingsData.metaKeywords,
          authorName: doc.authorName || layoutSettingsData.authorName,
          canonicalUrl: doc.canonicalUrl || layoutSettingsData.canonicalUrl,
          ogTitle: doc.ogTitle || layoutSettingsData.ogTitle,
          ogDescription: doc.ogDescription || layoutSettingsData.ogDescription,
          ogImage: doc.ogImage !== undefined ? doc.ogImage : layoutSettingsData.ogImage,
          twitterTitle: doc.twitterTitle || layoutSettingsData.twitterTitle,
          twitterDescription: doc.twitterDescription || layoutSettingsData.twitterDescription,
          twitterCard: (doc.twitterCard as "summary" | "summary_large_image") || (layoutSettingsData.twitterCard as "summary" | "summary_large_image"),
          robotsIndex: doc.robotsIndex !== undefined ? Boolean(doc.robotsIndex) : layoutSettingsData.robotsIndex,
          robotsFollow: doc.robotsFollow !== undefined ? Boolean(doc.robotsFollow) : layoutSettingsData.robotsFollow,
          googleSiteVerification: doc.googleSiteVerification !== undefined ? doc.googleSiteVerification : layoutSettingsData.googleSiteVerification,
        };
      }
    }
  } catch (err) {
    console.error("[getLayoutSettingsFromDb] MongoDB read failed, using local:", err);
  }

  return layoutSettingsData as LayoutSettings;
}

export async function saveLayoutSettingsToDb(settings: LayoutSettings): Promise<void> {
  // Update local file backup
  try {
    const filePath = path.join(process.cwd(), "content/settings/layout.json");
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local layout settings write error (non-fatal):", e);
  }

  // Update MongoDB
  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "layout" as unknown as undefined },
      { $set: { ...settings, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// -----------------------------------------------------------------
// 1.2 PAGE-WISE SEO & KEYWORD SETTINGS
// -----------------------------------------------------------------
export async function getPageSeoSettingsFromDb(): Promise<PageSeoItem[]> {
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "page-seo" as unknown as undefined });
      if (doc && Array.isArray(doc.pages) && doc.pages.length > 0) {
        return doc.pages;
      }
    }
  } catch (err) {
    console.error("[getPageSeoSettingsFromDb] MongoDB read failed, using local:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/settings/page-seo.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.warn("Local page-seo settings read error (non-fatal):", e);
  }

  return (pageSeoData as unknown as PageSeoItem[]) || [];
}

export async function savePageSeoSettingsToDb(items: PageSeoItem[]): Promise<void> {
  // Update local file backup
  try {
    const filePath = path.join(process.cwd(), "content/settings/page-seo.json");
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local page-seo settings write error (non-fatal):", e);
  }

  // Update MongoDB
  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "page-seo" as unknown as undefined },
      { $set: { pages: items, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

import { formatCourseSlug, syncPageSeoWithCourses } from "./seo-utils";
export { formatCourseSlug, syncPageSeoWithCourses };

export async function getPageSeoByPath(pagePath: string): Promise<PageSeoItem | null> {
  const pages = await getPageSeoSettingsFromDb();
  const clean = pagePath.endsWith("/") && pagePath !== "/" ? pagePath.slice(0, -1) : pagePath;
  const targetSlug = formatCourseSlug(clean);

  return (
    pages.find((p) => {
      if (p.path === clean || p.path === pagePath || p.id === pagePath) return true;
      if (targetSlug && (formatCourseSlug(p.path) === targetSlug || formatCourseSlug(p.id) === targetSlug)) return true;
      return false;
    }) || null
  );
}

// -----------------------------------------------------------------
// 2. NAVIGATION & BANNER
// -----------------------------------------------------------------
export async function getNavigationSettingsFromDb(): Promise<NavigationSettings> {
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "navigation" as unknown as undefined });
      if (doc) {
        return {
          bannerBadge: doc.bannerBadge || navigationSettingsData.bannerBadge,
          bannerText: doc.bannerText || navigationSettingsData.bannerText,
          bannerLinkText: doc.bannerLinkText || navigationSettingsData.bannerLinkText,
          bannerLinkHref: doc.bannerLinkHref || navigationSettingsData.bannerLinkHref,
        };
      }
    }
  } catch (err) {
    console.error("[getNavigationSettingsFromDb] MongoDB read failed, using local:", err);
  }

  return navigationSettingsData as NavigationSettings;
}

export async function saveNavigationSettingsToDb(settings: NavigationSettings): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/settings/navigation.json");
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local navigation write error (non-fatal):", e);
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "navigation" as unknown as undefined },
      { $set: { ...settings, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// -----------------------------------------------------------------
// 3. HOME PAGE CONTENT (HERO, STATS, WHY TREQO, PLACEMENTS, CERTS, DECISIONS, FAQS)
// -----------------------------------------------------------------
export async function getHomePageContentFromDb(): Promise<HomePageContent> {
  let localData = homePageContentData as unknown as HomePageContent;
  try {
    const filePath = path.join(process.cwd(), "content/pages/home.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      localData = JSON.parse(raw);
    }
  } catch {
    // fallback to imported
  }

  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("home_content").findOne({ _id: "home" as unknown as undefined });
      if (doc) {
        return {
          hero: {
            ...localData.hero,
            ...doc.hero,
            desktopImage: doc.hero?.desktopImage || localData.hero?.desktopImage || "/images/maiiin.webp",
            mobileImage: doc.hero?.mobileImage || localData.hero?.mobileImage || "/images/mainnnn-bg.webp",
          },
          stats: doc.stats || localData.stats,
          faqs: doc.faqs || localData.faqs,
          whyTreqqo: doc.whyTreqqo || localData.whyTreqqo,
          executionProof: doc.executionProof || localData.executionProof,
          govCerts: doc.govCerts || localData.govCerts,
          sixDecisions: doc.sixDecisions || localData.sixDecisions,
          mentors: doc.mentors || localData.mentors,
          certifications: doc.certifications
            ? {
                ...localData.certifications,
                ...doc.certifications,
              }
            : localData.certifications,
        };
      }
    }
  } catch (err) {
    console.error("[getHomePageContentFromDb] MongoDB read failed, using local:", err);
  }

  return localData;
}

export async function saveHomePageContentToDb(content: HomePageContent): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/pages/home.json");
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local home content write error (non-fatal):", e);
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("home_content").updateOne(
      { _id: "home" as unknown as undefined },
      { $set: { ...content, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// -----------------------------------------------------------------
// 4. BLOG ARTICLES
// -----------------------------------------------------------------
export async function getAllBlogsFromDb(): Promise<BlogPost[]> {
  try {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection<BlogPost>("blogs").find({}).sort({ publishedAt: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id || d.slug,
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: d.category,
          coverImage: d.coverImage,
          author: d.author,
          publishedAt: d.publishedAt,
          readTime: d.readTime,
          tags: d.tags || [],
          featured: Boolean(d.featured),
        }));
      }
    }
  } catch (err) {
    console.error("[getAllBlogsFromDb] MongoDB read failed, checking local files:", err);
  }

  // Fallback: Read local markdown files
  try {
    const blogsDir = path.join(process.cwd(), "content/blogs");
    if (fs.existsSync(blogsDir)) {
      const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
      if (files.length > 0) {
        return files.map((fileName) => {
          const fullPath = path.join(blogsDir, fileName);
          const raw = fs.readFileSync(fullPath, "utf-8");
          const { data, content } = matter(raw);
          const slug = data.slug || fileName.replace(/\.md$/, "");
          return {
            id: slug,
            slug,
            title: data.title || "Untitled",
            excerpt: data.excerpt || "",
            content: content.split(/\n\n+/).map((p) => p.trim()).filter((p) => p.length > 0),
            category: data.category || "Performance Marketing",
            coverImage: data.coverImage || "",
            author: {
              name: data.author?.name || "Treqo Team",
              role: data.author?.role || "Editorial Team",
              avatar: data.author?.avatar || "",
            },
            publishedAt: data.publishedAt || "September 2026",
            readTime: data.readTime || "5 min read",
            tags: data.tags || [],
            featured: Boolean(data.featured),
          };
        });
      }
    }
  } catch (err) {
    console.error("[getAllBlogsFromDb] Local fallback error:", err);
  }

  return fallbackBlogs;
}

export async function getBlogBySlugFromDb(slug: string): Promise<BlogPost | null> {
  const blogs = await getAllBlogsFromDb();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function saveBlogToDb(blog: BlogPost): Promise<void> {
  // Save local file
  try {
    const blogsDir = path.join(process.cwd(), "content/blogs");
    if (!fs.existsSync(blogsDir)) {
      fs.mkdirSync(blogsDir, { recursive: true });
    }
    const frontmatter = {
      title: blog.title,
      slug: blog.slug,
      publishedAt: blog.publishedAt,
      readTime: blog.readTime,
      category: blog.category,
      featured: Boolean(blog.featured),
      coverImage: blog.coverImage,
      excerpt: blog.excerpt,
      author: blog.author,
      tags: blog.tags,
    };
    const markdownContent = matter.stringify(
      Array.isArray(blog.content) ? blog.content.join("\n\n") : String(blog.content),
      frontmatter
    );
    fs.writeFileSync(path.join(blogsDir, `${blog.slug}.md`), markdownContent, "utf-8");
  } catch (e) {
    console.warn("Local markdown write error (non-fatal):", e);
  }

  // Save to MongoDB
  const db = await getMongoDb();
  if (db) {
    await db.collection("blogs").updateOne(
      { slug: blog.slug },
      { $set: { ...blog, id: blog.slug, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

export async function deleteBlogFromDb(slug: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/blogs", `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.warn("Local markdown delete error (non-fatal):", e);
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("blogs").deleteOne({ slug });
  }
}

// -----------------------------------------------------------------
// 5. COURSES
// -----------------------------------------------------------------
export async function getCoursesFromDb(): Promise<CourseItem[]> {
  try {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection("courses").find({}).toArray();
      if (docs && docs.length > 0) {
        const mapped: CourseItem[] = docs.map((d) => {
          const isLocked = Boolean(d.isLocked);
          return {
            id: d.id || String(d._id),
            title: d.title,
            href: (d.href || "").replace(/^\/categories\//, "/courses/") || `/courses/${d.id}`,
            badge: isLocked ? "COMING SOON" : (d.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (d.badge || "BATCH 2 · OPEN")),
            badgeVariant: d.badgeVariant || (isLocked ? "gray" : "blue"),
            duration: d.duration || "4 months · Online",
            meta: d.meta || d.duration || "4 months · Online",
            description: d.description || "",
            isFlagship: Boolean(d.isFlagship),
            isLocked,
            batch: d.batch,
            feeTotal: d.feeTotal,
            feeEmi: d.feeEmi,
            curriculumPdf: d.curriculumPdf,
            overview: d.overview,
            applyCta: isLocked ? "Notify Me When Open" : (d.applyCta === "Notify Me When Open" ? "Apply for Batch 2" : (d.applyCta || "Apply for Batch 2")),
            syllabusCta: d.syllabusCta,
            image: d.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            previewLabel: d.previewLabel || "",
            actionText: isLocked ? "Get notified →" : (d.actionText && !d.actionText.toLowerCase().includes("notif") ? d.actionText : "View course →"),
            actionHref: (d.actionHref || d.href || "").replace(/^\/categories\//, "/courses/") || `/courses/${d.id}`,
            tags: Array.isArray(d.tags) && d.tags.length > 0 ? d.tags : ["All"],
            order: typeof d.order === "number" ? d.order : 999,
            phases: d.phases,
            challenge: d.challenge,
            careerRoles: d.careerRoles,
            proof: d.proof,
            faqs: d.faqs,
            metaKeywords: Array.isArray(d.metaKeywords) ? d.metaKeywords : undefined,
          };
        });
        return mapped.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (err) {
    console.error("[getCoursesFromDb] Error reading MongoDB:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/courses.json");
    if (fs.existsSync(filePath)) {
      const list: CourseItem[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const normalized = list.map((c) => {
        const isLocked = Boolean(c.isLocked);
        return {
          ...c,
          href: (c.href || "").replace(/^\/categories\//, "/courses/") || `/courses/${c.id}`,
          actionHref: (c.actionHref || c.href || "").replace(/^\/categories\//, "/courses/") || `/courses/${c.id}`,
          isLocked,
          actionText: isLocked ? "Get notified →" : (c.actionText && !c.actionText.toLowerCase().includes("notif") ? c.actionText : "View course →"),
          badge: isLocked ? "COMING SOON" : (c.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (c.badge || "BATCH 2 · OPEN")),
          badgeVariant: isLocked ? "gray" : (c.badgeVariant || "blue"),
          applyCta: isLocked ? "Notify Me When Open" : (c.applyCta === "Notify Me When Open" ? "Apply for Batch 2" : (c.applyCta || "Apply for Batch 2")),
        };
      });
      return normalized.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch (e) {
    console.warn("Local courses read error:", e);
  }

  return [];
}

export async function saveCoursesToDb(courses: CourseItem[]): Promise<void> {
  // Ensure order, canonical slugs & lock states are normalized
  const orderedCourses = courses.map((c, idx) => {
    const isLocked = Boolean(c.isLocked);
    const rawHref = (c.href || "").trim().replace(/^\/categories\//, "/courses/");
    const cleanSlug = formatCourseSlug(rawHref) || formatCourseSlug(c.id);
    const canonicalPath = rawHref
      ? (rawHref.startsWith("/") ? rawHref : rawHref.startsWith("courses/") ? `/${rawHref}` : `/courses/${rawHref}`)
      : `/courses/${cleanSlug}`;
    return {
      ...c,
      id: c.id || cleanSlug,
      isLocked,
      actionText: isLocked ? "Get notified →" : (c.actionText && !c.actionText.toLowerCase().includes("notif") ? c.actionText : "View course →"),
      badge: isLocked ? "COMING SOON" : (c.badge === "COMING SOON" ? "BATCH 2 · OPEN" : (c.badge || "BATCH 2 · OPEN")),
      badgeVariant: isLocked ? "gray" : (c.badgeVariant || "blue"),
      applyCta: isLocked ? "Notify Me When Open" : (c.applyCta === "Notify Me When Open" ? "Apply for Batch 2" : (c.applyCta || "Apply for Batch 2")),
      actionHref: canonicalPath,
      href: canonicalPath,
      order: typeof c.order === "number" ? c.order : idx + 1,
    };
  });

  try {
    const filePath = path.join(process.cwd(), "content/courses.json");
    fs.writeFileSync(filePath, JSON.stringify(orderedCourses, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local courses write error:", e);
  }

  const db = await getMongoDb();
  if (db) {
    if (orderedCourses.length > 0) {
      const currentIds = orderedCourses.map((c) => c.id);
      const operations = orderedCourses.map((c) => ({
        updateOne: {
          filter: { _id: c.id as unknown as undefined },
          update: { $set: { ...c, _id: c.id as unknown as undefined } },
          upsert: true,
        },
      }));
      await db.collection("courses").bulkWrite(operations);
      await db.collection("courses").deleteMany({ _id: { $nin: currentIds } } as any);
    } else {
      await db.collection("courses").deleteMany({});
    }
  }

  // Automatically sync course names, slugs, and paths into Page SEO
  try {
    const currentSeo = await getPageSeoSettingsFromDb();
    const syncedSeo = syncPageSeoWithCourses(currentSeo, orderedCourses);
    await savePageSeoSettingsToDb(syncedSeo);
  } catch (err) {
    console.warn("Auto-sync page SEO with courses error:", err);
  }
}

// Aliases and CRUD helpers for Programs
export const getProgramsFromDb = getCoursesFromDb;
export const saveProgramsToDb = saveCoursesToDb;

export async function getProgramByIdFromDb(id: string): Promise<CourseItem | null> {
  const programs = await getCoursesFromDb();
  return programs.find((p) => p.id === id) || null;
}

export async function saveProgramToDb(program: CourseItem): Promise<CourseItem> {
  const programs = await getCoursesFromDb();
  const existingIdx = programs.findIndex((p) => p.id === program.id);
  let updated: CourseItem[];
  if (existingIdx >= 0) {
    updated = [...programs];
    updated[existingIdx] = { ...updated[existingIdx], ...program };
  } else {
    const maxOrder = programs.reduce((max, p) => Math.max(max, p.order ?? 0), 0);
    const order = typeof program.order === "number" ? program.order : maxOrder + 1;
    updated = [...programs, { ...program, order }];
  }
  updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  await saveCoursesToDb(updated);
  return program;
}

export async function deleteProgramFromDb(id: string): Promise<boolean> {
  const programs = await getCoursesFromDb();
  const existingIdx = programs.findIndex((p) => p.id === id);
  if (existingIdx < 0) return false;
  const updated = programs.filter((p) => p.id !== id);
  await saveCoursesToDb(updated);
  return true;
}

export async function reorderProgramsInDb(orderedIds: string[]): Promise<CourseItem[]> {
  const programs = await getCoursesFromDb();
  const programMap = new Map(programs.map((p) => [p.id, p]));
  const reordered: CourseItem[] = [];

  orderedIds.forEach((id, idx) => {
    const found = programMap.get(id);
    if (found) {
      reordered.push({ ...found, order: idx + 1 });
      programMap.delete(id);
    }
  });

  // Append any remaining programs
  Array.from(programMap.values()).forEach((p) => {
    reordered.push({ ...p, order: reordered.length + 1 });
  });

  await saveCoursesToDb(reordered);
  return reordered;
}

// -----------------------------------------------------------------
// 6. TUTORS / MENTORS
// -----------------------------------------------------------------
const DEFAULT_TUTOR_PHOTOS: Record<string, string> = {
  "Mohit Goel": "/uploads/tutors/chatgpt-image-sep-21--2026--04-1789988931113-hbh1.png",
  "Deeptika Bajaj": "/uploads/tutors/chatgpt_image_sep_21__2026__04-1789987659833-7bba.png",
  "Megha Punjabi": "/uploads/tutors/chatgpt_image_sep_21__2026__04-1789988219758-5cu9.png",
  "Akshat Aggarwal": "/uploads/tutors/screenshot-2026-09-21-163115-1789988498703-f4d3.png",
  "Prateek Narang": "/uploads/tutors/screenshot-2026-09-21-163115-1789988506460-6n42.png",
  "Ritika Sharma": "/uploads/tutors/screenshot-2026-09-21-163115-1789988514964-tz86.png",
};

const DEFAULT_TUTOR_INSIGHTS: Record<string, { brandMetric: string; focus: string; specialty: string }> = {
  "Mohit Goel": {
    brandMetric: "₹10Cr+ Ad Spend Managed",
    focus: "Direct-response unit economics and turning raw campaign data into profitable spend.",
    specialty: "Funnel Economics & Scaling",
  },
  "Deeptika Bajaj": {
    brandMetric: "3.8x Avg ROAS Across Clients",
    focus: "Scaling paid acquisition on Meta & Google Ads without burning client margins.",
    specialty: "Growth & Performance Marketing",
  },
  "Megha Punjabi": {
    brandMetric: "Ex-Amex Growth Lead",
    focus: "Enterprise positioning, high-LTV customer journeys, and retention architectures.",
    specialty: "Enterprise Marketing & Brand",
  },
  "Akshat Aggarwal": {
    brandMetric: "Enterprise Analytics",
    focus: "Full-funnel attribution models, clean tracking setups, and defensible ROI reporting.",
    specialty: "Attribution & Data-Driven Growth",
  },
  "Prateek Narang": {
    brandMetric: "IIT Alum & Top Tech Mentor",
    focus: "Defending campaign numbers out loud so hiring panels can't poke holes in your work.",
    specialty: "Portfolio & Interview Defense",
  },
  "Ritika Sharma": {
    brandMetric: "500+ Funnels Audited",
    focus: "High-growth brand positioning, conversion rate optimization, and organic distribution.",
    specialty: "Brand Strategy & Conversion",
  },
};

export async function getTutorsFromDb(): Promise<TutorItem[]> {
  try {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection("tutors").find({}).toArray();
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id || String(d._id),
          name: d.name,
          role: d.role,
          mentored: d.mentored || "",
          image: d.image?.trim() || DEFAULT_TUTOR_PHOTOS[d.name] || "",
          brandMetric: d.brandMetric || DEFAULT_TUTOR_INSIGHTS[d.name]?.brandMetric || "Active Practitioner",
          focus: d.focus || DEFAULT_TUTOR_INSIGHTS[d.name]?.focus || "Direct-response campaigns and hands-on portfolio execution.",
          specialty: d.specialty || DEFAULT_TUTOR_INSIGHTS[d.name]?.specialty || d.role || "Performance Marketing",
          isLocked: Boolean(d.isLocked),
        }));
      }
    }
  } catch (err) {
    console.error("[getTutorsFromDb] Error reading MongoDB:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/tutors.json");
    if (fs.existsSync(filePath)) {
      const list: TutorItem[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return list.map((d) => ({
        ...d,
        image: d.image?.trim() || DEFAULT_TUTOR_PHOTOS[d.name] || "",
        brandMetric: d.brandMetric || DEFAULT_TUTOR_INSIGHTS[d.name]?.brandMetric || "Active Practitioner",
        focus: d.focus || DEFAULT_TUTOR_INSIGHTS[d.name]?.focus || "Direct-response campaigns and hands-on portfolio execution.",
        specialty: d.specialty || DEFAULT_TUTOR_INSIGHTS[d.name]?.specialty || d.role || "Performance Marketing",
        isLocked: Boolean(d.isLocked),
      }));
    }
  } catch (e) {
    console.warn("Local tutors read error:", e);
  }

  return [];
}

export async function saveTutorsToDb(tutors: TutorItem[]): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/tutors.json");
    fs.writeFileSync(filePath, JSON.stringify(tutors, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local tutors write error:", e);
  }

  const db = await getMongoDb();
  if (db) {
    if (tutors.length > 0) {
      const currentIds = tutors.map((t) => t.id);
      const operations = tutors.map((t) => ({
        updateOne: {
          filter: { _id: t.id as unknown as undefined },
          update: { $set: { ...t, _id: t.id as unknown as undefined } },
          upsert: true,
        },
      }));
      await db.collection("tutors").bulkWrite(operations);
      await db.collection("tutors").deleteMany({ _id: { $nin: currentIds } } as any);
    } else {
      await db.collection("tutors").deleteMany({});
    }
  }
}

// -----------------------------------------------------------------
// 7. TESTIMONIALS / ALUMNI
// -----------------------------------------------------------------
export async function getTestimonialsFromDb(): Promise<TestimonialItem[]> {
  try {
    const db = await getMongoDb();
    if (db) {
      const docs = await db.collection("testimonials").find({}).toArray();
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id || String(d._id),
          name: d.name,
          role: d.role,
          company: d.company || "",
          quote: d.quote || "",
          image: d.image || "",
        }));
      }
    }
  } catch (err) {
    console.error("[getTestimonialsFromDb] Error reading MongoDB:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/testimonials.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.warn("Local testimonials read error:", e);
  }

  return [];
}

export async function saveTestimonialsToDb(testimonials: TestimonialItem[]): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/testimonials.json");
    fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local testimonials write error:", e);
  }

  const db = await getMongoDb();
  if (db) {
    if (testimonials.length > 0) {
      const currentIds = testimonials.map((t) => t.id);
      const operations = testimonials.map((t) => ({
        updateOne: {
          filter: { _id: t.id as unknown as undefined },
          update: { $set: { ...t, _id: t.id as unknown as undefined } },
          upsert: true,
        },
      }));
      await db.collection("testimonials").bulkWrite(operations);
      await db.collection("testimonials").deleteMany({ _id: { $nin: currentIds } } as any);
    } else {
      await db.collection("testimonials").deleteMany({});
    }
  }
}

// -----------------------------------------------------------------
// 8. ALERTS & NOTIFICATIONS
// -----------------------------------------------------------------
export async function getAlertSettingsFromDb(): Promise<AlertSettings> {
  const defaultAlerts: AlertSettings = {
    notifyEmails: "admissions@treqo.org",
    notifyPhones: "+91 99480 00491",
    emailAlertsEnabled: true,
    smsAlertsEnabled: true,
    smsProvider: "fast2sms",
    smsApiKey: "",
    resendApiKey: process.env.RESEND_API_KEY || "",
    webhookUrl: "",
  };

  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "alerts" as unknown as undefined });
      if (doc) {
        return {
          notifyEmails: doc.notifyEmails !== undefined ? doc.notifyEmails : defaultAlerts.notifyEmails,
          notifyPhones: doc.notifyPhones !== undefined ? doc.notifyPhones : defaultAlerts.notifyPhones,
          emailAlertsEnabled: doc.emailAlertsEnabled !== undefined ? Boolean(doc.emailAlertsEnabled) : defaultAlerts.emailAlertsEnabled,
          smsAlertsEnabled: doc.smsAlertsEnabled !== undefined ? Boolean(doc.smsAlertsEnabled) : defaultAlerts.smsAlertsEnabled,
          smsProvider: doc.smsProvider || defaultAlerts.smsProvider,
          smsApiKey: doc.smsApiKey || defaultAlerts.smsApiKey,
          resendApiKey: doc.resendApiKey || defaultAlerts.resendApiKey,
          webhookUrl: doc.webhookUrl || defaultAlerts.webhookUrl,
        };
      }
    }
  } catch (err) {
    console.error("[getAlertSettingsFromDb] Error reading MongoDB:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/alerts.json");
    if (fs.existsSync(filePath)) {
      return { ...defaultAlerts, ...JSON.parse(fs.readFileSync(filePath, "utf-8")) };
    }
  } catch (e) {
    console.warn("Local alerts read error:", e);
  }

  return defaultAlerts;
}

export async function saveAlertSettingsToDb(alerts: AlertSettings): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/alerts.json");
    fs.writeFileSync(filePath, JSON.stringify(alerts, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local alerts write error:", e);
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "alerts" as unknown as undefined },
      { $set: { ...alerts, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// -----------------------------------------------------------------
// 9. FORM TITLES & POPUP LABELS
// -----------------------------------------------------------------
export async function getFormSettingsFromDb(): Promise<FormSettings> {
  try {
    const db = await getMongoDb();
    if (db) {
      const doc = await db.collection("settings").findOne({ _id: "forms" as unknown as undefined });
      if (doc) {
        return {
          heroFormTitle: doc.heroFormTitle || defaultFormSettings.heroFormTitle,
          heroFormSubtitle: doc.heroFormSubtitle || defaultFormSettings.heroFormSubtitle,
          heroFormButtonText: doc.heroFormButtonText || defaultFormSettings.heroFormButtonText,
          heroFormSuccessTitle: doc.heroFormSuccessTitle || defaultFormSettings.heroFormSuccessTitle,
          heroFormSuccessMessage: doc.heroFormSuccessMessage || defaultFormSettings.heroFormSuccessMessage,

          applyModalTitle: doc.applyModalTitle || defaultFormSettings.applyModalTitle,
          applyModalSubtitle: doc.applyModalSubtitle || defaultFormSettings.applyModalSubtitle,
          applyModalButtonText: doc.applyModalButtonText || defaultFormSettings.applyModalButtonText,
          applyModalSuccessTitle: doc.applyModalSuccessTitle || defaultFormSettings.applyModalSuccessTitle,
          applyModalSuccessMessage: doc.applyModalSuccessMessage || defaultFormSettings.applyModalSuccessMessage,

          curriculumModalTitle: doc.curriculumModalTitle || defaultFormSettings.curriculumModalTitle,
          curriculumModalSubtitle: doc.curriculumModalSubtitle || defaultFormSettings.curriculumModalSubtitle,
          curriculumModalButtonText: doc.curriculumModalButtonText || defaultFormSettings.curriculumModalButtonText,
        };
      }
    }
  } catch (err) {
    console.error("[getFormSettingsFromDb] Error reading MongoDB:", err);
  }

  try {
    const filePath = path.join(process.cwd(), "content/settings/forms.json");
    if (fs.existsSync(filePath)) {
      return { ...defaultFormSettings, ...JSON.parse(fs.readFileSync(filePath, "utf-8")) };
    }
  } catch (e) {
    console.warn("Local forms.json read error:", e);
  }

  return defaultFormSettings;
}

export async function saveFormSettingsToDb(forms: FormSettings): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "content/settings/forms.json");
    fs.writeFileSync(filePath, JSON.stringify(forms, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local forms.json write error:", e);
  }

  const db = await getMongoDb();
  if (db) {
    await db.collection("settings").updateOne(
      { _id: "forms" as unknown as undefined },
      { $set: { ...forms, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  }
}


