"use client";

import { useEffect, useState } from "react";
import { courses } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";
import CourseMap, { findCourse } from "@/components/CourseMap";
import HoleMap, { type TapResult } from "@/components/HoleMap";
import { getHoleMap } from "@/lib/holeMaps";
import { CLUBS, demoRoute, distM, loadHand, loadRounds, saveHand, saveRounds, shotsOf, toYards, type Mark, type ShotRound } from "@/lib/shots";
import { eligibleRounds, ROUNDS_TO_UNLOCK } from "@/lib/insights";
import Link from "next/link";

const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
const newRound = (course: string, hand: "R" | "L"): ShotRound => ({ id: `s${Date.now()}`, course, date: today(), holes: [], hand });

export default function ShotTracker() {
  const [rounds, setRounds] = useState<ShotRound[]>([]);
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hole, setHole] = useState(1);
  const [club, setClub] = useState("");
  const [yards, setYards] = useState(false);
  const [demo, setDemo] = useState(false);
  const [course, setCourse] = useState("Mona Vale Golf Club");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [hand, setHand] = useState<"R" | "L">("R");
  const [walk, setWalk] = useState(0); // metres since the last mark, for the map

  useEffect(() => {
    // Browser storage can only be read after mount, so this one-off load is intentional.
    const r = loadRounds();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRounds(r);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHand(loadHand());
    if (r[0]) setActiveId(r[0].id);
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveRounds(rounds);
  }, [rounds, ready]);

  const round = rounds.find((r) => r.id === activeId) ?? null;
  const marks = round?.holes.find((h) => h.hole === hole)?.marks ?? [];
  const shots = shotsOf(marks);
  const holed = marks.length > 0 && !!marks[marks.length - 1].holed;
  const locked = !!round?.finished;
  const doneRounds = eligibleRounds(rounds).length;
  const holesHoled = round ? round.holes.filter((h) => h.marks.some((m) => m.holed)).length : 0;
  const unit = yards ? "yd" : "m";
  const fmt = (m: number) => Math.round(yards ? toYards(m) : m);

  function start() {
    saveHand(hand);
    const r = newRound(course.trim() || "Practice round", hand);
    setRounds((x) => [r, ...x]);
    setActiveId(r.id);
    setHole(1);
    setMsg("");
  }
  function addMark(m: Mark) {
    setClub("");
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
  function mark(kind: "shot" | "putt" = "shot") {
    setMsg("");
    if (locked) {
      setMsg("This round is finished and locked.");
      return;
    }
    if (holed) {
      setMsg("This hole is finished. Pick the next hole above, or go back to this hole and Undo.");
      return;
    }
    const isPutt = kind === "putt" && marks.length > 0;
    const withClub = marks.length === 0 ? {} : isPutt ? { club: "Putter", putt: true } : club ? { club } : {};
    if (demo) {
      const next = demoMarks[marks.length];
      if (!next) {
        setMsg("That hole is finished. Pick the next hole above.");
        return;
      }
      const k = marks.length;
      const isDemoPutt = k > Math.max(1, demoPar - 2);
      addMark({ ...next, ...(k === 0 ? {} : isDemoPutt ? { club: "Putter", putt: true } : { club: k === 1 && demoPar > 3 ? "Driver" : "7 iron" }) });
      return;
    }
    if (marks.length && marks[marks.length - 1].manual) {
      setMsg("Your last mark was added without GPS. Add the next ball by distance or on the map, or clear the hole to start again with GPS.");
      return;
    }
    if (!("geolocation" in navigator)) {
      setMsg("This device cannot share its location. Add the ball by distance or on the map instead.");
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
  const factor = yards ? 1.0936133 : 1;
  function addManual(metres: number, pos?: [number, number], putt = false) {
    if (!round) return;
    if (locked) {
      setMsg("This round is finished and locked.");
      return;
    }
    if (holed) {
      setMsg("This hole is finished. Pick the next hole above, or go back to this hole and Undo.");
      return;
    }
    if (marks.length === 0) {
      setMsg("Mark the tee first.");
      return;
    }
    if (!(metres > 0)) {
      setMsg("Enter a distance above zero.");
      return;
    }
    setMsg("");
    addMark({ lat: 0, lon: 0, manual: true, m: metres, pos, ts: Date.now(), ...(putt ? { club: "Putter", putt: true } : club ? { club } : {}) });
    setWalk(0);
  }
  function markTeeManual() {
    setMsg("");
    if (locked) return;
    addMark({ lat: 0, lon: 0, manual: true, m: 0, pos: mapData?.tp, ts: Date.now() });
  }
  function gpsWalked() {
    const last = marks[marks.length - 1];
    if (!last || last.manual) {
      setMsg("GPS distance needs a GPS mark as the starting point. Use the slider or type the distance instead.");
      return;
    }
    if (!("geolocation" in navigator)) {
      setMsg("This device cannot share its location. Use the slider or type the distance instead.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setBusy(false);
        setWalk(Math.min(500, Math.round(distM(last, { lat: p.coords.latitude, lon: p.coords.longitude }))));
        setMsg("GPS has set the distance walked. Adjust the slider if you like, then tap the map where your ball is.");
      },
      () => {
        setBusy(false);
        setMsg("No GPS fix. Use the slider or type the distance instead.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }
  // Putts without GPS: the ball stays put on the map, the distance is the slider or a typical 2 m
  function puttManual() {
    const last = marks[marks.length - 1];
    if (!last) {
      setMsg("Mark the tee first.");
      return;
    }
    if (!last.manual) {
      setMsg("Use Record putt with GPS from a GPS position, or finish the hole with In the cup.");
      return;
    }
    addManual(walk > 0 ? walk : 2, last.pos, true);
  }
  // Rough distance from the last recorded ball position to the pin
  function toPin() {
    const last = marks[marks.length - 1];
    if (!last) return 0;
    if (mapData && last.pos) {
      let len = 0;
      for (let i = 1; i < mapData.cl.length; i++) len += Math.hypot(mapData.cl[i][0] - mapData.cl[i - 1][0], mapData.cl[i][1] - mapData.cl[i - 1][1]);
      const k = mapData.m / len;
      return Math.hypot(last.pos[0] - mapData.gp[0], last.pos[1] - mapData.gp[1]) * k;
    }
    const holeLen = knownM ?? mapData?.m ?? (demo ? demoLen : 0);
    if (holeLen > 0) return holeLen - (along[along.length - 1] ?? 0);
    return 2;
  }
  function inTheCup() {
    if (!round || locked) return;
    if (marks.length === 0) {
      setMsg("Mark the tee first.");
      return;
    }
    if (holed) return;
    const d = Math.max(1, Math.min(300, toPin()));
    const estimated = !(knownM ?? mapData?.m);
    const lastClub = club;
    const isPutt = lastClub === "Putter" || !!marks[marks.length - 1].putt || (!lastClub && d <= 15);
    setMsg("");
    addMark({ lat: 0, lon: 0, manual: true, m: Math.round(d * 10) / 10, pos: mapData?.gp, ts: Date.now(), holed: true, ...(isPutt ? { club: "Putter", putt: true } : lastClub ? { club: lastClub } : {}) });
    setWalk(0);
    const n = marks.length; // shots after this one is added
    const putts = shots.filter((s) => s.putt).length + (isPutt ? 1 : 0);
    setMsg(`In the cup! ${n} ${n === 1 ? "shot" : "shots"}${putts ? `, ${putts} ${putts === 1 ? "putt" : "putts"}` : ""}.${estimated ? " Last distance is a guess because this course has no hole length yet." : ""}${hole < 18 ? ` On to hole ${hole + 1}.` : " That is your round."}`);
    if (hole < 18) {
      setHole(hole + 1);
    }
  }
  function undo() {
    if (locked) return;
    setRounds((all) => all.map((r) => (r.id === activeId ? { ...r, holes: r.holes.map((h) => (h.hole === hole ? { ...h, marks: h.marks.slice(0, -1) } : h)) } : r)));
  }
  function finishRound() {
    if (!round) return;
    setRounds((all) => all.map((r) => (r.id === round.id ? { ...r, finished: true } : r)));
    setMsg("Round finished and locked in.");
  }
  function remove(id: string) {
    setRounds((all) => all.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  }

  // Hole facts: only used when the course card is verified. Otherwise the map scales to your own marks.
  const cm = round ? findCourse(round.course) : undefined;
  const info = cm ? courseDetails[cm.slug]?.holeData?.find((h) => h.n === hole) : undefined;
  const knownM = info?.metres;
  const mapData = cm ? getHoleMap(cm.slug, hole) : undefined;
  const demoLen = knownM ?? 340;
  const demoPar = info?.par ?? 4;
  const demoMarks = demoRoute(demoLen, demoPar, hole * 11 + (round?.id.length ?? 0));

  // Progress along the hole: how far each shot took you, against the hole length when it is verified
  const along = shots.reduce<number[]>((acc, x) => [...acc, (acc[acc.length - 1] ?? 0) + x.metres], []);
  const hmMarks = marks.map((m, i) => ({ pos: m.pos, cum: i === 0 ? 0 : along[i - 1] ?? 0 }));
  const reach = Math.max(knownM ?? 0, along[along.length - 1] ?? 0, 1);

  const holeTotal = (h: { marks: Mark[] }) => shotsOf(h.marks).reduce((a, s) => a + s.metres, 0);

  const unitToggle = () => (
    <div className="inline-flex overflow-hidden rounded-full border border-white/25 text-xs font-semibold" role="group" aria-label="Distance units">
      <button type="button" aria-pressed={!yards} onClick={() => setYards(false)} className={`px-3 py-1.5 ${!yards ? "bg-lime text-black" : "text-white/85"}`}>Metres</button>
      <button type="button" aria-pressed={yards} onClick={() => setYards(true)} className={`px-3 py-1.5 ${yards ? "bg-lime text-black" : "text-white/85"}`}>Yards</button>
    </div>
  );

  return (
    <div className="grid gap-8">
      <section className="glass rounded-2xl p-5">
        {!round ? (
          <div className="grid gap-4">
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
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold">You play</span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/25 text-xs font-semibold" role="group" aria-label="Handedness">
                <button type="button" aria-pressed={hand === "R"} onClick={() => setHand("R")} className={`px-4 py-1.5 ${hand === "R" ? "bg-lime text-black" : "text-white/85"}`}>Right handed</button>
                <button type="button" aria-pressed={hand === "L"} onClick={() => setHand("L")} className={`px-4 py-1.5 ${hand === "L" ? "bg-lime text-black" : "text-white/85"}`}>Left handed</button>
              </div>
              <span className="text-xs text-white/60">Used to tell a slice from a hook in your report</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl">{round.course}</p>
                <p className="text-sm text-white/60">{round.date} · {round.hand === "L" ? "Left" : "Right"} handed{locked ? " · Finished and locked" : ""}</p>
              </div>
              <div className="flex gap-2">
                {!locked && holesHoled > 0 && (
                  <button type="button" className="rounded-full border border-lime px-4 py-1.5 text-sm font-semibold text-lime hover:bg-lime hover:text-black" onClick={finishRound}>
                    Finish round
                  </button>
                )}
                <button type="button" className="rounded-full border border-white/25 px-4 py-1.5 text-sm font-semibold hover:border-lime" onClick={() => setActiveId(null)}>
                  New round
                </button>
              </div>
            </div>
            {doneRounds >= ROUNDS_TO_UNLOCK ? (
              <Link href="/my-golf/shots/report" className="btn self-start !px-5 !py-2 !text-sm">See your shot report</Link>
            ) : (
              <div>
                <p className="text-sm text-white/75">
                  {doneRounds} of {ROUNDS_TO_UNLOCK} finished rounds. Finish {ROUNDS_TO_UNLOCK - doneRounds} more to unlock your shot report. A round counts once nine holes are holed out.
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
                  {Array.from({ length: ROUNDS_TO_UNLOCK }, (_, i) => (
                    <span key={i} className={`h-2 rounded-full ${i < doneRounds ? "bg-lime" : "bg-white/15"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {round && (
        <section className="glass rounded-2xl p-5">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Hole">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => {
              const done = round.holes.some((h) => h.hole === n && h.marks.some((m) => m.holed));
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setHole(n); setWalk(0); }}
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
                ? "Stand on the tee and tap Mark tee, or start without GPS."
                : `${fmt(along[along.length - 1] ?? 0)} ${unit} covered${knownM ? ` of ${fmt(knownM)} ${unit}` : ""}. Distances come from GPS or from what you entered.`}
            </p>
          </div>

          {mapData && (
            <div className="mt-4">
              <HoleMap data={mapData} marks={hmMarks} walk={walk} onWalk={setWalk} yards={yards} onTap={(r: TapResult) => addManual(r.metres, r.pos)} />
              <p className="mt-2 text-xs text-white/60">Tee is at the bottom and the green at the top. Layout redrawn for Golf Me and not to survey accuracy.</p>
            </div>
          )}
          {marks.length === 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <button type="button" className="rounded-full border border-lime/70 px-4 py-2 text-sm font-semibold text-lime hover:bg-lime hover:text-black" disabled={locked} onClick={markTeeManual}>Start this hole without GPS</button>
              {unitToggle()}
            </div>
          )}
          {marks.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/15 p-4">
              <label className="block text-sm font-semibold" htmlFor="walk">
                Slide to how far you walked: {Math.round(walk * factor)} {unit}
              </label>
              <input id="walk" type="range" min={0} max={Math.round(500 * factor)} value={Math.round(walk * factor)} onChange={(e) => setWalk(Number(e.target.value) / factor)} className="mt-2 w-full accent-[#c6ff3d]" />
              <p className="mt-1 text-xs text-white/65">{mapData ? "The map zooms in with a landing area. Tap it where your ball is." : "No hole map for this course yet. Slide, then add the shot."}</p>
              {!mapData && <button type="button" className="mt-2 rounded-full border border-lime/70 px-4 py-1.5 text-xs font-semibold text-lime hover:bg-lime hover:text-black disabled:opacity-40" disabled={walk <= 0} onClick={() => { addManual(walk); setWalk(0); }}>Add shot</button>}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold hover:border-lime disabled:opacity-40" disabled={busy} onClick={gpsWalked}>Use GPS distance</button>
                {unitToggle()}
              </div>
            </div>
          )}
          <label className="mt-4 block text-sm font-semibold">
            Club for this shot (optional)
            <select value={club} onChange={(e) => setClub(e.target.value)} className="field-input mt-1">
              <option value="">No club, just record it</option>
              {CLUBS.filter((c) => c !== "Putter").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          {marks.length === 0 ? (
            <div className="mt-3">
              <button type="button" className="btn w-full !px-4 !py-3 !text-sm disabled:opacity-60" disabled={busy || locked} onClick={() => mark("shot")}>
                {busy ? "Finding GPS..." : "Mark tee"}
              </button>
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="btn whitespace-nowrap !px-3 !py-3 !text-[0.8rem] disabled:opacity-60" disabled={busy || holed || locked} onClick={() => mark("shot")}>
                  {busy ? "Finding GPS..." : "Record shot"}
                </button>
                <button type="button" className="rounded-full border border-lime px-3 py-3 text-[0.8rem] font-extrabold uppercase tracking-wide text-lime hover:bg-lime hover:text-black disabled:opacity-40" disabled={busy || holed || locked} onClick={() => (marks[marks.length - 1].manual ? puttManual() : mark("putt"))}>
                  Record putt
                </button>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <button type="button" className="rounded-full border border-lime px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-lime hover:bg-lime hover:text-black disabled:opacity-40" disabled={holed || locked} onClick={inTheCup}>
                  In the cup!
                </button>
                <button type="button" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold hover:border-lime disabled:opacity-40" disabled={locked} onClick={undo}>Undo</button>
              </div>
            </div>
          )}
          <p className="mt-2 text-xs text-white/65">Record each shot where your ball ends up, then putts on the green. When it drops, tap In the cup and Golf Me works out the last distance from your previous ball position.</p>
          {msg && <p className="mt-2 text-sm text-[#ffd23d]" role="status">{msg}</p>}

          {shots.length > 0 && (
            <ol className="mt-4 divide-y divide-white/10 rounded-xl border border-white/15 text-sm">
              {shots.map((s) => (
                <li key={s.n} className="flex items-center justify-between px-4 py-2">
                  <span>{s.putt ? "Putt" : `Shot ${s.n}`}{!s.putt && s.club ? ` · ${s.club}` : ""}{s.to.holed ? " · in the cup" : ""}</span>
                  <span className="font-display text-xl text-lime">{fmt(s.metres)} <span className="text-sm normal-case">{unit}</span></span>
                </li>
              ))}
              <li className="flex items-center justify-between px-4 py-2 text-white/70">
                <span>Hole {hole}: {shots.length} {shots.length === 1 ? "shot" : "shots"}, {shots.filter((x) => x.putt).length} {shots.filter((x) => x.putt).length === 1 ? "putt" : "putts"}</span>
                <span>{fmt(holeTotal({ marks }))} {unit}</span>
              </li>
            </ol>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} /> Demo mode (made-up positions, no GPS)
            </label>
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
        Your positions are only read when you tap Record shot or Mark tee and stay on this device in this version. GPS in a phone is usually good to 3 to 10 metres in the open, so treat distances as a guide.
      </p>
    </div>
  );
}
