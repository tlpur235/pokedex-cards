import TypeBadge from "./TypeBadge";
import type { Effectiveness as Eff } from "@/lib/types";

function Row({ label, types, empty }: { label: string; types: string[]; empty: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-faded">
        {label}
      </p>
      {types.length ? (
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-faded">{empty}</p>
      )}
    </div>
  );
}

/** Type matchup grid: what hurts it, what it shrugs off, what it beats. */
export default function Effectiveness({ eff }: { eff: Eff }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Row label="Weak to" types={eff.weaknesses} empty="No weaknesses" />
      <Row label="Resists" types={eff.resistances} empty="No resistances" />
      <Row label="Immune to" types={eff.immunities} empty="None" />
      <Row label="Strong against" types={eff.strongAgainst} empty="None" />
    </div>
  );
}
