"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/** Name search — the no-camera path into the Pokédex. */
export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const go = () => {
    const q = value.trim().toLowerCase().replace(/\s+/g, "-");
    if (q) router.push(`/pokemon/${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
        placeholder="e.g. Pikachu"
        aria-label="Pokémon name"
        className="min-w-0 flex-1 rounded-full border border-edge bg-ink px-4 py-2.5 text-mist placeholder:text-faded/60 focus:border-beam focus:outline-none"
      />
      <button
        onClick={go}
        className="rounded-full bg-beam px-5 py-2.5 font-display text-sm font-bold text-ink transition hover:brightness-110 active:scale-95"
      >
        Search
      </button>
    </div>
  );
}
