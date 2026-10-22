import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For golf coaches",
  description:
    "Less admin and more time coaching. Booking, reminders, student notes and monthly payouts in one place.",
};

const features = [
  ["Your own booking page", "A personalised booking link for your Instagram or website."],
  ["Calendar sync", "Connect your Google Calendar so availability is always up to date."],
  ["Confirmations and reminders", "Automatic messages that reduce no-shows."],
  ["Rescheduling and cancellations", "Students manage changes themselves. No more back and forth."],
  ["Student history and lesson notes", "Remember every student, their goals and what you worked on."],
  ["Earnings reports", "Clear statements of lessons, earnings and fees."],
  ["Monthly payouts", "Paid for lessons that have taken place, with no chasing payments."],
  ["Reviews that build your name", "Strong feedback helps new students choose you."],
  ["New students", "Get found by golfers in Sydney looking for a coach."],
] as const;

export default function ForCoachesPage() {
  return (
    <main className="glow-bg">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">
          Built for <span className="text-lime">coaches</span>
        </h1>
        <p className="mt-2 max-w-xl text-white/85">
          Less admin and more time coaching, with tools to help you grow your student base.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text]) => (
            <div key={title} className="glass rounded-2xl p-5">
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-1 text-sm text-white/80">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl border border-white/15 p-5 text-white/85">
          Coach sign-up opens soon.
        </p>
      </div>
    </main>
  );
}
