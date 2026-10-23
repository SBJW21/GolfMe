export type Pt = { x: number; y: number }; // 0..1 of the frame
export type Tool = "line" | "circle" | "angle" | "pen" | "tracer" | "move";
export type Stroke = {
  id: number;
  view: number;
  tool: Tool;
  pts: Pt[];
  color: string;
  atMs: number | null; // time in the recording when drawn. null = drawn before recording
  removedMs: number | null;
};
export type Ev = { ms: number; view: number; kind: "seek" | "play" | "pause" | "rate"; v: number };

export function angleAt(a: Pt, b: Pt, c: Pt, w: number, h: number) {
  const v1 = { x: (a.x - b.x) * w, y: (a.y - b.y) * h };
  const v2 = { x: (c.x - b.x) * w, y: (c.y - b.y) * h };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  return m ? (Math.acos(Math.max(-1, Math.min(1, dot / m))) * 180) / Math.PI : 0;
}

/** Size a canvas to its on-screen box and return a ready 2D context. */
export function prepCanvas(c: HTMLCanvasElement) {
  const w = c.clientWidth;
  const h = c.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  if (c.width !== w * dpr || c.height !== h * dpr) {
    c.width = w * dpr;
    c.height = h * dpr;
  }
  const g = c.getContext("2d");
  if (!g) return null;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  g.lineWidth = 3;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.font = "700 16px sans-serif";
  return { g, w, h };
}


/** Points along a smooth curve (Catmull-Rom) through the tapped points. */
export function smoothPath(P: { x: number; y: number }[], steps = 18) {
  if (P.length < 3) return P;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(i - 1, 0)];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[Math.min(i + 2, P.length - 1)];
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(P[P.length - 1]);
  return out;
}

export function drawShape(g: CanvasRenderingContext2D, w: number, h: number, tool: Tool, pts: Pt[], col: string) {
        g.strokeStyle = col;
  g.fillStyle = col;
  const P = pts.map((p) => ({ x: p.x * w, y: p.y * h }));
  if (tool === "line" && P.length >= 2) {
    g.beginPath();
    g.moveTo(P[0].x, P[0].y);
    g.lineTo(P[1].x, P[1].y);
    g.stroke();
  } else if (tool === "circle" && P.length >= 2) {
    g.beginPath();
    g.arc(P[0].x, P[0].y, Math.hypot(P[1].x - P[0].x, P[1].y - P[0].y), 0, Math.PI * 2);
    g.stroke();
  } else if (tool === "pen" && P.length > 1) {
    g.beginPath();
    g.moveTo(P[0].x, P[0].y);
    P.slice(1).forEach((p) => g.lineTo(p.x, p.y));
    g.stroke();
  } else if (tool === "tracer") {
    if (P.length === 1) {
      g.beginPath();
      g.arc(P[0].x, P[0].y, 5, 0, Math.PI * 2);
      g.fill();
    } else if (P.length >= 2) {
      const C = smoothPath(P);
      const trace = () => {
        g.beginPath();
        g.moveTo(C[0].x, C[0].y);
        C.slice(1).forEach((q) => g.lineTo(q.x, q.y));
      };
      g.save();
      g.globalAlpha = 0.35;
      g.lineWidth = 9;
      trace();
      g.stroke();
      g.globalAlpha = 1;
      g.shadowColor = col;
      g.shadowBlur = 10;
      g.lineWidth = 3.5;
      trace();
      g.stroke();
      g.shadowBlur = 0;
      g.strokeStyle = "#fff";
      g.lineWidth = 1.2;
      trace();
      g.stroke();
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(C[0].x, C[0].y, 4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = col;
      g.beginPath();
      g.arc(C[C.length - 1].x, C[C.length - 1].y, 5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  } else if (tool === "angle") {
    P.forEach((p) => {
      g.beginPath();
      g.arc(p.x, p.y, 4, 0, Math.PI * 2);
      g.fill();
    });
    if (P.length >= 2) {
      g.beginPath();
      g.moveTo(P[0].x, P[0].y);
      g.lineTo(P[1].x, P[1].y);
      if (P.length === 3) g.lineTo(P[2].x, P[2].y);
      g.stroke();
    }
    if (P.length === 3) {
      const deg = angleAt(pts[0], pts[1], pts[2], w, h);
      const a1 = Math.atan2(P[0].y - P[1].y, P[0].x - P[1].x);
      const a2 = Math.atan2(P[2].y - P[1].y, P[2].x - P[1].x);
      let d = a2 - a1;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      g.beginPath();
      g.arc(P[1].x, P[1].y, 24, a1, a1 + d, d < 0);
      g.stroke();
      g.strokeStyle = "#000";
      g.lineWidth = 4;
      g.strokeText(`${Math.round(deg)}°`, P[1].x + 14, P[1].y - 14);
      g.lineWidth = 3;
      g.fillText(`${Math.round(deg)}°`, P[1].x + 14, P[1].y - 14);
    }
  }
}
