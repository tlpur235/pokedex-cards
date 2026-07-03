"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { fetchDexData } from "@/lib/pokeapi";
import { typeColor } from "@/lib/typeStyles";
import type { DexData, ScannedCard } from "@/lib/types";
import TypeBadge from "@/components/TypeBadge";
import StatBars from "@/components/StatBars";
import Evolution from "@/components/Evolution";
import Effectiveness from "@/components/Effectiveness";
import DexEntry from "@/components/DexEntry";
import CardPanel from "@/components/CardPanel";

/** Section wrapper: consistent panel + heading treatment. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel animate-pop p-5">
      <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-beam">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ink/70 px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-faded">{label}</p>
      <p className="mt-0.5 font-display text-sm font-semibold capitalize">
        {value}
      </p>
    </div>
  );
}

/**
 * The Pokédex screen. Fetches everything from PokéAPI in the browser,
 * shows a lens-pulse loading state, then reveals the full entry.
 */
export default function PokemonPage() {
  const params = useParams<{ name: string }>();
  const search = useSearchParams();
  const scanned = search.get("scanned") === "1";

  const [dex, setDex] = useState<DexData | null>(null);
  const [scan, setScan] = useState<ScannedCard | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDex(null);
    setError(false);
    fetchDexData(decodeURIComponent(params.name))
      .then((d) => !cancelled && setDex(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [params.name]);

  // Card details captured by the scanner (if we arrived via a scan).
  useEffect(() => {
    if (!scanned) return;
    try {
      const raw = sessionStorage.getItem("lastScan");
      if (raw) setScan(JSON.parse(raw));
    } catch {
      /* no scan context — the Pokédex still renders fully */
    }
  }, [scanned]);

  if (error) {
    return (
      <div className="pt-20 text-center">
        <p className="text-5xl" aria-hidden="true">🔍</p>
        <h1 className="mt-4 font-display text-xl font-bold">
          That Pokémon isn&apos;t in the Dex
        </h1>
        <p className="mt-2 text-faded">
          Check the spelling, or scan the card again.
        </p>
        <Link
          href="/scan"
          className="mt-6 inline-block rounded-full bg-dexred px-6 py-3 font-display font-semibold text-white"
        >
          Back to scanner
        </Link>
      </div>
    );
  }

  if (!dex) {
    return (
      <div className="flex flex-col items-center gap-4 pt-28">
        <span className="dex-lens h-16 w-16 animate-lens" />
        <p className="font-display font-semibold text-beam">Opening Pokédex…</p>
      </div>
    );
  }

  const accent = typeColor(dex.types[0]);

  return (
    <div className="space-y-4 pt-4">
      {/* Hero: big artwork on a type-coloured glow */}
      <section
        className="panel animate-pop overflow-hidden text-center"
        style={{
          backgroundImage: `radial-gradient(28rem 20rem at 50% -20%, ${accent}33, transparent 70%)`,
        }}
      >
        <div className="p-6 pb-4">
          <p className="font-display font-semibold text-faded">
            #{String(dex.id).padStart(4, "0")}
          </p>
          <Image
            src={dex.artwork}
            alt={dex.name}
            width={320}
            height={320}
            unoptimized
            priority
            className="mx-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
          />
          <h1 className="font-display text-4xl font-bold">{dex.name}</h1>
          <p className="mt-1 text-faded">{dex.genus}</p>
          <div className="mt-3 flex justify-center gap-2">
            {dex.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>
        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-2 p-4 pt-0 sm:grid-cols-3">
          <Fact label="Height" value={`${dex.heightM} m`} />
          <Fact label="Weight" value={`${dex.weightKg} kg`} />
          <Fact label="Generation" value={dex.generation} />
          <Fact label="Region" value={dex.region} />
          <Fact label="Stage" value={dex.evolutionStage} />
          <Fact
            label="Evolves from"
            value={dex.evolvesFrom ? dex.evolvesFrom.replace(/-/g, " ") : "—"}
          />
          {dex.evolvesInto.length > 0 && (
            <Fact
              label="Evolves into"
              value={dex.evolvesInto.join(", ").replace(/-/g, " ")}
            />
          )}
        </div>
      </section>

      <Section title="Pokédex entry">
        <DexEntry dex={dex} />
      </Section>

      <Section title="Base stats">
        <StatBars stats={dex.stats} />
      </Section>

      <Section title="Abilities">
        <div className="space-y-3">
          {dex.abilities.map((a) => (
            <div key={a.name} className="rounded-2xl bg-ink/70 p-3.5">
              <p className="font-display font-semibold">
                {a.name}
                {a.isHidden && (
                  <span className="ml-2 rounded-full bg-spark/20 px-2 py-0.5 text-[11px] font-bold text-spark">
                    Hidden
                  </span>
                )}
              </p>
              {a.description && (
                <p className="mt-1 text-sm text-faded">{a.description}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type matchups">
        <Effectiveness eff={dex.effectiveness} />
      </Section>

      <Section title="Evolution line">
        <Evolution line={dex.evolutionLine} currentId={dex.id} />
      </Section>

      {scan && (
        <Section title="Your card">
          <CardPanel scan={scan} />
        </Section>
      )}

      <div className="pt-2 text-center">
        <Link
          href="/scan"
          className="inline-block rounded-full bg-dexred px-8 py-3.5 font-display font-bold text-white shadow-lg shadow-dexred/25 transition hover:brightness-110 active:scale-95"
        >
          Scan another card
        </Link>
      </div>
    </div>
  );
}
