import { NextRequest, NextResponse } from "next/server";
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
