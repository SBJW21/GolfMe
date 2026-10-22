import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const live = process.env.ALLOW_INDEXING === "true";
  return live
    ? {
        rules: [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/my-golf", "/coach", "/book"],
          },
        ],
        sitemap: "https://golfme.com.au/sitemap.xml",
      }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
