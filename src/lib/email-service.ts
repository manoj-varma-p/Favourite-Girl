/**
 * Email Dispatch Service using Resend REST API
 */

export interface SendEmailOptions {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  apiKey?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  details?: unknown;
}

export async function sendEmailViaResend(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = options.apiKey || process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "Resend API key is not configured. Add RESEND_API_KEY to .env.local or enter it in the Admin Panel.",
    };
  }

  if (!options.to || options.to.length === 0) {
    return {
      success: false,
      error: "No recipient email addresses provided.",
    };
  }

  const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || "Treqo Admissions <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[Resend Error]:", res.status, data);
      let errorMsg = data?.message || `Resend failed with status ${res.status}`;
      if (res.status === 403 && (data?.message?.includes("testing emails") || data?.message?.includes("verify a domain") || data?.message?.includes("onboarding@resend.dev"))) {
        errorMsg = `Resend Sandbox Restriction: ${data.message}`;
      }
      return {
        success: false,
        error: errorMsg,
        details: data,
      };
    }

    console.log("[Resend Success] Email sent ID:", data?.id);
    return {
      success: true,
      id: data?.id,
      details: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error contacting Resend API";
    console.error("[Resend Network Exception]:", err);
    return {
      success: false,
      error: msg,
    };
  }
}
