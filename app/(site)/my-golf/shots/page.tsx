import type { Metadata } from "next";
import Link from "next/link";
import ShotTracker from "@/components/ShotTracker";

export const metadata: Metadata = { title: "Shot tracker" };

export default function ShotsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/my-golf" className="text-sm text-white/70 underline-offset-4 hover:underline">Back to My Golf</Link>
      <h1 className="font-display mt-2 text-[clamp(2.2rem,7vw,3.4rem)]">Shot tracker</h1>
      <p className="mt-2 max-w-xl text-white/75">Mark each shot on the course and see your line and distance for every club. Early version, so tell us what you think.</p>
      <div className="mt-8">
        <ShotTracker />
      </div>
    </main>
  );
}
