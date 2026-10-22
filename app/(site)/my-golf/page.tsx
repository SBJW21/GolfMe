import type { Metadata } from "next";
import Link from "next/link";
import AppointmentSlider from "@/components/AppointmentSlider";
import CoachPhoto from "@/components/CoachPhoto";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { formatAud } from "@/lib/pricing";
import {
  sampleAppointments,
  sampleCoachesWorkedWith,
  sampleMattVideos,
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

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <span className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime text-2xl text-black">
              CA
            </span>
            <div>
              <p className="text-xl font-bold">{s.name}</p>
              <p className="text-sm text-white/70">Member since {s.memberSince}</p>
            </div>
          </div>
          <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Email", s.email],
              ["Phone", s.phone],
              ["Location", s.suburb],
              ["Handicap", s.handicap],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/50">My goal</dt>
              <dd className="mt-0.5 font-semibold">{s.goal}</dd>
            </div>
          </dl>
          <span className="mt-5 inline-block rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold">
            Edit details
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((x) => (
            <div key={x.label} className="glass rounded-2xl p-5">
              <p className="font-display text-3xl text-lime">{x.value}</p>
              <p className="mt-1 text-sm text-white/75">{x.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Heading>My lessons</Heading>
        <div className="mt-4">
          <AppointmentSlider items={sampleAppointments()} />
        </div>
      </section>

      <section className="mt-12">
        <Heading>My coaches</Heading>
        {([
          ["Active", true],
          ["Past", false],
        ] as const).map(([label, active]) => {
          const list = sampleCoachesWorkedWith.filter((c) => c.active === active);
          if (list.length === 0) return null;
          return (
            <div key={label} className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">{label}</p>
              <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/coaches/${c.slug}`}
                    className={`glass flex items-center gap-4 rounded-2xl p-4 hover:!border-lime/70 ${
                      active ? "" : "opacity-55 grayscale"
                    }`}
                  >
                    <CoachPhoto slug={c.slug} name={c.name} photo={c.photo} className="h-16 w-16 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold">{c.name}</p>
                      <p className="text-sm text-white/70">
                        {c.title ? `${c.title}, ` : ""}
                        {c.suburb}
                      </p>
                      <p className={`mt-1 text-sm font-semibold ${active ? "text-lime" : "text-white/70"}`}>
                        {c.lessons} lessons &middot; Rebook
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-12">
        <Heading>Videos from Matt</Heading>
        <p className="mt-1 text-sm text-white/70">
          Swing reviews and drills Matt Grenot has uploaded for you.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sampleMattVideos.map((v) => (
            <VideoPlaceholder key={v.id} title={v.title} meta={`${v.date} · ${v.length}`} label="Sample" />
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
        <div className="mt-4 max-w-sm">
          <Link href="/my-golf/billing#methods" className="glass block rounded-2xl p-5 hover:!border-lime/70">
            <p className="font-bold">Payment methods</p>
            <p className="mt-1 text-sm text-white/75">Update the card you pay with</p>
            <p className="mt-3 text-sm font-semibold text-lime">Open &rarr;</p>
          </Link>
        </div>
        <p className="mt-5 text-sm">
          <Link href="/my-golf/billing#receipts" className="text-white/60 underline underline-offset-4 hover:text-white">
            Payment history
          </Link>
        </p>
      </section>
    </main>
  );
}
