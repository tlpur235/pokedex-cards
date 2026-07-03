import type { Metadata } from "next";
import Scanner from "@/components/Scanner";

export const metadata: Metadata = { title: "Scan a card · Pokédex Cards" };

export default function ScanPage() {
  return (
    <div className="space-y-4 pt-6">
      <h1 className="text-center font-display text-2xl font-bold">
        Scan a card
      </h1>
      <Scanner />
    </div>
  );
}
