import Link from "next/link";
import CoachCard from "@/components/CoachCard";
import SampleNotice from "@/components/SampleNotice";
import { coaches } from "@/lib/data";

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
    text: "Keep your lesson history, notes and scores in one place and rebook with one click.",
  },
];

export default function Home() {
  return (
    <main>
      <section
        className="relative flex flex-col items-center px-4 pb-16 pt-16 text-center"
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
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/coaches" className="btn">
            Find a coach
          </Link>
          <Link href="/for-coaches" className="btn btn-ghost">
            I&apos;m a coach
          </Link>
        </div>
      </section>

      <section className="glow-bg mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display mb-6 text-[clamp(1.7rem,5vw,2.3rem)]">
          How it works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="glass rounded-2xl p-5">
              <p className="font-display text-4xl text-lime">{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-white/80">{s.text}</p>
            </div>
          ))}
        </div>
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
          <SampleNotice />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.slice(0, 3).map((c) => (
            <CoachCard key={c.slug} coach={c} />
          ))}
        </div>
      </section>
    </main>
  );
}
