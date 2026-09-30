import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import {
  getAbonements,
  getAllServiceParams,
  getSpecialists,
} from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = ["", "/services/", "/training/"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const services = getAllServiceParams().map(({ category, slug }) => ({
    url: `${base}/services/${category}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const abons = getAbonements().map((a) => ({
    url: `${base}/abon/${a.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const specs = getSpecialists().map((s) => ({
    url: `${base}/specialists/${s.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...services, ...abons, ...specs];
}
