import fs from "fs";
import path from "path";
import {
  ExperienceTopic,
  JapanTopic,
  ProductTopic,
  Topic,
  TopicCategory,
} from "./types";

export {
  isExperienceTopic,
  topicHref,
  topicItemCount,
} from "./topic-utils";

const DATA_DIRS: Record<TopicCategory, string> = {
  product: path.join(process.cwd(), "data", "topics"),
  experience: path.join(process.cwd(), "data", "experiences"),
  japan: path.join(process.cwd(), "data", "givemejapan"),
};

function dirFor(category: TopicCategory): string {
  return DATA_DIRS[category];
}

function normalize(raw: string, category: TopicCategory): Topic {
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  return {
    ...parsed,
    category,
    viewCount: (parsed.viewCount as number) || 0,
  } as Topic;
}

function readTopicsFrom(category: TopicCategory): Topic[] {
  const dir = dirFor(category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) =>
      normalize(fs.readFileSync(path.join(dir, file), "utf-8"), category)
    );
}

/** 商品・体験をまとめた全トピック（タグ集計などの横断用） */
export function getAllTopics(): Topic[] {
  return [...readTopicsFrom("product"), ...readTopicsFrom("experience")];
}

export function getProductTopics(): ProductTopic[] {
  return readTopicsFrom("product") as ProductTopic[];
}

export function getExperienceTopics(): ExperienceTopic[] {
  return readTopicsFrom("experience") as ExperienceTopic[];
}

/** 英語トピックを取得（/givemejapan 用） */
export function getJapanTopics(): JapanTopic[] {
  return readTopicsFrom("japan") as JapanTopic[];
}

function findBySlug(slug: string, category: TopicCategory): Topic | null {
  const filePath = path.join(dirFor(category), `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return normalize(fs.readFileSync(filePath, "utf-8"), category);
}

/** 商品トピックを取得（/topics/[slug] 用） */
export function getTopicBySlug(slug: string): ProductTopic | null {
  return findBySlug(slug, "product") as ProductTopic | null;
}

/** 体験トピックを取得（/experiences/[slug] 用） */
export function getExperienceBySlug(slug: string): ExperienceTopic | null {
  return findBySlug(slug, "experience") as ExperienceTopic | null;
}

/** 英語トピックを取得（/givemejapan/[slug] 用） */
export function getJapanTopicBySlug(slug: string): JapanTopic | null {
  return findBySlug(slug, "japan") as JapanTopic | null;
}

export function getSlugsByCategory(category: TopicCategory): string[] {
  const dir = dirFor(category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

/** 商品トピックのslug一覧 */
export function getAllSlugs(): string[] {
  return getSlugsByCategory("product");
}

export interface TagCount {
  tag: string;
  count: number;
}

function countTags(topics: Topic[]): TagCount[] {
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

/** カテゴリごとのタグ一覧。商品と体験でタグ空間を分けている */
export function getTagsByCategory(category: TopicCategory): TagCount[] {
  return countTags(readTopicsFrom(category));
}

/** 商品・体験を横断したタグ一覧 */
export function getAllTags(): TagCount[] {
  return countTags(getAllTopics());
}

export function getTopicsByTag(
  tag: string,
  category: TopicCategory
): Topic[] {
  return readTopicsFrom(category).filter((t) => t.keywords.includes(tag));
}
