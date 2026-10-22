import type { Metadata } from "next";
import Link from "next/link";
import { formatAud } from "@/lib/pricing";
import { samplePayments } from "@/lib/myGolf";

export const metadata: Metadata = { title: "Admin" };

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/my-golf" className="text-sm text-lime">
        &larr; My Golf
      </Link>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">Sample admin</p>
      <h1 className="font-display mt-1 text-[clamp(2.2rem,7vw,3.4rem)]">Admin</h1>
      <p className="mt-2 text-white/80">
        Lessons are paid in full at booking. Cancel up to 24 hours before and the full amount goes to your account credit. Credit works with any coach for 6 months.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Account credit</h2>
        <div className="glass mt-3 flex items-center justify-between rounded-2xl p-5">
          <div>
            <p className="font-display text-3xl text-lime">$20.00</p>
            <p className="text-sm text-white/70">Applied automatically to your next booking</p>
          </div>
        </div>
      </section>

      <section id="methods" className="mt-10 scroll-mt-24">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Payment method</h2>
        <div className="glass mt-3 flex items-center justify-between rounded-2xl p-5">
          <div>
            <p className="font-bold">Visa ending 4242</p>
            <p className="text-sm text-white/70">Expires 08/28</p>
          </div>
          <span className="rounded-lg border border-white/40 px-3 py-1.5 text-sm font-semibold">
            Update
          </span>
        </div>
      </section>

      <section id="receipts" className="mt-10 scroll-mt-24">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Payment history</h2>
        <ul className="glass mt-3 divide-y divide-white/10 rounded-2xl">
          {samplePayments.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <span>
                <span className="block font-semibold">{p.item}</span>
                <span className="text-white/60">{p.date}</span>
              </span>
              <span className="flex items-center gap-4">
                <span className="font-semibold">{formatAud(p.cents)}</span>
                <span className="font-semibold text-lime">Receipt</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
