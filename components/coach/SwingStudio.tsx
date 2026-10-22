"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Pt = { x: number; y: number }; // 0..1 of the video frame
type Tool = "line" | "circle" | "angle" | "pen";
type Stroke = {
  id: number;
  view: number;
  tool: Tool;
  pts: Pt[];
  color: string;
  atMs: number | null; // time in the recording when drawn. null = drawn before recording
  removedMs: number | null;
};
type Ev = { ms: number; view: number; kind: "seek" | "play" | "pause" | "rate"; v: number };

const COLORS = ["#c6ff3d", "#ffffff", "#ff4d4d", "#4db8ff"];
const SPEEDS = [0.25, 0.5, 1];

const clock = () => performance.now();

function angleAt(a: Pt, b: Pt, c: Pt, w: number, h: number) {
  const v1 = { x: (a.x - b.x) * w, y: (a.y - b.y) * h };
  const v2 = { x: (c.x - b.x) * w, y: (c.y - b.y) * h };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  return m ? (Math.acos(Math.max(-1, Math.min(1, dot / m))) * 180) / Math.PI : 0;
}

export default function SwingStudio() {
  const [srcs, setSrcs] = useState<(string | null)[]>([null, null]);
  const [tool, setTool] = useState<Tool>("line");
  const [color, setColor] = useState(COLORS[0]);
  const [speed, setSpeed] = useState(1);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [pending, setPending] = useState<{ view: number; pts: Pt[] } | null>(null);
  const [drag, setDrag] = useState<{ view: number; pts: Pt[] } | null>(null);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [phase, setPhase] = useState<"edit" | "countdown" | "recording" | "replay">("edit");
  const [count, setCount] = useState(3);
  const [replayMs, setReplayMs] = useState(0);
  const [micError, setMicError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const vids = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const cans = useRef<(HTMLCanvasElement | null)[]>([null, null]);
  const nextId = useRef(1);
  const events = useRef<Ev[]>([]);
  const recStart = useRef(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);

  const views = srcs[1] ? 2 : srcs[0] ? 1 : 0;
  const nowMs = () => clock() - recStart.current;
  const recording = phase === "recording";

  const log = useCallback((view: number, kind: Ev["kind"], v: number) => {
    if (recording) events.current.push({ ms: nowMs(), view, kind, v });
  }, [recording]);

  function load(view: number, file: File | undefined) {
    if (!file) return;
    setSrcs((s) => {
      if (s[view]) URL.revokeObjectURL(s[view] as string);
      const n = [...s];
      n[view] = URL.createObjectURL(file);
      return n;
    });
    setStrokes((st) => st.filter((x) => x.view !== view));
  }

  const visible = useCallback(
    (s: Stroke) => {
      if (phase === "replay") {
        if (s.atMs === null) return true;
        return s.atMs <= replayMs && (s.removedMs === null || s.removedMs > replayMs);
      }
      return s.removedMs === null;
    },
    [phase, replayMs],
  );

  // Redraw overlays
  useEffect(() => {
    for (let v = 0; v < 2; v++) {
      const c = cans.current[v];
      if (!c) continue;
      const w = c.clientWidth;
      const h = c.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      const g = c.getContext("2d");
      if (!g) continue;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.lineWidth = 3;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.font = "700 16px sans-serif";
      const draw = (tool: Tool, pts: Pt[], col: string) => {
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
      };
      strokes.filter((s) => s.view === v && visible(s)).forEach((s) => draw(s.tool, s.pts, s.color));
      if (pending?.view === v) draw("angle", pending.pts, color);
      if (drag?.view === v) draw(tool, drag.pts, color);
    }
  }, [strokes, pending, drag, tool, color, visible, srcs, time]);

  // Keep time/duration in state for the scrubber
  useEffect(() => {
    const v = vids.current[0];
    if (!v) return;
    const upd = () => {
      setTime(v.currentTime);
      setDur(v.duration || 0);
    };
    v.addEventListener("timeupdate", upd);
    v.addEventListener("loadedmetadata", upd);
    return () => {
      v.removeEventListener("timeupdate", upd);
      v.removeEventListener("loadedmetadata", upd);
    };
  }, [srcs]);

  function allVids(fn: (v: HTMLVideoElement, i: number) => void) {
    vids.current.forEach((v, i) => v && fn(v, i));
  }
  function play() {
    allVids((v, i) => {
      v.playbackRate = speed;
      void v.play();
      log(i, "play", 0);
    });
  }
  function pause() {
    allVids((v, i) => {
      v.pause();
      log(i, "pause", v.currentTime);
    });
  }
  function seek(t: number) {
    allVids((v, i) => {
      v.currentTime = Math.max(0, Math.min(t, v.duration || t));
      log(i, "seek", v.currentTime);
    });
    setTime(t);
  }
  function setRate(r: number) {
    setSpeed(r);
    allVids((v, i) => {
      v.playbackRate = r;
      log(i, "rate", r);
    });
  }

  // Pointer drawing
  function pos(e: React.PointerEvent): Pt {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  function add(view: number, t: Tool, pts: Pt[]) {
    setStrokes((s) => [
      ...s,
      { id: nextId.current++, view, tool: t, pts, color, atMs: recording ? nowMs() : null, removedMs: null },
    ]);
  }
  function down(e: React.PointerEvent, view: number) {
    if (phase === "replay") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = pos(e);
    if (tool === "angle") {
      const pts = pending?.view === view ? [...pending.pts, p] : [p];
      if (pts.length === 3) {
        add(view, "angle", pts);
        setPending(null);
      } else setPending({ view, pts });
      return;
    }
    setDrag({ view, pts: [p, p] });
  }
  function move(e: React.PointerEvent, view: number) {
    if (!drag || drag.view !== view) return;
    const p = pos(e);
    setDrag((d) => (d ? { ...d, pts: tool === "pen" ? [...d.pts, p] : [d.pts[0], p] } : d));
  }
  function up() {
    if (drag) {
      const long = drag.pts.length > 2 || Math.hypot(drag.pts[1].x - drag.pts[0].x, drag.pts[1].y - drag.pts[0].y) > 0.01;
      if (long) add(drag.view, tool, drag.pts);
      setDrag(null);
    }
  }
  function undo() {
    setPending(null);
    setStrokes((s) => {
      const last = [...s].reverse().find((x) => x.removedMs === null);
      if (!last) return s;
      if (!recording) return s.filter((x) => x.id !== last.id);
      return s.map((x) => (x.id === last.id ? { ...x, removedMs: nowMs() } : x));
    });
  }
  function clearAll() {
    setPending(null);
    setStrokes((s) =>
      recording ? s.map((x) => (x.removedMs === null ? { ...x, removedMs: nowMs() } : x)) : [],
    );
  }

  // Recording
  async function startRecording() {
    setMicError("");
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError("Microphone blocked. Allow it in your browser to record a voiceover.");
      return;
    }
    pause();
    setPhase("countdown");
    setCount(3);
    let n = 3;
    const iv = window.setInterval(() => {
      n--;
      setCount(n);
      if (n === 0) {
        window.clearInterval(iv);
        chunks.current = [];
        const mr = new MediaRecorder(stream.current as MediaStream);
        mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
        mr.onstop = () => {
          stream.current?.getTracks().forEach((t) => t.stop());
          const url = URL.createObjectURL(new Blob(chunks.current, { type: mr.mimeType || "audio/webm" }));
          setAudioUrl((old) => {
            if (old) URL.revokeObjectURL(old);
            return url;
          });
        };
        recorder.current = mr;
        events.current = [];
        // snapshot where the videos start from
        allVids((v, i) => events.current.push({ ms: 0, view: i, kind: "seek", v: v.currentTime }));
        // pre-existing strokes stay visible; new ones are timestamped
        recStart.current = clock();
        mr.start();
        setPhase("recording");
      }
    }, 1000);
  }
  function stopRecording() {
    pause();
    recorder.current?.stop();
    setPhase("edit");
  }

  function stopReplay() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    audioEl.current?.pause();
    allVids((v) => v.pause());
    setPhase("edit");
  }
  function replay() {
    if (!audioUrl) return;
    setPhase("replay");
    setReplayMs(0);
    const a = audioEl.current as HTMLAudioElement;
    a.currentTime = 0;
    const t0 = clock();
    const evs = events.current;
    const first = evs.filter((e) => e.ms === 0);
    first.forEach((e) => {
      const v = vids.current[e.view];
      if (v) v.currentTime = e.v;
    });
    void a.play();
    const tick = window.setInterval(() => setReplayMs(clock() - t0), 50);
    timers.current.push(tick);
    evs
      .filter((e) => e.ms > 0)
      .forEach((e) => {
        timers.current.push(
          window.setTimeout(() => {
            const v = vids.current[e.view];
            if (!v) return;
            if (e.kind === "seek") v.currentTime = e.v;
            if (e.kind === "pause") v.pause();
            if (e.kind === "play") void v.play();
            if (e.kind === "rate") v.playbackRate = e.v;
          }, e.ms),
        );
      });
    a.onended = () => {
      window.clearInterval(tick);
      stopReplay();
    };
    // speeds recorded before the first play
    const rate = evs.find((e) => e.kind === "rate");
    if (rate) allVids((v) => (v.playbackRate = rate.v));
  }

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const btn = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-semibold ${on ? "border-lime bg-lime text-black" : "border-white/25 hover:border-lime"}`;

  return (
    <div>
      {views === 0 && (
        <div className="glass grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
          {["Back angle", "Side angle"].map((label, i) => (
            <label key={label} className="block cursor-pointer rounded-xl border border-dashed border-white/30 p-6 text-center hover:border-lime">
              <span className="font-display text-xl text-lime">{label}</span>
              <span className="mt-1 block text-sm text-white/70">Choose a swing clip</span>
              <input type="file" accept="video/*" className="sr-only" data-testid={`file-${i}`} onChange={(e) => load(i, e.target.files?.[0])} />
            </label>
          ))}
          <p className="text-sm text-white/60 sm:col-span-2">
            Clips stay on your device in this concept. Load one angle or both for a side by side review.
          </p>
        </div>
      )}

      {views > 0 && (
        <>
          <div className={`grid gap-2 ${views === 2 ? "sm:grid-cols-2" : ""}`}>
            {[0, 1].map(
              (v) =>
                srcs[v] && (
                  <div key={v} className={`relative mx-auto aspect-[9/12] w-full overflow-hidden rounded-xl bg-black ${views === 2 ? "max-w-md sm:max-w-none" : "max-w-md"}`}>
                    <video
                      ref={(el) => {
                        vids.current[v] = el;
                      }}
                      src={srcs[v] as string}
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <canvas
                      ref={(el) => {
                        cans.current[v] = el;
                      }}
                      data-testid={`canvas-${v}`}
                      className="absolute inset-0 h-full w-full touch-none"
                      style={{ cursor: "crosshair" }}
                      onPointerDown={(e) => down(e, v)}
                      onPointerMove={(e) => move(e, v)}
                      onPointerUp={up}
                    />
                    <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-bold">
                      {v === 0 ? "Back" : "Side"}
                    </span>
                    {phase === "countdown" && (
                      <div className="absolute inset-0 grid place-items-center bg-black/60">
                        <span className="font-display text-[8rem] text-lime">{count}</span>
                      </div>
                    )}
                    {recording && (
                      <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-xs font-bold">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> REC
                      </span>
                    )}
                  </div>
                ),
            )}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button type="button" className={btn(false)} onClick={() => (vids.current[0]?.paused ? play() : pause())}>
              Play / pause
            </button>
            <button type="button" className={btn(false)} onClick={() => seek(time - 1 / 30)} aria-label="Back one frame">
              &laquo;
            </button>
            <button type="button" className={btn(false)} onClick={() => seek(time + 1 / 30)} aria-label="Forward one frame">
              &raquo;
            </button>
            <input
              type="range"
              min={0}
              max={dur || 1}
              step={0.01}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[#c6ff3d]"
              aria-label="Scrub"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(["line", "circle", "angle", "pen"] as Tool[]).map((t) => (
              <button key={t} type="button" onClick={() => { setTool(t); setPending(null); }} className={btn(tool === t)}>
                {t === "angle" ? "Angle" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            {COLORS.map((c) => (
              <button key={c} type="button" aria-label={`Colour ${c}`} onClick={() => setColor(c)} className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`} style={{ background: c }} />
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            {SPEEDS.map((s) => (
              <button key={s} type="button" onClick={() => setRate(s)} className={btn(speed === s)}>
                {s}x
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            <button type="button" className={btn(false)} onClick={undo}>Undo</button>
            <button type="button" className={btn(false)} onClick={clearAll}>Clear</button>
          </div>
          {tool === "angle" && <p className="mt-2 text-sm text-white/65">Tap three points. The middle one is the joint.</p>}

          <div className="glass mt-6 rounded-2xl p-5">
            <p className="font-display text-2xl">Voiceover review</p>
            <p className="mt-1 text-sm text-white/75">
              Talk through the swing while you draw and slow it down. The golfer sees your drawings appear as you speak.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {phase === "edit" && (
                <button type="button" className="btn !px-6 !py-2.5 !text-sm" onClick={startRecording}>
                  Record review
                </button>
              )}
              {recording && (
                <button type="button" className="btn !bg-red-600 !px-6 !py-2.5 !text-sm !text-white" onClick={stopRecording}>
                  Stop recording
                </button>
              )}
              {phase === "edit" && audioUrl && (
                <button type="button" className={btn(false)} onClick={replay}>
                  Play review as the golfer sees it
                </button>
              )}
              {phase === "replay" && (
                <button type="button" className={btn(true)} onClick={stopReplay}>
                  Stop playback
                </button>
              )}
              {audioUrl && phase === "edit" && (
                <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                  Review ready
                </span>
              )}
            </div>
            {micError && <p className="mt-3 text-sm text-red-400">{micError}</p>}
            {audioUrl && <audio ref={audioEl} src={audioUrl} className="hidden" />}
            {audioUrl && (
              <p className="mt-3 text-sm text-white/60">
                In the live version, Send to student drops this review into their messages and My Videos.
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-3 text-sm">
            {!srcs[1] && (
              <label className="cursor-pointer text-lime underline-offset-4 hover:underline">
                Add side angle for side by side
                <input type="file" accept="video/*" className="sr-only" onChange={(e) => load(1, e.target.files?.[0])} />
              </label>
            )}
            <label className="cursor-pointer text-white/70 underline-offset-4 hover:underline">
              Change clip
              <input type="file" accept="video/*" className="sr-only" onChange={(e) => load(0, e.target.files?.[0])} />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
