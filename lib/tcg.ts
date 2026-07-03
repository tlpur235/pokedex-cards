import type { ScannedCard, TcgCard } from "./types";

/**
 * Pokémon TCG API client (https://pokemontcg.io).
 * Given what the scanner read off the card, find the closest matching
 * card record for the official image, attacks, rarity and illustrator.
 * Works without a key; POKEMON_TCG_API_KEY just raises rate limits.
 */

const API = "https://api.pokemontcg.io/v2/cards";

function toTcgCard(c: any): TcgCard {
  return {
    id: c.id,
    name: c.name,
    number: c.number ? `${c.number}/${c.set?.printedTotal ?? "?"}` : "—",
    setName: c.set?.name ?? "Unknown set",
    releaseYear: c.set?.releaseDate?.slice(0, 4) ?? "—",
    rarity: c.rarity ?? null,
    hp: c.hp ?? null,
    image: c.images?.large ?? c.images?.small ?? "",
    attacks: (c.attacks ?? []).map((a: any) => ({
      name: a.name,
      damage: a.damage || "—",
      text: a.text || "",
      cost: a.cost ?? [],
    })),
    weaknesses: c.weaknesses ?? [],
    retreatCost: c.convertedRetreatCost ?? 0,
    illustrator: c.artist ?? null,
  };
}

/** Search for the scanned card, from most to least specific query. */
export async function findCard(scan: ScannedCard): Promise<TcgCard | null> {
  const name = scan.cardName || scan.pokemon;
  const queries: string[] = [];

  if (scan.setName && scan.cardNumber) {
    const num = scan.cardNumber.split("/")[0];
    queries.push(`name:"${name}" set.name:"${scan.setName}" number:${num}`);
  }
  if (scan.setName) queries.push(`name:"${name}" set.name:"${scan.setName}"`);
  if (scan.hp) queries.push(`name:"${name}" hp:${scan.hp}`);
  queries.push(`name:"${name}"`);

  for (const q of queries) {
    try {
      const res = await fetch(
        `${API}?q=${encodeURIComponent(q)}&pageSize=1&orderBy=-set.releaseDate`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.data?.length) return toTcgCard(data.data[0]);
    } catch {
      // Network hiccup — try the next, broader query.
    }
  }
  return null;
}
