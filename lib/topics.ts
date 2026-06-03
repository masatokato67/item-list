import fs from "fs";
import path from "path";
import { Topic } from "./types";

const TOPICS_DIR = path.join(process.cwd(), "data", "topics");

export function getAllTopics(): Topic[] {
  const files = fs.readdirSync(TOPICS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(TOPICS_DIR, file), "utf-8");
    const topic = JSON.parse(raw) as Topic;
    topic.viewCount = topic.viewCount || 0;
    return topic;
  });
}

export function getTopicBySlug(slug: string): Topic | null {
  const filePath = path.join(TOPICS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Topic;
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getAllTags(): { tag: string; count: number }[] {
  const topics = getAllTopics();
  const counter = new Map<string, number>();
  for (const topic of topics) {
    for (const kw of topic.keywords) {
      counter.set(kw, (counter.get(kw) || 0) + 1);
    }
  }
  return Array.from(counter.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getTopicsByTag(tag: string): Topic[] {
  return getAllTopics().filter((t) => t.keywords.includes(tag));
}
