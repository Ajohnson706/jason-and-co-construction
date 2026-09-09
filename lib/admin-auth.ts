import { env } from "cloudflare:workers";
import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "../app/chatgpt-auth";

function configuredAdminEmails(): string[] {
  const configured = (env as { ADMIN_EMAILS?: string }).ADMIN_EMAILS ?? "";
  return configured.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return configuredAdminEmails().includes(email.trim().toLowerCase());
}

export async function requireAdmin(returnTo: string): Promise<ChatGPTUser> {
  const user = await requireChatGPTUser(returnTo);
  if (!isAdminEmail(user.email)) {
    throw new Response("You are not authorized to view this page.", { status: 403 });
  }
  return user;
}

export async function getAdmin(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isAdminEmail(user.email) ? user : null;
}
