/**
 * Shot report: turns finished, locked rounds into plain-language patterns.
 * Nothing here claims certainty. Patterns are wording for a coach conversation, not a diagnosis.
 */
import { getHoleMap, type HoleMapData } from "@/lib/holeMaps";
import { shotsOf, toYards, type ShotRound } from "@/lib/shots";

type P = [number, number];
export type Insight = {
  id: string;
  tone: "pattern" | "strength" | "watch";
  title: string;
  body: string;
  /** What to raise with a coach */
  coach?: string;
  holes?: number[];
};
export type HoleRow = { hole: number; par?: number; played: number; avgShots: number; avgPutts: number; trouble: string };
export type Report = {
  rounds: number;
  course: string;
  hand: "R" | "L";
  insights: Insight[];
  holes: HoleRow[];
  coach: string[];
  coverage: { shots: number; mapped: number };
};

export const ROUNDS_TO_UNLOCK = 3;
const MIN_HOLES = 9;

const holedHoles = (r: ShotRound) => r.holes.filter((h) => h.marks.some((m) => m.holed));
/** A round counts once it is finished (locked) and at least nine holes were holed out */
export const eligibleRounds = (rounds: ShotRound[]) => rounds.filter((r) => r.finished && holedHoles(r).length >= MIN_HOLES);

// ---- Hole geometry (same maths as the hole map) ----
type Geo = { K: number; len: number; project: (p: P) => { along: number; off: number }; classify: (p: P) => string; waterInPlay: boolean; waterSide: 1 | -1 | 0 };
const geoCache = new WeakMap<HoleMapData, Geo>();

