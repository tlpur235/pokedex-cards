/** App logo: the "Dex lens" — a Pokédex camera light. Pure SVG, no assets. */
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#EF3E4A" />
      <circle cx="32" cy="32" r="19" fill="#EEF7FF" />
      <circle cx="32" cy="32" r="15" fill="url(#lensShine)" />
      <circle cx="26" cy="25" r="5" fill="#BDF3FB" opacity="0.9" />
      <defs>
        <radialGradient id="lensShine" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#8FE7F2" />
          <stop offset="55%" stopColor="#2FA7BE" />
          <stop offset="100%" stopColor="#0D4B5C" />
        </radialGradient>
      </defs>
    </svg>
  );
}
