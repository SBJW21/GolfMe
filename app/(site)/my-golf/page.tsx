import type { Metadata } from "next";
import Link from "next/link";
import AppointmentSlider from "@/components/AppointmentSlider";
import CoachPhoto from "@/components/CoachPhoto";
import MyReviews from "@/components/MyReviews";
import Flame from "@/components/Flame";
import { milestoneProgress, sampleRounds, streakInfo } from "@/lib/rounds";
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

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">{children}</h2>;
}

export default function MyGolfPage() {
  const s = sampleStudent;
  const coach = sampleCoachesWorkedWith.find((c) => c.active);
  const streak = streakInfo(sampleRounds());
  const prog = milestoneProgress(streak.current);
  const stats = [
    { label: "Lessons done", value: String(sampleStats.lessonsDone) },
    { label: "Upcoming", value: String(sampleStats.lessonsUpcoming) },
    { label: "Hours coached", value: String(sampleStats.hoursCoached) },
    { label: "Account credit", value: formatAud(sampleStats.creditCents) },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-white/45">
        Sample student profile
      </p>
      <h1 className="font-display mt-1 text-[clamp(2.2rem,7vw,3.4rem)]">My Golf</h1>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.8fr_1fr]">
        <div className="glass rounded-2xl p-5 text-center">
          <div className="flex flex-col items-center text-center">
            <span className="font-display flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-lime text-4xl text-black sm:h-32 sm:w-32 sm:text-5xl">
              CA
            </span>
            <p className="mt-3 text-2xl font-bold">{s.name}</p>
            <p className="text-sm text-white/70">Member since {s.memberSince}</p>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-center text-sm">
            {[
              ["Handicap", s.handicap],
              ["Location", s.suburb],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">My goal</dt>
              <dd className="mt-0.5 font-semibold">{s.goal}</dd>
            </div>
          </dl>
          <span className="pill-arrow mt-5 inline-block rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold">
            Edit details
          </span>
        </div>

        {coach && (
          <Link
            href={`/coaches/${coach.slug}`}
            className="glass flex flex-col items-start justify-center gap-3 self-start rounded-2xl p-4 hover:!border-lime/70 lg:self-stretch lg:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">My coach</p>
            <div className="flex items-center gap-3">
              <CoachPhoto slug={coach.slug} name={coach.name} photo={coach.photo} className="h-14 w-14 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">{coach.name}</p>
                <p className="text-sm text-white/70">
                  {coach.title ? `${coach.title}, ` : ""}
                  {coach.suburb}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-lime">{coach.lessons} lessons &middot; Rebook</p>
          </Link>
        )}

        <div className="grid grid-cols-2 gap-4">
          {stats.map((x) => (
            <div key={x.label} className="glass rounded-2xl p-5">
              <p className="font-display text-3xl text-lime">{x.value}</p>
              <p className="mt-1 text-sm text-white/75">{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/my-golf/rounds"
        className="glass mt-4 block rounded-2xl p-5 hover:!border-lime/70"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Flame lit={streak.current > 0} className="h-14 w-11 shrink-0" />
          <div className="min-w-[11rem] flex-1">
            <p className="font-display text-2xl text-lime">{streak.current} week streak</p>
            <p className="text-sm text-white/75">
              {streak.atRisk
                ? "Play this week to keep it alive"
                : prog.next
                  ? `${prog.toGo} ${prog.toGo === 1 ? "week" : "weeks"} to ${prog.next.name}`
                  : "Top level reached"}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-2">
            <span className="pill-arrow whitespace-nowrap rounded-full bg-lime px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-black sm:px-4 sm:text-sm">
              My rounds
            </span>
          </span>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-1" aria-hidden="true">
          {streak.tiles.map((t) => (
            <span
              key={t.idx}
              className={`h-2.5 rounded-full ${t.played ? "bg-lime" : "bg-white/15"} ${t.current && !t.played ? "animate-pulse" : ""}`}
            />
          ))}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full rounded-full bg-lime" style={{ width: `${prog.pct}%` }} />
        </div>
      </Link>

      <Link href="/my-golf/shots" className="glass mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 hover:!border-lime/70">
        <span>
          <span className="font-display block text-2xl text-lime">Shot tracker</span>
          <span className="text-sm text-white/75">Mark your shots on the course and see distance by club</span>
        </span>
        <span className="pill-arrow whitespace-nowrap rounded-full bg-lime px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-black sm:px-4 sm:text-sm">
          Open
        </span>
      </Link>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <Heading>My lessons</Heading>
          <Link
            href="/coaches"
            className="pill-arrow shrink-0 whitespace-nowrap rounded-full bg-lime px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black hover:brightness-110 sm:px-5 sm:text-sm"
          >
            Book lesson
          </Link>
        </div>
        <div className="mt-4">
          <AppointmentSlider items={sampleAppointments()} />
        </div>
      </section>

      <section className="mt-12">
        <Heading>My videos</Heading>
        <p className="mt-1 text-sm text-white/70">
          Videos you&apos;ve saved or your coach has shared or uploaded.
        </p>
        <div className="mt-4">
          <MyReviews />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sampleMyVideos.map((v) => (
            <VideoPlaceholder
              key={v.id}
              title={v.title}
              meta={`${v.date} \u00b7 ${v.length}`}
              label="Sample"
              tag={v.tag}
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Heading>Lesson reports</Heading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {sampleReports.map((r) => (
            <a
              key={r.id}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center gap-4 rounded-2xl p-4 hover:!border-lime/70"
            >
              <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md border border-lime/60 text-xs font-extrabold tracking-wider text-lime">
                PDF
              </span>
              <span className="min-w-0">
                <span className="block font-bold">{r.title}</span>
                <span className="block text-sm text-white/70">
                  {r.coach} &middot; {r.date}
                </span>
              </span>
              <span className="ml-auto text-sm font-semibold text-lime">Open</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Heading>Admin</Heading>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ["Payment methods", "/my-golf/billing#methods"],
            ["Payment history", "/my-golf/billing#receipts"],
          ].map(([t, href]) => (
            <Link
              key={t}
              href={href}
              className="pill-arrow rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold hover:border-lime hover:text-lime"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
