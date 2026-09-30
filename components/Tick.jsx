"use client";
import { useEffect } from "react";

export function Tick({ hourKey, edition }) {
  useEffect(() => {
    fetch("/api/tick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hourKey, ...edition })
    }).catch(() => {});
  }, [hourKey, edition]);
  return null;
}
