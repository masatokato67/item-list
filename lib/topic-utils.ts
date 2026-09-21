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

/**
 * 「地域」タグの集合。トップページで地域Tagと注目Tagを分けるのに使う。
 * 都道府県・地方名に加え、データ内で使っている主要なエリア名を含める。
 * 施設名・ブランド名（ディズニー/USJ/ハウステンボス等）は地域に含めない。
 */
const REGION_TAGS = new Set<string>([
  // 地方・広域
  "北海道", "東北", "関東", "関東近郊", "首都圏", "東京近郊", "甲信越", "北陸",
  "中部", "東海", "近畿", "関西", "中国", "四国", "九州", "沖縄",
  "東日本", "西日本", "山陰", "山陽",
  // 都道府県
  "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬",
  "埼玉", "千葉", "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨",
  "長野", "岐阜", "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫",
  "奈良", "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川",
  "愛媛", "高知", "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島",
  // 主要エリア・地名（データで使用のあるもの中心）
  "伊豆", "伊東", "熱海", "伊豆高原", "箱根", "河口湖", "富士五湖", "越後湯沢",
  "会津", "日光", "鬼怒川", "那須", "軽井沢", "函館", "札幌", "定山渓", "小樽",
  "名古屋", "横浜", "みなとみらい", "鎌倉", "別府", "由布院", "湯布院", "宮島",
  "佐世保", "多摩センター", "舞浜", "新浦安", "東京発",
]);

/** そのタグが「地域」タグかどうか（トップページの地域Tag/注目Tag分けに使う） */
export function isRegionTag(tag: string): boolean {
  if (REGION_TAGS.has(tag)) return true;
  // 「◯◯県/都/府」表記も地域として扱う（「東海道」等の誤検出を避けるため道は除く）
  return /^.{2,3}[都府県]$/.test(tag);
}

/**
 * トップ「地域から探す」の固定タブ（体験）。表示順もこの順。
 * 各体験記事は region フィールドでこのいずれか1つに分類する。
 */
export const EXPERIENCE_REGIONS = [
  "全国",
  "北海道",
  "東北",
  "関東+関東近郊",
  "関西",
  "九州",
] as const;

/** 体験の地域ページURL（/experiences/regions/<region>） */
export function experienceRegionHref(region: string): string {
  return `/experiences/regions/${encodeURIComponent(region)}`;
}

/**
 * 粒度違い・同義の地域タグを1つのチップにまとめる定義。
 * 各グループは "A+B" の統合キーで表す（例:「関東」「関東近郊」→「関東+関東近郊」）。
 */
export const REGION_TAG_MERGES: string[][] = [["関東", "関東近郊"]];

/** 統合キー "A+B" を構成タグ配列に展開する。通常タグはそのまま [tag] を返す */
export function expandTagKey(tag: string): string[] {
  return tag.includes("+") ? tag.split("+").filter(Boolean) : [tag];
}

/**
 * 表示用に地域タグ配列の統合対象をまとめる（先頭出現位置を保持）。
 * 例:[..,"関東近郊",..,"関東",..] → [..,"関東+関東近郊",..]
 */
export function mergeRegionTags(tags: string[]): string[] {
  const result: string[] = [];
  const consumed = new Set<string>();
  for (const tag of tags) {
    const group = REGION_TAG_MERGES.find((g) => g.includes(tag));
    if (group) {
      const key = group.join("+");
      if (!consumed.has(key)) {
        result.push(key);
        consumed.add(key);
      }
      continue;
    }
    result.push(tag);
  }
  return result;
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
