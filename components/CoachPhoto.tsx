/**
 * Holding image for a coach. Replace with the coach's own photo once they upload one.
 * Each coach gets a slightly different contour pattern so the cards don't look identical.
 */
export default function CoachPhoto({ slug }: { slug: string }) {
  const hash = Array.from(slug).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const shift = ((hash % 5) - 2) * 22;
  const id = `ph-${slug}`;

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-[#0b0d08]">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={id} cx="50%" cy="38%" r="80%">
            <stop offset="0" stopColor="#27340f" />
            <stop offset="1" stopColor="#0b0d08" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${id})`} />
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse
            key={i}
            cx={200 + shift}
            cy={340}
            rx={90 + i * 52}
            ry={60 + i * 30}
            fill="none"
            stroke="#c6ff3d"
            strokeOpacity={0.2 - i * 0.025}
            strokeWidth={1.2}
          />
        ))}
        <g fill="#f2f2ee" fillOpacity={0.16}>
          <circle cx={200} cy={116} r={38} />
          <path d="M120 300 C120 222 158 176 200 176 C242 176 280 222 280 300 Z" />
        </g>
      </svg>
    </div>
  );
}
