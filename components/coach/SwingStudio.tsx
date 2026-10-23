"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveReview } from "@/lib/reviewStore";
import { drawShape, prepCanvas, type Ev, type Pt, type Stroke, type Tool } from "@/lib/swingDraw";

const COLORS = ["#c6ff3d", "#ffffff", "#ff4d4d", "#4db8ff"];
const SPEEDS = [0.25, 0.5, 1];
const SLOTS = 4;
const SLOT_IDX = [0, 1, 2, 3];
const defaultLabel = (i: number) => (i === 0 ? "Before" : i === 1 ? "After" : `Photo ${i + 1}`);

/** Distance in px from point (px,py) to segment a-b. */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function hits(st: Stroke, p: Pt, w: number, h: number) {
  const P = st.pts.map((q) => ({ x: q.x * w, y: q.y * h }));
  const x = p.x * w;
  const y = p.y * h;
  const R = 14;
  if (st.tool === "circle" && P.length >= 2) {
    const r = Math.hypot(P[1].x - P[0].x, P[1].y - P[0].y);
    return Math.abs(Math.hypot(x - P[0].x, y - P[0].y) - r) < R || Math.hypot(x - P[0].x, y - P[0].y) < R;
  }
  if (st.tool === "angle") {
    if (P.some((q) => Math.hypot(x - q.x, y - q.y) < R)) return true;
  }
  for (let i = 0; i < P.length - 1; i++) if (segDist(x, y, P[i].x, P[i].y, P[i + 1].x, P[i + 1].y) < R) return true;
  return false;
}

const clock = () => performance.now();
const stamp = () => Date.now();

