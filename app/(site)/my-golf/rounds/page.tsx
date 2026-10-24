import type { Metadata } from "next";
import Link from "next/link";
import RoundsTracker from "@/components/RoundsTracker";

export const metadata: Metadata = { title: "My rounds" };
export const dynamic = "force-dynamic";

export default async function RoundsPage(props: PageProps<"/my-golf/rounds">) {
  const { mode } = await props.searchParams;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/my-golf" className="text-sm text-lime">
        &larr; My Golf
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">Sample student profile</p>
      <h1 className="font-display mt-1 text-[clamp(2.2rem,7vw,3.4rem)]">My rounds</h1>
      <p className="mt-2 max-w-xl text-white/80">
        Log every round, keep your weekly streak alive and see how your friends are going.
      </p>
      <div className="mt-8">
        <RoundsTracker initialMode={mode === "holes" ? "holes" : "total"} />
      </div>
    </main>
  );
}
