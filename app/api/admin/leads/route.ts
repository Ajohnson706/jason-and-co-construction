import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { leads } from "../../../../db/schema";
import { requireAdmin } from "../../../../lib/admin-auth";

export async function GET(request: Request) {
  await requireAdmin(new URL(request.url).pathname);
  const rows = await getDb().select().from(leads).orderBy(desc(leads.createdAt));
  return Response.json({ leads: rows });
}
