import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/builder", "/auth", "/api"],
    },
    sitemap: "https://pagodastudio.com/sitemap.xml",
  };
}
