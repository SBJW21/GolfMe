import { areaOfSuburb } from "@/lib/areas";
import {
  AREA_CELLS,
  AREA_POINTS,
  BOTANY_PATH,
  HARBOUR_PATH,
  LAND_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  RIVERS,
} from "@/lib/mapData";
import PinMark from "./PinMark";

const WATER = "#07101c";
const LAND = "#141c0d";
const LIME = "198,255,61";

/**
 * General area only. Shows the Golf Me Sydney map zoomed to the area a coach teaches in, using the
 * same shapes as the search map. It never shows an exact address.
 */
export default function CoachAreaMap({ suburb }: { suburb: string }) {
  const area = areaOfSuburb(suburb);
  const point = area ? AREA_POINTS[area.id] : undefined;
  const cell = area ? AREA_CELLS[area.id] : undefined;
  if (!area || !point || !cell) return null;

  const w = 560;
  const h = 370;
  const x = Math.min(Math.max(point[0] - w / 2, 0), MAP_WIDTH - w);
  const y = Math.min(Math.max(point[1] - h / 2, 0), MAP_HEIGHT - h);
  const px = ((point[0] - x) / w) * 100;
  const py = ((point[1] - y) / h) * 100;

  return (
    <section className="mt-10">
      <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Where {suburb} is</h2>
      <p className="mt-1 text-sm text-white/70">General area only: {area.label}</p>
      <div
        className="relative mt-4 overflow-hidden rounded-2xl border border-white/15"
        style={{ background: WATER }}
      >
        <svg
          viewBox={`${x} ${y} ${w} ${h}`}
          role="img"
          aria-label={`Map of the ${area.label} area in Sydney`}
          className="block h-auto w-full"
        >
          <defs>
            <clipPath id="ca-land">
              <path d={LAND_PATH} />
            </clipPath>
          </defs>
          <rect x={x} y={y} width={w} height={h} fill={WATER} />
          <path d={LAND_PATH} fill={LAND} stroke={`rgba(${LIME},0.55)`} strokeWidth="2" />
          <g clipPath="url(#ca-land)">
            <path d={cell} fill={`rgba(${LIME},0.28)`} stroke={`rgb(${LIME})`} strokeWidth="2" strokeLinejoin="round" />
          </g>
          {RIVERS.map((r, i) => (
            <path key={i} d={r.d} fill="none" stroke={WATER} strokeWidth={r.w} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          <path d={BOTANY_PATH} fill={WATER} stroke={`rgba(${LIME},0.4)`} strokeWidth="1.5" />
          <path d={HARBOUR_PATH} fill={WATER} stroke={`rgba(${LIME},0.4)`} strokeWidth="1.5" />
        </svg>
        <div className="absolute" style={{ left: `${px}%`, top: `${py}%` }}>
          <PinMark className="h-9 w-7 -translate-x-1/2 -translate-y-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" />
        </div>
      </div>
    </section>
  );
}
