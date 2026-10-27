"use client";

import { useState } from "react";
import HoleMap from "@/components/HoleMap";
import { getHoleMap } from "@/lib/holeMaps";
import { courses, regionOf } from "@/lib/courses";
import type { HoleInfo } from "@/lib/courseDetails";

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

type Props = {
  name: string;
  /** Tap or hover a hole to see its details, with a hole list under the map. */
  interactive?: boolean;
  /** Hole facts. Only holes the club or an official source states are passed in. */
  holeData?: HoleInfo[];
  /** Club page where the official scorecard lives, if known. */
  scorecardUrl?: string;
  /** Highlight a hole from outside (for example the hole being played). */
  selected?: number | null;
  /** Show the redrawn hole layout under the hole details when we have one. */
  showHoleMap?: boolean;
  /** Course page viewer: hole pills above, one map that swaps between the whole course and the chosen hole. */
  viewer?: boolean;
};

type Pt = { x: number; y: number };
const W = 320, H = 170;

function segDist(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Holes laid out in tidy rows, snaking left to right then back, so the route never crosses itself. */
function layout(holes: number): Pt[] {
  const rows = holes > 9 ? 3 : 2;
  const per = Math.ceil(holes / rows);
  const ys = rows === 3 ? [36, 85, 134] : [50, 120];
  return Array.from({ length: holes }, (_, i) => {
    const r = Math.floor(i / per);
    const k = i % per;
    const count = Math.min(per, holes - r * per);
    const step = count > 1 ? (W - 56) / (count > 1 ? Math.max(per - 1, 1) : 1) : 0;
    const x = r % 2 === 0 ? 28 + k * step : W - 28 - k * step;
    const y = ys[r] + (k % 2 === 0 ? -5 : 5);
    return { x, y };
  });
}

/** Scenery goes only where it will not sit under a hole or the route between holes. */
function scenery(slug: string, pts: Pt[]) {
  const rnd = seed(slug);
  const clear = (p: Pt, r: number) => pts.every((q, i) => Math.hypot(p.x - q.x, p.y - q.y) > r + 14 && (i === 0 || segDist(p, pts[i - 1], q) > r + 10));
  const out: { x: number; y: number; r: number }[] = [];
  for (let n = 0; n < 5; n++) {
    for (let t = 0; t < 40; t++) {
      const r = 5 + rnd() * 5;
      const p = { x: 16 + rnd() * (W - 32), y: 12 + rnd() * (H - 24) };
      if (clear(p, r) && out.every((o) => Math.hypot(p.x - o.x, p.y - o.y) > r + o.r + 6)) {
        out.push({ ...p, r });
        break;
      }
    }
  }
  let water: { x: number; y: number; rx: number; ry: number } | null = null;
  for (let t = 0; t < 60 && !water; t++) {
    const rx = 22 + rnd() * 14, ry = 6 + rnd() * 3;
    const p = { x: 30 + rnd() * (W - 60), y: 14 + rnd() * (H - 28) };
    if (clear(p, Math.max(rx, ry)) && out.every((o) => Math.hypot(p.x - o.x, p.y - o.y) > rx + o.r)) water = { ...p, rx, ry };
  }
  return { bunkers: out, water };
}

function Scorecard({ holes, holeData, sel, pick }: { holes: number; holeData: HoleInfo[]; sel: number | null; pick: (n: number) => void }) {
  const get = (n: number) => holeData.find((h) => h.n === n);
  const halves = holes > 9 ? [[1, 9], [10, holes]] : [[1, holes]];
  const hasM = holeData.some((h) => h.metres);
  return (
    <div className="border-t border-white/10 px-3 py-3">
      <p className="mb-2 text-xs text-white/60">
        Bigger rings are par 5s and smaller rings are par 3s. Lengths are metres from the tees named in the course notes.
      </p>
      <div className="grid gap-3">
        {halves.map(([a, b], i) => {
          const list = Array.from({ length: b - a + 1 }, (_, k) => a + k);
          const par = list.reduce((t, n) => t + (get(n)?.par ?? 0), 0);
          const m = list.reduce((t, n) => t + (get(n)?.metres ?? 0), 0);
          const complete = list.every((n) => get(n)?.par);
          const completeM = list.every((n) => get(n)?.metres);
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full min-w-[22rem] border-collapse text-center text-xs">
                <thead>
                  <tr className="text-white/55">
                    <th className="py-1 pr-2 text-left font-semibold">Hole</th>
                    {list.map((n) => (
                      <th key={n} className="p-0">
                        <button type="button" onClick={() => pick(n)} className={`h-6 w-full font-semibold ${sel === n ? "text-lime" : ""}`}>{n}</button>
                      </th>
                    ))}
                    <th className="pl-2 text-lime">{holes > 9 ? (i === 0 ? "Out" : "In") : "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="py-1 pr-2 text-left text-white/55">Par</td>
                    {list.map((n) => (
                      <td key={n} className={sel === n ? "font-bold text-lime" : ""}>{get(n)?.par ?? "-"}</td>
                    ))}
                    <td className="pl-2 font-bold">{complete ? par : "-"}</td>
                  </tr>
                  {hasM && (
                    <tr className="border-t border-white/10">
                      <td className="py-1 pr-2 text-left text-white/55">Metres</td>
                      {list.map((n) => (
                        <td key={n} className={sel === n ? "font-bold text-lime" : ""}>{get(n)?.metres ?? "-"}</td>
                      ))}
                      <td className="pl-2 font-bold">{completeM ? m : "-"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Stylised, illustrative layout (not a surveyed map). Hole positions are neat rows, not the real routing. */
export default function CourseMap({ name, interactive = false, holeData, scorecardUrl, selected, showHoleMap = false, viewer = false }: Props) {
  const [own, setOwn] = useState<number | null>(null);
  const c = findCourse(name);
  if (!c) return null;
  const sel = selected !== undefined ? selected : own;
  const holes = c.holes;
  const pts = holes ? layout(holes) : [];
  const { bunkers, water } = pts.length
    ? scenery(c.slug, pts)
    : { bunkers: [{ x: 80, y: 38, r: 7 }, { x: 150, y: 28, r: 5 }, { x: 272, y: 112, r: 8 }], water: { x: 200, y: 118, rx: 28, ry: 8 } };
  const d = pts.length
    ? pts.reduce((acc, p, i) => {
        if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        const q = pts[i - 1];
        const sameRow = Math.abs(p.y - q.y) < 30;
        if (sameRow) return `${acc} L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        const bend = p.x > W / 2 ? W - 8 : 8;
        return `${acc} Q${bend},${((p.y + q.y) / 2).toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }, "")
    : "";
  const info = sel ? holeData?.find((h) => h.n === sel) : undefined;
  const holeMapNow = viewer && sel !== null && c.slug ? getHoleMap(c.slug, sel) : undefined;
  const pick = (n: number) => setOwn(n);

  return (
    <div className={viewer ? "" : "overflow-hidden rounded-xl border border-white/15 bg-[#0d2a14]"}>
      {viewer && holes && (
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Holes">
          <button type="button" onClick={() => setOwn(null)} aria-pressed={sel === null} className={`h-9 rounded-full border px-4 text-xs font-bold ${sel === null ? "border-lime bg-lime text-black" : "border-white/25 text-white/85 hover:border-lime"}`}>
            Whole course
          </button>
          {Array.from({ length: holes }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => pick(n)} aria-pressed={sel === n} className={`h-9 w-9 rounded-full border text-xs font-bold ${sel === n ? "border-lime bg-lime text-black" : "border-white/25 text-white/85 hover:border-lime"}`}>
              {n}
            </button>
          ))}
        </div>
      )}
      {holeMapNow && (
        <div>
          <HoleMap data={holeMapNow} className="h-[62vh] max-h-[560px] min-h-[340px]" />
          <p className="mt-2 text-xs text-white/60">Tee at the bottom, green at the top. Layout redrawn for Golf Me and not to survey accuracy.</p>
        </div>
      )}
      <div className={viewer ? "overflow-hidden rounded-xl border border-white/15 bg-[#0d2a14]" : ""} hidden={!!holeMapNow}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Illustrative layout of ${c.name}`}>
        <rect width={W} height={H} fill="#12361b" />
        {water && <ellipse cx={water.x} cy={water.y} rx={water.rx} ry={water.ry} fill="#1e6a8f" opacity=".8" />}
        {bunkers.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#e9d9a6" opacity=".55" />
        ))}
        {pts.length > 0 ? (
          <>
            <path d={d} fill="none" stroke="#4f9a5f" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
            <path d={d} fill="none" stroke="#c6ff3d" strokeWidth="1.2" strokeDasharray="3 4" opacity=".8" />
          </>
        ) : (
          <>
            {/* Hole count not confirmed, so show one tidy example hole instead of a made-up course */}
            <path d="M40,128 C90,120 120,60 270,52" fill="none" stroke="#2f7a47" strokeWidth="26" strokeLinecap="round" />
            <path d="M40,128 C90,120 120,60 270,52" fill="none" stroke="#4f9a5f" strokeWidth="1.2" strokeDasharray="3 4" />
            <rect x="26" y="121" width="16" height="12" rx="2" fill="#4f9a5f" />
            <ellipse cx="274" cy="52" rx="20" ry="16" fill="#3fae60" stroke="#c6ff3d" strokeOpacity=".5" />
            <line x1="274" y1="52" x2="274" y2="30" stroke="#fff" strokeWidth="1.5" />
            <path d="M274,30 l11,4 l-11,4z" fill="#c6ff3d" />
            <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="9" fill="#fff" opacity=".7">Hole by hole map added once the club&apos;s card is confirmed</text>
          </>
        )}
        {pts.map((p, i) => {
          const n = i + 1;
          const on = sel === n;
          const props = interactive
            ? {
                role: "button" as const,
                tabIndex: 0,
                "aria-label": `Hole ${n}`,
                "aria-pressed": on,
                style: { cursor: "pointer" },
                onClick: () => pick(n),
                onMouseEnter: () => setOwn(n),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(n);
                  }
                },
              }
            : {};
          const hp = holeData?.find((h) => h.n === n)?.par;
          const base = hp === 3 ? 5.6 : hp === 5 ? 8 : 6.8;
          return (
            <g key={n} {...props}>
              <circle cx={p.x} cy={p.y} r={on ? base + 2.6 : base} fill={on ? "#c6ff3d" : "#0a0a0a"} stroke="#c6ff3d" strokeWidth={hp === 5 ? 1.8 : 1} />
              <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontSize={on ? 8.5 : 7.5} fontWeight="700" fill={on ? "#000" : "#c6ff3d"}>
                {n}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {viewer && (
        <div className="mt-3 text-sm" aria-live="polite">
          {sel === null ? (
            <p className="text-white/70">Tap a hole to see it up close.</p>
          ) : (
            <p>
              <span className="font-display text-xl text-lime">Hole {sel}</span>
              {info && (info.par || info.metres) ? <span className="ml-2 text-white/85">{info.par ? `Par ${info.par}` : ""}{info.par && info.metres ? " · " : ""}{info.metres ? `${info.metres} m` : ""}{info.note ? ` · ${info.note}` : ""}</span> : null}
            </p>
          )}
        </div>
      )}

      {!viewer && interactive && holes && (
        <div className="border-t border-white/10 px-3 py-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Holes">
            {Array.from({ length: holes }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => pick(n)}
                aria-pressed={sel === n}
                className={`h-8 w-8 rounded-full border text-xs font-bold ${sel === n ? "border-lime bg-lime text-black" : "border-white/25 text-white/85 hover:border-lime"}`}
              >
                {n}
              </button>
            ))}
          </div>
          {sel !== null && selected === undefined && (
            <button type="button" onClick={() => setOwn(null)} className="mt-3 rounded-full border border-lime/70 px-4 py-1.5 text-sm font-semibold text-lime hover:bg-lime hover:text-black">
              View whole course
            </button>
          )}
          {showHoleMap && sel !== null && getHoleMap(c.slug, sel) && (
            <div className="mt-3">
              <HoleMap data={getHoleMap(c.slug, sel)!} className="h-[56vh] max-h-[520px] min-h-[320px]" />
              <p className="mt-1 text-xs text-white/55">Layout redrawn for Golf Me, tee at the bottom. Not to survey accuracy.</p>
            </div>
          )}
          <div className="mt-3 min-h-[3.25rem] text-sm" aria-live="polite">
            {sel === null ? (
              <p className="text-white/65">Tap a hole to see its details.</p>
            ) : (
              <div>
                <p className="font-display text-xl text-lime">Hole {sel}</p>
                {info && (info.par || info.metres) ? (
                  <p className="text-white/85">
                    {info.par ? `Par ${info.par}` : ""}
                    {info.par && info.metres ? " · " : ""}
                    {info.metres ? `${info.metres} m` : ""}
                    {info.note ? ` · ${info.note}` : ""}
                  </p>
                ) : (
                  <p className="text-white/70">
                    Par and length for this hole are on the club&apos;s scorecard.
                    {scorecardUrl && (
                      <>
                        {" "}
                        <a href={scorecardUrl} target="_blank" rel="noopener" className="text-lime underline-offset-4 hover:underline">
                          Open the club site
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!viewer && interactive && holes && holeData && holeData.length > 0 && <Scorecard holes={holes} holeData={holeData} sel={sel} pick={pick} />}

      {!viewer && (
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 text-xs text-white/75">
        <span className="font-semibold text-white">{c.name}</span>
        <span>
          {c.suburb} &middot; {regionOf(c)}
          {holes ? ` · ${holes} holes` : ""}
          {c.par ? ` · Par ${c.par}` : ""}
        </span>
        <span className="text-white/45">Illustrative layout, not to scale</span>
      </div>
      )}
    </div>
  );
}
