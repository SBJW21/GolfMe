import Link from "next/link";
import CoachCard from "@/components/CoachCard";
import FeatureShowcase from "@/components/FeatureShowcase";
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
      </section>

      <FeatureShowcase />

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">
            Featured coaches
          </h2>
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
        <div className="mt-10 flex justify-center">
          <Link href="/coaches" className="btn">
            Find a coach
          </Link>
        </div>
      </section>
    </main>
  );
}
