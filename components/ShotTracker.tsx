"use client";

import { useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/courses";
import { CLUBS, demoNext, loadRounds, project, saveRounds, shotsOf, toYards, type Mark, type ShotRound } from "@/lib/shots";

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
const newRound = (course: string): ShotRound => ({ id: `s${Date.now()}`, course, date: today(), holes: [] });

export default function ShotTracker() {
  const [rounds, setRounds] = useState<ShotRound[]>([]);
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hole, setHole] = useState(1);
  const [club, setClub] = useState("Driver");
  const [yards, setYards] = useState(false);
  const [demo, setDemo] = useState(false);
  const [course, setCourse] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Browser storage can only be read after mount, so this one-off load is intentional.
    const r = loadRounds();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRounds(r);
    if (r[0]) setActiveId(r[0].id);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveRounds(rounds);
  }, [rounds, ready]);

  const round = rounds.find((r) => r.id === activeId) ?? null;
  const marks = round?.holes.find((h) => h.hole === hole)?.marks ?? [];
  const shots = shotsOf(marks);
  const unit = yards ? "yd" : "m";
  const fmt = (m: number) => Math.round(yards ? toYards(m) : m);

  function start() {
    const r = newRound(course.trim() || "Practice round");
    setRounds((x) => [r, ...x]);
    setActiveId(r.id);
    setHole(1);
    setMsg("");
  }
  function addMark(m: Mark) {
    setRounds((all) =>
      all.map((r) => {
        if (r.id !== activeId) return r;
        const has = r.holes.some((h) => h.hole === hole);
        const holes = has
          ? r.holes.map((h) => (h.hole === hole ? { ...h, marks: [...h.marks, m] } : h))
          : [...r.holes, { hole, marks: [m] }];
        return { ...r, holes };
      }),
    );
  }
  function mark() {
    setMsg("");
    const withClub = { club };
    if (demo) {
      addMark({ ...demoNext(marks[marks.length - 1], marks.length + hole * 7 + rounds.length), ...withClub });
      return;
    }
    if (!("geolocation" in navigator)) {
      setMsg("This device cannot share its location. Try demo mode to see how it works.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setBusy(false);
        addMark({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, ts: Date.now(), ...withClub });
        if (p.coords.accuracy > 25) setMsg(`GPS is only accurate to about ${Math.round(p.coords.accuracy)} m right now. Distances may be off. Wait a moment in open sky and mark again.`);
      },
      (e) => {
        setBusy(false);
        setMsg(e.code === 1 ? "Location is blocked. Allow it for this site in your browser settings, or use demo mode." : "Could not get a GPS fix. Try again in open sky.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }
  function undo() {
    setRounds((all) => all.map((r) => (r.id === activeId ? { ...r, holes: r.holes.map((h) => (h.hole === hole ? { ...h, marks: h.marks.slice(0, -1) } : h)) } : r)));
  }
  function clearHole() {
    setRounds((all) => all.map((r) => (r.id === activeId ? { ...r, holes: r.holes.filter((h) => h.hole !== hole) } : r)));
  }
  function remove(id: string) {
    setRounds((all) => all.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  }

  // Map geometry
  const W = 320, H = 240, PAD = 30;
  const P = project(marks);
  const xs = P.map((p) => p.x), ys = P.map((p) => p.y);
  const spanX = Math.max(40, Math.max(0, ...xs) - Math.min(0, ...xs));
  const spanY = Math.max(40, Math.max(0, ...ys) - Math.min(0, ...ys));
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const cx = (Math.max(0, ...xs) + Math.min(0, ...xs)) / 2;
  const cy = (Math.max(0, ...ys) + Math.min(0, ...ys)) / 2;
  const sx = (x: number) => W / 2 + (x - cx) * scale;
  const sy = (y: number) => H / 2 + (y - cy) * scale;
  const barM = [10, 20, 50, 100, 200].find((b) => b * scale >= 40) ?? 200;

  const clubAvg = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const r of rounds) for (const h of r.holes) for (const s of shotsOf(h.marks)) if (s.club && s.club !== "Putter") map.set(s.club, [...(map.get(s.club) ?? []), s.metres]);
    return CLUBS.filter((c) => map.has(c)).map((c) => {
      const v = map.get(c)!;
      return { club: c, n: v.length, avg: v.reduce((a, b) => a + b, 0) / v.length, best: Math.max(...v) };
    });
  }, [rounds]);

  const holeTotal = (h: { marks: Mark[] }) => shotsOf(h.marks).reduce((a, s) => a + s.metres, 0);

  return (
    <div className="grid gap-8">
      <section className="glass rounded-2xl p-5">
        {!round ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm font-semibold">
              Course
              <input list="shot-courses" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Start typing a course" className="field-input mt-1" />
              <datalist id="shot-courses">
                {courses.map((c) => (
                  <option key={c.slug} value={c.name} />
                ))}
              </datalist>
            </label>
            <button type="button" className="btn !px-6 !py-2.5 !text-sm" onClick={start}>Start tracking</button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-2xl">{round.course}</p>
              <p className="text-sm text-white/60">{round.date}</p>
            </div>
            <button type="button" className="rounded-full border border-white/25 px-4 py-1.5 text-sm font-semibold hover:border-lime" onClick={() => setActiveId(null)}>
              New round
            </button>
          </div>
        )}
      </section>

      {round && (
        <section className="glass rounded-2xl p-5">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Hole">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => {
              const done = round.holes.some((h) => h.hole === n && h.marks.length > 1);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setHole(n)}
                  aria-pressed={hole === n}
                  className={`h-8 w-8 rounded-full border text-xs font-bold ${hole === n ? "border-lime bg-lime text-black" : done ? "border-lime/60 text-lime" : "border-white/25 text-white/85 hover:border-lime"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-[#0d2a14]">
            <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Your shots on hole ${hole}`}>
              <rect width={W} height={H} fill="#12361b" />
              {marks.length === 0 && (
                <text x={W / 2} y={H / 2} textAnchor="middle" fontSize="11" fill="#ffffff" opacity=".6">
                  Stand on the tee and tap Mark shot
                </text>
              )}
              {P.length > 1 && (
                <polyline points={P.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ")} fill="none" stroke="#c6ff3d" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
              )}
              {P.slice(1).map((p, i) => {
                const a = P[i];
                const mx = (sx(a.x) + sx(p.x)) / 2, my = (sy(a.y) + sy(p.y)) / 2;
                return (
                  <text key={i} x={mx} y={my - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" stroke="#000" strokeWidth="3" paintOrder="stroke">
                    {fmt(shots[i].metres)} {unit}
                  </text>
                );
              })}
              {P.map((p, i) => (
                <g key={i}>
                  <circle cx={sx(p.x)} cy={sy(p.y)} r="8" fill={i === 0 ? "#c6ff3d" : "#0a0a0a"} stroke="#c6ff3d" />
                  <text x={sx(p.x)} y={sy(p.y) + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={i === 0 ? "#000" : "#c6ff3d"}>{i === 0 ? "T" : i}</text>
                </g>
              ))}
              {marks.length > 0 && (
                <g>
                  <line x1="14" y1={H - 14} x2={14 + barM * scale} y2={H - 14} stroke="#fff" strokeWidth="2" />
                  <text x="14" y={H - 20} fontSize="9" fill="#fff">{fmt(barM)} {unit}</text>
                </g>
              )}
            </svg>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <label className="text-sm font-semibold">
              Club you are about to hit
              <select value={club} onChange={(e) => setClub(e.target.value)} className="field-input mt-1">
                {CLUBS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button type="button" className="btn !px-6 !py-2.5 !text-sm disabled:opacity-60" disabled={busy} onClick={mark}>
              {busy ? "Finding GPS..." : marks.length === 0 ? "Mark tee" : "Mark ball here"}
            </button>
            <div className="flex gap-2">
              <button type="button" className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-lime disabled:opacity-40" disabled={!marks.length} onClick={undo}>Undo</button>
              <button type="button" className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-lime disabled:opacity-40" disabled={!marks.length} onClick={clearHole}>Clear hole</button>
            </div>
          </div>
          <p className="mt-2 text-sm text-white/65">
            Mark the tee, hit, walk to your ball and mark it. Each gap becomes a shot. Mark the hole last so the final putt counts. Pick the club before you hit.
          </p>
          {msg && <p className="mt-2 text-sm text-[#ffd23d]" role="status">{msg}</p>}

          {shots.length > 0 && (
            <ol className="mt-4 divide-y divide-white/10 rounded-xl border border-white/15 text-sm">
              {shots.map((s) => (
                <li key={s.n} className="flex items-center justify-between px-4 py-2">
                  <span>Shot {s.n}{s.club ? ` · ${s.club}` : ""}</span>
                  <span className="font-display text-xl text-lime">{fmt(s.metres)} <span className="text-sm normal-case">{unit}</span></span>
                </li>
              ))}
              <li className="flex items-center justify-between px-4 py-2 text-white/70">
                <span>Hole {hole} total</span>
                <span>{fmt(holeTotal({ marks }))} {unit}</span>
              </li>
            </ol>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={yards} onChange={(e) => setYards(e.target.checked)} /> Show yards
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} /> Demo mode (made-up positions, no GPS)
            </label>
          </div>
        </section>
      )}

      {clubAvg.length > 0 && (
        <section>
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Your distances by club</h2>
          <div className="glass mt-3 overflow-x-auto rounded-2xl p-2">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-white/50">
                <tr><th className="p-3">Club</th><th className="p-3">Shots</th><th className="p-3">Average</th><th className="p-3">Longest</th></tr>
              </thead>
              <tbody>
                {clubAvg.map((c) => (
                  <tr key={c.club} className="border-t border-white/10">
                    <td className="p-3 font-semibold">{c.club}</td><td className="p-3">{c.n}</td><td className="p-3">{fmt(c.avg)} {unit}</td><td className="p-3">{fmt(c.best)} {unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {rounds.length > 0 && (
        <section>
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Tracked rounds</h2>
          <ul className="mt-3 grid gap-2">
            {rounds.map((r) => {
              const n = r.holes.reduce((a, h) => a + shotsOf(h.marks).length, 0);
              return (
                <li key={r.id} className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm">
                  <button type="button" className="text-left" onClick={() => setActiveId(r.id)}>
                    <span className="font-semibold">{r.course}</span>
                    <span className="block text-white/60">{r.date} · {r.holes.length} holes · {n} shots</span>
                  </button>
                  <button type="button" className="text-white/60 underline-offset-4 hover:text-white hover:underline" onClick={() => remove(r.id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="text-xs text-white/50">
        Your positions are only read when you tap Mark and stay on this device in this version. GPS in a phone is usually good to 3 to 10 metres in the open, so treat distances as a guide.
      </p>
    </div>
  );
}
