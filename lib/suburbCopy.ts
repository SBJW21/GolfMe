import { focusSentence } from "./data";
import { formatAud } from "./pricing";
import type { Coach, FocusArea } from "./types";

/** Stable number from a string, so each suburb always gets the same wording. */
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(slug: string, salt: string, options: T[]): T {
  return options[hash(slug + salt) % options.length];
}

type Input = {
  slug: string;
  name: string;
  areaLabel: string;
  neighbours: string[];
  nearby: Coach[];
  inSuburb: Coach[];
};

/**
 * Copy for a suburb page. Only uses facts we hold: the suburb, its area group, and the coaches
 * actually listed. Wording is varied per suburb so pages do not read as copies of each other.
 */
export function suburbCopy(i: Input) {
  const { slug, name, areaLabel, neighbours, nearby, inSuburb } = i;
  const n = nearby.length;
  const near = neighbours.slice(0, 3);
  const nearText =
    near.length > 1 ? `${near.slice(0, -1).join(", ")} and ${near[near.length - 1]}` : near[0] ?? areaLabel;

  const title = pick(slug, "t", [
    `Golf lessons in ${name}, Sydney`,
    `${name} golf coaches: book lessons online`,
    `Golf coach in ${name}, Sydney`,
  ]);

  const description = pick(slug, "d", [
    `Compare golf coaches near ${name}. See prices, reviews and availability, then book a lesson online with a vetted Sydney professional.`,
    `Looking for golf lessons in ${name}? Browse local coaches, compare hourly rates and book online in minutes.`,
    `Book a golf lesson near ${name}, ${nearText} and across Sydney. Real reviews, clear prices and instant online booking.`,
  ]);

  const h1Lead = pick(slug, "h", ["Golf lessons in", "Golf coaches in", "Learn golf in"]);

  const intro =
    n === 0
      ? pick(slug, "i0", [
          `Golf Me is growing around ${name}. Browse coaches across ${areaLabel} and Sydney while we sign up more nearby.`,
          `We are still adding coaches close to ${name}. See who is available across ${areaLabel} and book online.`,
        ])
      : pick(slug, "i1", [
          `Compare ${n} vetted ${n === 1 ? "coach" : "coaches"} near ${name}. Read reviews, check prices and book online.`,
          `${name} golfers can choose from ${n} ${n === 1 ? "coach" : "coaches"} across ${areaLabel}. Pick a time that suits and book in minutes.`,
          `Whether you play at the weekend or want to fix one fault, ${n} ${n === 1 ? "coach" : "coaches"} serving ${name} and ${nearText} are ready to help.`,
        ]);

  const here =
    inSuburb.length > 0
      ? ` ${inSuburb.map((c) => c.name).join(" and ")} ${inSuburb.length === 1 ? "teaches" : "teach"} right here in ${name}.`
      : "";

  const focuses = [...new Set(nearby.flatMap((c) => c.focus))] as FocusArea[];
  const teaches =
    focuses.length > 0
      ? pick(slug, "f", [
          `Coaches near ${name} cover ${focusSentence(focuses)}.`,
          `Nearby coaches can help with ${focusSentence(focuses)}.`,
          `Lessons around ${name} include ${focusSentence(focuses)}.`,
        ])
      : "";

  const prices = nearby.map((c) => c.priceCents);
  const priceLine =
    prices.length > 0
      ? Math.min(...prices) === Math.max(...prices)
        ? `Lessons near ${name} are ${formatAud(prices[0])} per hour.`
        : `Lessons near ${name} range from ${formatAud(Math.min(...prices))} to ${formatAud(Math.max(...prices))} per hour.`
      : "";

  const listHeading = pick(slug, "lh", [
    `Coaches near ${name}`,
    `Book a coach serving ${name}`,
    `Golf professionals around ${name}`,
  ]);
  const alsoHeading = pick(slug, "ah", [
    `Also near ${name}`,
    `Golf lessons in nearby suburbs`,
    `More suburbs around ${name}`,
  ]);

  const beginnerQ = pick(slug, "bq", [
    `Can beginners take golf lessons in ${name}?`,
    `Are there lessons for new golfers near ${name}?`,
  ]);
  const beginnerA =
    nearby.some((c) => c.focus.includes("Basics"))
      ? `Yes. Tick Basics when you search and we show coaches near ${name} who teach new golfers.`
      : `Yes. Coaches cover every level, from first-time golfers to advanced players. Check each profile for the levels they teach.`;

  return {
    title,
    description,
    h1Lead,
    intro: intro + here,
    teaches,
    priceLine,
    listHeading,
    alsoHeading,
    beginnerQ,
    beginnerA,
    cheapest: prices.length ? Math.min(...prices) : null,
  };
}
