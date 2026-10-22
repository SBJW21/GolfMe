/**
 * Builds lib/mapData.ts: the stylised Sydney map used by the area picker.
 * Run with: node scripts/build-map.mjs
 *
 * The coastline and waterways are hand-placed from approximate coordinates and smoothed,
 * so the map is illustrative, not survey accurate. Area regions are Voronoi cells around each
 * area's centre point, clipped to the land at draw time.
 */
import fs from "node:fs";
import { Delaunay } from "d3-delaunay";
import { curveCatmullRom, curveCatmullRomClosed, line } from "d3-shape";

const W = 900;
const LON0 = 150.62;
const LON1 = 151.4;
const LAT_TOP = -33.62;
const LAT_BOTTOM = -34.1;

const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const scale = W / ((LON1 - LON0) * (Math.PI / 180));
const H = Math.round(scale * (merc(LAT_TOP) - merc(LAT_BOTTOM)));
const px = ([lon, lat]) => [
  +(((lon - LON0) / (LON1 - LON0)) * W).toFixed(1),
  +((scale * (merc(LAT_TOP) - merc(lat))).toFixed(1)),
];

// Pixels per kilometre, used to size rivers.
const PX_PER_KM = W / ((LON1 - LON0) * 92.4);

const smooth = (pts, closed = false) =>
  line().curve(closed ? curveCatmullRomClosed.alpha(0.5) : curveCatmullRom.alpha(0.5))(pts.map(px));

// Ocean coastline, north to south (lon, lat).
const coast = [
  [151.333, -33.575], [151.335, -33.603], [151.337, -33.628], [151.335, -33.652], [151.327, -33.672],
  [151.322, -33.693], [151.307, -33.715], [151.303, -33.735], [151.297, -33.752], [151.291, -33.772],
  [151.292, -33.790], [151.293, -33.805], [151.307, -33.818], [151.312, -33.826],
];
const coastSouth = [
  [151.295, -33.842], [151.282, -33.868], [151.277, -33.890], [151.268, -33.905], [151.262, -33.922],
  [151.256, -33.945], [151.250, -33.965], [151.238, -33.985],
];
const coastBotanyToCronulla = [
  [151.228, -34.012], [151.205, -34.030], [151.175, -34.050], [151.155, -34.062], [151.130, -34.085],
  [151.105, -34.100], [151.085, -34.125], [151.075, -34.14],
];

const landEdge = (pts) => pts.map(px);
const frameTL = px([LON0 - 0.05, LAT_TOP + 0.05]);
const frameBL = px([LON0 - 0.05, LAT_BOTTOM - 0.05]);
const coastTop = px([151.333, LAT_TOP + 0.05]);
const coastBottom = px([151.065, LAT_BOTTOM - 0.05]);

const coastPath = line().curve(curveCatmullRom.alpha(0.5))([
  ...landEdge(coast),
]);
const coastPath2 = line().curve(curveCatmullRom.alpha(0.5))(landEdge(coastSouth));
const coastPath3 = line().curve(curveCatmullRom.alpha(0.5))(landEdge(coastBotanyToCronulla));

const landPath =
  `M${frameTL.join(",")}L${coastTop.join(",")}` +
  coastPath.replace(/^M/, "L") +
  `L${px(coastSouth[0]).join(",")}` + // jump across the Heads
  coastPath2.replace(/^M/, "L") +
  `L${px(coastBotanyToCronulla[0]).join(",")}` + // jump across Botany Bay mouth
  coastPath3.replace(/^M/, "L") +
  `L${coastBottom.join(",")}L${frameBL.join(",")}Z`;

// Port Jackson (Sydney Harbour) and the Parramatta River as one smooth shape.
const harbour = [
  [151.296, -33.842], [151.283, -33.847], [151.273, -33.857], [151.264, -33.868], [151.251, -33.863],
  [151.240, -33.871], [151.235, -33.866], [151.228, -33.871], [151.223, -33.862], [151.221, -33.868],
  [151.211, -33.861], [151.203, -33.857], [151.199, -33.874], [151.194, -33.864], [151.182, -33.853],
  [151.172, -33.850], [151.153, -33.852], [151.130, -33.851], [151.100, -33.840], [151.070, -33.833],
  [151.040, -33.823], [151.008, -33.816], [151.008, -33.811], [151.040, -33.816], [151.070, -33.826],
  [151.100, -33.832], [151.128, -33.839], [151.150, -33.843], [151.172, -33.837], [151.200, -33.845],
  [151.213, -33.849], [151.226, -33.848], [151.240, -33.848], [151.252, -33.855], [151.254, -33.838],
  [151.262, -33.829], [151.272, -33.825], [151.290, -33.820], [151.302, -33.818],
];

