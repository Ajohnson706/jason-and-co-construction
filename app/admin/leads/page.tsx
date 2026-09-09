import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { leads } from "../../../db/schema";
import { requireAdmin } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(`${value.replace(" ", "T")}Z`));
}

export default async function AdminLeadsPage() {
  const user = await requireAdmin("/admin/leads");
  const rows = await getDb().select().from(leads).orderBy(desc(leads.createdAt));

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Jason &amp; Co. Construction</p>
          <h1>Estimate requests</h1>
          <p className="admin-subtitle">Private lead dashboard for {user.email}</p>
        </div>
        <a className="button button-outline" href="/">Back to website</a>
      </header>
      <section className="admin-card" aria-label="Estimate requests">
        <div className="admin-card-heading">
          <div><p className="eyebrow">Lead inbox</p><h2>{rows.length} request{rows.length === 1 ? "" : "s"}</h2></div>
          <a className="button button-gold" href="/admin/leads">Refresh</a>
        </div>
        {rows.length === 0 ? <p className="admin-empty">New estimate requests will appear here.</p> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Date</th><th>Customer</th><th>Project</th><th>Location</th><th>Timeline</th><th>Details</th><th>Contact</th></tr></thead><tbody>
            {rows.map((lead) => <tr key={lead.id}><td className="admin-date">{formatDate(lead.createdAt)}</td><td><strong>{lead.name}</strong></td><td>{lead.projectType}</td><td>{lead.location}</td><td>{lead.timeline || "—"}</td><td className="admin-details">{lead.details}</td><td><a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </main>
  );
}