function inPoly(p: P, poly: P[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function geoOf(d: HoleMapData): Geo {
  const hit = geoCache.get(d);
  if (hit) return hit;
  const CL = d.cl;
  const cum = [0];
  for (let i = 1; i < CL.length; i++) cum.push(cum[i - 1] + Math.hypot(CL[i][0] - CL[i - 1][0], CL[i][1] - CL[i - 1][1]));
  const K = d.m / cum[cum.length - 1];
  const at = (m: number): P => {
    const s = Math.max(0, Math.min(d.m, m)) / K;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < s) i++;
    const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return [CL[i - 1][0] + (CL[i][0] - CL[i - 1][0]) * t, CL[i - 1][1] + (CL[i][1] - CL[i - 1][1]) * t];
  };
  const samples: { m: number; c: P; n: P }[] = [];
  for (let m = 0; m <= d.m; m += 2) {
    const a = at(m - 3), b = at(m + 3);
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    // Left of travel on a screen where y points down
    samples.push({ m, c: at(m), n: [ty / l, -tx / l] });
  }
  const project = (p: P) => {
    let best = samples[0], bd = Infinity;
    for (const s of samples) {
      const dd = (s.c[0] - p[0]) ** 2 + (s.c[1] - p[1]) ** 2;
      if (dd < bd) { bd = dd; best = s; }
    }
    const off = ((p[0] - best.c[0]) * best.n[0] + (p[1] - best.c[1]) * best.n[1]) * K;
    return { along: best.m, off };
  };
  const classify = (p: P) => {
    if (d.water.some((w) => inPoly(p, w))) return "water";
    if (d.sand.some((w) => inPoly(p, w))) return "sand";
    if (d.trees.some((t) => Math.hypot(t[0] - p[0], t[1] - p[1]) < d.tr)) return "trees";
    if (d.fair.some((w) => inPoly(p, w))) return "fairway";
    if (d.semi.some((w) => inPoly(p, w))) return "semi-rough";
    if (inPoly(p, d.silh)) return "rough";
    return "out of bounds";
  };
  // Water is "in play" when it sits within 50 m of the line between 60 m out and the green
  let waterInPlay = false;
  let sideSum = 0, sideN = 0;
  for (const w of d.water) {
    for (const v of w) {
      const pr = project(v);
      if (pr.along >= 60 && pr.along <= d.m - 20 && Math.abs(pr.off) <= 50) {
        waterInPlay = true;
        sideSum += pr.off;
        sideN++;
      }
    }
  }
  const g: Geo = { K, len: d.m, project, classify, waterInPlay, waterSide: sideN ? (sideSum > 0 ? 1 : -1) : 0 };
  geoCache.set(d, g);
  return g;
}

// ---- Shot records ----
type Rec = { hole: number; round: string; metres: number; club?: string; putt: boolean; end?: string; s?: number; waterHole: boolean; par?: number };

const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const sd = (a: number[]) => {
  const m = mean(a);
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};
const r0 = (n: number) => Math.round(n);
const dist = (m: number) => `${r0(m)} m (${r0(toYards(m))} yd)`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function buildReport(allRounds: ShotRound[], slugOf: (course: string) => string | undefined): Report | null {
  const el = eligibleRounds(allRounds);
  if (el.length < ROUNDS_TO_UNLOCK) return null;

  // Focus on the course played most
  const byCourse = new Map<string, ShotRound[]>();
  for (const r of el) byCourse.set(r.course, [...(byCourse.get(r.course) ?? []), r]);
  const [course, courseRounds] = [...byCourse.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  const slug = slugOf(course);
  const hand: "R" | "L" = courseRounds.filter((r) => r.hand === "L").length > courseRounds.length / 2 ? "L" : "R";
  const slice = hand === "R" ? "right" : "left";
  const hook = hand === "R" ? "left" : "right";

  const recs: Rec[] = [];
  let totalShots = 0, mapped = 0;
  for (const r of courseRounds) {
    for (const h of r.holes) {
      const d = slug ? getHoleMap(slug, h.hole) : undefined;
      const g = d ? geoOf(d) : undefined;
      shotsOf(h.marks).forEach((s) => {
        totalShots++;
        const rec: Rec = { hole: h.hole, round: r.id, metres: s.metres, club: s.club, putt: s.putt, waterHole: !!g?.waterInPlay, par: d?.par };
        if (g && s.to.pos && !s.putt) {
          mapped++;
          const pr = g.project(s.to.pos);
          rec.s = hand === "L" ? pr.off : -pr.off; // positive = slice side
          rec.end = g.classify(s.to.pos);
        }
        recs.push(rec);
      });
    }
  }

  const insights: Insight[] = [];
  const full = recs.filter((x) => !x.putt && x.metres >= 60 && x.s !== undefined);

  // 1. Overall lean
  if (full.length >= 8) {
    const big = full.filter((x) => Math.abs(x.s as number) >= 15);
    const sliceSide = big.filter((x) => (x.s as number) > 0).length;
    const share = big.length ? Math.max(sliceSide, big.length - sliceSide) / big.length : 0;
    if (big.length >= 5 && share >= 0.65) {
      const toSlice = sliceSide >= big.length - sliceSide;
      const side = toSlice ? slice : hook;
      insights.push({
        id: "lean",
        tone: "pattern",
        title: `Your misses lean ${side}`,
        body: `${big.length} of your ${full.length} full shots finished more than 15 m ${side} of the centre line, and ${r0(share * 100)}% of those went the same way. ${toSlice ? `For a ${hand === "R" ? "right" : "left"}-hander that is the slice and push side.` : `For a ${hand === "R" ? "right" : "left"}-hander that is the hook and pull side.`}`,
        coach: `Check clubface and swing path at impact, because most of your misses go ${side}.`,
      });
    }
  }

  // 2. Water in play
  const wet = full.filter((x) => x.waterHole), dry = full.filter((x) => !x.waterHole);
  if (wet.length >= 6 && dry.length >= 6) {
    const diff = mean(wet.map((x) => x.s as number)) - mean(dry.map((x) => x.s as number));
    if (Math.abs(diff) >= 6) {
      const toward = diff > 0 ? slice : hook;
      insights.push({
        id: "water",
        tone: "pattern",
        title: `You drift ${toward} when water is in play`,
        body: `On holes with water in play your average shot finished ${r0(Math.abs(diff))} m further ${toward} than on the other holes. That can mean steering away from the hazard or tightening up over the shot. It is a pattern across ${wet.length} shots, not proof of cause.`,
        coach: "Talk through your target choice and pre-shot routine on water holes, and whether you swing differently when you see it.",
        holes: [...new Set(wet.map((x) => x.hole))].sort((a, b) => a - b),
      });
    }
  }
  const inWater = recs.filter((x) => x.end === "water");
  if (inWater.length >= 2) {
    const hs = [...new Set(inWater.map((x) => x.hole))].sort((a, b) => a - b);
    insights.push({
      id: "water-hits",
      tone: "watch",
      title: `${plural(inWater.length, "shot")} finished in water`,
      body: `Across ${courseRounds.length} rounds, water came into play on hole${hs.length > 1 ? "s" : ""} ${hs.join(", ")}.`,
      coach: "Plan a layup distance or club that keeps water out of play on those holes.",
      holes: hs,
    });
  }

  // 3. Repeat trouble on the same hole
  const spots = new Map<string, Set<string>>();
  for (const x of recs) if (x.end && ["water", "sand", "trees", "out of bounds"].includes(x.end)) spots.set(`${x.hole}|${x.end}`, (spots.get(`${x.hole}|${x.end}`) ?? new Set()).add(x.round));
  [...spots.entries()]
    .filter(([, rs]) => rs.size >= 2)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 3)
    .forEach(([k, rs]) => {
      const [h, end] = k.split("|");
      insights.push({
        id: `repeat-${k}`,
        tone: "watch",
        title: `Hole ${h}: ${end === "out of bounds" ? "out of bounds" : `in the ${end === "sand" ? "bunker" : end}`} in ${rs.size} of ${courseRounds.length} rounds`,
        body: "The same trouble on the same hole more than once usually points to a target or club choice rather than bad luck.",
        coach: `Work out a different line or club for hole ${h}.`,
        holes: [Number(h)],
      });
    });

  // 4. Putting
  const holedRows = courseRounds.flatMap((r) => holedHoles(r).map((h) => ({ hole: h.hole, putts: shotsOf(h.marks).filter((s) => s.putt).length })));
  if (holedRows.length >= MIN_HOLES) {
    const avg = mean(holedRows.map((x) => x.putts));
    const threes = holedRows.filter((x) => x.putts >= 3);
    if (avg <= 1.9)
      insights.push({ id: "putting", tone: "strength", title: "Putting is a strength", body: `You average ${avg.toFixed(1)} putts a hole across ${plural(courseRounds.length, "round")}.` });
    else if (avg >= 2.2 || threes.length >= 3)
      insights.push({
        id: "putting",
        tone: "watch",
        title: `${avg.toFixed(1)} putts a hole, with ${plural(threes.length, "three-putt")}`,
        body: "Lag putting distance control usually saves the most strokes here.",
        coach: "Ask for a lag putting drill, because that is usually where three-putts start.",
        holes: [...new Set(threes.map((x) => x.hole))].sort((a, b) => a - b),
      });
  }

  // 5. Club consistency (all eligible rounds)
  const clubShots = new Map<string, number[]>();
  for (const r of el) for (const h of r.holes) for (const s of shotsOf(h.marks)) if (!s.putt && s.club && s.metres >= 40) clubShots.set(s.club, [...(clubShots.get(s.club) ?? []), s.metres]);
  const clubStats = [...clubShots.entries()].filter(([, v]) => v.length >= 5).map(([club, v]) => ({ club, n: v.length, avg: mean(v), cv: sd(v) / mean(v), lo: Math.min(...v), hi: Math.max(...v) }));
  const loose = [...clubStats].sort((a, b) => b.cv - a.cv)[0];
  if (loose && loose.cv >= 0.1)
    insights.push({
      id: "club-spread",
      tone: "watch",
      title: `Your ${loose.club} ranges from ${r0(loose.lo)} to ${r0(loose.hi)} m`,
      body: `It averages ${dist(loose.avg)} over ${loose.n} shots. A wide spread makes club choice a guess on the course.`,
      coach: `Ask about strike consistency with your ${loose.club}.`,
    });
  const tight = [...clubStats].sort((a, b) => a.cv - b.cv)[0];
  if (tight && tight.cv <= 0.06 && tight !== loose)
    insights.push({ id: "club-tight", tone: "strength", title: `Your ${tight.club} is your most consistent club`, body: `It averages ${dist(tight.avg)} across ${tight.n} shots, within a tight range. Trust it when you need a number.` });

  // Hole table
  const holes: HoleRow[] = [];
  for (let n = 1; n <= 18; n++) {
    const played = courseRounds.flatMap((r) => r.holes.filter((h) => h.hole === n && h.marks.some((m) => m.holed)));
    if (!played.length) continue;
    const d = slug ? getHoleMap(slug, n) : undefined;
    const ends = recs.filter((x) => x.hole === n && x.end && !["fairway", "semi-rough"].includes(x.end)).map((x) => x.end as string);
    const common = ends.length ? [...new Set(ends)].sort((a, b) => ends.filter((e) => e === b).length - ends.filter((e) => e === a).length)[0] : "";
    holes.push({
      hole: n,
      par: d?.par,
      played: played.length,
      avgShots: mean(played.map((h) => shotsOf(h.marks).length)),
      avgPutts: mean(played.map((h) => shotsOf(h.marks).filter((s) => s.putt).length)),
      trouble: common ? `${common === "sand" ? "bunker" : common} (${ends.filter((e) => e === common).length})` : "",
    });
  }
  const hard = holes.filter((h) => h.par).sort((a, b) => b.avgShots - (b.par as number) - (a.avgShots - (a.par as number)))[0];
  if (hard && hard.avgShots - (hard.par as number) >= 1.5)
    insights.push({ id: "hard", tone: "watch", title: `Hole ${hard.hole} is costing you most`, body: `You average ${hard.avgShots.toFixed(1)} shots on a par ${hard.par}.`, coach: `Plan hole ${hard.hole} shot by shot.`, holes: [hard.hole] });
  const easy = holes.filter((h) => h.par).sort((a, b) => a.avgShots - (a.par as number) - (b.avgShots - (b.par as number)))[0];
  if (easy && easy.avgShots - (easy.par as number) <= 0.4)
    insights.push({ id: "easy", tone: "strength", title: `Hole ${easy.hole} is your best`, body: `You average ${easy.avgShots.toFixed(1)} shots on a par ${easy.par}.`, holes: [easy.hole] });

  return {
    rounds: courseRounds.length,
    course,
    hand,
    insights,
    holes,
    coach: insights.filter((i) => i.coach).map((i) => i.coach as string),
    coverage: { shots: totalShots, mapped },
  };
}
