import { areas, type Area } from "./areas";

export type SuburbPage = { slug: string; name: string; area: Area };

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** One landing page per suburb. Every suburb in an area group gets its own page. */
export const suburbPages: SuburbPage[] = (() => {
  const seen = new Set<string>();
  const out: SuburbPage[] = [];
  for (const area of areas) {
    for (const name of area.suburbs) {
      const slug = slugify(name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, name, area });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
})();

export function getSuburbPage(slug: string) {
  return suburbPages.find((s) => s.slug === slug);
}

export const SITE_URL = "https://golfme.com.au";
