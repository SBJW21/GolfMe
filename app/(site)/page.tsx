import Link from "next/link";
import CoachCard from "@/components/CoachCard";
import HowItWorks from "@/components/HowItWorks";
import SampleNotice from "@/components/SampleNotice";
import FocusPicker from "@/components/FocusPicker";
import AreaPicker from "@/components/AreaPicker";
import { areaCounts } from "@/lib/areas";
import { loadCoaches } from "@/lib/repo";

export const revalidate = 60;

const steps = [
  {
    title: "Compare coaches",
    text: "Browse Sydney coaches by suburb, price and what you want to work on. Read genuine reviews.",
  },
  {
    title: "Book in a few taps",
    text: "Pick a time from the coach's calendar and pay securely online. No texting back and forth.",
  },
  {
    title: "Track your progress",
    text: "Keep your lesson history, get detailed feedback from your coach (videos and schematics where possible), see your scores and rebook easily.",
    badge: "New feature",
  },
];

export default async function Home() {
  const { coaches, isSample } = await loadCoaches();
  return (
    <main>
      <section
        className="relative z-10 flex flex-col items-center px-4 pb-16 pt-16 text-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.7) 70%, #000 100%), url(/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "50% 35%",
        }}
      >
        <h1 className="font-display text-[clamp(3.2rem,13vw,7rem)]">
          Find your <span className="text-lime">coach</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Compare golf coaches in Sydney, read reviews and book lessons online.
        </p>
        <form
          action="/coaches"
          method="GET"
          className="mt-8 grid w-full max-w-3xl gap-2 rounded-2xl border border-white/15 bg-black/55 p-2 backdrop-blur sm:grid-cols-[1fr_1fr_auto]"
        >
          <FocusPicker name="focus" />
          <AreaPicker name="area" counts={areaCounts(coaches.map((c) => c.suburb))} />
          <button type="submit" className="btn">
            Find a coach
          </button>
        </form>
        <p className="mt-4 text-sm text-white/75">
          Are you a coach?{" "}
          <Link href="/for-coaches" className="font-semibold text-lime underline-offset-4 hover:underline">
            Join Golf Me
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display mb-6 text-[clamp(1.7rem,5vw,2.3rem)]">
          How it works
        </h2>
        <HowItWorks steps={steps} />
        <p className="mb-3 mt-10 text-xs font-bold uppercase tracking-[0.16em] text-white/50">Also in Golf Me</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/coach/swing-analysis", title: "Swing analysis", text: "Draw on the swing, trace the ball flight and compare before and after", cta: "See it" },
            { href: "/my-golf/shots", title: "Shot tracker", text: "Mark each shot with GPS and see your distance for every club", cta: "Try it" },
            { href: "/courses", title: "Course guides", text: "Hole maps, how it plays and a 7 day forecast for Sydney courses", cta: "Browse" },
            { href: "/my-golf/rounds", title: "Rounds and streaks", text: "Log your scorecard and keep your weekly golf streak alive", cta: "Open" },
          ].map((f) => (
            <li key={f.title}>
              <Link href={f.href} className="glass flex h-full flex-col gap-1 rounded-2xl border-lime/30 p-4 transition hover:!border-lime/70 md:hover:-translate-y-0.5">
                <span className="font-display text-xl text-lime">{f.title}</span>
                <span className="text-sm text-white/80">{f.text}</span>
                <span className="pill-arrow mt-auto self-start rounded-full border border-lime/60 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-lime">{f.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">
            Featured coaches
          </h2>
          <Link href="/coaches" className="text-sm font-semibold text-lime">
            See all
          </Link>
        </div>
        <div className="mb-4">
          <SampleNotice show={isSample} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:py-6">
          {coaches.slice(0, 3).map((c, i) => (
            <div
              key={c.slug}
              className={`[&>a]:h-full ${
                i === 1
                  ? "lg:relative lg:z-10 lg:scale-[1.16] lg:shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
                  : "lg:scale-[0.97]"
              }`}
            >
              <CoachCard coach={c} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
