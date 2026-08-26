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

export const DEFAULT_SECTION: JapanSection = "destinations";

export function sectionHref(section: JapanSection): string {
  return `/givemejapan/sections/${section}`;
}

export function isJapanSection(value: string): value is JapanSection {
  return value in SECTION_LABELS;
}
