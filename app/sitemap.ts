import type { MetadataRoute } from "next";
import {
  getProductTopics,
  getExperienceTopics,
  getJapanTopics,
} from "@/lib/topics";
import { sectionHref, VISIBLE_SECTIONS } from "@/lib/japan-sections";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodawari-topic.com";
  const now = new Date().toISOString();

  const experienceTopics = getExperienceTopics();
  const japanTopics = getJapanTopics();

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
    {
      url: `${baseUrl}/givemejapan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: japanTopics.length > 0 ? 0.9 : 0.5,
    },
    ...VISIBLE_SECTIONS.map((section) => ({
      url: `${baseUrl}${sectionHref(section)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
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

  const japanPages: MetadataRoute.Sitemap = japanTopics.map((topic) => ({
    url: `${baseUrl}/givemejapan/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...topicPages, ...experiencePages, ...japanPages];
}
