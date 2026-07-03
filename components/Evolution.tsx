import Link from "next/link";
import Image from "next/image";
import type { EvolutionNode } from "@/lib/types";

/** Evolution chain as tappable artwork, current Pokémon highlighted. */
export default function Evolution({
  line,
  currentId,
}: {
  line: EvolutionNode[];
  currentId: number;
}) {
  if (line.length <= 1) {
    return <p className="text-sm text-faded">This Pokémon does not evolve.</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {line.map((node, i) => {
        const current = node.id === currentId;
        return (
          <div key={node.id} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-lg text-faded">→</span>}
            <Link
              href={`/pokemon/${node.name}`}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-2 transition hover:-translate-y-0.5 ${
                current
                  ? "border-spark bg-spark/10"
                  : "border-edge bg-ink/60 hover:border-beam"
              }`}
            >
              <Image
                src={node.artwork}
                alt={node.name}
                width={72}
                height={72}
                unoptimized
              />
              <span className="font-display text-xs font-semibold capitalize">
                {node.name.replace(/-/g, " ")}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
