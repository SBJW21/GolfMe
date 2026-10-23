"use client";

import { useEffect, useMemo, useState } from "react";
import { courses } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";
import CourseMap, { findCourse } from "@/components/CourseMap";
import { CLUBS, demoRoute, loadRounds, saveRounds, shotsOf, toYards, type Mark, type ShotRound } from "@/lib/shots";

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
      const next = demoMarks[marks.length];
      if (!next) {
        setMsg("That hole is finished. Pick the next hole above.");
        return;
      }
      const k = marks.length;
      const demoClub = k >= Math.max(1, demoPar - 2) ? "Putter" : k === 0 && demoPar > 3 ? "Driver" : "7 iron";
      addMark({ ...next, club: demoClub });
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

  // Hole facts: only used when the course card is verified. Otherwise the map scales to your own marks.
  const cm = round ? findCourse(round.course) : undefined;
  const info = cm ? courseDetails[cm.slug]?.holeData?.find((h) => h.n === hole) : undefined;
  const knownM = info?.metres;
  const demoLen = knownM ?? 340;
  const demoPar = info?.par ?? 4;
  const demoMarks = demoRoute(demoLen, demoPar, hole * 11 + (round?.id.length ?? 0));

  // Progress along the hole: how far each shot took you, against the hole length when it is verified
  const along = shots.reduce<number[]>((acc, x) => [...acc, (acc[acc.length - 1] ?? 0) + x.metres], []);
  const reach = Math.max(knownM ?? 0, along[along.length - 1] ?? 0, 1);

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

          <div className="mt-4">
            <CourseMap name={round.course} holeData={cm ? courseDetails[cm.slug]?.holeData : undefined} selected={hole} />
          </div>
          <div className="mt-3 rounded-xl border border-white/15 px-4 py-3">
            <p className="text-sm font-semibold">
              Hole {hole}
              {info?.par ? ` · Par ${info.par}` : ""}
              {knownM ? ` · ${fmt(knownM)} ${unit}` : ""}
            </p>
            <div className="relative mt-3 h-3 rounded-full bg-white/10" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 rounded-full bg-lime/40" style={{ width: `${Math.min(100, ((along[along.length - 1] ?? 0) / reach) * 100)}%` }} />
              {along.map((m, i) => (
                <span key={i} className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime bg-black" style={{ left: `${Math.min(100, (m / reach) * 100)}%` }} />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/60">
              {marks.length === 0
                ? "Stand on the tee and tap Mark tee."
                : `${fmt(along[along.length - 1] ?? 0)} ${unit} covered${knownM ? ` of ${fmt(knownM)} ${unit}` : ""}. Distances are real GPS.`}
            </p>
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
