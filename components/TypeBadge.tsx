import { TYPE_STYLES, typeColor } from "@/lib/typeStyles";

/** Pill badge for a Pokémon type, with glyph and type colour. */
export default function TypeBadge({
  type,
  size = "md",
}: {
  type: string;
  size?: "sm" | "md";
}) {
  const style = TYPE_STYLES[type];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-display font-semibold capitalize text-ink ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-sm"
      }`}
      style={{ backgroundColor: typeColor(type) }}
    >
      <span aria-hidden="true">{style?.glyph ?? "❓"}</span>
      {type}
    </span>
  );
}
