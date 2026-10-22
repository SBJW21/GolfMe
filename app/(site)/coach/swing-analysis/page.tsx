import type { Metadata } from "next";
import Link from "next/link";
import SwingStudio from "@/components/coach/SwingStudio";

export const metadata: Metadata = { title: "Swing analysis" };

export default function SwingAnalysisPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/coach" className="text-sm text-lime">
        &larr; Coach hub
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">Working concept</p>
      <h1 className="font-display mt-1 text-[clamp(2.2rem,7vw,3.4rem)]">Swing analysis</h1>
      <p className="mt-2 max-w-xl text-white/80">
        Draw on a golfer&apos;s swing, slow it down and talk them through it. They get your voice and your drawings in sync.
      </p>
      <div className="mt-8">
        <SwingStudio />
      </div>
    </main>
  );
}
