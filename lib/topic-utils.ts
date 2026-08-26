import { ExperienceTopic, JapanTopic, Topic, TopicCategory } from "./types";

/**
 * fs に依存しない純粋なヘルパー。
 * クライアントコンポーネントからも読み込むため lib/topics.ts とは分離している。
 */

export function isExperienceTopic(topic: Topic): topic is ExperienceTopic {
  return topic.category === "experience";
}

export function isJapanTopic(topic: Topic): topic is JapanTopic {
  return topic.category === "japan";
}

/** そのトピックの詳細ページURL */
export function topicHref(topic: Topic): string {
  if (isJapanTopic(topic)) return `/givemejapan/${topic.slug}`;
  return isExperienceTopic(topic)
    ? `/experiences/${topic.slug}`
    : `/topics/${topic.slug}`;
}

/** 掲載件数（商品なら商品数、体験なら体験数、英語トピックならスポット数） */
export function topicItemCount(topic: Topic): number {
  if (isJapanTopic(topic)) return topic.places.length;
  return isExperienceTopic(topic)
    ? topic.experiences.length
    : topic.products.length;
}

/** カテゴリのトップページURL */
export function categoryHref(category: TopicCategory): string {
  if (category === "japan") return "/givemejapan";
  return category === "experience" ? "/experiences" : "/";
}

/** カテゴリのタグ一覧URL */
export function tagsIndexHref(category: TopicCategory): string {
  if (category === "japan") return "/givemejapan/tags";
  return category === "experience" ? "/experiences/tags" : "/tags";
}

/** カテゴリ内の個別タグページURL */
export function tagHref(tag: string, category: TopicCategory): string {
  return `${tagsIndexHref(category)}/${encodeURIComponent(tag)}`;
}

/** URLのパスから、いま見ているカテゴリを判定する */
export function categoryFromPathname(pathname: string): TopicCategory {
  if (pathname === "/givemejapan" || pathname.startsWith("/givemejapan/")) {
    return "japan";
  }
  return pathname === "/experiences" || pathname.startsWith("/experiences/")
    ? "experience"
    : "product";
}
