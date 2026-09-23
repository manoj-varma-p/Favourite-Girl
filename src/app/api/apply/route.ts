import { NextResponse } from "next/server";
import { addLead } from "@/lib/leads-db";
import { getAlertSettingsFromDb } from "@/lib/content-db";
import { sendEmailViaResend } from "@/lib/email-service";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const course = typeof body.course === "string" ? body.course.trim().slice(0, 100) : "New Age Digital Marketing";
    const background = typeof body.background === "string" ? body.background.trim().slice(0, 150) : "General Inquiry";
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 100) : "Website Form";

    // Extract Origin Page and URL
    const refererHeader = request.headers.get("referer") || "";
    let originPage = typeof body.page === "string" && body.page.trim() ? body.page.trim().slice(0, 200) : "";
    const originUrl = typeof body.pageUrl === "string" && body.pageUrl.trim() ? body.pageUrl.trim().slice(0, 500) : refererHeader;

    if (!originPage && refererHeader) {
      try {
        const parsed = new URL(refererHeader);
        originPage = parsed.pathname || "/";
      } catch {}
    }
    if (!originPage) {
      originPage = "/";
    }

    // Validate Name
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Please provide a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 120 || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate Phone (must contain at least 7 digits, e.g. excluding "+91 " prefix)
    const digitsOnly = phone.replace(/\D/g, "");
    if (!phone || digitsOnly.length < 7 || phone.length > 25) {
      return NextResponse.json(
        { error: "Please enter a valid phone number with your country/area code." },
        { status: 400 }
      );
    }

    // Save into database
    const savedLead = await addLead({
      name,
      email,
      phone,
      course,
      background,
      source,
      page: originPage,
      pageUrl: originUrl,
    });

    console.log("[DB] Lead saved successfully:", savedLead);

    // Check and trigger SMS & Email alerts configured in Admin Panel
    try {
      const alertConfig = await getAlertSettingsFromDb();
      const alertMessage = `📢 New Treqo Student Application!\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCourse: ${course}\nOrigin Page: ${originPage}\nSource: ${source}\nBackground: ${background}\nDate: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

      // 1. Dispatch SMS Alerts to configured numbers
      if (alertConfig.smsAlertsEnabled && alertConfig.notifyPhones) {
        const phoneList = alertConfig.notifyPhones.split(",").map((p: string) => p.trim()).filter(Boolean);
        console.log(`[SMS Alert] Dispatching to ${phoneList.length} numbers:`, phoneList);

        if (alertConfig.webhookUrl) {
          fetch(alertConfig.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "student_application_sms_alert",
              message: alertMessage,
              recipients: phoneList,
              lead: savedLead,
            }),
          }).catch((err) => console.error("[SMS Webhook Error]:", err));
        }

        if (alertConfig.smsApiKey) {
          const numbers = phoneList.map((p: string) => p.replace(/\D/g, "").slice(-10)).join(",");
          fetch("https://www.fast2sms.com/dev/bulkV2", {
            method: "POST",
            headers: {
              authorization: alertConfig.smsApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              route: "v3",
              sender_id: "TXTIND",
              message: alertMessage,
              language: "english",
              flash: 0,
              numbers,
            }),
          }).catch((err) => console.error("[Fast2SMS Error]:", err));
        }
      }

      // 2. Dispatch Email Alerts to configured addresses
      if (alertConfig.emailAlertsEnabled && alertConfig.notifyEmails) {
        const emailList = alertConfig.notifyEmails.split(",").map((e: string) => e.trim()).filter(Boolean);
        console.log(`[Email Alert] Dispatching to ${emailList.length} emails:`, emailList);

        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px;">
            <div style="border-bottom: 2px solid #012A22; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #012A22; margin: 0; font-size: 22px;">📢 New Student Application</h2>
              <p style="color: #666; margin: 4px 0 0 0; font-size: 13px;">Received via Treqo Public Website</p>
            </div>
            <div style="background: #f8f9fc; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #777; width: 130px;">Student Name:</td>
                  <td style="padding: 8px 0; color: #111; font-weight: bold; font-size: 16px;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Phone:</td>
                  <td style="padding: 8px 0; color: #111; font-weight: bold;"><a href="tel:${escapeHtml(phone)}" style="color: #012A22;">${escapeHtml(phone)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Email:</td>
                  <td style="padding: 8px 0; color: #111; font-weight: bold;"><a href="mailto:${escapeHtml(email)}" style="color: #012A22;">${escapeHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Target Track:</td>
                  <td style="padding: 8px 0; color: #012A22; font-weight: bold;">${escapeHtml(course)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Background:</td>
                  <td style="padding: 8px 0; color: #333;">${escapeHtml(background)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Submission Source:</td>
                  <td style="padding: 8px 0; color: #555;">${escapeHtml(source)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #777;">Origin Page:</td>
                  <td style="padding: 8px 0; color: #012A22; font-weight: bold;">${escapeHtml(originPage)}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://wa.me/${phone.replace(/\D/g, "")}" style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin-right: 10px;">Chat on WhatsApp</a>
              <a href="tel:${phone}" style="display: inline-block; background: #012A22; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px;">Call Applicant</a>
            </div>
            <div style="border-top: 1px solid #eee; margin-top: 24px; padding-top: 12px; font-size: 11px; color: #999; text-align: center;">
              Treqo Real-Time Lead Engine · Powered by Resend
            </div>
          </div>
        `;

        // Send real email via Resend
        sendEmailViaResend({
          to: emailList,
          subject: `🚨 New Lead: ${name} applied for ${course}`,
          html: emailHtml,
          text: alertMessage,
        }).catch((err: unknown) => console.error("[Resend Lead Email Error]:", err));

        if (alertConfig.webhookUrl) {
          fetch(alertConfig.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "student_email_alert",
              recipients: emailList,
              subject: `New Application: ${name} (${course})`,
              message: alertMessage,
              lead: savedLead,
            }),
          }).catch((err) => console.error("[Email Webhook Error]:", err));
        }
      }
    } catch (alertError) {
      console.error("[Alert Notification Error]:", alertError);
    }

    // Also forward to external webhook (Google Sheets / Excel / Power Automate) if configured
    const webhookUrl =
      process.env.LEADS_WEBHOOK_URL ||
      process.env.EXCEL_WEBHOOK_URL ||
      process.env.SHEET_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbyBRWMwf1gKHjWziw_7qAfdc197IB5pMKjbe66TSqoFY0NYkJLcBPXcUmEIictBglbK/exec";

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savedLead),
          redirect: "follow",
          signal: AbortSignal.timeout(5000),
        });
      } catch (webhookError) {
        console.error("[Webhook Forwarding Error]:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead recorded in database successfully",
      lead: savedLead,
    });
  } catch (error) {
    console.error("[API Apply Error]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
