import {
  getGeneralSettingsFromDb,
  getLayoutSettingsFromDb,
  getNavigationSettingsFromDb,
  getHomePageContentFromDb,
  getAllBlogsFromDb,
  getBlogBySlugFromDb,
  getTutorsFromDb,
  getCoursesFromDb,
  type GeneralSettings,
  type LayoutSettings,
  type NavigationSettings,
  type HomePageContent,
  type TutorItem,
  type CourseItem,
} from "./content-db";
import type { BlogPost } from "@/data/blogs";

export type { GeneralSettings, LayoutSettings, NavigationSettings, HomePageContent, BlogPost, TutorItem, CourseItem };

export async function getLayoutSettings(): Promise<LayoutSettings> {
  return getLayoutSettingsFromDb();
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  return getGeneralSettingsFromDb();
}

export async function getNavigationSettings(): Promise<NavigationSettings> {
  return getNavigationSettingsFromDb();
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return getHomePageContentFromDb();
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  return getAllBlogsFromDb();
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogBySlugFromDb(slug);
}

export async function getTutors(): Promise<TutorItem[]> {
  return getTutorsFromDb();
}

export async function getCourses(): Promise<CourseItem[]> {
  return getCoursesFromDb();
}
