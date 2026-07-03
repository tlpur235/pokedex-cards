import Link from "next/link";
import SearchBox from "@/components/SearchBox";

/**
 * Homepage: hero with the tagline, a big scan CTA, a three-step
 * explainer, and a mock-up of the scanning experience.
 */
export default function Home() {
  return (
    <div className="space-y-10 pt-10">
      {/* Hero */}
      <section className="animate-pop text-center">
        <span className="dex-lens mx-auto block h-24 w-24 animate-lens" />
        <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
          Pokédex <span className="text-dexred">Cards</span>
        </h1>
        <p className="mt-2 text-lg text-faded">
          Your Pokédex for Pokémon cards.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3">
          <Link
            href="/scan"
            className="rounded-full bg-dexred px-10 py-4 font-display text-lg font-bold text-white shadow-lg shadow-dexred/30 transition hover:brightness-110 active:scale-95"
          >
            Scan a card
          </Link>
          <span className="text-sm text-faded">or search by name below</span>
        </div>
        <div className="mx-auto mt-4 max-w-sm">
          <SearchBox />
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { glyph: "📷", title: "Point", text: "Aim your camera at any Pokémon card." },
          { glyph: "⚡", title: "Scan", text: "The card is identified in seconds." },
          { glyph: "📖", title: "Discover", text: "A full Pokédex page opens instantly." },
        ].map((step) => (
          <div key={step.title} className="panel p-5 text-center">
            <span className="text-3xl" aria-hidden="true">{step.glyph}</span>
            <h2 className="mt-2 font-display text-lg font-bold">{step.title}</h2>
            <p className="mt-1 text-sm text-faded">{step.text}</p>
          </div>
        ))}
      </section>

      {/* Scan mock-up */}
      <section className="panel mx-auto max-w-xs overflow-hidden">
        <div className="relative aspect-[3/4] bg-gradient-to-b from-[#101735] to-[#0B1020]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* A stylised card inside the scan frame */}
            <div className="relative flex h-[68%] w-[70%] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-beam/80 bg-panel">
              <span className="absolute left-3 right-3 h-0.5 animate-beam rounded bg-beam shadow-[0_0_12px_2px_rgba(79,209,224,0.8)]" />
              <span className="text-5xl" aria-hidden="true">⚡</span>
              <span className="rounded-full bg-spark px-3 py-1 font-display text-xs font-bold text-ink">
                Pikachu · found!
              </span>
            </div>
          </div>
        </div>
        <p className="px-5 py-4 text-center text-sm text-faded">
          Scanning feels like reading a QR code — quick, smooth, almost instant.
        </p>
      </section>
    </div>
  );
}
