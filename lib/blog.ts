export type Block = { h?: string; p: string[] };
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  blocks: Block[];
  sources: { label: string; url: string }[];
};

export const posts: Post[] = [
  {
    slug: "how-much-do-golf-lessons-cost-in-sydney",
    title: "How much do golf lessons cost in Sydney?",
    description:
      "What Sydney golf lessons cost, from 30-minute sessions to on-course lessons, with real prices from local providers and tips for getting value.",
    date: "2026-10-22",
    blocks: [
      {
        p: [
          "Golf lessons in Sydney are usually priced by the half hour or the hour. The price depends on the coach, the facility and whether you want technology such as a launch monitor.",
          "These are published prices from two Sydney providers, checked on 22 October 2026. Prices change, so confirm with the provider before you book.",
        ],
      },
      {
        h: "Prices from Sydney providers",
        p: [
          "Moore Park Golf lists a private 30-minute lesson at $88 and a private one-hour lesson at $166. A one-hour shared lesson is $191 for two people. An on-course private lesson starts at $285 for an hour and a half.",
          "Precision Golf at Cromer lists an adult 30-minute lesson at $100 and a one-hour lesson at $150, both with a PGA coach and TrackMan. A junior one-hour lesson is $110 and a 90-minute short game lesson is $225.",
        ],
      },
      {
        h: "What changes the price",
        p: [
          "Length matters most. A 30-minute lesson suits one fault, such as a slice. A full hour gives time to warm up, work on a drill and check it sticks.",
          "On-course lessons cost more because the coach plays holes with you. They help with course management as well as swing.",
          "Shared lessons cost less per person. They work well for friends at a similar level.",
          "Packages usually lower the price per lesson. Moore Park Golf, for example, lists a 12-pack of 30-minute lessons at 15% off.",
        ],
      },
      {
        h: "How to get good value",
        p: [
          "Pick one thing to work on before you book. Tick it when you search on Golf Me so the coach knows what you want from the first minute.",
          "Book a short run of lessons rather than one. One lesson shows you the fix. Follow-up lessons check you are still doing it.",
          "Compare coaches before you commit. On Golf Me, every coach shows their hourly price and real reviews, and you can cancel up to 24 hours before for full account credit.",
        ],
      },
    ],
    sources: [
      { label: "Moore Park Golf: private lessons", url: "https://mooreparkgolf.com.au/learn/private-lessons/" },
      { label: "Precision Golf: golf lessons Sydney", url: "https://www.precisiongolf.com.au/golf-lessons-sydney/" },
    ],
  },
  {
    slug: "sydney-golf-courses-to-play",
    title: "Which Sydney golf course suits you?",
    description:
      "A short guide to choosing a Sydney golf course by what you want from a round: a quick first game, a gentler layout or a full test.",
    date: "2026-10-22",
    blocks: [
      {
        p: [
          "The best course depends on what you want from the day. Here is how we would choose, using the details courses publish. These are our reads, not reviews of every hole. We will add coach picks as our coaches share them.",
        ],
      },
      {
        h: "Short on time or new to the game: Moore Park Golf",
        p: [
          "Moore Park Golf is an 18-hole, par 70 course close to the city. Its own site lists 10-hole rounds, which suit a first game or a lunch break. Online bookings were listed at $39 on weekdays and $46 on Fridays to Sundays when we checked on 22 October 2026.",
          "Our take: a 10-hole round is the easiest way to try golf without giving up half a day. Book a lesson first and use the round to practise what you learn.",
        ],
      },
      {
        h: "Want a gentler layout: Bardwell Valley",
        p: [
          "Bardwell Valley Golf Club at Bardwell Park is 18 holes, but the par is 62. That is ten shots lower than a standard par 72 course, which usually means shorter holes.",
          "Our take: a shorter course tends to be quicker to play and kinder to beginners. We have not played it, so check the course for hole lengths before you go.",
        ],
      },
      {
        h: "Want a full test: Mona Vale",
        p: [
          "Mona Vale Golf Club on the Northern Beaches is 18 holes, par 73. It has the highest par of the courses we have details for. Par is only a rough guide to difficulty, but it points to a longer round.",
          "Our take: a good target once you can hit the ball forward with some control. Pair it with a driving lesson beforehand.",
        ],
      },
      {
        h: "Other 18-hole courses with published details",
        p: [
          "Long Reef Golf Course at Collaroy is 18 holes, par 71. Wakehurst Golf Club at Allambie Heights is 18 holes, par 72. St Michael's Golf Club at Little Bay is 18 holes, par 72. Stonecutters Ridge at Colebee is 18 holes, par 71. Lynwood Golf and Country Club at Pitt Town is 18 holes, par 72. Brighton Lakes at Moorebank is 18 holes, par 70.",
        ],
      },
      {
        h: "Match the course to your lesson",
        p: [
          "Slicing the ball off the tee? Book a driving lesson before a longer course. Losing shots around the green? A short game lesson pays back fastest. Every course page on Golf Me links to coaches nearby.",
        ],
      },
    ],
    sources: [
      {
        label: "Fairway Finders: public golf courses in Sydney",
        url: "https://fairwayfinders.com.au/access/public/new-south-wales/sydney-metropolitan",
      },
      { label: "Moore Park Golf: play", url: "https://mooreparkgolf.com.au/play/" },
    ],
  },
  {
    slug: "getting-started-in-golf-kit-and-coach",
    title: "Getting started in golf: what to buy and how to choose a coach",
    description:
      "A beginner's guide to golf kit, what you can skip for now and what to look for in a coach before you book your first lesson.",
    date: "2026-10-22",
    blocks: [
      {
        p: [
          "Golf can look expensive before you have hit a ball. It does not need to be. Start with the basics, borrow or buy used where you can and put your money into good coaching first.",
        ],
      },
      {
        h: "The kit you need",
        p: [
          "Clubs. You do not need a full set of 14. A half set is often enough to get started. It usually has a driver, a few irons and a putter. One guide says you can enjoy the game with as few as five to seven clubs. Another suggests eight to 10.",
          "Renting is a good first step. Buying used is the next. Pro shops sometimes sell second-hand gear that helps you piece together a set.",
          "Balls. Buy cheap and durable. Most beginners lose a few. A dozen is plenty to start.",
          "A bag, tees and a glove. A stand bag suits walking and a cart bag suits riding. Tees come in wood or plastic, and plastic lasts longer. A snug glove helps your grip and stops blisters. Keep a spare in case one gets wet.",
          "Clothing. Check the course's dress code first. Most expect a collared top. Add a hat, sunglasses and water for a Sydney summer.",
        ],
      },
      {
        h: "What can wait",
        p: [
          "Golf shoes are not essential at the start. Shoes with good grip will do. They are worth buying once you know you will keep playing, because they add support and traction over a full round.",
          "Rangefinders and GPS watches can wait too. A new golfer gets far more from a lesson than from a gadget.",
        ],
      },
      {
        h: "What to look for in a coach",
        p: [
          "Qualifications. Ask what qualification the coach holds. Look for a professional with current training. All coaches on Golf Me are checked before they appear.",
          "Experience that fits you. Check that the coach works with players at your level and enjoys teaching beginners. Look for reviews from golfers like you.",
          "The right focus. If you slice the ball or struggle with putting, choose a coach who covers it. On Golf Me you can tick what you want to work on and see who matches.",
          "A style that suits you. A good coach adapts to you and avoids a one-size-fits-all method. Some people want tough love and some prefer a gentle approach. Reviews help you see which you are getting.",
          "Clear communication. Expect straightforward answers on price, timing and what to practise between lessons. A lesson report afterwards makes that easy.",
          "Use of video. Seeing your swing on screen makes a fix easier to understand. It also lets you check your progress.",
          "Support beyond the lesson. The best coaches help before a round or between sessions. Ask how they follow up.",
        ],
      },
      {
        h: "Your first week",
        p: [
          "Book one lesson before you buy anything big. Your coach can tell you which clubs suit your height and swing. Then borrow or rent a half set and book a short run of lessons. Search by suburb on Golf Me to find coaches near you.",
        ],
      },
    ],
    sources: [
      {
        label: "NCGA: golf gear guide for new golfers",
        url: "https://blog.ncga.org/golf-gear-guide-must-haves-and-nice-to-haves-for-new-golfers",
      },
      { label: "Nike Golf: gear essentials for beginners", url: "https://www.nike.com/au/a/best-golf-gear-beginners" },
      {
        label: "PGA: how to choose a golf coach",
        url: "https://www.pga.com/story/instruction-get-started-how-to-choose-a-golf-coach",
      },
      { label: "Golf.com: what to look for in a coach", url: "https://golf.com/?p=15517952" },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
