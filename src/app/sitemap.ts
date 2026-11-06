import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const publicPaths = ["/", "/products", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: new URL(path, site.url).toString(),
  }));
}
