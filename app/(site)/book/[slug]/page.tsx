import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingScreen from "@/components/BookingScreen";
import { getCoach, getSlots } from "@/lib/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a lesson",
  robots: { index: false },
};

export default async function BookPage(props: PageProps<"/book/[slug]">) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const found = await getCoach(slug);
  if (!found) notFound();
  const { coach } = found;

  const slot = Array.isArray(sp.slot) ? sp.slot[0] : sp.slot;
  const valid = !!slot && (await getSlots(coach)).some((s) => s.startsAt === slot);

  return (
    <BookingScreen
      coach={coach}
      slot={slot}
      valid={valid}
      backHref={`/coaches/${coach.slug}`}
      source="site"
    />
  );
}
