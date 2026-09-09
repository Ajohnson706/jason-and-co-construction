import { env } from "cloudflare:workers";

const NOTIFY_EMAILS = ["jasonandco.jason@gmail.com", "ajohnson.csra@gmail.com"];

type EmailEnv = {
  BREVO_API_KEY?: string;
  BREVO_FROM_EMAIL?: string;
  BREVO_FROM_NAME?: string;
};

export async function sendLeadEmails(input: {
  name: string;
  phone: string;
  location: string;
  projectType: string;
  timeline: string;
  details: string;
}) {
  const { BREVO_API_KEY, BREVO_FROM_EMAIL, BREVO_FROM_NAME } = env as EmailEnv;

  if (!BREVO_API_KEY || !BREVO_FROM_EMAIL) {
    console.error("Lead email notification is not configured");
    return false;
  }

  const body = [
    "A new Jason & Co. Construction estimate request was submitted.",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Project location: ${input.location}`,
    `Project type: ${input.projectType}`,
    `Desired timeline: ${input.timeline || "Not sure yet"}`,
    "",
    "Project details:",
    input.details,
  ].join("\n");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: BREVO_FROM_EMAIL,
        name: BREVO_FROM_NAME || "Jason & Co. Construction",
      },
      to: NOTIFY_EMAILS.map((email) => ({ email })),
      subject: `New estimate request from ${input.name}`,
      textContent: body,
    }),
  });

  if (!response.ok) {
    let detail = "Brevo returned an unreadable error response";
    try {
      const payload = (await response.json()) as { code?: string; message?: string };
      detail = `${payload.code || "email_error"}: ${payload.message || "Unknown Brevo error"}`;
    } catch {
      // Keep the safe fallback detail.
    }

    console.error("Lead email notification failed", { detail, status: response.status });
    return false;
  }

  return true;
}
