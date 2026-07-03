import type { Config } from "tailwindcss";

/**
 * Pokédex Cards design tokens.
 * "Midnight Dex" palette: deep-space navy surfaces with Pokédex-red,
 * spark-yellow and scanner-cyan accents.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1020",        // page background
        panel: "#151B30",      // card surfaces
        edge: "#242D4C",       // borders
        dexred: "#EF3E4A",     // Pokédex shell red
        spark: "#FFCB3E",      // Pikachu-spark yellow
        beam: "#4FD1E0",       // scanner beam cyan
        mist: "#EDF0FA",       // primary text
        faded: "#8B94B8"       // secondary text
      },
      fontFamily: {
        display: ["'Chakra Petch'", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: { card: "1.5rem" },
      keyframes: {
        lens: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79,209,224,0.55)" },
          "70%": { boxShadow: "0 0 0 18px rgba(79,209,224,0)" }
        },
        beam: {
          "0%": { top: "6%" },
          "50%": { top: "88%" },
          "100%": { top: "6%" }
        },
        pop: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        grow: { from: { width: "0%" } }
      },
      animation: {
        lens: "lens 1.8s ease-out infinite",
        beam: "beam 2.4s ease-in-out infinite",
        pop: "pop .35s cubic-bezier(.2,.9,.3,1.2) both",
        grow: "grow .9s cubic-bezier(.3,.8,.3,1) both"
      }
    }
  },
  plugins: []
};
export default config;
