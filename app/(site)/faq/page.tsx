import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Golf Me FAQ",
  description:
    "How Golf Me works: finding a vetted Sydney golf coach, booking lessons online, lesson types, account credit and training videos.",
};

type QA = { q: string; a: string };
type Section = { id: string; title: string; intro?: string; items: QA[] };

const sections: Section[] = [
  {
    id: "about",
    title: "What is Golf Me?",
    items: [
      {
        q: "What is Golf Me?",
        a: "Golf Me is a Sydney platform for finding, comparing and booking golf coaches. Browse local professionals, read real reviews, see prices and book a lesson online in a couple of minutes.",
      },
      {
        q: "Why use Golf Me?",
        a: "Vetted professionals. Every coach is checked before they appear. Affordable. Prices are shown up front, so you can compare before you book. Flexible. Pick a time that suits you and manage changes yourself. All the training features. Lesson reports, saved videos, drills and a My Golf page that keeps your progress in one place.",
      },
      {
        q: "Which areas do you cover?",
        a: "Coaches across Sydney, from the northern beaches to the south and west. Choose your area on the map and we will show coaches nearby.",
      },
      {
        q: "Does it cost anything to use?",
        a: "Searching and comparing coaches is free. You only pay for the lessons you book.",
      },
    ],
  },
  {
    id: "start",
    title: "How to get started",
    intro: "Booking your first lesson takes about two minutes.",
    items: [
      {
        q: "How do I book a lesson?",
        a: "Search by area and what you want to work on, compare coaches, then pick a time on the coach's calendar. Lessons are paid in full at booking.",
      },
      {
        q: "Can I choose what I want to work on?",
        a: "Yes. Tick as many focus areas as you like, such as slice, driving, putting, general improvement or the basics. We show coaches who cover any of them.",
      },
      {
        q: "What if I need to cancel?",
        a: "Cancel up to 24 hours before the lesson and the full amount goes to your Golf Me account credit. Use it on a future lesson with any coach within 6 months. Inside 24 hours no credit is given. Credit is not paid back as cash.",
      },
      {
        q: "How does account credit work?",
        a: "Your credit balance shows on your My Golf page. It works with any coach and expires 6 months after it is issued.",
      },
      {
        q: "When does a lesson count as done?",
        a: "A lesson completes automatically 24 hours after it ends. If something went wrong, tell us before then.",
      },
    ],
  },
  {
    id: "lessons",
    title: "Lesson types",
    items: [
      {
        q: "What lessons can I book?",
        a: "One-on-one lessons with a coach, usually 60 minutes. Choose a focus for the session, from fixing a slice to short game, putting, course management or a general tune-up.",
      },
      {
        q: "I am a complete beginner. Is that fine?",
        a: "Absolutely. Tick Basics when you search and we will show coaches who teach new golfers. Coaches also cover every level up to advanced.",
      },
      {
        q: "I play already and want to get better. What should I pick?",
        a: "Choose General improvement, or pick the part of your game that costs you most shots. Your coach will build the session around it.",
      },
      {
        q: "Can I book more than one lesson?",
        a: "Yes. Many golfers book a run of lessons with the same coach. Book each one from the coach's calendar.",
      },
    ],
  },
  {
    id: "checklist",
    title: "Getting started checklist",
    items: [],
  },
  {
    id: "media",
    title: "Media and training videos",
    items: [
      {
        q: "What is in My Golf?",
        a: "Your upcoming and past lessons, your coaches, your account credit, your saved videos and your lesson reports.",
      },
      {
        q: "What is a lesson report?",
        a: "After a lesson your coach sends a short written report with what you worked on and what to practise next. It lands in My Golf.",
      },
      {
        q: "How do videos work?",
        a: "My Videos holds clips you have saved, clips your coach shared with you and clips your coach uploaded from your lesson. Each one is tagged Saved, Shared or Uploaded.",
      },
      {
        q: "Who can use the Learn library?",
        a: "The Learn library of drills and tips unlocks once you have booked three or more lessons.",
      },
    ],
  },
];

const checklist = [
  "Choose your area on the map",
  "Tick what you want to work on",
  "Compare coaches, prices and reviews",
  "Pick a time and book",
  "Check your confirmation in My Golf",
  "Turn up 10 minutes early with your clubs",
  "Read your lesson report and watch any videos your coach shares",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections
    .flatMap((s) => s.items)
    .map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-display text-[clamp(2.2rem,7vw,3.4rem)]">FAQ</h1>
      <p className="mt-2 max-w-xl text-white/80">
        Everything you need to know about finding a coach and booking with Golf Me.
      </p>
      <nav aria-label="FAQ sections" className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-white/20 px-3 py-1.5 hover:border-lime hover:text-lime"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
          <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">{s.title}</h2>
          {s.intro && <p className="mt-2 text-white/80">{s.intro}</p>}
          {s.id === "checklist" ? (
            <ul className="glass mt-4 grid gap-3 rounded-2xl p-5">
              {checklist.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-lime/70 text-xs text-lime"
                  >
                    &#10003;
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/15">
              {s.items.map((i) => (
                <details key={i.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    {i.q}
                    <span aria-hidden="true" className="text-lime transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-white/80">{i.a}</p>
                </details>
              ))}
            </div>
          )}
        </section>
      ))}

      <div className="mt-12 text-center">
        <Link href="/coaches" className="btn">
          Find a coach
        </Link>
      </div>
    </main>
  );
}
