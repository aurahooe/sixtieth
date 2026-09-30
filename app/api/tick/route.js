import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const hourKey = body.hourKey;
  if (!hourKey) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: existing } = await supabase
    .from("features")
    .select("id")
    .eq("hour_key", hourKey)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true, existed: true });

  const { error } = await supabase.from("features").insert({
    hour_key: hourKey,
    title: body.title || "This hour",
    kicker: body.kicker || "Desk",
    body: body.body || "The desk turned over."
  });

  if (error && !String(error.message || "").includes("duplicate")) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true });
}
