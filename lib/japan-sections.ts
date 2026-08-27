import { JapanSection } from "./types";

/**
 * /givemejapan のセクション定義。
 * fs に依存しないので、クライアントコンポーネントからも読み込める。
 */

export const SECTION_LABELS: Record<JapanSection, string> = {
  destinations: "Destinations",
  stays: "Where to stay",
  interests: "Interests",
  planning: "Plan a trip",
};

export const SECTION_BLURBS: Record<JapanSection, string> = {
  destinations: "Cities, regions and day trips worth building a trip around.",
  stays: "Ryokan, onsen towns and hotels, picked for a specific kind of stay.",
  interests: "Food, festivals, nature and culture — trips built around a theme.",
  planning: "Practical guides: seasons, transport, budget and etiquette.",
};

/**
 * 実際にサイトへ出すセクション。ナビ・トップの一覧・sitemap・セクションページの
 * 生成はすべてこの配列に従う。ここに無いセクションはナビから消え、
 * セクションページも生成されない（404）。
 *
 * 当面は「Where to stay」の宿紹介に絞る方針。記事が揃ったら配列に戻すだけで、
 * ナビ・トップ・sitemap がまとめて復活する。
 */
export const VISIBLE_SECTIONS: JapanSection[] = ["stays"];

export function isVisibleSection(section: JapanSection): boolean {
  return VISIBLE_SECTIONS.includes(section);
}

export const DEFAULT_SECTION: JapanSection = "stays";

export function sectionHref(section: JapanSection): string {
  return `/givemejapan/sections/${section}`;
}

export function isJapanSection(value: string): value is JapanSection {
  return value in SECTION_LABELS;
}
