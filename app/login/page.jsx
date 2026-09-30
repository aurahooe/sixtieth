"use client";
import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function ensureProfile(user) {
    if (!user) return;
    const handle = (user.email || "reader").split("@")[0].slice(0, 24);
    await supabase.from("profiles").upsert({
      id: user.id,
      handle,
      display_name: handle
    });
  }

  async function signIn(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg(error.message);
    await ensureProfile(data.user);
    router.push("/desk");
    router.refresh();
  }

  async function signUp(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) return setMsg(error.message);
    if (data.user) await ensureProfile(data.user);
    setMsg(data.session ? "Account ready. Going to the desk." : "Check your email to confirm, then come back.");
    if (data.session) {
      router.push("/desk");
      router.refresh();
    }
  }

  async function magic(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    setMsg(error ? error.message : "A link is on its way to your inbox.");
  }

  return (
    <section className="section">
      <div className="kicker">Door</div>
      <h1>Enter the desk</h1>
      <p className="lede">Password or a one-time link. Either way your drafts persist.</p>
      <form className="stack" style={{ marginTop: 28 }}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} />
        <div className="row">
          <button className="btn solid" onClick={signIn}>Sign in</button>
          <button className="btn" onClick={signUp}>Create account</button>
          <button className="btn" onClick={magic}>Email me a link</button>
        </div>
        {msg && <p className="meta">{msg}</p>}
      </form>
    </section>
  );
}