export default function SwingStudio() {
  const [srcs, setSrcs] = useState<(string | null)[]>(Array(SLOTS).fill(null));
  const [files, setFiles] = useState<(File | null)[]>(Array(SLOTS).fill(null));
  const [labels, setLabels] = useState<string[]>(SLOT_IDX.map(defaultLabel));
  const moving = useRef<{ id: number; view: number; last: Pt } | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const audioBlob = useRef<Blob | null>(null);
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

  const vids = useRef<(HTMLVideoElement | null)[]>(Array(SLOTS).fill(null));
  const cans = useRef<(HTMLCanvasElement | null)[]>(Array(SLOTS).fill(null));
  const nextId = useRef(1);
  const events = useRef<Ev[]>([]);
  const recStart = useRef(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const timers = useRef<number[]>([]);

  const views = srcs.filter(Boolean).length;
  const isImage = (v: number) => !!files[v]?.type.startsWith("image/");
  const hasVideo = srcs.some((x, i) => x && !isImage(i));
  const nowMs = () => clock() - recStart.current;
  const recording = phase === "recording";

  const log = useCallback((view: number, kind: Ev["kind"], v: number) => {
    if (recording) events.current.push({ ms: nowMs(), view, kind, v });
  }, [recording]);

  function load(view: number, file: File | undefined) {
    if (!file) return;
    setFiles((f) => f.map((x, i) => (i === view ? file : x)));
    setSrcs((s) => {
      if (s[view]) URL.revokeObjectURL(s[view] as string);
      const n = [...s];
      n[view] = URL.createObjectURL(file);
      return n;
    });
    setStrokes((st) => st.filter((x) => x.view !== view));
  }
  /** Drop several chosen files into the empty slots in order. */
  function loadMany(list: FileList | null | undefined) {
    if (!list) return;
    const free = SLOT_IDX.filter((i) => !srcs[i]);
    Array.from(list)
      .slice(0, free.length)
      .forEach((f, k) => load(free[k], f));
  }
  function removeView(view: number) {
    setSrcs((s) => {
      if (s[view]) URL.revokeObjectURL(s[view] as string);
      return s.map((x, i) => (i === view ? null : x));
    });
    setFiles((f) => f.map((x, i) => (i === view ? null : x)));
    setStrokes((st) => st.filter((x) => x.view !== view));
    vids.current[view] = null;
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
    for (let v = 0; v < SLOTS; v++) {
      const c = cans.current[v];
      if (!c) continue;
      const prep = prepCanvas(c);
      if (!prep) continue;
      const { g, w, h } = prep;
      const draw = (tool: Tool, pts: Pt[], col: string) => drawShape(g, w, h, tool, pts, col);
      strokes.filter((s) => s.view === v && visible(s)).forEach((s) => draw(s.tool, s.pts, s.color));
      if (pending?.view === v) draw(tool === "tracer" ? "tracer" : "angle", pending.pts, color);
      if (drag?.view === v) draw(tool, drag.pts, color);
    }
  }, [strokes, pending, drag, tool, color, visible, srcs, time]);

  // Keep time/duration in state for the scrubber
  useEffect(() => {
    const v = vids.current[0] ?? vids.current[1];
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

  async function saveToMyGolf() {
    const used = SLOT_IDX.filter((i) => srcs[i] && files[i]);
    if (!used.length) return;
    const media = used.map((i) => {
      const f = files[i] as File;
      return { kind: (f.type.startsWith("image/") ? "image" : "video") as "image" | "video", blob: f as Blob, name: f.name, label: labels[i] };
    });
    const map = new Map(used.map((slot, k) => [slot, k]));
    const now = stamp();
    const id = String(now);
    const label = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    await saveReview({
      id,
      title: `Swing review from Matt, ${label}`,
      createdAt: now,
      media,
      strokes: strokes.filter((x) => map.has(x.view)).map((x) => ({ ...x, view: map.get(x.view) as number })),
      events: events.current.filter((e) => map.has(e.view)).map((e) => ({ ...e, view: map.get(e.view) as number })),
      audio: audioBlob.current,
    });
    setSaved(id);
  }

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
    if (tool === "move") {
      if (recording) return;
      const el = e.currentTarget as HTMLElement;
      const hit = [...strokes].reverse().find((x) => x.view === view && x.removedMs === null && hits(x, p, el.clientWidth, el.clientHeight));
      moving.current = hit ? { id: hit.id, view, last: p } : null;
      return;
    }
    if (tool === "tracer") {
      const pts = pending?.view === view ? [...pending.pts, p] : [p];
      setPending({ view, pts });
      return;
    }
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
    if (moving.current && moving.current.view === view) {
      const p = pos(e);
      const { id, last } = moving.current;
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      moving.current = { id, view, last: p };
      setStrokes((st) => st.map((x) => (x.id === id ? { ...x, pts: x.pts.map((q) => ({ x: Math.max(0, Math.min(1, q.x + dx)), y: Math.max(0, Math.min(1, q.y + dy)) })) } : x)));
      return;
    }
    if (!drag || drag.view !== view) return;
    const p = pos(e);
    setDrag((d) => (d ? { ...d, pts: tool === "pen" ? [...d.pts, p] : [d.pts[0], p] } : d));
  }
  function up() {
    moving.current = null;
    if (drag) {
      const long = drag.pts.length > 2 || Math.hypot(drag.pts[1].x - drag.pts[0].x, drag.pts[1].y - drag.pts[0].y) > 0.01;
      if (long) add(drag.view, tool, drag.pts);
      setDrag(null);
    }
  }
  function finishTracer() {
    if (pending && pending.pts.length >= 2) add(pending.view, "tracer", pending.pts);
    setPending(null);
  }
  function undo() {
    if (pending && pending.pts.length > 1) {
      setPending({ view: pending.view, pts: pending.pts.slice(0, -1) });
      return;
    }
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
          const blob = new Blob(chunks.current, { type: mr.mimeType || "audio/webm" });
          audioBlob.current = blob;
          const url = URL.createObjectURL(blob);
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
          {["Before", "After"].map((label, i) => (
            <label key={label} className="block cursor-pointer rounded-xl border border-dashed border-white/30 p-6 text-center hover:border-lime">
              <span className="font-display text-xl text-lime">{label}</span>
              <span className="mt-1 block text-sm text-white/70">Choose a clip or photo</span>
              <input type="file" accept="video/*,image/*" className="sr-only" data-testid={`file-${i}`} onChange={(e) => load(i, e.target.files?.[0])} />
            </label>
          ))}
          <label className="block cursor-pointer rounded-xl border border-white/25 p-3 text-center text-sm font-semibold hover:border-lime sm:col-span-2">
            Or choose several photos or clips at once
            <input type="file" multiple accept="video/*,image/*" className="sr-only" data-testid="file-many" onChange={(e) => loadMany(e.target.files)} />
          </label>
          <p className="text-sm text-white/60 sm:col-span-2">
            Compare a swing before and after a correction, or two angles side by side. Add up to four. Clips and photos stay on your device in this concept.
          </p>
        </div>
      )}

      {views > 0 && (
        <>
          <div className={`grid gap-2 ${views >= 2 ? "sm:grid-cols-2" : ""}`}>
            {SLOT_IDX.map(
              (v) =>
                srcs[v] && (
                  <div key={v} className={`relative mx-auto aspect-[9/12] w-full overflow-hidden rounded-xl bg-black ${views >= 2 ? "max-w-md sm:max-w-none" : "max-w-md"}`}>
                    {isImage(v) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={srcs[v] as string} alt="" className="absolute inset-0 h-full w-full object-contain" />
                    ) : (
                      <video
                        ref={(el) => {
                          vids.current[v] = el;
                        }}
                        src={srcs[v] as string}
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    )}
                    <canvas
                      ref={(el) => {
                        cans.current[v] = el;
                      }}
                      data-testid={`canvas-${v}`}
                      className="absolute inset-0 h-full w-full touch-none"
                      style={{ cursor: tool === "move" ? "grab" : "crosshair" }}
                      onPointerDown={(e) => down(e, v)}
                      onPointerMove={(e) => move(e, v)}
                      onPointerUp={up}
                    />
                    <input
                      value={labels[v]}
                      maxLength={20}
                      aria-label="Label"
                      disabled={phase !== "edit"}
                      onChange={(e) => setLabels((l) => l.map((x, i) => (i === v ? e.target.value : x)))}
                      className="absolute left-2 top-2 w-28 rounded bg-black/60 px-2 py-0.5 text-xs font-bold outline-none focus:ring-1 focus:ring-lime"
                    />
                    {phase === "edit" && (
                      <button type="button" aria-label="Remove" onClick={() => removeView(v)} className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-sm font-bold hover:bg-red-600">
                        &times;
                      </button>
                    )}
                    {phase === "countdown" && (
                      <div className="absolute inset-0 grid place-items-center bg-black/60">
                        <span className="font-display text-[8rem] text-lime">{count}</span>
                      </div>
                    )}
                    {recording && (
                      <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-xs font-bold">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> REC
                      </span>
                    )}
                  </div>
                ),
            )}
          </div>

          {hasVideo && (
          <div className="mt-3 flex items-center gap-3">
            <button type="button" className={btn(false)} onClick={() => ((vids.current[0] ?? vids.current[1])?.paused ? play() : pause())}>
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
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(["line", "circle", "angle", "pen", "tracer", "move"] as Tool[]).map((t) => (
              <button key={t} type="button" disabled={t === "move" && recording} onClick={() => { setTool(t); setPending(null); }} className={`${btn(tool === t)} disabled:opacity-40`}>
                {t === "angle" ? "Angle" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            {COLORS.map((c) => (
              <button key={c} type="button" aria-label={`Colour ${c}`} onClick={() => setColor(c)} className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`} style={{ background: c }} />
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            {hasVideo && (
              <>
                {SPEEDS.map((s) => (
                  <button key={s} type="button" onClick={() => setRate(s)} className={btn(speed === s)}>
                    {s}x
                  </button>
                ))}
                <span className="mx-1 h-5 w-px bg-white/20" />
              </>
            )}
            <button type="button" className={btn(false)} onClick={undo}>Undo</button>
            <button type="button" className={btn(false)} onClick={clearAll}>Clear</button>
          </div>
          {tool === "angle" && <p className="mt-2 text-sm text-white/65">Tap three points. The middle one is the joint.</p>}
          {tool === "tracer" && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/65">
              <p>Tap the ball, then a few points along its flight, ending where it lands. Three to six taps gives the smoothest arc.</p>
              <button type="button" className={`${btn(true)} disabled:opacity-40`} disabled={!pending || pending.pts.length < 2} onClick={finishTracer}>
                Draw tracer
              </button>
            </div>
          )}
          {tool === "move" && <p className="mt-2 text-sm text-white/65">Drag a line, circle or angle to reposition it. Moving is off while recording.</p>}

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
              {phase === "edit" && views > 0 && (
                <button type="button" className={btn(false)} onClick={saveToMyGolf}>
                  Save to Chloe&apos;s My Golf
                </button>
              )}
              {audioUrl && phase === "edit" && (
                <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                  Review ready
                </span>
              )}
            </div>
            {saved && (
              <p className="mt-3 text-sm text-lime">
                Saved. <a href={`/my-golf/review?id=${saved}`} className="underline">Open it as Chloe sees it</a> or find it under My videos on{" "}
                <a href="/my-golf" className="underline">My Golf</a>.
              </p>
            )}
            {micError && <p className="mt-3 text-sm text-red-400">{micError}</p>}
            {audioUrl && <audio ref={audioEl} src={audioUrl} className="hidden" />}
            {audioUrl && (
              <p className="mt-3 text-sm text-white/60">
                In the live version, Send to student drops this review into their messages and My Videos.
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            {views < SLOTS && (
              <label className="cursor-pointer text-lime underline-offset-4 hover:underline">
                Add photos or clips to compare
                <input type="file" multiple accept="video/*,image/*" className="sr-only" data-testid="add-more" onChange={(e) => loadMany(e.target.files)} />
              </label>
            )}
          </div>
        </>
      )}
    </div>
  );
}
