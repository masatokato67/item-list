import fs from "fs";
import path from "path";
import { Topic } from "./types";

const TOPICS_DIR = path.join(process.cwd(), "data", "topics");

export function getAllTopics(): Topic[] {
  const files = fs.readdirSync(TOPICS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(TOPICS_DIR, file), "utf-8");
    return JSON.parse(raw) as Topic;
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
