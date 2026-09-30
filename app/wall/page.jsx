import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Wall() {
  const supabase = createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("id,title,body,created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(48);

  return (
    <section className="section">
      <div className="kicker">Public slips</div>
      <h1>The wall</h1>
      <p className="lede">Anything a signed-in person marks public lands here. Private drafts never leave the desk.</p>
      <div className="rule" />
      {notes?.length ? (
        <div className="grid">
          {notes.map((n, i) => (
            <article className="card" key={n.id} style={{ animationDelay: `${i * 40}ms` }}>
              <h3>{n.title}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
              <div className="who">{new Date(n.created_at).toLocaleString()}</div>
            </article>
          ))}
        </div>
      ) : (
        <p>No public slips yet.</p>
      )}
    </section>
  );
}