const rivers = [
  { w: 0.9, pts: [[151.268, -33.826], [151.252, -33.810], [151.243, -33.802], [151.232, -33.795], [151.220, -33.788], [151.208, -33.782], [151.200, -33.772], [151.200, -33.756], [151.206, -33.744]] }, // Middle Harbour
  { w: 0.45, pts: [[151.158, -33.838], [151.160, -33.822], [151.152, -33.803], [151.142, -33.787], [151.130, -33.772], [151.120, -33.760]] }, // Lane Cove River
  { w: 0.55, pts: [[151.140, -33.992], [151.110, -33.996], [151.080, -34.003], [151.050, -33.993], [151.020, -33.974], [150.990, -33.956]] }, // Georges River
  { w: 1.4, pts: [[151.152, -34.066], [151.126, -34.064], [151.105, -34.069], [151.082, -34.076], [151.060, -34.071]] }, // Port Hacking
  { w: 0.4, pts: [[151.178, -33.957], [151.166, -33.935], [151.150, -33.923]] }, // Cooks River
];

const botany = [
  [151.245, -33.985], [151.205, -33.983], [151.175, -33.972], [151.150, -33.966], [151.132, -33.976],
  [151.135, -33.996], [151.150, -34.010], [151.178, -34.021], [151.208, -34.021], [151.232, -34.016], [151.245, -34.012],
];

const harbourPath = smooth(harbour, true);
const botanyPath = smooth(botany, true);
const riverPaths = rivers.map((r) => ({ d: smooth(r.pts), w: +(r.w * PX_PER_KM).toFixed(1) }));

// Area centres (lon, lat). Keys match the ids in lib/areas.ts.
const centres = {
  alexandria: [151.200, -33.910],
  ashfield: [151.100, -33.875],
  balmain: [151.170, -33.870],
  bankstown: [151.035, -33.935],
  blacktown: [150.905, -33.775],
  bondi: [151.255, -33.895],
  campbelltown: [150.820, -34.070],
  "castle-hill": [151.000, -33.730],
  chatswood: [151.180, -33.795],
  coogee: [151.235, -33.935],
  cronulla: [151.130, -34.040],
  "dee-why": [151.275, -33.750],
  epping: [151.085, -33.785],
  "frenchs-forest": [151.225, -33.745],
  hornsby: [151.100, -33.690],
  "lane-cove": [151.175, -33.815],
  lindfield: [151.150, -33.770],
  liverpool: [150.930, -33.925],
  manly: [151.272, -33.795],
  marrickville: [151.150, -33.905],
  "mona-vale": [151.300, -33.675],
  mosman: [151.238, -33.828],
  "north-sydney": [151.205, -33.835],
  paddington: [151.235, -33.882],
  parramatta: [151.003, -33.830],
  penrith: [150.700, -33.750],
  rockdale: [151.130, -33.965],
  sutherland: [151.060, -34.030],
  "sydney-cbd": [151.205, -33.880],
};

const ids = Object.keys(centres);
const pts = ids.map((id) => px(centres[id]));
const voronoi = Delaunay.from(pts).voronoi([0, 0, W, H]);
const cells = {};
ids.forEach((id, i) => {
  const poly = voronoi.cellPolygon(i);
  cells[id] = "M" + poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";
});
const centroids = Object.fromEntries(ids.map((id, i) => [id, pts[i]]));

const out = `// Generated by scripts/build-map.mjs. Do not edit by hand.
export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};
export const LAND_PATH = ${JSON.stringify(landPath)};
export const HARBOUR_PATH = ${JSON.stringify(harbourPath)};
export const BOTANY_PATH = ${JSON.stringify(botanyPath)};
export const RIVERS: { d: string; w: number }[] = ${JSON.stringify(riverPaths)};
export const AREA_CELLS: Record<string, string> = ${JSON.stringify(cells)};
export const AREA_POINTS: Record<string, [number, number]> = ${JSON.stringify(centroids)};
`;
fs.writeFileSync(new URL("../lib/mapData.ts", import.meta.url), out);
console.log("map", W, H, "bytes", out.length);
