import mona from "./mona-vale-golf-club.json";

type P = [number, number];
/** One hole, redrawn in Golf Me style. Drawn tee at the bottom and green at the top. Units are map pixels. */
export type HoleMapData = {
  n: number;
  par: number;
  /** Hole length in metres (men's tees), used to scale the map */
  m: number;
  /** Tree radius in map pixels */
  tr: number;
  silh: P[];
  semi: P[][];
  fair: P[][];
  water: P[][];
  sand: P[][];
  trees: P[];
  tp: P;
  gp: P;
  /** Centreline from tee to green */
  cl: P[];
};

const MAPS: Record<string, HoleMapData[]> = {
  "mona-vale-golf-club": mona as unknown as HoleMapData[],
};

export function getHoleMap(slug: string | undefined, n: number | null | undefined): HoleMapData | undefined {
  if (!slug || !n) return undefined;
  return MAPS[slug]?.find((h) => h.n === n);
}
export const hasHoleMaps = (slug: string | undefined) => !!slug && !!MAPS[slug];
