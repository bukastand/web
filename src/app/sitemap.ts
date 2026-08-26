import type { MetadataRoute } from "next";

const BASE = "https://pagodastudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/tentang", "/layanan", "/portofolio", "/templates", "/blog", "/kontak", "/privasi", "/syarat"];

  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
