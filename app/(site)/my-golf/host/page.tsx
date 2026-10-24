import type { Metadata } from "next";
import Link from "next/link";
import HostRound from "@/components/HostRound";

export const metadata: Metadata = { title: "Host a round" };

export default function HostPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/my-golf" className="text-sm text-white/70 underline-offset-4 hover:underline">Back to My Golf</Link>
      <h1 className="font-display mt-2 text-[clamp(2.2rem,7vw,3.4rem)]">Host a round</h1>
      <p className="mt-2 max-w-xl text-white/75">Play with friends, compare scores over a beer after and stay in touch if you want to.</p>
      <div className="mt-8">
        <HostRound />
      </div>
    </main>
  );
}
