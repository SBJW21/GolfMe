import type { Metadata } from "next";
import Link from "next/link";
import ShotReport from "@/components/ShotReport";

export const metadata: Metadata = { title: "Your shot report" };

export default function ShotReportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/my-golf/shots" className="text-sm text-white/70 underline-offset-4 hover:underline">Back to the shot tracker</Link>
      <h1 className="font-display mt-2 text-[clamp(2.2rem,7vw,3.4rem)]">Your shot report</h1>
      <div className="mt-8">
        <ShotReport />
      </div>
    </main>
  );
}
