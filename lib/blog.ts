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
          "Pick one thing to work on before you book. Tick it when you search on Golf Me so the coach knows what you want from the first minute.",
          "Book a short run of lessons rather than one. One lesson shows you the fix. Follow-up lessons check you are still doing it.",
          "Compare coaches before you commit. On Golf Me, every coach shows their hourly price and real reviews, and you can cancel up to 24 hours before for full account credit.",
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
    title: "Sydney golf courses to play, by area",
    description:
      "A guide to Sydney golf courses by area, with holes and par where published, plus how to get a lesson near each one.",
    date: "2026-10-22",
    blocks: [
      {
        p: [
          "Sydney has dozens of courses open to visitors and casual players. This guide groups some of them by area, using details published by Fairway Finders on 22 October 2026.",
          "Always check the course for current fees, opening hours and booking rules.",
        ],
      },
      {
        h: "Northern Beaches",
        p: [
          "Long Reef Golf Course at Collaroy is an 18-hole, par 71 course. Mona Vale Golf Club is 18 holes, par 73. Wakehurst Golf Club at Allambie Heights is 18 holes, par 72.",
          "Balgowlah Golf Club, Warringah Golf Club, Avalon Golf Course and Palm Beach Golf Club are also in the directory.",
        ],
      },
      {
        h: "Inner city and east",
        p: [
          "Moore Park Golf is an 18-hole, par 70 course close to the city. It takes bookings online and lists 10-hole rounds, which suit a short visit.",
          "St Michael's Golf Club at Little Bay is 18 holes, par 72. Bardwell Valley Golf Club at Bardwell Park is 18 holes, par 62.",
        ],
      },
      {
        h: "West and south-west",
        p: [
          "Stonecutters Ridge at Colebee is 18 holes, par 71. Lynwood Golf and Country Club at Pitt Town is 18 holes, par 72. Brighton Lakes at Moorebank is 18 holes, par 70.",
        ],
      },
      {
        h: "Before you play",
        p: [
          "A lesson before a round helps most with the shot that costs you the most strokes. Every course page on Golf Me links to coaches nearby.",
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
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
