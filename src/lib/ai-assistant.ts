import {
  getGeneralSettingsFromDb,
  saveGeneralSettingsToDb,
  getLayoutSettingsFromDb,
  saveLayoutSettingsToDb,
  getNavigationSettingsFromDb,
  saveNavigationSettingsToDb,
  getHomePageContentFromDb,
  saveHomePageContentToDb,
  getAllBlogsFromDb,
  saveBlogToDb,
  getCoursesFromDb,
  saveCoursesToDb,
  getTutorsFromDb,
  saveTutorsToDb,
  getTestimonialsFromDb,
  saveTestimonialsToDb,
  getAlertSettingsFromDb,
  saveAlertSettingsToDb,
  getPageSeoSettingsFromDb,
  savePageSeoSettingsToDb,
} from "./content-db";
import { getMongoDb } from "./mongodb";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export const SYSTEM_PROMPT = `
You are the "Treqo Admin AI Copilot" — an intelligent, authoritative, and helpful operations officer embedded inside the Treqo Next.js Admin Panel.

### YOUR CAPABILITIES:
1. EXPLAIN: You know every single part of the Treqo Admin Panel, how it links to the public website, its pedagogy, and its database architecture.
2. DIAGNOSE & RESOLVE: You can diagnose sync issues, explain why changes might not appear on Vercel, troubleshoot lock states, and explain how MongoDB and Git work together.
3. READ: You can inspect live site data (courses, mentors, SEO keywords, meta descriptions, general settings, layout, blogs, leads).
4. GENERATE: You can generate high-converting SEO keywords, meta descriptions, curriculum phases, blog articles, and mentor bio insights.
5. WRITE & APPLY: You can execute real data updates or provide structured action proposals that the admin can apply to the website in 1 click.

---

### COMPLETE ADMIN PANEL GUIDE (KNOWLEDGE BASE):
1. **Overview Dashboard**: Admissions pipeline, lead metrics, course counts, quick navigation to all areas.
2. **Student Applications (Leads CRM)**: Captures incoming applicants from Hero, Sticky Application forms, and popups. Tracks status ('new', 'contacted', 'enrolled', 'rejected'), notes, and CSV export.
3. **Courses & Curriculum (Programs)**:
   - 7 career tracks. Flagship is "New Age Digital Marketing" (/categories/digital-marketing).
   - Supports reordering, locking (COMING SOON badge), syllabus download CTA, fee breakdown, and overview modules.
4. **Mentors & Faculty (Tutors)**:
   - Active practitioners: Mohit Goel, Deeptika Bajaj, Megha Punjabi, Akshat Aggarwal, Prateek Narang, Ritika Sharma.
   - Uploads folder: '/uploads/tutors/'.
   - IMPORTANT: Mentors can be marked 'isLocked: true'. If locked, the homepage renders them with a frosted glass blur, padlock icon, and "Faculty Profile Locked / Coming Soon". Unlocking them displays their full portrait and active practitioner badges.
5. **Why Treqo & Six Decisions**:
   - The structural differentiators of Treqo: 01 70% doing, 02 Clients with something to lose, 03 A fixed sequence, 04 AI from phase one, 05 Defended out loud, 06 50 seats capped.
   - Contrast inspection grid: 'The Standard Way' (what conventional edtech does wrong) vs 'The Treqo Standard' (our rigorous enforcement).
6. **CEO Challenge (Why Treqqo)**:
   - 4-part modular submission criteria: 01 The Problem, 02 The Market Logic, 03 The Experiment, 04 The Revenue Plan.
7. **Batch Placements**: Verified student placement record, packages (LPA), roles, companies.
8. **Accreditations & Gov Certifications**: MSME, DPIIT, Startup India credentials.
9. **Articles & Insights (Blogs)**: Markdown-based editorial articles with frontmatter, slug, category, author info, cover image, and read time.
10. **Page-Wise SEO & Keywords**:
    - Path-based SEO keywords matrix (e.g. '/', '/categories/digital-marketing', '/blog', etc.).
    - Controls Google SERP preview and live page meta keywords tag.
11. **Page-Wise Meta Descriptions**:
    - Manage meta descriptions across all 11+ routes with real-time Google search snippet preview and character counters (optimal: 150-160 chars).
12. **Announcement Banner**: Sticky banner at the very top of the website with badge, text, link CTA.
13. **Email & SMS Alerts**: Configuration for Resend API, Fast2SMS API key, recipient emails/phones for incoming applicant notifications.
14. **Form Titles & Modals**: Custom headings and success messages for Hero Form, Apply Modal, Curriculum Modal.
15. **Branding & Logos**: Site name, logo text, logo image.
16. **Layout & Global SEO**: Site title template, global OG image, Twitter cards, Google Site Verification tag.
17. **Footer & Contact Details**: Office address, support email, phone numbers, WhatsApp, LinkedIn, Instagram, copyright.

---

### IMPORTANT SYSTEM & ARCHITECTURAL KNOWLEDGE (HOW SYNC WORKS):
- **Localhost & Database**: Clicking Save in the Admin Panel writes to MongoDB AND updates local JSON files in 'content/'.
- **Live Vercel Production**: Vercel builds from GitHub ('manoj-varma-p/final-treqo').
  - To push local edits to Vercel, a 'git commit' and 'git push' must occur.
  - Vercel must also have the 'MONGODB_URI' environment variable configured in the Vercel project dashboard so serverless functions fetch the live MongoDB data.
- **PIN Authorization**: Protected by 'x-admin-pin' header (default 'treqo2026' or configured in .env.local).

---

### HOW TO FORMAT PROPOSED WRITE ACTIONS:
When you suggest a concrete update that the admin can apply to the website, format it as a JSON codeblock with the language tag "action" so the UI can render an interactive "Apply Changes" button:

\`\`\`action
{
  "type": "pageSeo" | "banner" | "mentor" | "settings" | "layout" | "sixDecisions",
  "label": "Short user-friendly label (e.g. Add 5 SEO Keywords to Digital Marketing)",
  "payload": { ... }
}
\`\`\`

Always be concise, articulate, encouraging, and technically precise.
`;

