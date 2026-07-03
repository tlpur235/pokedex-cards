import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import Logo from "@/components/Logo";
import ServiceWorker from "@/components/ServiceWorker";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL in Vercel once you know your live URL so
  // link previews (LinkedIn, Discord, iMessage) resolve the OG image.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pokedex-cards.vercel.app"
  ),
  title: "Pokédex Cards",
  description:
    "Your Pokédex for Pokémon cards. Scan any card and instantly meet the Pokémon on it.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/favicon.png", apple: "/icons/icon-192.png" },
  openGraph: {
    title: "Pokédex Cards",
    description: "Your Pokédex for Pokémon cards.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokédex Cards",
    description: "Your Pokédex for Pokémon cards.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Chakra Petch (display) + Inter (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">
        <header className="sticky top-0 z-40 border-b border-edge/70 bg-ink/85 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={30} />
              <span className="font-display text-lg font-bold tracking-wide">
                Pokédex <span className="text-dexred">Cards</span>
              </span>
            </Link>
            <Link
              href="/scan"
              className="rounded-full bg-dexred px-4 py-1.5 font-display text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
            >
              Scan card
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 pb-16">{children}</main>
        <ServiceWorker />
      </body>
    </html>
  );
}
