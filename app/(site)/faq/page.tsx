import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Golf Me FAQ",
  description:
    "How Golf Me works: finding a vetted Sydney golf coach, booking lessons online, lesson types, account credit and training videos.",
};

type QA = { q: string; a: string };
type Section = { id: string; title: string; intro?: string; items: QA[] };

const sections: Section[] = [
  {
    id: "about",
    title: "What is Golf Me?",
    items: [
      {
        q: "What is Golf Me?",
        a: "Golf Me is a Sydney platform for finding, comparing and booking golf coaches. Browse local professionals, read real reviews, see prices and book a lesson online in a couple of minutes.",
      },
      {
        q: "Why use Golf Me?",
        a: "Vetted professionals. Every coach is checked before they appear. Affordable. Prices are shown up front, so you can compare before you book. Flexible. Pick a time that suits you and manage changes yourself. All the training features. Lesson reports, saved videos, drills and a My Golf page that keeps your progress in one place.",
      },
      {
        q: "Which areas do you cover?",
        a: "Coaches across Sydney, from the northern beaches to the south and west. Choose your area on the map and we will show coaches nearby.",
      },
      {
        q: "How do I get the $10 new member credit?",
        a: "New members get $10 Golf Me credit when they join through the ScoreCard or an invite link. It is added after you log your first round, works with any coach and expires after 6 months. Full terms are on the new member credit page.",
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
        a: "Cancel up to 24 hours before the lesson and the full amount goes to your Golf Me account credit. Use it on a future lesson with any coach within 6 months. Inside 24 hours no credit is given. Credit is not paid back as cash.",
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
  {
    id: "swing",
    title: "The golf swing explained",
    intro: "Plain answers to the questions new golfers ask most. Sources are listed at the bottom of the page.",
    items: [
      {
        q: "What is a golf swing?",
        a: "The golf swing is the motion you use to hit the ball. It is usually described in stages: the setup, the backswing that takes the club away from the ball, the downswing that brings it back through the ball, contact, and the follow-through after the ball has gone.",
      },
      {
        q: "What is the backswing?",
        a: "The backswing is the part of the swing where you wind up and take the club away from the target. The first movement is called the takeaway. GOLF.com instruction says how far you go back affects how much power you can build. Top 100 Teacher Kellie Stenzel advises limiting it to what your flexibility allows so you can stay in your posture.",
      },
      {
        q: "What is the downswing?",
        a: "The downswing starts when the club stops moving away from the ball and begins moving back towards it. GOLF.com says the force comes mainly from swing speed and rotation of the hips.",
      },
      {
        q: "What are the basic fundamentals of a good swing?",
        a: "Kellie Stenzel lists ten in GOLF.com. The ones beginners hear most are holding the club in the fingers of the lead hand, bending forward from the hips (not the knees) so the arms hang down, keeping feet about hip-width apart (wider only with the driver), and keeping balance at address, through the swing and at the finish. A coach can check these on video.",
      },
      {
        q: "Should I try to lift the ball into the air?",
        a: "No. Stenzel advises letting your arms extend towards the turf so the club strikes the ground, rather than trying to scoop the ball up. The loft of the club does the lifting.",
      },
    ],
  },
  {
    id: "ball-flight",
    title: "Draw, fade, slice and hook",
    intro: "Descriptions are for a right-handed golfer. Reverse left and right if you play left-handed.",
    items: [
      {
        q: "What is a draw in golf?",
        a: "A draw is a shot that curves gently from right to left. Many golfers describe it as starting on or just right of the target line and bending back towards the target. It usually runs a little further than a straight shot.",
      },
      {
        q: "What is a fade in golf?",
        a: "A fade is the opposite of a draw. It curves gently from left to right, often starting on or just left of the target line.",
      },
      {
        q: "What is a slice?",
        a: "A slice is a fade that curves too much, often finishing well right of where you aimed. It is the most common miss for amateur golfers. Instruction from Golf Digest explains that a clubface pointing right of the swing path produces a fade or slice, and the bigger the gap, the bigger the curve.",
      },
      {
        q: "What is a hook?",
        a: "A hook is a draw that curves too much, starting on line or left and finishing well left of the target. In ball flight terms it comes from a clubface pointing well left of the swing path.",
      },
      {
        q: "What are a push and a pull?",
        a: "A push starts right of the target and flies fairly straight. A pull starts left of the target and flies fairly straight. Neither one curves much.",
      },
      {
        q: "Why does the ball curve?",
        a: "Golf Digest and GolfWRX instruction both describe curve as coming from the relationship between where the clubface points and the direction the club is travelling (the swing path) at impact. If the face points right of the path the ball tends to curve left to right. If it points left of the path the ball tends to curve right to left. The bigger the difference, the bigger the curve.",
      },
      {
        q: "Does the clubface or the swing path start the ball?",
        a: "Teacher Tom Stickney wrote in GolfWRX that the clubface sets most of the starting direction (he puts it at 75 percent or more) and the path mostly drives the curve. Not every teacher agrees on the exact split, and the GolfWRX comments show golfers define draw and fade a little differently. If you are working on this, ask your coach and check it on video.",
      },
      {
        q: "How do I hit a draw?",
        a: "Instructors generally describe a draw as a swing path that travels slightly more in-to-out than the clubface is pointing. Golf Digest gives an example of a path of about 1 degree in-to-out with a square face, which produces a slight draw. This is easier to set up with a coach who can see your path on video.",
      },
      {
        q: "What causes a slice?",
        a: "A clubface that is open to the swing path. It often goes with a swing that travels from out to in across the target line. Fixing it usually means changing the grip, the face or the path, which a coach can spot quickly. You can book a slice-focused lesson with a Golf Me coach.",
      },
    ],
  },
  {
    id: "scoring",
    title: "Scoring, par and handicaps",
    items: [
      {
        q: "What does par mean?",
        a: "Par is the number of strokes a skilled golfer is expected to need on a hole. Most holes are par 3, 4 or 5. The par of a course is the total for its holes, and most 18-hole courses sit in the low 70s.",
      },
      {
        q: "What are a birdie, eagle and bogey?",
        a: "A birdie is one stroke under par on a hole. An eagle is two under. An albatross is three under. A bogey is one over par and a double bogey is two over.",
      },
      {
        q: "How does Stableford scoring work?",
        a: "Stableford scores points on each hole and the highest total wins. Against your handicap-adjusted score a bogey earns 1 point, par 2, birdie 3 and eagle 4. A double bogey or worse earns 0, so one bad hole does not ruin your round. It was devised by Frank Stableford and first used informally at Glamorganshire Golf Club in Wales in 1898. Golf Australia calls 36 Stableford points the universal measure of playing to your handicap.",
      },
      {
        q: "What is a handicap?",
        a: "A handicap is a number that shows your playing ability so golfers of different levels can compete fairly. In Australia the World Handicap System calls it your GA Handicap. It is based on the average of your best 8 scores from your most recent 20. You need three 18-hole scores to get one, and the maximum is 54.0.",
      },
      {
        q: "What is a daily handicap?",
        a: "Your daily handicap is the number of shots you receive on a particular course and set of tees. Golf Australia gives the formula as GA Handicap multiplied by (Slope Rating divided by 113), plus the Scratch Rating minus par, all multiplied by 0.93 and rounded to a whole number.",
      },
      {
        q: "What are Slope Rating and Scratch Rating?",
        a: "Each set of tees has a Scratch Rating, the score a scratch golfer is expected to shoot, and a Slope Rating from 55 to 155 showing how much harder the course plays for an average golfer. 113 is neutral.",
      },
      {
        q: "Can I track my scores on Golf Me?",
        a: "Yes. The ScoreCard in My Golf lets you log rounds with putts, an automatic Stableford estimate, your playing partners and a weekly streak. New members get $10 Golf Me credit, with terms on the new member credit page.",
      },
    ],
  },
  {
    id: "clubs",
    title: "Golf clubs explained",
    items: [
      {
        q: "How many clubs can I carry?",
        a: "The Rules of Golf allow up to 14 clubs in your bag. Beginners usually start with fewer, such as a driver, a hybrid or wood, a few irons, a wedge and a putter.",
      },
      {
        q: "What does the driver do?",
        a: "The driver is the longest club with the largest head, used for tee shots on longer holes. MyGolfSpy says most have a head of 440 to 460cc and 9 to 12 degrees of loft.",
      },
      {
        q: "What are fairway woods and hybrids?",
        a: "Fairway woods are smaller versions of the driver, such as a 3-wood or 5-wood, used off the tee or the turf for long shots. Hybrids blend a wood and an iron, replace hard-to-hit long irons and are easier to hit high and from the rough.",
      },
      {
        q: "What are irons and what do the numbers mean?",
        a: "Irons are numbered, and a higher number means more loft, so the ball goes higher and shorter. Sets commonly run from 4 or 5 through to 9. Game improvement irons are designed to be more forgiving for newer golfers.",
      },
      {
        q: "What are the different wedges?",
        a: "MyGolfSpy gives typical lofts of about 44 to 48 degrees for a pitching wedge, 50 to 54 for a gap wedge, 54 to 56 for a sand wedge and 58 to 60 for a lob wedge. They are used for short shots, bunkers and approaches close to the green.",
      },
      {
        q: "What is a putter for?",
        a: "The putter is used on the green to roll the ball into the hole. It has very little loft and is built for feel and distance control.",
      },
      {
        q: "Should my clubs be fitted?",
        a: "GOLF.com instruction recommends getting clubs fitted to your height rather than assuming the standard length suits you. Your coach can advise before you buy.",
      },
    ],
  },
  {
    id: "rules",
    title: "Rules every beginner should know",
    intro: "Based on the R&A and USGA Rules of Golf. Always check the current rules or ask your club for local rules.",
    items: [
      {
        q: "What happens if I lose my ball?",
        a: "A ball is lost if it is not found within three minutes of starting to look for it. You take one penalty stroke and play again from where you hit the previous shot. This is called stroke and distance.",
      },
      {
        q: "What happens if I hit out of bounds?",
        a: "The same as a lost ball. You take one penalty stroke and play again from where you hit the previous shot.",
      },
      {
        q: "What is a provisional ball?",
        a: "If your ball might be lost or out of bounds, you can play a second ball to save walking back. You must say it is a provisional before you play it. If you do not announce it properly, the second ball counts as your ball in play with the penalty. If you find your first ball in bounds within three minutes, you must carry on with that one.",
      },
      {
        q: "What can I do with an unplayable ball?",
        a: "You can declare a ball unplayable anywhere on the course except in a penalty area. There are three options and each adds one penalty stroke: go back and play from where you last hit, drop back on the line from the hole through where the ball lies, or drop within two club lengths of the ball. Going back and playing again works even if you cannot find the ball.",
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


const sources: { title: string; url: string }[] = [
  { title: "Golf Australia: World Handicap System", url: "https://www.golf.org.au/whs" },
  { title: "GolfWRX: Understanding the new ball flight laws (Tom Stickney)", url: "https://golfwrx.com/107406/understanding-the-new-ball-flight-laws/" },
  { title: "Golf Digest: Golf physics and ball flight", url: "https://www.golfdigest.com/story/you-need-to-understand-this-golf-physics-lesson-if-you-want-to-be-a-ball-flight-master" },
  { title: "GOLF.com: What is a backswing? (Jackson Wald)", url: "https://golf.com/instruction/golf-questions-youre-afraid-to-ask-what-is-a-backswing/" },
  { title: "GOLF.com: 10 fundamentals for a great golf swing (Kellie Stenzel)", url: "https://golf.com/instruction/10-fundamentals-needed-for-great-golf-swing/" },
  { title: "MyGolfSpy: Types of golf clubs explained", url: "https://mygolfspy.com/news-opinion/instruction/types-of-golf-clubs-explained-a-beginners-guide/" },
  { title: "Wikipedia: Stableford", url: "https://en.wikipedia.org/wiki/Stableford" },
  { title: "The R&A: Get golf rules ready", url: "https://www.randa.org/articles/get-golf-rules-ready" },
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
        Everything you need to know about finding a coach and booking with Golf Me, plus plain answers to common golf questions, from the swing and ball flight to scoring, clubs and the rules.
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

      <section id="sources" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-[clamp(1.5rem,5vw,2rem)]">Sources</h2>
        <p className="mt-2 text-sm text-white/65">Golf answers last checked 22 October 2026.</p>
        <ul className="mt-3 grid gap-1.5 text-sm">
          {sources.map((x) => (
            <li key={x.url}>
              <a href={x.url} target="_blank" rel="noopener noreferrer" className="text-lime underline-offset-4 hover:underline">
                {x.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 text-center">
        <Link href="/coaches" className="btn">
          Find a coach
        </Link>
      </div>
    </main>
  );
}
