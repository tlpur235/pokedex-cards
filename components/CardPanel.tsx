"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { findCard } from "@/lib/tcg";
import type { ScannedCard, TcgCard } from "@/lib/types";
import { TYPE_STYLES } from "@/lib/typeStyles";

const ENERGY_GLYPH: Record<string, string> = {
  Grass: "🌿", Fire: "🔥", Water: "💧", Lightning: "⚡", Psychic: "🔮",
  Fighting: "🥊", Darkness: "🌙", Metal: "⚙️", Fairy: "✨", Dragon: "🐉",
  Colorless: "⭐",
};

/** Secondary panel: details about the physical card that was scanned. */
export default function CardPanel({ scan }: { scan: ScannedCard | null }) {
  const [card, setCard] = useState<TcgCard | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!scan) {
      setDone(true);
      return;
    }
    let cancelled = false;
    findCard(scan).then((c) => {
      if (!cancelled) {
        setCard(c);
        setDone(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [scan]);

  if (!scan) return null;
  if (!done)
    return <div className="h-40 animate-pulse rounded-card bg-edge/50" />;
  if (!card)
    return (
      <p className="text-sm text-faded">
        Card details couldn&apos;t be matched — the Pokédex data above is still
        accurate.
      </p>
    );

  const fact = (label: string, value: string | null) =>
    value ? (
      <div>
        <dt className="text-xs uppercase tracking-wider text-faded">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {card.image && (
        <Image
          src={card.image}
          alt={card.name}
          width={180}
          height={251}
          unoptimized
          className="mx-auto w-40 shrink-0 rounded-xl shadow-lg shadow-black/40 sm:mx-0"
        />
      )}
      <div className="flex-1 space-y-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {fact("Card", card.name)}
          {fact("Number", card.number)}
          {fact("Set", card.setName)}
          {fact("Released", card.releaseYear)}
          {fact("Rarity", card.rarity)}
          {fact("HP", card.hp)}
          {fact(
            "Weakness",
            card.weaknesses.map((w) => `${w.type} ${w.value}`).join(", ") || null
          )}
          {fact("Retreat cost", card.retreatCost ? "⭐".repeat(card.retreatCost) : "Free")}
          {fact("Illustrator", card.illustrator)}
        </dl>
        {card.attacks.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-faded">Attacks</p>
            {card.attacks.map((a) => (
              <div key={a.name} className="rounded-xl bg-ink/70 p-3 text-sm">
                <div className="flex items-center justify-between gap-2 font-display font-semibold">
                  <span>
                    <span className="mr-1.5" aria-hidden="true">
                      {a.cost.map((c) => ENERGY_GLYPH[c] ?? "⭐").join("")}
                    </span>
                    {a.name}
                  </span>
                  <span className="text-spark">{a.damage}</span>
                </div>
                {a.text && <p className="mt-1 text-faded">{a.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
