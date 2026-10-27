import type { Metadata } from "next";
import Link from "next/link";
import AppointmentSlider from "@/components/AppointmentSlider";
import CoachPhoto from "@/components/CoachPhoto";
import MyReviews from "@/components/MyReviews";
import Accordion, { CapIcon, FlagIcon, PencilIcon, SmileIcon } from "@/components/Accordion";
import { milestoneProgress, sampleFriends, sampleRounds, streakInfo } from "@/lib/rounds";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { formatAud } from "@/lib/pricing";
import {
  sampleAppointments,
  sampleCoachesWorkedWith,
  sampleMyVideos,
  sampleReports,
  sampleStats,
  sampleStudent,
} from "@/lib/myGolf";

export const metadata: Metadata = { title: "My Golf" };
export const dynamic = "force-dynamic";

function Sub({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">{children}</h3>
      {action}
    </div>
  );
}
const pill =
  "pill-arrow shrink-0 whitespace-nowrap rounded-full bg-lime px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-black hover:brightness-110";

export default function MyGolfPage() {
  const s = sampleStudent;
  const coach = sampleCoachesWorkedWith.find((c) => c.active);
  const rounds = sampleRounds();
  const streak = streakInfo(rounds);
  const prog = milestoneProgress(streak.current);
  const last = rounds[0];
  const nextAppt = sampleAppointments().find((x) => !x.past);
  const nextLesson = nextAppt ? `${nextAppt.weekday} ${nextAppt.dateLabel}, ${nextAppt.time} with ${nextAppt.coachName}` : "book your next lesson";
  const stats = [
    { label: "Lessons done", value: String(sampleStats.lessonsDone) },
    { label: "Upcoming", value: String(sampleStats.lessonsUpcoming) },
    { label: "Hours coached", value: String(sampleStats.hoursCoached) },
    { label: "Account credit", value: formatAud(sampleStats.creditCents) },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">Sample student profile</p>
          <h1 className="font-display mt-1 text-[clamp(2rem,6vw,2.8rem)] leading-none">My Golf</h1>
        </div>
      </div>

      {/* Headline stats */}
      <section className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass flex flex-col rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="font-display flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lime text-3xl text-black">CA</span>
            <div className="min-w-0">
              <p className="text-xl font-bold leading-tight">{s.name}</p>
              <p className="text-sm text-white/70">Member since {s.memberSince}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">Handicap</dt>
              <dd className="mt-0.5 text-lg font-semibold">{s.handicap}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">Home area</dt>
              <dd className="mt-0.5 text-lg font-semibold">{s.suburb}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">Goal</dt>
              <dd className="mt-0.5 text-base">{s.goal}</dd>
            </div>
          </dl>
          <span className="pill-arrow mt-5 self-end rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold lg:mt-auto">Edit details</span>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-3">
          {coach && (
            <Link href={`/coaches/${coach.slug}`} className="glass flex items-center gap-3 rounded-2xl p-4 hover:!border-lime/70">
              <CoachPhoto slug={coach.slug} name={coach.name} photo={coach.photo} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">My coach</p>
                <p className="font-bold leading-tight">{coach.name}</p>
                <p className="text-sm text-white/70">{coach.lessons} lessons together</p>
              </div>
              <span className={pill}>Rebook</span>
            </Link>
          )}
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            {stats.map((x) => (
              <div key={x.label} className="glass flex flex-col justify-center rounded-2xl px-4 py-3">
                <p className="font-display text-2xl leading-none text-lime">{x.value}</p>
                <p className="mt-1 text-xs text-white/75">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-3">
        <Accordion
          icon={<CapIcon />}
          title="Lessons and reports"
          overview={<>Next: {nextLesson}</>}
        >
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
              <Sub action={<Link href="/coaches" className={pill}>Book lesson</Link>}>Upcoming</Sub>
              <AppointmentSlider items={sampleAppointments()} />
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
              <Sub>Swing feedback</Sub>
              <MyReviews />
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
              <Sub>Videos</Sub>
              <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {sampleMyVideos.map((v) => (
                  <div key={v.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
                    <VideoPlaceholder title={v.title} meta={`${v.date} \u00b7 ${v.length}`} label="Sample" tag={v.tag} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
              <Sub>Reports</Sub>
              <div className="grid gap-3 sm:grid-cols-2">
                {sampleReports.map((r) => (
                  <a key={r.id} href={r.href} target="_blank" rel="noreferrer" className="glass flex items-center gap-3 rounded-2xl p-3 hover:!border-lime/70">
                    <span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-md border border-lime/60 text-[0.65rem] font-extrabold tracking-wider text-lime">PDF</span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight">{r.title}</span>
                      <span className="block text-sm text-white/70">{r.coach} &middot; {r.date}</span>
                    </span>
                    <span className="ml-auto text-sm font-semibold text-lime">Open</span>
                  </a>
                ))}
                <Link href="/my-golf/shots/report" className="glass flex items-center gap-3 rounded-2xl p-3 hover:!border-lime/70">
                  <span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-md border border-lime/60 text-lime">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 20V10m7 10V4m7 16v-7" /></svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight">Your shot report</span>
                    <span className="block text-sm text-white/70">Unlocks after 3 finished rounds</span>
                  </span>
                  <span className="ml-auto text-sm font-semibold text-lime">Open</span>
                </Link>
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion icon={<FlagIcon />} title="Playing today" overview="Score a round and record every shot, with or without GPS." open>
          <p className="text-sm text-white/75">Pick your course, choose right or left handed and start. Your shots lock in when you finish the round.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-golf/shots" className={pill}>Open score tracker</Link>
            <Link href="/my-golf/host" className={pill}>Host a round</Link>
          </div>
        </Accordion>

        <Accordion icon={<PencilIcon />} title="Past rounds" overview={<>Last: {last.course}, {last.score} &middot; {streak.current} week streak</>}>
          <div className="grid grid-cols-12 gap-1.5" aria-hidden="true">
            {streak.tiles.map((t) => (
              <span key={t.idx} className={`h-2 rounded-full ${t.played ? "bg-lime" : "bg-white/15"} ${t.current && !t.played ? "animate-pulse" : ""}`} />
            ))}
          </div>
          <p className="mt-2 text-sm text-white/70">
            {streak.atRisk ? "Play this week to keep your streak alive. " : ""}
            {prog.next ? `${prog.toGo} ${prog.toGo === 1 ? "week" : "weeks"} to ${prog.next.name}` : "Top level reached"}
          </p>
          <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10">
            {rounds.slice(0, 2).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="font-semibold">{r.course}</span>
                <span className="text-white/70">{r.date} &middot; <span className="font-display text-lg text-lime">{r.score}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-golf/rounds" className={pill}>View all rounds</Link>
            <Link href="/my-golf/rounds?mode=total#log" className={pill}>Log a past round</Link>
          </div>
        </Accordion>

        <Accordion icon={<SmileIcon />} big title="Friends" overview={<>{sampleFriends[0].name} is on {sampleFriends[0].weeks} weeks &middot; {sampleFriends.length} friends</>}>
          <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
            {sampleFriends.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 font-display">{f.name[0]}</span>
                <span className="flex-1 font-semibold">{f.name}</span>
                <span className="text-white/70">{f.weeks} week streak</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-golf/rounds#friends" className={pill}>Manage friends</Link>
            <Link href="/my-golf/host" className={pill}>Host a round</Link>
          </div>
        </Accordion>
      </div>

      <p className="mt-6 text-sm text-white/70">
        <Link href="/my-golf/billing#methods" className="underline underline-offset-4 hover:text-lime">Payment methods</Link> &middot;{" "}
        <Link href="/my-golf/billing#receipts" className="underline underline-offset-4 hover:text-lime">Payment history</Link>
      </p>
    </main>
  );
}
