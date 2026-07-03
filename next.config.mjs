/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fonts load via <link> at runtime; skip build-time font inlining.
  optimizeFonts: false,
  images: {
    // Pokémon artwork and card scans come from these public CDNs.
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.pokemontcg.io" },
    ],
  },
};
export default nextConfig;
