import Link from "next/link";
import type { Metadata } from "next";
import CoachAdmin from "@/components/coach/CoachAdmin";
import CoachCalendar from "@/components/coach/CoachCalendar";
import CoachPhoto from "@/components/CoachPhoto";
import CoachRecent from "@/components/coach/CoachRecent";
import { hubWeeks } from "@/lib/coachHub";

export const metadata: Metadata = { title: "Coach hub" };
export const dynamic = "force-dynamic";

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-[clamp(1.7rem,5vw,2.3rem)]">{children}</h2>;
}

export default function CoachHubPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Sample coach hub</p>
      <div className="mt-1 flex items-center gap-4">
        <CoachPhoto slug="matt-grenot" name="Matt Grenot" photo="/coaches/matt-grenot.jpg" className="h-14 w-14 shrink-0" />
        <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">Coach hub</h1>
      </div>

      <section className="mt-6">
        <Heading>Upcoming</Heading>
        <div className="mt-4">
          <CoachCalendar weeks={hubWeeks()} />
        </div>
      </section>

      <Link
        href="/coach/swing-analysis"
        className="glass mt-12 flex items-center justify-between gap-4 rounded-2xl p-5 hover:!border-lime/70"
      >
        <div>
          <p className="font-display text-2xl text-lime">Swing analysis</p>
          <p className="text-sm text-white/75">Draw on a swing, add a voiceover and send it to your student</p>
        </div>
        <span className="text-2xl text-lime" aria-hidden="true">&rarr;</span>
      </Link>

      <section className="mt-6">
        <Heading>Recent</Heading>
        <div className="mt-4">
          <CoachRecent />
        </div>
      </section>

      <section className="mt-12">
        <Heading>Admin</Heading>
        <div className="mt-4">
          <CoachAdmin />
        </div>
      </section>
    </main>
  );
}
