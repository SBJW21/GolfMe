import type { Metadata } from "next";
import Link from "next/link";
import AppointmentSlider from "@/components/AppointmentSlider";
import CoachPhoto from "@/components/CoachPhoto";
import MyReviews from "@/components/MyReviews";
import Flame from "@/components/Flame";
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

function Group({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[clamp(1.5rem,4.5vw,2rem)]">{children}</h2>;
}
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
        <div className="flex flex-wrap gap-2">
          <Link href="/my-golf/rounds?mode=holes#log" className={pill}>Live Scorecard</Link>
          <Link href="/my-golf/rounds?mode=total#log" className={pill}>Mark last round</Link>
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
          <span className="pill-arrow mt-5 self-start rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold lg:mt-auto">Edit details</span>
        </div>
        <div className="grid content-start gap-3">
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
          <div className="grid grid-cols-2 gap-3">
            {stats.map((x) => (
              <div key={x.label} className="glass rounded-2xl px-4 py-3">
                <p className="font-display text-2xl leading-none text-lime">{x.value}</p>
                <p className="mt-1 text-xs text-white/75">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lessons, feedback, videos, reports */}
      <section className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6">
        <Group>Lessons</Group>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
          <Sub action={<Link href="/coaches" className="text-sm font-semibold text-lime underline-offset-4 hover:underline">Book lesson</Link>}>My lessons</Sub>
          <AppointmentSlider items={sampleAppointments()} />
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3">
          <Sub>Feedback</Sub>
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
          </div>
        </div>
      </section>

      {/* Tracking: scorecard, shots, friends */}
      <section className="mt-10 grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <Group>Play a round</Group>
          <Link href="/my-golf/host" className={pill}>Host a round</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/my-golf/rounds" className="glass flex flex-col gap-3 rounded-2xl p-4 hover:!border-lime/70">
            <Sub>Scorecard</Sub>
            <div className="flex items-center gap-3">
              <Flame lit={streak.current > 0} className="h-12 w-9 shrink-0" />
              <div>
                <p className="font-display text-xl leading-none text-lime">{streak.current} week streak</p>
                <p className="mt-1 text-xs text-white/75">
                  {streak.atRisk ? "Play this week to keep it alive" : prog.next ? `${prog.toGo} ${prog.toGo === 1 ? "week" : "weeks"} to ${prog.next.name}` : "Top level reached"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1" aria-hidden="true">
              {streak.tiles.map((t) => (
                <span key={t.idx} className={`h-2 rounded-full ${t.played ? "bg-lime" : "bg-white/15"} ${t.current && !t.played ? "animate-pulse" : ""}`} />
              ))}
            </div>
            <p className="text-sm text-white/70">Last round: {last.course}, {last.score}</p>
            <span className={`${pill} mt-auto self-start`}>Score a round</span>
          </Link>

          <Link href="/my-golf/shots" className="glass flex flex-col gap-3 rounded-2xl p-4 hover:!border-lime/70">
            <Sub>Shots</Sub>
            <p className="font-display text-xl leading-none text-lime">Shot tracker</p>
            <p className="text-sm text-white/75">Mark each shot with GPS and see your distance for every club.</p>
            <span className={`${pill} mt-auto self-start`}>Open</span>
          </Link>

          <Link href="/my-golf/rounds" className="glass flex flex-col gap-3 rounded-2xl p-4 hover:!border-lime/70">
            <Sub>Friends</Sub>
            <ul className="grid gap-1.5 text-sm">
              {sampleFriends.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-white/70">{f.weeks} week streak</span>
                </li>
              ))}
            </ul>
            <span className={`${pill} mt-auto self-start`}>See friends</span>
          </Link>
        </div>
      </section>

      {/* Admin */}
      <section className="mt-10">
        <Group>Admin</Group>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ["Payment methods", "/my-golf/billing#methods"],
            ["Payment history", "/my-golf/billing#receipts"],
          ].map(([t, href]) => (
            <Link key={t} href={href} className="pill-arrow rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold hover:border-lime hover:text-lime">
              {t}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
