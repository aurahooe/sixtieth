import { createClient } from "../lib/supabase/server";
import { editionFor } from "../lib/catalog";
import { Tick } from "../components/Tick";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const now = new Date();
  const edition = editionFor(now);
  const supabase = createClient();

  const { data: feature } = await supabase
    .from("features")
    .select("title,kicker,body,hour_key,created_at")
    .eq("hour_key", edition.key)
    .maybeSingle();

  const { data: wall } = await supabase
    .from("notes")
    .select("id,title,body,created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const feat = feature || edition;
  const mins = now.getMinutes();
  const secs = now.getSeconds();
  const remain = 60 - mins;
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(mins).padStart(2, "0");

  return (
    <>
      <Tick hourKey={edition.key} edition={edition} />
      <section className="hero">
        <div>
          <div className="kicker">{feat.kicker || "This hour"}</div>
          <h1>{feat.title}</h1>
          <p className="lede">{feat.body}</p>
        </div>
        <aside className="clock">
          <div className="meta">Hour {edition.key.replace("T", " · ")}:00</div>
          <div className="time">{hh}:{mm}</div>
          <div className="meta" style={{ marginTop: 8 }}>{remain} minutes left on this page</div>
          <div className="bar"><span style={{ width: `${((mins * 60 + secs) / 3600) * 100}%` }} /></div>
        </aside>
      </section>

      <section className="section">
        <div className="meta">From the wall</div>
        <div className="rule" />
        {wall?.length ? (
          <div className="grid">
            {wall.map((n, i) => (
              <article className="card" key={n.id} style={{ animationDelay: `${i * 80}ms` }}>
                <h3>{n.title}</h3>
                <p>{n.body.slice(0, 220)}{n.body.length > 220 ? "…" : ""}</p>
                <div className="who">{new Date(n.created_at).toLocaleString()}</div>
              </article>
            ))}
          </div>
        ) : (
          <p className="lede">The wall is empty. Sign in, write something at the desk, and mark it public.</p>
        )}
        <p style={{ marginTop: 28 }}>
          <Link className="btn" href="/wall">See the whole wall</Link>
          <Link className="btn solid" href="/desk" style={{ marginLeft: 10 }}>Write at the desk</Link>
        </p>
      </section>
    </>
  );
}
