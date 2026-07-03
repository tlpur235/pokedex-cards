import { NextResponse } from "next/server";

/**
 * POST /api/identify
 * Body: { image: string }  — base64 JPEG (no data-URL prefix)
 * Uses Claude vision to read the card and returns a ScannedCard JSON.
 * The API key stays server-side; the browser never sees it.
 */

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const PROMPT = `You are a Pokémon Trading Card Game expert. Look at this photo of a Pokémon card and identify it.

Respond with ONLY a JSON object, no markdown fences, no other text:
{
  "pokemon": "lowercase species name as used by PokéAPI, e.g. charizard, mr-mime, farfetchd",
  "cardName": "exact card title as printed, e.g. Charizard ex",
  "setName": "set name if identifiable from the symbol or text, else null",
  "cardNumber": "collector number like 4/102 if visible, else null",
  "rarity": "rarity if identifiable, else null",
  "hp": "HP number as printed, else null"
}

If the photo is not a Pokémon card or is unreadable, respond with:
{ "error": "short friendly reason" }`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Scanning is not set up yet. Add ANTHROPIC_API_KEY to your environment, or use search instead.",
      },
      { status: 503 }
    );
  }

  let image: string;
  try {
    ({ image } = await req.json());
    if (!image) throw new Error();
  } catch {
    return NextResponse.json({ error: "No image received." }, { status: 400 });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: image },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "The scanner had trouble. Try again with better lighting." },
      { status: 502 }
    );
  }

  const data = await res.json();
  const text: string = (data.content ?? [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("");

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Couldn't read that card. Hold it flat and fill the frame." },
      { status: 422 }
    );
  }
}
