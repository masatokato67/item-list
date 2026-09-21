import {
  getExperienceTopics,
  getTagsByCategory,
  getPickupTopics,
} from "@/lib/topics";
import {
  isRegionTag,
  EXPERIENCE_REGIONS,
  experienceRegionHref,
} from "@/lib/topic-utils";
import TopicCard from "@/components/TopicCard";
import TagBrowseSections from "@/components/TagBrowseSections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体験・旅行のおすすめ特集",
  description:
    "旅行・宿泊・おでかけなど「体験」のおすすめをトピックごとに厳選してご紹介。エリアやテーマから、次の旅の行き先が見つかります。",
  alternates: {
    canonical: "/experiences",
  },
  openGraph: {
    title: "体験・旅行のおすすめ特集 | こだわりおすすめナビ",
    description:
      "旅行・宿泊・おでかけなど「体験」のおすすめをトピックごとに厳選してご紹介。",
    images: [
      {
        url: "/hero/ogp-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "こだわりおすすめナビ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "体験・旅行のおすすめ特集 | こだわりおすすめナビ",
    description:
      "旅行・宿泊・おでかけなど「体験」のおすすめをトピックごとに厳選してご紹介。",
    images: ["/hero/ogp-1200x630.webp"],
  },
};

// 作成日の新しい順（同日は更新日→slugで決定的に）
function newestFirst<T extends { createdAt: string; updatedAt: string; slug: string }>(
  a: T,
  b: T
) {
  return (
    b.createdAt.localeCompare(a.createdAt) ||
    b.updatedAt.localeCompare(a.updatedAt) ||
    b.slug.localeCompare(a.slug)
  );
}

export default function ExperiencesPage() {
  const all = getExperienceTopics().sort(newestFirst);

  const tags = getTagsByCategory("experience");
  // 地域から探すは固定タブ（全国/北海道/東北/関東+関東近郊/関西/九州）
  const regionLinks = EXPERIENCE_REGIONS.map((region) => ({
    label: region,
    href: experienceRegionHref(region),
  }));
  const featuredTags = tags
    .filter((t) => !isRegionTag(t.tag))
    .slice(0, 12)
    .map((t) => t.tag);

  // 人気のトピックは data/pickups.json で手動選定（表示順もそこで指定）
  const pickups = getPickupTopics("experience");
  const pickupSlugs = new Set(pickups.map((t) => t.slug));
  const rest = all.filter((t) => !pickupSlugs.has(t.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="relative mb-10 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
        {/* テキストは下のオーバーレイで表示するため、画像はテキストなしのベースを使用 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-1920x800.svg"
          alt=""
          aria-hidden="true"
          className="h-[220px] w-full object-cover object-[70%_center] sm:h-[300px] md:h-[360px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm sm:text-4xl md:text-5xl">
            こだわりおすすめナビ
          </h1>
          <p className="mt-3 max-w-md text-sm font-medium text-gray-700 sm:text-base">
            旅行やおでかけなど、こだわりの「体験」を見つけよう
          </p>
        </div>
      </section>

      {all.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-600">
            体験のトピックは準備中です。もうしばらくお待ちください。
          </p>
        </div>
      ) : (
        <>
          <TagBrowseSections
            category="experience"
            regionLinks={regionLinks}
            featuredTags={featuredTags}
          />

          {pickups.length > 0 && (
            <section className="mb-12">
              <div className="mb-5 flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  人気のトピック
                </h2>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  PICK UP
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {pickups.map((topic) => (
                  <TopicCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              すべてのトピック
              <span className="ml-2 text-sm font-normal text-gray-400">
                新着順
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {rest.map((topic) => (
                <TopicCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
