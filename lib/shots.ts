/** Shot tracking maths and storage. Positions stay in this browser (localStorage). */
export type Mark = {
  lat: number;
  lon: number;
  acc?: number; // GPS accuracy in metres
  club?: string; // club used for the shot that starts here
  ts: number;
  demo?: boolean;
};
export type HoleShots = { hole: number; marks: Mark[] };
export type ShotRound = { id: string; course: string; date: string; holes: HoleShots[] };

export const CLUBS = ["Driver", "3 wood", "5 wood", "Hybrid", "4 iron", "5 iron", "6 iron", "7 iron", "8 iron", "9 iron", "Pitching wedge", "Sand wedge", "Lob wedge", "Putter"];

/** Distance between two points in metres (haversine). */
export function distM(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371008.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Shots are the gaps between consecutive marks. The club belongs to the mark the shot starts from. */
export function shotsOf(marks: Mark[]) {
  return marks.slice(1).map((m, i) => ({ n: i + 1, from: marks[i], to: m, metres: distM(marks[i], m), club: marks[i].club }));
}

const KEY = "golfme-shots-v1";
export function loadRounds(): ShotRound[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShotRound[]) : [];
  } catch {
    return [];
  }
}
export function saveRounds(r: ShotRound[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* storage blocked */
  }
}
export const toYards = (m: number) => m * 1.0936133;

const rnd = (seed: number, n: number) => {
  const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** A believable made-up hole for trying the tracker indoors: tee, full shots, then putts. Ends at the pin. */
export function demoRoute(lengthM: number, par: number, seed: number): Mark[] {
  const full = Math.max(1, par - 2);
  const pts: { u: number; v: number }[] = [{ u: 0, v: 0 }];
  for (let i = 1; i <= full; i++) {
    const last = i === full;
    const u = last ? lengthM - (6 + rnd(seed, i) * 10) : (lengthM * i) / full * (0.93 + rnd(seed, i) * 0.06);
    const v = last ? (rnd(seed, i + 9) - 0.5) * 12 : (rnd(seed, i + 9) - 0.5) * 26;
    pts.push({ u, v });
  }
  const g = pts[pts.length - 1];
  pts.push({ u: lengthM - 0.5 + (g.u - lengthM) * 0.1, v: g.v * 0.1 });
  pts.push({ u: lengthM, v: 0 });
  const b = (28 * Math.PI) / 180;
  const base = { lat: -33.7396, lon: 151.3061 };
  return pts.map((p) => {
    const east = p.u * Math.sin(b) + p.v * Math.cos(b);
    const north = p.u * Math.cos(b) - p.v * Math.sin(b);
    return { lat: base.lat + north / 111_132, lon: base.lon + east / (111_320 * Math.cos((base.lat * Math.PI) / 180)), ts: Date.now(), demo: true };
  });
}
