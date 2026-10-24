"use client";

import { useState } from "react";
import { courses } from "@/lib/courses";
import { courseDetails } from "@/lib/courseDetails";
import { findCourse } from "@/components/CourseMap";

type Player = { name: string; score?: number };
type Hosted = { id: string; course: string; when: string; spots: number; note: string; players: Player[]; mine: boolean };

const sample: Hosted[] = [
  { id: "s1", course: "Balgowlah Golf Club", when: "Sat 31 Oct, 7:30 am", spots: 4, note: "Casual nine, beers after", players: [{ name: "Jess (host)" }, { name: "Tom" }], mine: false },
  { id: "s2", course: "Cammeray Golf Club", when: "Sun 25 Oct, 8:00 am", spots: 3, note: "Stableford, all levels", players: [{ name: "Chloe (you, host)", score: 47 }, { name: "Priya", score: 41 }, { name: "Jess", score: 44 }], mine: true },
];

const socials = ["Instagram", "Facebook", "WhatsApp"] as const;

export default function HostRound() {
  const [rounds, setRounds] = useState<Hosted[]>(sample);
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("07:30");
  const [spots, setSpots] = useState("4");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState("");
  const [myScore, setMyScore] = useState("");
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [share, setShare] = useState<Record<string, boolean>>({ Instagram: true, Facebook: false, WhatsApp: false });
  const [handles, setHandles] = useState<Record<string, string>>({ Instagram: "@chloe.golf", Facebook: "", WhatsApp: "" });
  const [requests] = useState([{ id: "q1", who: "Priya", ask: "WhatsApp" }, { id: "q2", who: "Jess", ask: "Instagram" }]);
  const [decided, setDecided] = useState<Record<string, "approved" | "declined">>({});

  function create(e: React.FormEvent) {
    e.preventDefault();
    if (!course.trim() || !date) return;
    const d = new Date(`${date}T${time}`);
    const when = d.toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" });
    setRounds((r) => [{ id: `n${Date.now()}`, course: course.trim(), when, spots: Number(spots) || 4, note: note.trim(), players: [{ name: "Chloe (you, host)" }], mine: true }, ...r]);
    setCourse("");
    setNote("");
  }
  async function copy(id: string) {
    try {
      await navigator.clipboard.writeText(`https://golfme.com.au/round/${id}`);
      setCopied(id);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      /* clipboard blocked */
    }
  }
  function bookHref(name: string) {
    const c = findCourse(name);
    return c ? (courseDetails[c.slug]?.bookingUrl ?? c.website) : undefined;
  }
  const past = rounds.find((r) => r.players.some((p) => p.score));
  const board = past ? [...past.players].filter((p) => p.score).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)) : [];

  return (
    <div className="grid gap-10">
      <p className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70">Preview with sample players. Nothing here is saved or sent.</p>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={create} className="glass grid content-start gap-3 rounded-2xl p-5 sm:grid-cols-2">
          <h2 className="font-display text-2xl sm:col-span-2">Host a round</h2>
          <label className="text-sm font-semibold sm:col-span-2">
            Course
            <input list="host-courses" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Start typing a course" className="field-input mt-1" />
            <datalist id="host-courses">
              {courses.map((c) => (
                <option key={c.slug} value={c.name} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-semibold">
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field-input mt-1" />
          </label>
          <label className="text-sm font-semibold">
            Tee time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field-input mt-1" />
          </label>
          <label className="text-sm font-semibold">
            Players wanted
            <select value={spots} onChange={(e) => setSpots(e.target.value)} className="field-input mt-1">
              {[2, 3, 4].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Note
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Casual nine, beers after" className="field-input mt-1" />
          </label>
          <p className="text-xs text-white/60 sm:col-span-2">Tee times are booked with the club. Book there first, then share the round here.</p>
          <button type="submit" className="btn !text-base sm:col-span-2 sm:justify-self-start">Create round</button>
        </form>

        <div className="grid content-start gap-3">
          <h2 className="font-display text-2xl">Upcoming rounds</h2>
          {rounds.map((r) => {
            const inIt = r.mine || joined[r.id];
            const count = r.players.length + (joined[r.id] ? 1 : 0);
            const href = bookHref(r.course);
            return (
              <div key={r.id} className="glass rounded-2xl p-4">
                <p className="font-bold">{r.course}</p>
                <p className="text-sm text-white/75">{r.when} &middot; {count} of {r.spots} players</p>
                {r.note && <p className="mt-1 text-sm text-white/65">{r.note}</p>}
                <p className="mt-2 text-sm text-white/80">
                  {r.players.map((p) => p.name).join(", ")}
                  {joined[r.id] ? ", Chloe (you)" : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {!r.mine && (
                    <button type="button" onClick={() => setJoined((j) => ({ ...j, [r.id]: !j[r.id] }))} className={inIt ? "rounded-full border border-lime/70 px-4 py-1.5 text-lime" : "rounded-full bg-lime px-4 py-1.5 text-black"}>
                      {inIt ? "You're in. Leave" : count >= r.spots ? "Full" : "Join round"}
                    </button>
                  )}
                  <button type="button" onClick={() => copy(r.id)} className="rounded-full border border-white/30 px-4 py-1.5 hover:border-lime">
                    {copied === r.id ? "Link copied" : "Copy invite link"}
                  </button>
                  {href && (
                    <a href={href} target="_blank" rel="noopener" className="text-lime underline-offset-4 hover:underline">
                      Book with the club
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">The 19th hole</h2>
        <p className="mt-1 max-w-xl text-sm text-white/70">After the round, everyone adds their score and the group sees the board. Only people in that round can see it.</p>
        {past && (
          <div className="glass mt-3 rounded-2xl p-5">
            <p className="font-bold">{past.course} <span className="font-normal text-white/65">&middot; {past.when}</span></p>
            <ol className="mt-3 divide-y divide-white/10 text-sm">
              {board.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between py-2">
                  <span><span className="mr-3 text-white/50">{i + 1}</span>{p.name}</span>
                  <span className="font-display text-xl text-lime">{p.score} <span className="font-sans text-xs normal-case text-white/60">pts</span></span>
                </li>
              ))}
            </ol>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = Number(myScore);
                if (!n) return;
                setRounds((all) => all.map((r) => (r.id === past.id ? { ...r, players: r.players.map((p) => (p.name.startsWith("Chloe") ? { ...p, score: n } : p)) } : r)));
                setMyScore("");
              }}
              className="mt-4 flex flex-wrap items-end gap-3"
            >
              <label className="text-sm font-semibold">
                Update your score
                <input inputMode="numeric" value={myScore} onChange={(e) => setMyScore(e.target.value.replace(/\D/g, "").slice(0, 3))} className="field-input mt-1 w-28" />
              </label>
              <button type="submit" className="rounded-full border border-lime/70 px-4 py-2 text-sm font-semibold text-lime">Add</button>
            </form>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Stay in touch</h2>
        <p className="mt-1 max-w-2xl text-sm text-white/70">
          Add your socials if you like. Nobody sees them unless you approve that person, and you can switch any of them off at any time. Golf Me never shows them publicly.
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <div className="glass grid gap-3 rounded-2xl p-5">
            {socials.map((s) => (
              <div key={s} className="grid gap-1.5">
                <label className="flex items-center justify-between gap-3 text-sm font-semibold">
                  {s}
                  <span className="flex items-center gap-2 text-xs font-normal text-white/70">
                    <input type="checkbox" checked={share[s]} onChange={(e) => setShare((x) => ({ ...x, [s]: e.target.checked }))} /> Available to people I approve
                  </span>
                </label>
                <input value={handles[s]} onChange={(e) => setHandles((x) => ({ ...x, [s]: e.target.value }))} placeholder={s === "WhatsApp" ? "Mobile number" : "Profile link or handle"} className="field-input" />
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="font-bold">Requests</p>
            <ul className="mt-2 divide-y divide-white/10 text-sm">
              {requests.map((q) => (
                <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <span>{q.who} would like your {q.ask}</span>
                  {decided[q.id] ? (
                    <span className="text-white/60">{decided[q.id] === "approved" ? "Approved" : "Declined"}</span>
                  ) : (
                    <span className="flex gap-2 font-semibold">
                      <button type="button" onClick={() => setDecided((d) => ({ ...d, [q.id]: "approved" }))} className="rounded-full bg-lime px-3.5 py-1 text-black">Approve</button>
                      <button type="button" onClick={() => setDecided((d) => ({ ...d, [q.id]: "declined" }))} className="rounded-full border border-white/30 px-3.5 py-1">Decline</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {requests.length === 0 && <p className="text-sm text-white/65">No requests.</p>}
            <p className="mt-3 text-xs text-white/55">Approving shares that one channel with that one person. You can take it back later.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
