"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CourseMap from "./CourseMap";
import { courses as allCourses } from "@/lib/courses";
import Flame from "./Flame";
import { defaultPars, defaultStrokeIndex, holePoints, milestoneProgress, milestones, sampleCourses, sampleFriends, sampleRounds, streakInfo, todayIso, type Round } from "@/lib/rounds";

export default function RoundsTracker() {
  const [rounds, setRounds] = useState<Round[]>(() => sampleRounds());
  const [course, setCourse] = useState("");
  const [date, setDate] = useState(todayIso());
  const [score, setScore] = useState("");
  const [par, setPar] = useState("72");
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"total" | "holes">("total");
  const [holes, setHoles] = useState<string[]>(Array(18).fill(""));
  const [putts, setPutts] = useState("");
  const [hcp, setHcp] = useState("24.6");
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState<{ id: number; weeks: number; bits: { dx: number; dy: number; rot: number; c: string }[] } | null>(null);

  const info = useMemo(() => streakInfo(rounds), [rounds]);
  const prog = milestoneProgress(info.current);
  const courses = useMemo(() => {
    const map = new Map<string, { played: number; best: number }>();
    for (const r of rounds) {
      const c = map.get(r.course) ?? { played: 0, best: 999 };
      map.set(r.course, { played: c.played + 1, best: Math.min(c.best, r.score) });
    }
    return [...map.entries()].sort((a, b) => b[1].played - a[1].played);
  }, [rounds]);
  const scores = rounds.map((r) => r.score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const link = "https://golfme.com.au/join/chloe-anderson";
  const holeNums = holes.map((h) => Number(h) || 0);
  const holesTotal = holeNums.reduce((a, b) => a + b, 0);
  const holesPlayed = holeNums.filter(Boolean).length;
  const points = holeNums.reduce((sum, st, i) => sum + holePoints(st, defaultPars[i], defaultStrokeIndex[i], Number(hcp) || 0), 0);
  const puttRounds = rounds.filter((r) => r.putts);
  const avgPutts = puttRounds.length ? Math.round((puttRounds.reduce((a, r) => a + (r.putts ?? 0), 0) / puttRounds.length) * 10) / 10 : 0;

  function addRound(e: React.FormEvent) {
    e.preventDefault();
    const n = mode === "holes" ? holesTotal : Number(score);
    if (!course.trim() || !n) return;
    const before = streakInfo(rounds).current;
    const after = streakInfo([{ id: "x", course: "", date, score: n, par: 72, withFriends: [] }, ...rounds]).current;
    if (after > before) {
      const colours = ["#c6ff3d", "#ffffff", "#ffd23d", "#4db8ff"];
      setBurst({
        id: Date.now(),
        weeks: after,
        bits: Array.from({ length: 28 }, (_, i) => ({
          dx: Math.round((Math.random() - 0.5) * 380),
          dy: Math.round(-80 - Math.random() * 220),
          rot: Math.round(Math.random() * 720 - 360),
          c: colours[i % colours.length],
        })),
      });
      window.setTimeout(() => setBurst(null), 3200);
    }
    setRounds((r) => [
      {
        id: `n${r.length}-${Date.now()}`,
        course: course.trim(),
        date,
        score: n,
        par: Number(par) || 72,
        withFriends: Object.keys(picked),
        putts: Number(putts) || undefined,
        points: mode === "holes" ? points : undefined,
        friendScores: Object.fromEntries(Object.entries(picked).filter(([, v]) => Number(v)).map(([k, v]) => [k, Number(v)])),
      },
      ...r,
    ]);
    setCourse("");
    setScore("");
    setPutts("");
    setHoles(Array(18).fill(""));
    setPicked({});
  }

  async function invite() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Golf Me", text: "Join me on Golf Me. Log your rounds and get $10 Golf Me credit", url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  }

  const ranking = [{ id: "me", name: "You", weeks: info.current }, ...sampleFriends].sort((a, b) => b.weeks - a.weeks);

  return (
    <div className="grid gap-10">
      {/* Streak */}
      <section className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8">
        {burst && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center" aria-hidden="true">
            {burst.bits.map((b, i) => (
              <span
                key={`${burst.id}-${i}`}
                className="confetti absolute bottom-10 h-2.5 w-1.5 rounded-sm"
                style={{ background: b.c, ["--dx" as string]: `${b.dx}px`, ["--dy" as string]: `${b.dy}px`, ["--rot" as string]: `${b.rot}deg` }}
              />
            ))}
          </div>
        )}
        {burst && (
          <div className="mb-4 flex justify-center">
            <p className="pop-in rounded-full bg-lime px-5 py-2 text-center text-sm font-extrabold uppercase tracking-[0.14em] text-black shadow-lg">
              {burst.weeks} week streak! Keep it going
            </p>
          </div>
        )}
        <div className="flex items-center gap-4 sm:gap-6">
          <Flame lit={info.current > 0} className="h-24 w-20 shrink-0" />
          <div className="min-w-0">
            <p key={info.current} className="streak-pop font-display text-[clamp(3.4rem,13vw,6rem)] leading-none text-lime">
              {info.current}
            </p>
            <p className="text-lg font-bold">week streak</p>
            <p className="text-sm text-white/70">
              {info.atRisk
                ? "Play a round this week to keep it alive"
                : info.current > 0
                  ? "Locked in for this week"
                  : "Log a round to start your streak"}
              {info.best > info.current ? ` \u00b7 Best ${info.best}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-3 text-sm">
            <p className="font-bold">
              {prog.earned.length > 0 ? prog.earned[prog.earned.length - 1].name : "Just starting"}
            </p>
            <p className="text-white/70">
              {prog.next ? `${prog.toGo} ${prog.toGo === 1 ? "week" : "weeks"} to ${prog.next.name}` : "Top level reached"}
            </p>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={prog.pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${prog.pct}%` }} />
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {milestones.map((m) => {
            const on = info.current >= m.weeks;
            return (
              <li key={m.weeks} className={`rounded-xl border px-2 py-2 text-center ${on ? "border-lime bg-lime/10" : "border-white/10 opacity-50"}`}>
                <p className={`font-display text-xl ${on ? "text-lime" : ""}`}>{on ? "\u2713" : "\ud83d\udd12"} {m.weeks}w</p>
                <p className="text-[0.7rem] font-semibold leading-tight">{m.name}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid grid-cols-12 gap-1.5 sm:gap-2" aria-label="Last 12 weeks">
          {info.tiles.map((t) => (
            <div
              key={t.idx}
              className={`grid aspect-square place-items-center rounded-md text-xs font-extrabold text-black sm:rounded-lg sm:text-sm ${
                t.played ? "bg-lime" : "border border-white/20 bg-white/5"
              } ${t.current ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""} ${t.current && !t.played ? "animate-pulse" : ""}`}
            >
              {t.played ? "\u2713" : ""}
            </div>
          ))}
        </div>
        <p className="mt-2 flex justify-between text-xs text-white/50">
          <span>12 weeks ago</span>
          <span>This week</span>
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Rounds logged", String(rounds.length)],
          ["Average score", String(avg)],
          ["Best score", String(Math.min(...scores))],
          ["Courses played", String(courses.length)],
        ].map(([k, v]) => (
          <div key={k} className="glass rounded-2xl p-5">
            <p className="font-display text-3xl text-lime">{v}</p>
            <p className="mt-1 text-sm text-white/75">{k}</p>
          </div>
        ))}
      </section>

      {/* Putting insight */}
      {avgPutts > 0 && (
        <section className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
          <div>
            <p className="font-display text-3xl text-lime">{avgPutts} putts a round</p>
            <p className="text-sm text-white/75">
              {avgPutts >= 34
                ? "Putting is where you can save the most shots. A short lesson can cut this fast."
                : "Solid putting. Keep it sharp with a short game lesson."}
            </p>
          </div>
          <a href={`/coaches?focus=${avgPutts >= 34 ? "Putting" : "Chipping"}`} className="btn !px-5 !py-2 !text-sm">
            {avgPutts >= 34 ? "Find a putting coach" : "Find a short game coach"}
          </a>
        </section>
      )}

      {/* Round results */}
      <section>
        <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Round results</h2>
        <div className="relative mt-4">
        <div className="grid max-h-[24rem] gap-3 overflow-y-auto pb-10 lg:max-h-none lg:grid-cols-2 lg:pb-0">
          {[...rounds]
            .filter((r) => r.friendScores && Object.keys(r.friendScores).length > 0)
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 8)
            .map((r) => {
              const board = [{ name: "You", score: r.score }, ...Object.entries(r.friendScores ?? {}).map(([name, score]) => ({ name, score }))].sort((a, b) => a.score - b.score);
              return (
                <div key={r.id} className="glass rounded-2xl p-4">
                  <p className="font-bold">{r.course}</p>
                  <p className="text-xs text-white/60">
                    {r.date}
                    {r.putts ? ` \u00b7 ${r.putts} putts` : ""}
                    {r.points ? ` \u00b7 ${r.points} pts` : ""}
                  </p>
                  <ol className="mt-3 grid gap-1.5">
                    {board.map((b, i) => (
                      <li key={b.name} className="flex items-center gap-3 text-sm">
                        <span className="font-display w-5 text-lg text-white/50">{i + 1}</span>
                        <span className={`flex-1 font-semibold ${b.name === "You" ? "text-lime" : ""}`}>{b.name}</span>
                        {i === 0 && <span aria-hidden="true">{"\ud83c\udfc6"}</span>}
                        <span className="font-display text-xl">{b.score}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black to-transparent lg:hidden" aria-hidden="true" />
        </div>
      </section>

      {/* Log a round */}
      <section>
        <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Log a round</h2>
        <form onSubmit={addRound} className="glass mt-4 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Course
            <input list="courses" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Start typing" className="field-input mt-1" required />
            <datalist id="courses">
              {[...new Set([...sampleCourses, ...allCourses.map((c) => c.name)])].map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          {course && (
            <div className="sm:col-span-2 sm:-mt-1">
              <div className="mt-3"><CourseMap name={course} /></div>
            </div>
          )}
          <label className="text-sm font-semibold">
            Date
            <input type="date" value={date} max={todayIso()} onChange={(e) => setDate(e.target.value)} className="field-input mt-1" required />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            {([["total", "Quick total"], ["holes", "Hole by hole"]] as const).map(([m, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${mode === m ? "border-lime bg-lime text-black" : "border-white/25"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          {mode === "total" ? (
              <label className="text-sm font-semibold">
                Your score
                <input inputMode="numeric" value={score} onChange={(e) => setScore(e.target.value.replace(/\D/g, ""))} className="field-input mt-1" required />
              </label>
            ) : (
              <label className="text-sm font-semibold">
                Your handicap
                <input inputMode="decimal" value={hcp} onChange={(e) => setHcp(e.target.value.replace(/[^0-9.]/g, ""))} className="field-input mt-1" />
              </label>
            )}
            <label className="text-sm font-semibold">
              Total putts
              <input inputMode="numeric" value={putts} onChange={(e) => setPutts(e.target.value.replace(/\D/g, ""))} placeholder="Optional" className="field-input mt-1" />
            </label>
          </div>
          {mode === "total" && (
            <label className="text-sm font-semibold">
              Course par
              <input inputMode="numeric" value={par} onChange={(e) => setPar(e.target.value.replace(/\D/g, ""))} className="field-input mt-1" />
            </label>
          )}
          {mode === "holes" && (
            <div className="sm:col-span-2">
              <div className="grid grid-cols-9 gap-1.5">
                {holes.map((h, i) => (
                  <label key={i} className="text-center text-[0.65rem] font-semibold text-white/60">
                    {i + 1}
                    <input
                      inputMode="numeric"
                      aria-label={`Hole ${i + 1} strokes, par ${defaultPars[i]}`}
                      value={h}
                      onChange={(e) => setHoles((x) => x.map((v, j) => (j === i ? e.target.value.replace(/\D/g, "").slice(0, 2) : v)))}
                      className="field-input mt-0.5 !p-1.5 text-center"
                    />
                    <span className="block text-white/35">P{defaultPars[i]}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 rounded-xl border border-lime/40 px-4 py-3">
                <p><span className="font-display text-2xl text-lime">{holesTotal}</span> <span className="text-sm text-white/70">strokes, {holesPlayed} holes</span></p>
                <p><span className="font-display text-2xl text-lime">{points}</span> <span className="text-sm text-white/70">Stableford points</span></p>
              </div>
              <p className="mt-2 text-xs text-white/50">
                Points are an estimate on a standard par 72 layout. Real course cards come later.
              </p>
              <p className="mt-2 text-sm">
                <Link href="/my-golf/shots" className="font-semibold text-lime underline-offset-4 hover:underline">Track your shots with GPS</Link>
              </p>
            </div>
          )}
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold">Who did you play with? They can log their own card too</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {sampleFriends.map((f) => {
                const on = f.name in picked;
                return (
                  <label key={f.id} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${on ? "border-lime bg-lime text-black" : "border-white/25"}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() =>
                        setPicked((p) => {
                          const n = { ...p };
                          if (f.name in n) delete n[f.name];
                          else n[f.name] = "";
                          return n;
                        })
                      }
                    />
                    {on ? "✓ " : ""}
                    {f.name}
                  </label>
                );
              })}
            </div>
            {Object.keys(picked).length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {Object.keys(picked).map((name) => (
                  <label key={name} className="text-sm font-semibold">
                    {name}&apos;s score
                    <input
                      inputMode="numeric"
                      value={picked[name]}
                      onChange={(e) => setPicked((p) => ({ ...p, [name]: e.target.value.replace(/\D/g, "") }))}
                      placeholder="Optional"
                      className="field-input mt-1"
                    />
                  </label>
                ))}
              </div>
            )}
          </fieldset>
          <button type="submit" className="btn sm:col-span-2">
            Save round
          </button>
        </form>
      </section>

      {/* Course tracker */}
      <section>
        <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Course tracker</h2>
        <p className="mt-1 text-white/75">{courses.length} courses played. Tick off more.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {courses.map(([name, c]) => (
            <div key={name} className="glass flex items-center justify-between gap-3 rounded-xl px-3 py-2.5">
              <p className="min-w-0 flex-1 text-sm font-bold">{name}</p>
              <div className="shrink-0 text-right">
                <div className="flex justify-end gap-1" aria-label={`${c.played} rounds`}>
                  {Array.from({ length: Math.min(c.played, 8) }, (_, i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-lime" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-white/75">
                  {c.played} {c.played === 1 ? "round" : "rounds"} &middot; Best {c.best}
                </p>
              </div>
            </div>
          ))}
          {sampleCourses
            .filter((n) => !courses.some(([c]) => c === n))
            .slice(0, 3)
            .map((n) => (
              <div key={n} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-white/20 px-3 py-2.5 text-white/45">
                <p className="min-w-0 flex-1 text-sm font-bold">{n}</p>
                <p className="shrink-0 text-xs">Not played yet</p>
              </div>
            ))}
        </div>
      </section>

      {/* Friends */}
      <section>
        <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Friends</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <ol className="glass divide-y divide-white/10 rounded-2xl">
            {ranking.map((f, i) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3">
                <span className="font-display w-6 text-xl text-white/50">{i + 1}</span>
                <span className={`grid h-10 w-10 place-items-center rounded-full font-display ${f.id === "me" ? "bg-lime text-black" : "bg-white/15"}`}>
                  {f.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{f.name}</p>
                  {"lastCourse" in f && (
                    <p className="truncate text-xs text-white/65">
                      {f.lastScore} at {f.lastCourse}
                    </p>
                  )}
                </div>
                <p className="font-display text-xl text-lime">{f.weeks}w</p>
              </li>
            ))}
          </ol>
          <div className="glass rounded-2xl p-5">
            <p className="font-bold">Invite your friends to play. They get $10 Golf Me credit.</p>
            <p className="mt-1 text-sm text-white/75">
              Friends who join get $10 credit towards their first lesson, can log their own scorecard for the same round and join your leaderboard.
            </p>
            <p className="mt-2 text-xs text-white/60">
              $10 credit for new members, released after their first logged round.{" "}
              <a href="/new-member-credit" className="underline">Terms apply</a>
            </p>
            <p className="mt-3 break-all rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80">{link}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={invite} className="btn !px-5 !py-2 !text-sm">
                {copied ? "Link copied" : "Invite friends"}
              </button>
              <a
                className="pill-arrow rounded-full border border-white/30 px-4 py-2 text-sm font-semibold"
                href={`sms:?&body=${encodeURIComponent("Join me on Golf Me and get $10 credit towards a lesson: " + link)}`}
              >
                Text
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
