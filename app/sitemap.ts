import type { MetadataRoute } from "next";
import { getAllTopics, getAllTags } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodawari-topic.com";
  const now = new Date().toISOString();

  const topics = getAllTopics();
  const tags = getAllTags();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...topicPages, ...tagPages];
}
