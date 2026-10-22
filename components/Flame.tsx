export default function Flame({ lit, className = "h-20 w-16" }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 48 64" className={`${className} ${lit ? "flame-flicker" : ""}`} aria-hidden="true">
      <path
        d="M24 2c2 12 16 18 16 36a16 16 0 0 1-32 0c0-8 4-12 7-16 1 5 3 7 6 8-3-12 0-20 3-28z"
        fill={lit ? "#c6ff3d" : "#2a2a2a"}
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M24 30c1 6 8 9 8 17a8 8 0 0 1-16 0c0-4 3-6 4-9 2 2 3 2 4 2z"
        fill={lit ? "#fff" : "#3a3a3a"}
        opacity={lit ? 0.85 : 1}
      />
    </svg>
  );
}
