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

/** Local flat projection in metres (east, north) around the first point. Fine at hole scale. */
export function project(marks: Mark[]) {
  if (!marks.length) return [];
  const o = marks[0];
  const kLat = 111_132;
  const kLon = 111_320 * Math.cos((o.lat * Math.PI) / 180);
  return marks.map((m) => ({ x: (m.lon - o.lon) * kLon, y: (o.lat - m.lat) * kLat }));
}

/** A made-up next position, for trying the tracker indoors. */
export function demoNext(prev: Mark | undefined, seed: number): Mark {
  const base = prev ?? { lat: -33.7396, lon: 151.3061, ts: Date.now() };
  const r = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const metres = prev ? 60 + r(1) * 170 : 0;
  const bearing = ((20 + (r(2) - 0.5) * 50) * Math.PI) / 180; // roughly north-east with some wander
  const dLat = (metres * Math.cos(bearing)) / 111_132;
  const dLon = (metres * Math.sin(bearing)) / (111_320 * Math.cos((base.lat * Math.PI) / 180));
  return { lat: base.lat + dLat, lon: base.lon + dLon, ts: Date.now(), demo: true };
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
