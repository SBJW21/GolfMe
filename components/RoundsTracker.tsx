"use client";

import { useMemo, useState } from "react";
import { sampleCourses, sampleFriends, sampleRounds, streakInfo, todayIso, type Round } from "@/lib/rounds";

function Flame({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 48 64" className={`h-20 w-16 ${lit ? "flame-flicker" : ""}`} aria-hidden="true">
      <path
        d="M24 2c2 12 16 18 16 36a16 16 0 0 1-32 0c0-8 4-12 7-16 1 5 3 7 6 8-3-12 0-20 3-28z"
        fill={lit ? "#c6ff3d" : "#2a2a2a"}
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M24 30c1 6 8 9 8 17a8 8 0 0 1-16 0c0-4 3-6 4-9 2 2 3 2 4 2z"
        fill={lit ? "#fff" : "#3a3a3a"}
        opacity={lit ? 0.85 : 1}
      />
    </svg>
  );
}

export default function RoundsTracker() {
  const [rounds, setRounds] = useState<Round[]>(() => sampleRounds());
  const [course, setCourse] = useState("");
  const [date, setDate] = useState(todayIso());
  const [score, setScore] = useState("");
  const [par, setPar] = useState("72");
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const info = useMemo(() => streakInfo(rounds), [rounds]);
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

  function addRound(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(score);
    if (!course.trim() || !n) return;
    setRounds((r) => [
      { id: `n${r.length}-${Date.now()}`, course: course.trim(), date, score: n, par: Number(par) || 72, withFriends: Object.keys(picked) },
      ...r,
    ]);
    setCourse("");
    setScore("");
    setPicked({});
  }

  async function invite() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Golf Me", text: "Log your rounds with me on Golf Me", url: link });
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
      <section className="glass rounded-3xl p-5 sm:p-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Flame lit={info.current > 0} />
          <div>
            <p className="font-display text-[clamp(3rem,12vw,5.5rem)] leading-none text-lime">{info.current}</p>
            <p className="text-lg font-bold">week streak</p>
            <p className="text-sm text-white/70">
              {info.atRisk
                ? "Play a round this week to keep it alive"
                : info.current > 0
                  ? "Locked in for this week"
                  : "Log a round to start your streak"}
              {info.best > info.current ? ` · Best ${info.best}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-1.5 sm:gap-2" aria-label="Last 12 weeks">
          {info.tiles.map((t) => (
            <div key={t.idx} className="text-center">
              <div
                className={`aspect-square rounded-md sm:rounded-lg ${
                  t.played ? "bg-lime" : "border border-white/20 bg-white/5"
                } ${t.current ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""}`}
              />
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

      {/* Log a round */}
      <section>
        <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">Log a round</h2>
        <form onSubmit={addRound} className="glass mt-4 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Course
            <input list="courses" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Start typing" className="field-input mt-1" required />
            <datalist id="courses">
              {sampleCourses.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-semibold">
            Date
            <input type="date" value={date} max={todayIso()} onChange={(e) => setDate(e.target.value)} className="field-input mt-1" required />
          </label>
          <label className="text-sm font-semibold">
            Your score
            <input inputMode="numeric" value={score} onChange={(e) => setScore(e.target.value.replace(/\D/g, ""))} className="field-input mt-1" required />
          </label>
          <label className="text-sm font-semibold">
            Course par
            <input inputMode="numeric" value={par} onChange={(e) => setPar(e.target.value.replace(/\D/g, ""))} className="field-input mt-1" />
          </label>
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
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(([name, c]) => (
            <div key={name} className="glass rounded-2xl p-4">
              <p className="font-bold">{name}</p>
              <div className="mt-2 flex gap-1" aria-label={`${c.played} rounds`}>
                {Array.from({ length: Math.min(c.played, 8) }, (_, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-full bg-lime" />
                ))}
              </div>
              <p className="mt-2 text-sm text-white/75">
                {c.played} {c.played === 1 ? "round" : "rounds"} &middot; Best {c.best}
              </p>
            </div>
          ))}
          {sampleCourses
            .filter((n) => !courses.some(([c]) => c === n))
            .slice(0, 3)
            .map((n) => (
              <div key={n} className="rounded-2xl border border-dashed border-white/20 p-4 text-white/45">
                <p className="font-bold">{n}</p>
                <p className="mt-2 text-sm">Not played yet</p>
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
            <p className="font-bold">Invite your playing partners</p>
            <p className="mt-1 text-sm text-white/75">
              Friends who join can log their own scorecard for the same round and join your leaderboard.
            </p>
            <p className="mt-3 break-all rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80">{link}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={invite} className="btn !px-5 !py-2 !text-sm">
                {copied ? "Link copied" : "Invite friends"}
              </button>
              <a
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold"
                href={`sms:?&body=${encodeURIComponent("Log your golf rounds with me on Golf Me: " + link)}`}
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
