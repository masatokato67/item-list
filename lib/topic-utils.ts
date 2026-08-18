import { ExperienceTopic, Topic, TopicCategory } from "./types";

/**
 * fs に依存しない純粋なヘルパー。
 * クライアントコンポーネントからも読み込むため lib/topics.ts とは分離している。
 */

export function isExperienceTopic(topic: Topic): topic is ExperienceTopic {
  return topic.category === "experience";
}

/** そのトピックの詳細ページURL */
export function topicHref(topic: Topic): string {
  return isExperienceTopic(topic)
    ? `/experiences/${topic.slug}`
    : `/topics/${topic.slug}`;
}

/** 掲載件数（商品なら商品数、体験なら体験数） */
export function topicItemCount(topic: Topic): number {
  return isExperienceTopic(topic)
    ? topic.experiences.length
    : topic.products.length;
}

/** カテゴリのトップページURL */
export function categoryHref(category: TopicCategory): string {
  return category === "experience" ? "/experiences" : "/";
}

/** カテゴリのタグ一覧URL */
export function tagsIndexHref(category: TopicCategory): string {
  return category === "experience" ? "/experiences/tags" : "/tags";
}

/** カテゴリ内の個別タグページURL */
export function tagHref(tag: string, category: TopicCategory): string {
  return `${tagsIndexHref(category)}/${encodeURIComponent(tag)}`;
}

/** URLのパスから、いま見ているカテゴリを判定する */
export function categoryFromPathname(pathname: string): TopicCategory {
  return pathname === "/experiences" || pathname.startsWith("/experiences/")
    ? "experience"
    : "product";
}
