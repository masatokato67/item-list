import type { MetadataRoute } from "next";
import { getProductTopics, getExperienceTopics } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodawari-topic.com";
  const now = new Date().toISOString();

  const experienceTopics = getExperienceTopics();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: now,
      changeFrequency: "daily",
      priority: experienceTopics.length > 0 ? 0.9 : 0.5,
    },
  ];

  const topicPages: MetadataRoute.Sitemap = getProductTopics().map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const experiencePages: MetadataRoute.Sitemap = experienceTopics.map(
    (topic) => ({
      url: `${baseUrl}/experiences/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })
  );

  return [...staticPages, ...topicPages, ...experiencePages];
}
