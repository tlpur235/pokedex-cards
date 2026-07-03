import { NextResponse } from "next/server";

/**
 * POST /api/dex-entry
 * Body: facts about the Pokémon gathered from PokéAPI.
 * Returns { entry } — a ~100 word Pokédex entry written by Claude.
 * Falls back gracefully (client shows official flavour text) if no key.
 */

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI entries not configured." }, { status: 503 });
  }

  const facts = await req.json();

  const prompt = `Write a modern Pokédex entry of about 100 words for ${facts.name}.

Facts (do not contradict these):
- Category: ${facts.genus}
- Types: ${facts.types?.join(", ")}
- Abilities: ${facts.abilities?.join("; ")}
- Habitat: ${facts.habitat ?? "unknown"}
- Official entry: "${facts.flavor}"

Cover: what makes it unique, its signature ability, how it behaves, where it's commonly found, and one surprising fact. Tone: fun and exciting, like a nature show host — not encyclopaedic. Respond with the entry text only.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Entry generation failed." }, { status: 502 });
  }

  const data = await res.json();
  const entry = (data.content ?? [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("")
    .trim();

  return NextResponse.json({ entry });
}
