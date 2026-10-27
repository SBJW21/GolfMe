"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { findCourse } from "@/components/CourseMap";
import { buildReport, eligibleRounds, ROUNDS_TO_UNLOCK, type Insight } from "@/lib/insights";
import { loadRounds, type ShotRound } from "@/lib/shots";

const pill = "pill-arrow rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold hover:border-lime hover:text-lime";
const TONE: Record<Insight["tone"], { label: string; cls: string }> = {
  pattern: { label: "Pattern", cls: "text-lime" },
  strength: { label: "Strength", cls: "text-[#7fe08f]" },
  watch: { label: "Worth a look", cls: "text-[#ffd23d]" },
};

export default function ShotReport() {
  const [rounds, setRounds] = useState<ShotRound[] | null>(null);
  useEffect(() => {
    // Browser storage can only be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRounds(loadRounds());
  }, []);

  if (!rounds) return <p className="text-white/60">Loading your rounds...</p>;
  const done = eligibleRounds(rounds).length;
  const report = buildReport(rounds, (c) => findCourse(c)?.slug);

  if (!report) {
    return (
      <div className="glass rounded-2xl p-5">
        <p className="font-display text-2xl text-lime">{done} of {ROUNDS_TO_UNLOCK} rounds</p>
        <p className="mt-2 text-white/80">Your shot report unlocks after {ROUNDS_TO_UNLOCK} finished rounds. A round counts once you have finished it and holed out at least nine holes. Place your shots on the hole map when you can, because that is how Golf Me spots where your misses go.</p>
        <div className="mt-3 grid max-w-xs grid-cols-3 gap-1.5" aria-hidden="true">
          {Array.from({ length: ROUNDS_TO_UNLOCK }, (_, i) => (
            <span key={i} className={`h-2 rounded-full ${i < done ? "bg-lime" : "bg-white/15"}`} />
          ))}
        </div>
        <Link href="/my-golf/shots" className="btn mt-5 inline-block !px-5 !py-2 !text-sm">Back to the tracker</Link>
      </div>
    );
  }

  const thin = report.coverage.shots > 0 && report.coverage.mapped / report.coverage.shots < 0.5;
  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm text-white/70">
          {report.course} · {report.rounds} finished rounds · {report.hand === "R" ? "Right" : "Left"} handed
        </p>
        <p className="mt-2 max-w-2xl text-sm text-white/65">
          Based on {report.coverage.shots} shots. {report.coverage.mapped} were placed on the hole map, and only those can show where your misses go.
          {thin ? " Place more shots on the map to get sharper patterns." : ""} These are patterns in your numbers, not a diagnosis. A coach can confirm them on the range.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">What we noticed</h2>
        {report.insights.length === 0 && <p className="text-white/70">Nothing stands out yet. Keep placing your shots on the map and the patterns will sharpen with every round.</p>}
        {report.insights.map((i) => (
          <article key={i.id} className="glass rounded-2xl p-4">
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${TONE[i.tone].cls}`}>{TONE[i.tone].label}</p>
            <h3 className="mt-1 font-display text-xl leading-tight">{i.title}</h3>
            <p className="mt-2 text-sm text-white/80">{i.body}</p>
            {i.coach && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/15 px-3 py-2">
                <p className="text-sm text-white/85"><span className="font-semibold text-lime">Raise with your coach:</span> {i.coach}</p>
                <Link href="/coaches" className={pill}>Book a lesson</Link>
              </div>
            )}
          </article>
        ))}
      </section>

      <section>
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Hole by hole</h2>
        <div className="glass mt-3 overflow-x-auto rounded-2xl p-2">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-white/50">
              <tr><th className="p-3">Hole</th><th className="p-3">Par</th><th className="p-3">Avg shots</th><th className="p-3">Avg putts</th><th className="p-3">Trouble</th></tr>
            </thead>
            <tbody>
              {report.holes.map((h) => (
                <tr key={h.hole} className="border-t border-white/10">
                  <td className="p-3 font-semibold">{h.hole}</td>
                  <td className="p-3">{h.par ?? "-"}</td>
                  <td className="p-3">{h.avgShots.toFixed(1)}</td>
                  <td className="p-3">{h.avgPutts.toFixed(1)}</td>
                  <td className="p-3 text-white/75">{h.trouble || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {report.coach.length > 0 && (
        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-[clamp(1.4rem,4.5vw,1.8rem)]">Take this to your next lesson</h2>
          <ul className="mt-3 grid gap-2 text-sm text-white/85">
            {report.coach.map((c) => (
              <li key={c} className="flex gap-2"><span className="text-lime" aria-hidden="true">&#9679;</span>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-lime/60 bg-lime/10 p-6 text-center">
        <p className="font-display text-[clamp(1.6rem,5vw,2.2rem)] text-lime">Turn these patterns into shots saved</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85">Book a session with a Sydney coach and bring this report with you.</p>
        <Link href="/coaches" className="btn mt-4 inline-block !px-6 !py-3 !text-sm">Book your next session</Link>
      </section>
    </div>
  );
}
