"use client";

import { useState } from "react";
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
};

/** Stylised, illustrative layout (not a surveyed map). Shape is generated from the course name. */
export default function CourseMap({ name, interactive = false, holeData, scorecardUrl }: Props) {
  const [sel, setSel] = useState<number | null>(null);
  const c = findCourse(name);
  if (!c) return null;
  const holes = c.holes; // unknown hole counts are not drawn
  const rnd = seed(c.slug);
  const W = 320, H = 170;
  const pts = holes
    ? Array.from({ length: holes }, (_, i) => {
        const t = i / Math.max(holes - 1, 1);
        const row = i < holes / 2 ? 0 : 1;
        const k = row === 0 ? i / (holes / 2) : 1 - (i - holes / 2) / (holes / 2);
        return { x: 22 + k * (W - 44) + (rnd() - 0.5) * 14, y: (row === 0 ? 48 : 118) + (rnd() - 0.5) * 30 + Math.sin(t * 6) * 6 };
      })
    : [];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const blobs = Array.from({ length: 5 }, () => ({ x: 20 + rnd() * (W - 40), y: 15 + rnd() * (H - 30), r: 6 + rnd() * 9 }));
  const water = { x: 40 + rnd() * (W - 120), y: 76 + rnd() * 10, rx: 28 + rnd() * 20, ry: 7 + rnd() * 5 };
  const info = sel ? holeData?.find((h) => h.n === sel) : undefined;
  const pick = (n: number) => setSel(n);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-[#0d2a14]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Illustrative layout of ${c.name}`}>
        <rect width={W} height={H} fill="#12361b" />
        <ellipse cx={water.x} cy={water.y} rx={water.rx} ry={water.ry} fill="#1e6a8f" opacity=".8" />
        {blobs.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#e9d9a6" opacity=".55" />
        ))}
        {pts.length > 0 && (
          <>
            <path d={d} fill="none" stroke="#4f9a5f" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
            <path d={d} fill="none" stroke="#c6ff3d" strokeWidth="1.2" strokeDasharray="3 4" opacity=".8" />
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
                onMouseEnter: () => setSel(n),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(n);
                  }
                },
              }
            : {};
          return (
            <g key={n} {...props}>
              <circle cx={p.x} cy={p.y} r={on ? 9 : 6.5} fill={on ? "#c6ff3d" : "#0a0a0a"} stroke="#c6ff3d" strokeWidth="1" />
              <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontSize={on ? 8.5 : 7.5} fontWeight="700" fill={on ? "#000" : "#c6ff3d"}>
                {n}
              </text>
            </g>
          );
        })}
      </svg>

      {interactive && holes && (
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

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 text-xs text-white/75">
        <span className="font-semibold text-white">{c.name}</span>
        <span>
          {c.suburb} &middot; {regionOf(c)}
          {holes ? ` · ${holes} holes` : ""}
          {c.par ? ` · Par ${c.par}` : ""}
        </span>
        <span className="text-white/45">Illustrative layout, not to scale</span>
      </div>
    </div>
  );
}
