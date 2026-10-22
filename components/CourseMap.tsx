import { courses, regionOf } from "@/lib/courses";

function seed(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0), (h % 10000) / 10000);
}

export function findCourse(name: string) {
  const norm = (x: string) => x.toLowerCase().replace(/golf (club|course|links)|golf$|\bclub\b|[^a-z ]/g, "").replace(/\s+/g, " ").trim();
  const n = norm(name);
  return n.length > 2 ? courses.find((c) => norm(c.name) === n) : undefined;
}

/** Stylised, illustrative layout (not a surveyed map). Shape is generated from the course name. */
export default function CourseMap({ name }: { name: string }) {
  const c = findCourse(name);
  if (!c) return null;
  const holes = c.holes ?? 18;
  const rnd = seed(c.slug);
  const W = 320, H = 170;
  const pts = Array.from({ length: holes }, (_, i) => {
    const t = i / Math.max(holes - 1, 1);
    const row = i < holes / 2 ? 0 : 1;
    const k = row === 0 ? i / (holes / 2) : 1 - (i - holes / 2) / (holes / 2);
    return { x: 22 + k * (W - 44) + (rnd() - 0.5) * 14, y: (row === 0 ? 48 : 118) + (rnd() - 0.5) * 30 + Math.sin(t * 6) * 6 };
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const blobs = Array.from({ length: 5 }, () => ({ x: 20 + rnd() * (W - 40), y: 15 + rnd() * (H - 30), r: 6 + rnd() * 9 }));
  const water = { x: 40 + rnd() * (W - 120), y: 76 + rnd() * 10, rx: 28 + rnd() * 20, ry: 7 + rnd() * 5 };
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-[#0d2a14]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Illustrative layout of ${c.name}`}>
        <rect width={W} height={H} fill="#12361b" />
        <ellipse cx={water.x} cy={water.y} rx={water.rx} ry={water.ry} fill="#1e6a8f" opacity=".8" />
        {blobs.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#e9d9a6" opacity=".55" />
        ))}
        <path d={d} fill="none" stroke="#4f9a5f" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
        <path d={d} fill="none" stroke="#c6ff3d" strokeWidth="1.2" strokeDasharray="3 4" opacity=".8" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6.5" fill="#0a0a0a" stroke="#c6ff3d" strokeWidth="1" />
            <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#c6ff3d">{i + 1}</text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 text-xs text-white/75">
        <span className="font-semibold text-white">{c.name}</span>
        <span>
          {c.suburb} &middot; {regionOf(c)} &middot; {holes} holes{c.par ? ` · Par ${c.par}` : ""}
        </span>
        <span className="text-white/45">Illustrative layout</span>
      </div>
    </div>
  );
}
