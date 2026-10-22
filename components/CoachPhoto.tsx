import Image from "next/image";

/**
 * Round coach photo. Uses the coach's own photo when there is one, otherwise a holding
 * image. Each coach gets a slightly different contour pattern so cards don't look identical.
 * Size and position come from the className passed in.
 */
export default function CoachPhoto({
  slug,
  name,
  photo,
  className = "",
}: {
  slug: string;
  name: string;
  photo?: string;
  className?: string;
}) {
  const frame = `relative overflow-hidden rounded-full bg-[#0b0d08] ring-1 ring-white/25 ${className}`;

  if (photo) {
    return (
      <div className={frame}>
        <Image
          src={photo}
          alt={`${name}, golf coach`}
          fill
          sizes="(min-width: 640px) 120px, 64px"
          className="object-cover object-[50%_35%]"
        />
      </div>
    );
  }

  const hash = Array.from(slug).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const shift = ((hash % 5) - 2) * 14;
  const id = `ph-${slug}`;

  return (
    <div className={frame}>
      <svg
        viewBox="0 0 300 300"
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
        <rect width="300" height="300" fill={`url(#${id})`} />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse
            key={i}
            cx={150 + shift}
            cy={330}
            rx={70 + i * 42}
            ry={50 + i * 26}
            fill="none"
            stroke="#c6ff3d"
            strokeOpacity={0.24 - i * 0.03}
            strokeWidth={1.4}
          />
        ))}
        <g fill="#f2f2ee" fillOpacity={0.18}>
          <circle cx={150} cy={118} r={42} />
          <path d="M62 300 C62 226 102 180 150 180 C198 180 238 226 238 300 Z" />
        </g>
      </svg>
    </div>
  );
}
