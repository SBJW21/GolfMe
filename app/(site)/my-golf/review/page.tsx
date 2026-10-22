import type { Metadata } from "next";
import ReviewViewer from "@/components/ReviewViewer";

export const metadata: Metadata = { title: "Swing review", robots: { index: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl">Your swing review</h1>
      <p className="mt-1 text-white/70">From Matt Grenot. Press play to hear him talk through the swing.</p>
      <div className="mt-6">{id ? <ReviewViewer id={id} /> : <p className="text-white/70">No review selected.</p>}</div>
    </div>
  );
}
