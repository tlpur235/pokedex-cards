/** Shared data shapes used across the app. */

export interface StatBlock {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface AbilityInfo {
  name: string;
  isHidden: boolean;
  description: string;
}

export interface EvolutionNode {
  name: string;
  id: number;
  artwork: string;
}

export interface Effectiveness {
  weaknesses: string[]; // takes >1x damage from these types
  resistances: string[]; // takes <1x damage
  immunities: string[]; // takes 0x damage
  strongAgainst: string[]; // its own attacks hit these types for 2x
}

/** Everything the Pokédex screen needs about one Pokémon. */
export interface DexData {
  id: number;
  name: string;
  genus: string; // e.g. "Mouse Pokémon"
  types: string[];
  heightM: number;
  weightKg: number;
  generation: string; // e.g. "Generation I"
  region: string; // e.g. "Kanto"
  artwork: string;
  stats: StatBlock;
  abilities: AbilityInfo[];
  evolutionLine: EvolutionNode[];
  evolvesFrom: string | null;
  evolvesInto: string[];
  evolutionStage: string; // "Basic" | "Stage 1" | "Stage 2"
  effectiveness: Effectiveness;
  flavor: string; // official flavour text, used as AI fallback
  habitat: string | null;
}

/** What the scanner (Claude vision) extracts from a card photo. */
export interface ScannedCard {
  pokemon: string; // lowercase species name, e.g. "charizard"
  cardName: string;
  setName: string | null;
  cardNumber: string | null;
  rarity: string | null;
  hp: string | null;
}

/** A card record from the Pokémon TCG API. */
export interface TcgCard {
  id: string;
  name: string;
  number: string;
  setName: string;
  releaseYear: string;
  rarity: string | null;
  hp: string | null;
  image: string;
  attacks: { name: string; damage: string; text: string; cost: string[] }[];
  weaknesses: { type: string; value: string }[];
  retreatCost: number;
  illustrator: string | null;
}
