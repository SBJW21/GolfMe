import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoach } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Booking received" },
  robots: { index: false },
};

export default async function SoloBookedPage(props: PageProps<"/c/[slug]/booked">) {
  const { slug } = await props.params;
  const found = await getCoach(slug);
  if (!found) notFound();
  const { coach } = found;

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)]">
        You&apos;re <span className="text-lime">booked</span>
      </h1>
      <p className="mt-4 text-white/85">
        Thanks. Your payment was received and a confirmation will be sent to your email.
      </p>
      <Link href={`/c/${coach.slug}`} className="btn mt-8">
        Back to {coach.name}
      </Link>
    </main>
  );
}
