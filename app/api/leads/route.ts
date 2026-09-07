import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { leads } from "../../../db/schema";
import { sendLeadTexts } from "../../../lib/notify";

function toRouteErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const detail =
    error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
  const combined = `${message}\n${detail}`;

  if (combined.includes("no such table") || combined.includes('from "leads"')) {
    return "The leads table is unavailable. Generate the migration locally with `npm run db:generate`, then deploy so the platform can apply the generated SQL to the real D1 database.";
  }

  return message;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt), desc(leads.id))
      .limit(50);

    return Response.json({ leads: rows });
  } catch (error) {
    return Response.json(
      { error: toRouteErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      phone?: string;
      location?: string;
      projectType?: string;
      timeline?: string;
      details?: string;
    };

    const name = payload.name?.trim() ?? "";
    const phone = payload.phone?.trim() ?? "";
    const location = payload.location?.trim() ?? "";
    const projectType = payload.projectType?.trim() ?? "";
    const timeline = payload.timeline?.trim() ?? "";
    const details = payload.details?.trim() ?? "";

    if (!name || !phone || !location || !projectType || !details) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const [lead] = await db
      .insert(leads)
      .values({ name, phone, location, projectType, timeline, details })
      .returning();

    await sendLeadTexts(
      `New Jason & Co. lead: ${name} (${phone}) - ${projectType} in ${location}.`
    );

    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: toRouteErrorMessage(error) },
      { status: 500 }
    );
  }
}
