import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "$10 new member credit: terms",
  description: "Terms for the $10 Golf Me credit offered to new members who sign up through the ScoreCard or an invite link.",
};

const sections: { title: string; points: string[] }[] = [
  {
    title: "Who can get it",
    points: [
      "New members only. You must not have had a Golf Me account before, under any email address or phone number",
      "One account per person",
      "You must be 18 or over, or have a parent or guardian's consent",
      "You must sign up through the ScoreCard or an invite link",
    ],
  },
  {
    title: "How you earn it",
    points: [
      "The $10 credit is added once your account is verified and you have logged your first round on the ScoreCard",
      "One $10 credit per person and per household or device",
    ],
  },
  {
    title: "How you can use it",
    points: [
      "It is account credit only. It has no cash value and cannot be cashed out or transferred",
      "It expires 6 months after it is added",
      "You can use it with any coach on Golf Me",
      "It cannot be used for gift purchases or to top up other credit",
      "It is applied automatically at checkout. If your lesson costs less than your credit, the rest stays on your account until it expires",
      "Credit from a cancelled lesson follows our cancellation rule: cancel 24 hours or more before the lesson and the full amount comes back as account credit, valid for 6 months",
      "It cannot be used against refunded or disputed payments",
    ],
  },
  {
    title: "Fair play",
    points: [
      "We can remove credit from fake accounts, duplicate accounts, self-referrals or any misuse of an invite link",
      "We can change or end this offer at any time. Credit already added to an account is not affected",
      "Any reward for the person who sent an invite is set separately and is not covered here",
    ],
  },
  {
    title: "Inviting friends",
    points: [
      "Invites are sent by you, not by Golf Me. Only invite people who would expect to hear from you",
      "We do not upload or store your phone contacts. Share your invite link yourself by text or any app you like",
    ],
  },
  {
    title: "General",
    points: [
      "These terms are governed by the laws of New South Wales",
      "Questions? Contact us through the Golf Me contact page",
    ],
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Terms</p>
      <h1 className="font-display mt-1 text-[clamp(2.2rem,7vw,3.4rem)]">$10 new member credit</h1>
      <p className="mt-3 text-white/80">
        New members get $10 Golf Me credit when they join through the ScoreCard or an invite link. Here is how it works.
      </p>
      <div className="mt-8 grid gap-4">
        {sections.map((s) => (
          <section key={s.title} className="glass rounded-2xl p-5">
            <h2 className="font-display text-2xl">{s.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/85">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-6 text-sm text-white/55">
        These terms are a draft and should be reviewed before launch. See also our <Link href="/faq" className="underline">FAQ</Link>.
      </p>
    </main>
  );
}
