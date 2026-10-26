"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HoleMapData } from "@/lib/holeMaps";

type P = [number, number];
export type HoleMarkPt = { pos?: P; cum: number };
export type TapResult = { pos: P; metres: number; along: number };

type Props = {
  data: HoleMapData;
  /** Ball marks so far, tee first. GPS marks have no position, so they sit on the centreline at their distance. */
  marks?: HoleMarkPt[];
  /** Metres walked since the last mark. Above 0 the map zooms in and the next tap places the ball. */
  walk?: number;
  onWalk?: (m: number) => void;
  onTap?: (r: TapResult) => void;
  yards?: boolean;
  /** Size of the drawing area */
  className?: string;
};

function smooth(pts: P[]) {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + "Z";
}

const NS = { vectorEffect: "non-scaling-stroke" as const };

export default function HoleMap({ data, marks = [], walk = 0, onWalk, onTap, yards = false, className = "h-[62vh] max-h-[560px] min-h-[360px]" }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [aspect, setAspect] = useState(0.7);
  const [vb, setVb] = useState<number[] | null>(null);
  const raf = useRef(0);

  const geo = useMemo(() => {
    const CL = data.cl;
    const cum = [0];
    for (let i = 1; i < CL.length; i++) cum.push(cum[i - 1] + Math.hypot(CL[i][0] - CL[i - 1][0], CL[i][1] - CL[i - 1][1]));
    const LEN = data.m;
    const K = LEN / cum[cum.length - 1];
    const at = (m: number): P => {
      const s = Math.max(0, Math.min(LEN, m)) / K;
      let i = 1;
      while (i < cum.length - 1 && cum[i] < s) i++;
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [CL[i - 1][0] + (CL[i][0] - CL[i - 1][0]) * t, CL[i - 1][1] + (CL[i][1] - CL[i - 1][1]) * t];
    };
    const ang = (m: number) => {
      const a = at(m - 3), b = at(m + 3);
      return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    };
    const along = (p: P) => {
      let best = 0, bd = 1e9;
      for (let m = 0; m <= LEN; m += 1) {
        const q = at(m), d = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (d < bd) { bd = d; best = m; }
      }
      return best;
    };
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of data.silh) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    return { LEN, K, u: 1 / K, at, ang, along, bb: [x0, y0, x1, y1] };
  }, [data]);
  const { LEN, K, u, at, ang, along, bb } = geo;

  const resolved = marks.map((m, i) => m.pos ?? (i === 0 ? data.tp : at(m.cum)));
  const lastP = resolved[resolved.length - 1];
  const lastAlong = marks.length ? (marks[marks.length - 1].pos ? along(marks[marks.length - 1].pos as P) : marks[marks.length - 1].cum) : 0;
  const zoomed = walk > 0 && !!onTap && marks.length > 0;

  // keep the drawing area's shape so the framing fits it
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const f = () => el.clientWidth && el.clientHeight && setAspect(el.clientWidth / el.clientHeight);
    f();
    const ro = new ResizeObserver(f);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const target = useMemo(() => {
    if (zoomed) {
      const span = 190 * u;
      let W = span, H = W / aspect;
      if (H < span) { H = span; W = H * aspect; }
      const c = at(lastAlong + walk);
      return [c[0] - W / 2, c[1] - H / 2, W, H];
    }
    const pad = 30 * u;
    let W = bb[2] - bb[0] + pad * 2, H = bb[3] - bb[1] + pad * 2;
    if (W / H > aspect) H = W / aspect; else W = H * aspect;
    return [(bb[0] + bb[2]) / 2 - W / 2, (bb[1] + bb[3]) / 2 - H / 2, W, H];
  }, [zoomed, walk, lastAlong, aspect, u, bb, at]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    setVb((cur) => {
      if (!cur) return target;
      return cur;
    });
    let cur = vb ?? target;
    const step = () => {
      let done = true;
      cur = cur.map((v, i) => {
        const nv = v + (target[i] - v) * 0.2;
        if (Math.abs(target[i] - nv) > 0.4 * u) done = false;
        return nv;
      });
      if (done) { setVb(target); return; }
      setVb(cur);
      raf.current = requestAnimationFrame(step);
    };
    if (vb) step();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  function click(e: React.MouseEvent<SVGSVGElement>) {
    if (!zoomed || !onTap || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const q = pt.matrixTransform(ctm.inverse());
    const p: P = [q.x, q.y];
    onTap({ pos: p, metres: Math.hypot(p[0] - lastP[0], p[1] - lastP[1]) * K, along: along(p) });
  }

  const a0 = ang(0), a1 = ang(LEN);
  const step = yards ? 91.44 : 100;
  const rings: { m: number; label: string }[] = [];
  for (let k = 1; k * step < LEN - 20; k++) rings.push({ m: k * step, label: `${k * 100} ${yards ? "yd" : "m"}` });
  const trees = data.trees;
  const tr = data.tr;
  const fairId = `fc-${data.n}`;
  const bnd = bb;
  const D = Math.hypot(bnd[2] - bnd[0], bnd[3] - bnd[1]);
  const stripes: number[] = [];
  for (let t = -D; t < D; t += 14 * u) stripes.push(t);
  const pathPts: P[] = [data.tp, ...resolved.slice(1)];
  const landing = zoomed ? at(lastAlong + walk) : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/15 bg-[#0f2e18]">
      <svg
        ref={svgRef}
        viewBox={(vb ?? target).join(" ")}
        className={`block w-full touch-manipulation ${className} ${zoomed ? "cursor-crosshair" : ""}`}
        role="img"
        aria-label={`Hole ${data.n} layout, tee at the bottom and green at the top`}
        onClick={click}
      >
        <rect x={-9000} y={-9000} width={20000} height={20000} fill="#0f2e18" />
        <path d={smooth(data.silh)} fill="#1b5a30" />
        {data.semi.map((p, i) => <path key={i} d={smooth(p)} fill="#2a7440" />)}
        <defs>
          <clipPath id={fairId}>{data.fair.map((p, i) => <path key={i} d={smooth(p)} />)}</clipPath>
        </defs>
        {data.fair.map((p, i) => <path key={i} d={smooth(p)} fill="#5fb06f" />)}
        <g clipPath={`url(#${fairId})`}>
          {stripes.map((t) => (
            <path key={t} d={`M${bnd[0] - 50},${bnd[1] + t} L${bnd[2] + 50},${bnd[1] + t - (bnd[2] - bnd[0] + 100) * 0.3}`} stroke="#8bd48f" opacity={0.28} strokeWidth={6 * u} />
          ))}
        </g>
        {data.fair.map((p, i) => <path key={i} d={smooth(p)} fill="none" stroke="#c6ff3d" strokeOpacity={0.55} strokeWidth={2.5} {...NS} />)}
        {data.water.map((p, i) => <path key={i} d={smooth(p)} fill="#1e6a8f" stroke="#7fd0f0" strokeWidth={2.5} {...NS} />)}
        <rect x={-20 * u} y={-11 * u} width={40 * u} height={22 * u} rx={5 * u} fill="#a9c9b3" stroke="#c6ff3d" strokeWidth={2} {...NS} transform={`translate(${data.tp[0]},${data.tp[1]}) rotate(${a0})`} />
        <ellipse rx={15 * u} ry={12 * u} fill="#7fe08f" stroke="#c6ff3d" strokeWidth={3} {...NS} transform={`translate(${data.gp[0]},${data.gp[1]}) rotate(${a1})`} />
        {data.sand.map((p, i) => <path key={i} d={smooth(p)} fill="#f1e1ac" stroke="#c8b36d" strokeWidth={2} {...NS} />)}
        {trees.map((t, i) => (
          <g key={i}>
            <circle cx={t[0] + tr * 0.15} cy={t[1] + tr * 0.25} r={tr} fill="#0b2a14" opacity={0.5} />
            <circle cx={t[0]} cy={t[1]} r={tr} fill="#1d6b35" stroke="#0f3d1c" strokeWidth={1.5} {...NS} />
            <circle cx={t[0] - tr * 0.25} cy={t[1] - tr * 0.25} r={tr * 0.35} fill="#2f8c4a" opacity={0.8} />
          </g>
        ))}
        {rings.map((r) => {
          const p = at(r.m), a = ang(r.m) + 90, rad = (a * Math.PI) / 180;
          return (
            <g key={r.m}>
              <line x1={-35 * u} x2={35 * u} y1={0} y2={0} stroke="#fff" strokeOpacity={0.45} strokeDasharray="8 10" strokeWidth={2.5} {...NS} transform={`translate(${p[0]},${p[1]}) rotate(${a})`} />
              <text x={p[0] + 38 * u * Math.cos(rad) + 3 * u} y={p[1] + 38 * u * Math.sin(rad) + 3 * u} fontSize={6 * u} fill="#fff" fillOpacity={0.8} fontWeight={600}>{r.label}</text>
            </g>
          );
        })}
        {pathPts.map((p, i) =>
          i ? <line key={`l${i}`} x1={pathPts[i - 1][0]} y1={pathPts[i - 1][1]} x2={p[0]} y2={p[1]} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" {...NS} /> : null,
        )}
        {marks.length > 0 && pathPts.map((p, i) => <circle key={`c${i}`} cx={p[0]} cy={p[1]} r={3.4 * u} fill={i ? "#c6ff3d" : "#0a0a0a"} stroke="#c6ff3d" strokeWidth={3} {...NS} />)}
        {landing && (
          <g style={{ pointerEvents: "none" }}>
            <ellipse rx={25 * u} ry={65 * u} fill="#c6ff3d" fillOpacity={0.16} stroke="#c6ff3d" strokeDasharray="10 8" strokeWidth={3} {...NS} transform={`translate(${landing[0]},${landing[1]}) rotate(${ang(lastAlong + walk)})`} />
            <circle cx={landing[0]} cy={landing[1]} r={1.8 * u} fill="#c6ff3d" />
          </g>
        )}
        <g style={{ pointerEvents: "none" }} transform={`translate(${data.gp[0] - 16 * 0.55 * u},${data.gp[1] + 1.5 * u - 38 * 0.55 * u}) scale(${0.55 * u})`}>
          <path d="M16 0C7.7 0 1 6.5 1 14.6 1 25 16 40 16 40s15-15 15-25.4C31 6.5 24.3 0 16 0z" fill="#c6ff3d" />
          <path d="M13 7.5h2v17h-2z" />
          <path d="M15 7.5 25 11.5 15 15.5z" />
          <ellipse cx={14} cy={25} rx={5.2} ry={1.7} />
        </g>
      </svg>
      {zoomed && onWalk && (
        <button type="button" onClick={() => onWalk(0)} className="absolute right-2 top-2 rounded-full border border-lime/70 bg-black/60 px-3 py-1 text-xs font-semibold text-lime hover:bg-lime hover:text-black">
          View whole hole
        </button>
      )}
    </div>
  );
}
