import { NextRequest, NextResponse } from "next/server";
import { getAlertSettingsFromDb } from "@/lib/content-db";
import { sendEmailViaResend } from "@/lib/email-service";
import { isAuthorizedRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const dbAlertConfig = await getAlertSettingsFromDb();
    
    // Merge DB config with any unsaved payload passed from test button
    const alertConfig = {
      ...dbAlertConfig,
      ...body,
    };

    const emailList = (alertConfig.notifyEmails || "")
      .split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    const timeStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const testMessage = `🔔 [TEST ALERT] Treqo Email Alert System is working!\nTarget Emails: ${emailList.join(", ") || "None"}\nTime: ${timeStr}`;

    let emailStatus = "Disabled in settings";
    let emailResult = null;

    // 1. Dispatch Real Email via Resend API
    if (alertConfig.emailAlertsEnabled && emailList.length > 0) {
      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #eaeaea; rounded: 16px;">
          <div style="border-bottom: 2px solid #012A22; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #012A22; margin: 0; font-size: 22px;">🔔 Treqo Lead Alert System (Test)</h2>
            <p style="color: #666; margin: 4px 0 0 0; font-size: 13px;">Instant notifications for student admissions</p>
          </div>
          <div style="background: #f8f9fc; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #111;">
              ✅ Your Resend.com Email Integration is Active!
            </p>
            <p style="margin: 0; font-size: 13px; color: #444; line-height: 1.5;">
              Whenever an applicant fills the registration or contact form on Treqo, their full details (Name, Phone, Email, Target Course, and Background) will be dispatched directly to your inbox.
            </p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #777; width: 140px;">Configured Emails:</td>
              <td style="padding: 8px 0; color: #111; font-weight: 600;">${emailList.join(", ")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777;">Timestamp:</td>
              <td style="padding: 8px 0; color: #111;">${timeStr}</td>
            </tr>
          </table>
          <div style="border-top: 1px solid #eee; padding-top: 12px; font-size: 11px; color: #999; text-align: center;">
            Treqo Admissions Notification Engine · Powered by Resend
          </div>
        </div>
      `;

      emailResult = await sendEmailViaResend({
        to: emailList,
        subject: "🔔 [Test Alert] Treqo Email Alert Integration Verified",
        html: htmlContent,
        text: testMessage,
      });

      if (emailResult.success) {
        emailStatus = `Delivered via Resend (ID: ${emailResult.id})`;
      } else {
        emailStatus = `Resend Error: ${emailResult.error}`;
      }
    }

    const overallSuccess = emailResult ? emailResult.success : false;
    const feedbackMsg = emailResult?.success
      ? `Success! Test email sent via Resend to ${emailList.join(", ")}.`
      : emailResult?.error
      ? `Email delivery failed: ${emailResult.error}`
      : emailList.length === 0
      ? `Please add at least one notification email address.`
      : `Email alerts are paused in settings.`;

    return NextResponse.json({
      success: overallSuccess,
      message: feedbackMsg,
      error: overallSuccess ? undefined : feedbackMsg,
      details: {
        emailStatus,
        emails: emailList,
        emailResult,
      },
    }, { status: overallSuccess ? 200 : 400 });
  } catch (error) {
    console.error("[Test Alert Error]:", error);
    return NextResponse.json({ error: "Failed to dispatch test alert" }, { status: 500 });
  }
}
