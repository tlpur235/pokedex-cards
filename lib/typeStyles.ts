/**
 * Visual identity for the 18 Pokémon types.
 * Colours follow the familiar community palette; each type also gets a
 * small emoji glyph so effectiveness grids stay scannable at a glance.
 */
export const TYPE_STYLES: Record<string, { color: string; glyph: string }> = {
  normal: { color: "#A8A77A", glyph: "⭐" },
  fire: { color: "#EE8130", glyph: "🔥" },
  water: { color: "#6390F0", glyph: "💧" },
  electric: { color: "#F7D02C", glyph: "⚡" },
  grass: { color: "#7AC74C", glyph: "🌿" },
  ice: { color: "#96D9D6", glyph: "❄️" },
  fighting: { color: "#C22E28", glyph: "🥊" },
  poison: { color: "#A33EA1", glyph: "☠️" },
  ground: { color: "#E2BF65", glyph: "⛰️" },
  flying: { color: "#A98FF3", glyph: "🪽" },
  psychic: { color: "#F95587", glyph: "🔮" },
  bug: { color: "#A6B91A", glyph: "🐛" },
  rock: { color: "#B6A136", glyph: "🪨" },
  ghost: { color: "#735797", glyph: "👻" },
  dragon: { color: "#6F35FC", glyph: "🐉" },
  dark: { color: "#705746", glyph: "🌙" },
  steel: { color: "#B7B7CE", glyph: "⚙️" },
  fairy: { color: "#D685AD", glyph: "✨" },
};

export function typeColor(type: string): string {
  return TYPE_STYLES[type]?.color ?? "#8B94B8";
}
