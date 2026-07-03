"use client";
import { useEffect, useState } from "react";
import type { DexData } from "@/lib/types";

/**
 * AI Pokédex entry. Asks /api/dex-entry for a ~100 word write-up;
 * if the AI isn't configured, falls back to the official flavour text.
 */
export default function DexEntry({ dex }: { dex: DexData }) {
  const [entry, setEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dex-entry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: dex.name,
            genus: dex.genus,
            types: dex.types,
            habitat: dex.habitat,
            flavor: dex.flavor,
            abilities: dex.abilities.map(
              (a) => `${a.name}${a.isHidden ? " (hidden)" : ""}: ${a.description}`
            ),
          }),
        });
        const data = await res.json();
        if (!cancelled) setEntry(res.ok ? data.entry : null);
      } catch {
        if (!cancelled) setEntry(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dex]);

  if (loading) {
    return (
      <div className="space-y-2" aria-label="Writing entry">
        {[100, 92, 96, 60].map((w, i) => (
          <div
            key={i}
            className="h-3.5 animate-pulse rounded bg-edge"
            style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <p className="leading-relaxed text-mist/90">
      {entry ?? dex.flavor ?? "No entry available for this Pokémon yet."}
    </p>
  );
}
