import type { MetadataRoute } from "next";
import { loadCoaches } from "@/lib/repo";
import { courses } from "@/lib/courses";
import { posts } from "@/lib/blog";
import { SITE_URL, suburbPages } from "@/lib/suburbs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { coaches } = await loadCoaches();
  const now = new Date();
  const fixed = ["", "/coaches", "/golf-lessons", "/courses", "/blog", "/faq", "/new-member-credit", "/for-coaches", "/learn"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...fixed,
    ...suburbPages.map((s) => ({
      url: `${SITE_URL}/golf-lessons/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...coaches.map((c) => ({
      url: `${SITE_URL}/coaches/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
