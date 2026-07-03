"use client";
import { useEffect, useRef, useState } from "react";
import type { StatBlock } from "@/lib/types";

const ROWS: { key: keyof StatBlock; label: string; color: string }[] = [
  { key: "hp", label: "HP", color: "#7AC74C" },
  { key: "attack", label: "Attack", color: "#EE8130" },
  { key: "defense", label: "Defence", color: "#6390F0" },
  { key: "specialAttack", label: "Sp. Attack", color: "#F95587" },
  { key: "specialDefense", label: "Sp. Defence", color: "#A98FF3" },
  { key: "speed", label: "Speed", color: "#F7D02C" },
];

const MAX = 200; // sensible visual ceiling for base stats

/** Animated base-stat bars: fill from zero when scrolled into view. */
export default function StatBars({ stats }: { stats: StatBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-2.5">
      {ROWS.map((row, i) => {
        const value = stats[row.key];
        return (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm text-faded">{row.label}</span>
            <span className="w-8 shrink-0 text-right font-display text-sm font-semibold">
              {value}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: visible ? `${Math.min(100, (value / MAX) * 100)}%` : "0%",
                  backgroundColor: row.color,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
