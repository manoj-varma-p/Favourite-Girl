import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorizedRequest } from "@/lib/admin-auth";
import { askGemini, getLiveAdminContext } from "@/lib/ai-assistant";
import {
  getPageSeoSettingsFromDb,
  savePageSeoSettingsToDb,
  getGeneralSettingsFromDb,
  saveGeneralSettingsToDb,
  getLayoutSettingsFromDb,
  saveLayoutSettingsToDb,
  getNavigationSettingsFromDb,
  saveNavigationSettingsToDb,
  getHomePageContentFromDb,
  saveHomePageContentToDb,
  getTutorsFromDb,
  saveTutorsToDb,
  getCoursesFromDb,
  saveCoursesToDb,
} from "@/lib/content-db";

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { message, history = [], currentTab, action, actionPayload } = body;

    // 1. Direct Action Execution (Write/Update)
    if (action === "apply_action" && actionPayload) {
      const { type, payload } = actionPayload;

      if (type === "pageSeo") {
        const pages = await getPageSeoSettingsFromDb();
        const targetPath = payload.path || "/";
        const idx = pages.findIndex((p) => p.path === targetPath || p.id === payload.id);
        let updatedPages = [...pages];

        if (idx >= 0) {
          updatedPages[idx] = {
            ...updatedPages[idx],
            ...(payload.title ? { title: payload.title } : {}),
            ...(payload.metaDescription ? { metaDescription: payload.metaDescription } : {}),
            ...(Array.isArray(payload.metaKeywords)
              ? { metaKeywords: Array.from(new Set([...updatedPages[idx].metaKeywords, ...payload.metaKeywords])) }
              : {}),
          };
        } else {
          updatedPages.push({
            id: payload.id || targetPath.replace(/^\//, "") || "page",
            name: payload.name || targetPath,
            path: targetPath,
            metaKeywords: payload.metaKeywords || [],
            metaDescription: payload.metaDescription || "",
            title: payload.title || "",
          });
        }

        await savePageSeoSettingsToDb(updatedPages);
        return NextResponse.json({
          success: true,
          applied: true,
          message: `Successfully applied SEO updates to ${targetPath}!`,
        });
      }

      if (type === "banner") {
        const currentNav = await getNavigationSettingsFromDb();
        const updatedNav = {
          ...currentNav,
          ...payload,
        };
        await saveNavigationSettingsToDb(updatedNav);
        return NextResponse.json({
          success: true,
          applied: true,
          message: "Announcement banner updated successfully!",
        });
      }

      if (type === "settings") {
        const current = await getGeneralSettingsFromDb();
        await saveGeneralSettingsToDb({ ...current, ...payload });
        return NextResponse.json({
          success: true,
          applied: true,
          message: "General settings updated successfully!",
        });
      }

      if (type === "layout") {
        const current = await getLayoutSettingsFromDb();
        await saveLayoutSettingsToDb({ ...current, ...payload });
        return NextResponse.json({
          success: true,
          applied: true,
          message: "Layout & SEO meta updated successfully!",
        });
      }

      if (type === "sixDecisions") {
        const currentHome = await getHomePageContentFromDb();
        const updatedHome = {
          ...currentHome,
          sixDecisions: {
            ...(currentHome.sixDecisions || {}),
            ...payload,
          },
        };
        await saveHomePageContentToDb(updatedHome);
        return NextResponse.json({
          success: true,
          applied: true,
          message: "Six Decisions updated successfully!",
        });
      }

      if (
        type === "mentor" ||
        type === "mentors" ||
        type === "tutor" ||
        type === "tutors" ||
        type === "lock_mentor" ||
        type === "unlock_mentor"
      ) {
        const tutors = await getTutorsFromDb();
        let updatedTutors = [...tutors];
        const forceLock = type === "lock_mentor" ? true : type === "unlock_mentor" ? false : undefined;

        if (payload?.all || payload?.lockAll || payload?.unlockAll) {
          const lockState = payload.lockAll ? true : payload.unlockAll ? false : payload.isLocked ?? forceLock ?? false;
          updatedTutors = updatedTutors.map((t) => ({ ...t, isLocked: Boolean(lockState) }));
        } else {
          const targetName = (payload?.name || "").toLowerCase().trim();
          const targetId = (payload?.id || "").toLowerCase().trim();
          const targetIdx = typeof payload?.index === "number" ? payload.index : -1;

          let foundIdx = -1;
          if (targetId) {
            foundIdx = updatedTutors.findIndex((t) => t.id?.toLowerCase() === targetId);
          }
          if (foundIdx < 0 && targetName) {
            foundIdx = updatedTutors.findIndex(
              (t) =>
                t.name.toLowerCase().includes(targetName) ||
                targetName.includes(t.name.toLowerCase())
            );
          }
          if (foundIdx < 0 && targetIdx >= 0 && targetIdx < updatedTutors.length) {
            foundIdx = targetIdx;
          }

          if (foundIdx >= 0) {
            const current = updatedTutors[foundIdx];
            const newLockState =
              forceLock !== undefined
                ? forceLock
                : payload?.isLocked !== undefined
                ? Boolean(payload.isLocked)
                : current.isLocked;

            updatedTutors[foundIdx] = {
              ...current,
              ...payload,
              isLocked: newLockState,
            };
          } else {
            return NextResponse.json({
              success: false,
              error: `Could not find mentor matching '${payload?.name || payload?.id || "specified name"}'`,
            });
          }
        }

        await saveTutorsToDb(updatedTutors);
        try {
          revalidatePath("/", "layout");
        } catch {}

        const isNowLocked = payload?.isLocked ?? forceLock;
        return NextResponse.json({
          success: true,
          applied: true,
          message: isNowLocked === false
            ? `Successfully unlocked mentor profile!`
            : isNowLocked === true
            ? `Successfully locked mentor profile!`
            : `Mentor details updated successfully!`,
        });
      }

      if (
        type === "course" ||
        type === "courses" ||
        type === "program" ||
        type === "programs" ||
        type === "lock_course" ||
        type === "unlock_course"
      ) {
        const courses = await getCoursesFromDb();
        let updatedCourses = [...courses];
        const forceLock = type === "lock_course" ? true : type === "unlock_course" ? false : undefined;

        if (payload?.all || payload?.lockAll || payload?.unlockAll) {
          const lockState = payload.lockAll ? true : payload.unlockAll ? false : payload.isLocked ?? forceLock ?? false;
          updatedCourses = updatedCourses.map((c) => ({ ...c, isLocked: Boolean(lockState) }));
        } else {
          const targetName = (payload?.title || payload?.name || "").toLowerCase().trim();
          const targetId = (payload?.id || "").toLowerCase().trim();
          const targetSlug = (payload?.slug || "").toLowerCase().trim();

          let foundIdx = -1;
          if (targetId) {
            foundIdx = updatedCourses.findIndex((c) => c.id?.toLowerCase() === targetId);
          }
          if (foundIdx < 0 && targetSlug) {
            foundIdx = updatedCourses.findIndex(
              (c) => c.id?.toLowerCase() === targetSlug || c.href?.toLowerCase().includes(targetSlug)
            );
          }
          if (foundIdx < 0 && targetName) {
            foundIdx = updatedCourses.findIndex(
              (c) =>
                c.title.toLowerCase().includes(targetName) ||
                targetName.includes(c.title.toLowerCase())
            );
          }

          if (foundIdx >= 0) {
            const current = updatedCourses[foundIdx];
            const newLockState =
              forceLock !== undefined
                ? forceLock
                : payload?.isLocked !== undefined
                ? Boolean(payload.isLocked)
                : current.isLocked;

            updatedCourses[foundIdx] = {
              ...current,
              ...payload,
              isLocked: newLockState,
            };
          } else {
            return NextResponse.json({
              success: false,
              error: `Could not find course matching '${payload?.title || payload?.id || "specified track"}'`,
            });
          }
        }

        await saveCoursesToDb(updatedCourses);
        try {
          revalidatePath("/", "layout");
        } catch {}

        const isNowLocked = payload?.isLocked ?? forceLock;
        return NextResponse.json({
          success: true,
          applied: true,
          message: isNowLocked === false
            ? `Course successfully unlocked!`
            : isNowLocked === true
            ? `Course locked (Coming Soon)!`
            : `Course updated successfully!`,
        });
      }

      return NextResponse.json({
        success: false,
        error: `Unknown action type: ${type}`,
      });
    }

    // 2. Direct Diagnostics
    if (action === "diagnostics") {
      const diag = await getLiveAdminContext();
      return NextResponse.json({
        success: true,
        diagnostics: diag,
      });
    }

    // 3. Conversational AI Turn
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Call Gemini with conversation history and current tab context
    const chatHistory = Array.isArray(history) ? history : [];
    const fullMessages = [
      ...chatHistory,
      { role: "user" as const, content: message },
    ];

    const { text, proposedAction } = await askGemini(fullMessages, currentTab);

    return NextResponse.json({
      success: true,
      reply: text,
      proposedAction,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/ai Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process AI request. Please check API key and connectivity.",
      },
      { status: 500 }
    );
  }
}
