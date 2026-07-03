import type {
  AbilityInfo,
  DexData,
  Effectiveness,
  EvolutionNode,
} from "./types";

/**
 * PokéAPI client (runs in the browser).
 * Assembles everything the Pokédex screen needs in a handful of
 * parallel requests: species, stats, abilities, evolution chain and
 * combined type matchups. No data is invented — it all comes from
 * https://pokeapi.co.
 */

const API = "https://pokeapi.co/api/v2";

const GENERATION_REGIONS: Record<string, string> = {
  "generation-i": "Kanto",
  "generation-ii": "Johto",
  "generation-iii": "Hoenn",
  "generation-iv": "Sinnoh",
  "generation-v": "Unova",
  "generation-vi": "Kalos",
  "generation-vii": "Alola",
  "generation-viii": "Galar",
  "generation-ix": "Paldea",
};

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokéAPI request failed (${res.status})`);
  return res.json() as Promise<T>;
}

/** Pull the English short description for one ability. */
async function fetchAbility(
  name: string,
  isHidden: boolean,
  url: string
): Promise<AbilityInfo> {
  try {
    const data = await getJson<any>(url);
    const entry =
      data.effect_entries?.find((e: any) => e.language.name === "en")
        ?.short_effect ??
      data.flavor_text_entries?.find((e: any) => e.language.name === "en")
        ?.flavor_text ??
      "";
    return {
      name: titleCase(name),
      isHidden,
      description: entry.replace(/\s+/g, " ").trim(),
    };
  } catch {
    return { name: titleCase(name), isHidden, description: "" };
  }
}

/**
 * Combine damage relations across the Pokémon's types into overall
 * multipliers, then bucket into weaknesses / resistances / immunities.
 */
async function fetchEffectiveness(types: string[]): Promise<Effectiveness> {
  const relations = await Promise.all(
    types.map((t) => getJson<any>(`${API}/type/${t}`))
  );

  const multipliers: Record<string, number> = {};
  const bump = (type: string, factor: number) => {
    multipliers[type] = (multipliers[type] ?? 1) * factor;
  };

  const strong = new Set<string>();
  for (const rel of relations) {
    rel.damage_relations.double_damage_from.forEach((t: any) => bump(t.name, 2));
    rel.damage_relations.half_damage_from.forEach((t: any) => bump(t.name, 0.5));
    rel.damage_relations.no_damage_from.forEach((t: any) => bump(t.name, 0));
    rel.damage_relations.double_damage_to.forEach((t: any) => strong.add(t.name));
  }

  const weaknesses: string[] = [];
  const resistances: string[] = [];
  const immunities: string[] = [];
  for (const [type, m] of Object.entries(multipliers)) {
    if (m === 0) immunities.push(type);
    else if (m > 1) weaknesses.push(type);
    else if (m < 1) resistances.push(type);
  }
  return { weaknesses, resistances, immunities, strongAgainst: Array.from(strong) };
}

/** Flatten the (possibly branching) evolution chain into display order. */
function flattenChain(chain: any): { name: string; id: number }[] {
  const out: { name: string; id: number }[] = [];
  const walk = (node: any) => {
    const id = Number(node.species.url.split("/").filter(Boolean).pop());
    out.push({ name: node.species.name, id });
    node.evolves_to.forEach(walk);
  };
  walk(chain);
  return out;
}

/** Direct next evolutions for the scanned species (handles branches like Eevee). */
function directEvolutions(chain: any, species: string): string[] {
  let found: string[] = [];
  const walk = (node: any) => {
    if (node.species.name === species) {
      found = node.evolves_to.map((n: any) => n.species.name);
      return;
    }
    node.evolves_to.forEach(walk);
  };
  walk(chain);
  return found;
}

/** Depth of the species within its chain → Basic / Stage 1 / Stage 2. */
function evolutionStage(chain: any, species: string): string {
  let stage = 0;
  const walk = (node: any, depth: number) => {
    if (node.species.name === species) stage = depth;
    node.evolves_to.forEach((n: any) => walk(n, depth + 1));
  };
  walk(chain, 0);
  return stage === 0 ? "Basic" : `Stage ${stage}`;
}

/** Main entry point: build the full Pokédex record for one species. */
export async function fetchDexData(nameOrId: string): Promise<DexData> {
  const key = nameOrId.toLowerCase().trim().replace(/\s+/g, "-");
  const pokemon = await getJson<any>(`${API}/pokemon/${key}`);
  const species = await getJson<any>(pokemon.species.url);

  const types: string[] = pokemon.types.map((t: any) => t.type.name);

  const statOf = (name: string) =>
    pokemon.stats.find((s: any) => s.stat.name === name)?.base_stat ?? 0;

  const [abilities, effectiveness, evoChainData] = await Promise.all([
    Promise.all(
      pokemon.abilities.map((a: any) =>
        fetchAbility(a.ability.name, a.is_hidden, a.ability.url)
      )
    ),
    fetchEffectiveness(types),
    getJson<any>(species.evolution_chain.url),
  ]);

  const line = flattenChain(evoChainData.chain);
  const evolutionLine: EvolutionNode[] = line.map((n) => ({
    ...n,
    artwork: artworkUrl(n.id),
  }));

  const genus =
    species.genera?.find((g: any) => g.language.name === "en")?.genus ??
    "Pokémon";

  const flavor = (
    species.flavor_text_entries?.find((f: any) => f.language.name === "en")
      ?.flavor_text ?? ""
  ).replace(/[\n\f]/g, " ");

  const generationSlug: string = species.generation?.name ?? "generation-i";

  return {
    id: pokemon.id,
    name: titleCase(species.name),
    genus,
    types,
    heightM: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    generation: titleCase(generationSlug).replace(/ (\w+)$/, (m) =>
      m.toUpperCase()
    ),
    region: GENERATION_REGIONS[generationSlug] ?? "Unknown",
    artwork:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ??
      artworkUrl(pokemon.id),
    stats: {
      hp: statOf("hp"),
      attack: statOf("attack"),
      defense: statOf("defense"),
      specialAttack: statOf("special-attack"),
      specialDefense: statOf("special-defense"),
      speed: statOf("speed"),
    },
    abilities,
    evolutionLine,
    evolvesFrom: species.evolves_from_species?.name ?? null,
    evolvesInto: directEvolutions(evoChainData.chain, species.name),
    evolutionStage: evolutionStage(evoChainData.chain, species.name),
    effectiveness,
    flavor,
    habitat: species.habitat?.name ?? null,
  };
}
