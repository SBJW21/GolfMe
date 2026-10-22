import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)]">
        You&apos;re <span className="text-lime">booked</span>
      </h1>
      <p className="mt-4 text-white/85">
        Thanks. Your payment was received and a confirmation will be sent to your email.
      </p>
      <Link href="/coaches" className="btn mt-8">
        Browse more coaches
      </Link>
    </main>
  );
}
