"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default function Desk() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [msg, setMsg] = useState("");

  async function load(u) {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", u.id)
      .order("created_at", { ascending: false });
    setNotes(data || []);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (data.user) load(data.user);
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    if (!user) return;
    const handle = (user.email || "reader").split("@")[0].slice(0, 24);
    await supabase.from("profiles").upsert({
      id: user.id,
      handle,
      display_name: handle
    });
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: title.trim() || "Untitled slip",
      body: body.trim(),
      is_public: isPublic
    });
    if (error) return setMsg(error.message);
    setTitle("");
    setBody("");
    setMsg(isPublic ? "On the wall." : "Saved privately.");
    load(user);
  }

  async function toggle(note) {
    await supabase.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load(user);
  }

  async function remove(note) {
    await supabase.from("notes").delete().eq("id", note.id);
    load(user);
  }

  async function out() {
    await supabase.auth.signOut();
    setUser(null);
    setNotes([]);
  }

  if (!user) {
    return (
      <section className="section">
        <div className="kicker">Locked</div>
        <h1>The desk is personal</h1>
        <p className="lede">Sign in to write. Public slips still show on the wall for everyone else.</p>
        <p style={{ marginTop: 24 }}><Link className="btn solid" href="/login">Enter</Link></p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="kicker">Your papers</div>
      <h1>Desk</h1>
      <p className="meta">{user.email} · <button className="btn" onClick={out}>Leave</button></p>
      <form className="stack" onSubmit={save} style={{ marginTop: 28 }}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
        <label>Body</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
        <label className="check">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Mark public — it will appear on the wall
        </label>
        <button className="btn solid" type="submit">Save slip</button>
        {msg && <p className="meta">{msg}</p>}
      </form>

      <div style={{ marginTop: 48 }}>
        <div className="meta">Saved here</div>
        <div className="rule" />
        <div className="grid">
          {notes.map((n) => (
            <article className="card" key={n.id}>
              <h3>{n.title}</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
              <div className="who">{n.is_public ? "Public" : "Private"}</div>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => toggle(n)}>{n.is_public ? "Make private" : "Make public"}</button>
                <button className="btn" onClick={() => remove(n)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