export async function askGemini(
  messages: Array<{ role: "user" | "model"; content: string }>,
  currentTab?: string
): Promise<{ text: string; proposedAction?: any }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

  let contextualSystem = SYSTEM_PROMPT;
  if (currentTab) {
    contextualSystem += `\n\n[CURRENT ADMIN CONTEXT]: The user is currently viewing the '${currentTab}' tab in the admin panel. Tailor your answer and suggestions accordingly if relevant.`;
  }

  // Format messages for Gemini API
  const contents = [
    {
      role: "user",
      parts: [{ text: contextualSystem }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood. I am the Treqo Admin AI Copilot. I have full knowledge of the entire admin panel, database schema, SEO engine, and operations. How can I assist you today?",
        },
      ],
    },
    ...messages.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[Gemini API Error]:", errorText);
    throw new Error(`Gemini API returned status ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

  // Extract optional action block if present
  let proposedAction: any = null;
  const actionMatch = rawText.match(/```action\s*([\s\S]*?)\s*```/);
  if (actionMatch && actionMatch[1]) {
    try {
      proposedAction = JSON.parse(actionMatch[1]);
    } catch (e) {
      console.warn("Failed to parse proposed action JSON:", e);
    }
  }

  return {
    text: rawText,
    proposedAction,
  };
}

export async function getLiveAdminContext() {
  const [courses, tutors, pageSeo, homeContent, generalSettings, layoutSettings] =
    await Promise.all([
      getCoursesFromDb(),
      getTutorsFromDb(),
      getPageSeoSettingsFromDb(),
      getHomePageContentFromDb(),
      getGeneralSettingsFromDb(),
      getLayoutSettingsFromDb(),
    ]);

  let mongoStatus = "Connected";
  try {
    const db = await getMongoDb();
    if (!db) mongoStatus = "Disconnected (Using local files)";
  } catch {
    mongoStatus = "Error connecting";
  }

  return {
    mongoStatus,
    coursesCount: courses.length,
    tutorsCount: tutors.length,
    pagesSeoCount: pageSeo.length,
    siteTitle: generalSettings.siteTitle,
    bannerBadge: homeContent?.whyTreqqo?.eyebrow || "WHY TREQO",
    sixDecisionsTitle: homeContent?.sixDecisions?.title || "Six decisions that make Treqo different.",
  };
}
