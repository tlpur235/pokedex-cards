# Pokédex Cards

Your Pokédex for Pokémon cards. Point your phone camera at any Pokémon card and instantly open a rich Pokédex page for the Pokémon on it: artwork, stats, abilities, type matchups, evolution line, an AI-written Pokédex entry, and details about the card itself.

Built with Next.js 14, React, TypeScript and Tailwind CSS. Installable as a Progressive Web App. Data comes live from [PokéAPI](https://pokeapi.co) and the [Pokémon TCG API](https://pokemontcg.io); card recognition and AI entries use the Anthropic API.

## How it works

1. **Scan** — the camera frame is sent to `/api/identify`, where Claude reads the card and returns the Pokémon's name plus card details (set, number, rarity, HP).
2. **Look up** — the browser fetches everything about that Pokémon from PokéAPI (stats, abilities, evolution chain, type matchups) and the closest matching card from the Pokémon TCG API.
3. **Discover** — the Pokédex screen renders with animated stat bars and a fresh AI Pokédex entry from `/api/dex-entry`.

No Pokémon data is invented: everything on screen comes from the APIs, and the AI entry is generated from PokéAPI facts.

## Folder structure

```
pokedex-cards/
├── app/
│   ├── layout.tsx              # Shell: header, fonts, metadata, PWA
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Design tokens & signature styles
│   ├── scan/page.tsx           # Camera scanning screen
│   ├── pokemon/[name]/page.tsx # The Pokédex screen
│   └── api/
│       ├── identify/route.ts   # Claude vision: photo → card details
│       └── dex-entry/route.ts  # Claude: facts → ~100 word entry
├── components/                 # Reusable UI (Scanner, StatBars, …)
├── lib/                        # PokéAPI / TCG API clients, types
├── public/                     # Icons, OG image, manifest, service worker
└── assets/                     # SVG sources for the brand assets
```

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
cp .env.example .env.local     # then paste your keys into .env.local
npm run dev
```

Open http://localhost:3000. Note that phone cameras require HTTPS, so on localhost use the **Upload a photo** button or name search; the live camera works once deployed.

## Environment variables

| Variable | Required | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | For scanning + AI entries | Create one at console.anthropic.com → API Keys |
| `POKEMON_TCG_API_KEY` | Optional | Higher rate limits for card lookups (free at dev.pokemontcg.io) |

Without an Anthropic key the app still works: search by name, and the official Pokédex flavour text stands in for the AI entry.

## Deploying for the first time

### 1. Create a GitHub repository

1. Sign in at github.com and click the **+** in the top right → **New repository**.
2. Name it `pokedex-cards`, leave it empty (no README or .gitignore — this project has them), and click **Create repository**.

### 2. Upload the project

In a terminal, inside the `pokedex-cards` folder:

```bash
git init
git add .
git commit -m "Pokédex Cards v1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pokedex-cards.git
git push -u origin main
```

(Replace `YOUR-USERNAME`. Git will ask you to sign in the first time.)

### 3. Deploy to Vercel

Vercel is made by the Next.js team and the free tier is plenty.

1. Go to vercel.com and sign up **with your GitHub account**.
2. Click **Add New → Project**, find `pokedex-cards` in the list, and click **Import**.
3. Before deploying, open **Environment Variables** and add `ANTHROPIC_API_KEY` with your key (and `POKEMON_TCG_API_KEY` if you have one).
4. Click **Deploy**. About a minute later you'll get a live URL like `pokedex-cards.vercel.app` — open it on your phone and the camera scanner will work, since Vercel serves it over HTTPS.

### 4. Updating the site

Any push to `main` redeploys automatically:

```bash
git add .
git commit -m "Describe your change"
git push
```

Vercel rebuilds and the live site updates in about a minute.

## What to connect later

- **Anthropic API key** — required for scanning; everything else works without it.
- **Pokémon TCG API key** — optional; add it if card lookups start rate-limiting.
- **Custom domain** — add one in Vercel → Settings → Domains whenever you like.

## Credits

Pokémon data © PokéAPI contributors. Card data © Pokémon TCG API. Pokémon and Pokémon character names are trademarks of Nintendo/Creatures Inc./GAME FREAK inc. This is a fan-made educational project.
