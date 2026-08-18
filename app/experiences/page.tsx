import Link from "next/link";
import { getExperienceTopics, getTagsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
import TopicCard from "@/components/TopicCard";
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
  },
};

export default function ExperiencesPage() {
  const topics = getExperienceTopics().sort((a, b) =>
    (b.viewCount || 0) !== (a.viewCount || 0)
      ? (b.viewCount || 0) - (a.viewCount || 0)
      : b.updatedAt.localeCompare(a.updatedAt)
  );
  const popularTags = getTagsByCategory("experience").slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          こだわりおすすめナビ
        </h1>
        <p className="mt-3 text-gray-600">
          旅行やおでかけなど、こだわりの「体験」を見つけよう
        </p>
      </div>

      {popularTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {popularTags.map(({ tag }) => (
            <Link
              key={tag}
              href={tagHref(tag, "experience")}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {tag}
            </Link>
          ))}
          <Link
            href="/experiences/tags"
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            すべてのタグ →
          </Link>
        </div>
      )}

      {topics.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-600">
            体験のトピックは準備中です。もうしばらくお待ちください。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
