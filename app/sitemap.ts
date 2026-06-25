import type { MetadataRoute } from "next";
import { getAllTopics } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodawari-topic.com";
  const now = new Date().toISOString();

  const topics = getAllTopics();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...topicPages];
}
