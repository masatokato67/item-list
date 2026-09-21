import { notFound } from "next/navigation";
import { getTagsByCategory, getTopicsByTags } from "@/lib/topics";
import { REGION_TAG_MERGES, expandTagKey } from "@/lib/topic-utils";
import TopicCard from "@/components/TopicCard";
import Link from "next/link";
import type { Metadata } from "next";

type Params = { tag: string };

// タグは data のキーワードから決まる確定集合。未生成のタグ（統合・削除済みの
// 表記ゆれなど）はオンデマンド生成せず 404 を返す。
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const tags = getTagsByCategory("experience");
  const tagSet = new Set(tags.map(({ tag }) => tag));
  // 通常タグ + 統合タグ（例:「関東+関東近郊」。構成タグが1つでも存在する場合）
  const mergedKeys = REGION_TAG_MERGES.filter((g) =>
    g.some((t) => tagSet.has(t))
  ).map((g) => g.join("+"));
  return [...tags.map(({ tag }) => ({ tag })), ...mergedKeys.map((tag) => ({ tag }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `「${decoded}」の体験・旅行特集`,
    description: `「${decoded}」に関連する旅行・おでかけ特集の一覧です。`,
    robots: { index: false, follow: true },
  };
}

export default async function ExperienceTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const topics = getTopicsByTags(expandTagKey(decoded), "experience");
  if (topics.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/experiences/tags"
          className="-mt-4 mb-4 inline-block text-sm text-emerald-700 hover:underline"
        >
          ← 体験のタグ一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          「{decoded}」の体験・旅行特集
        </h1>
        <p className="mt-2 text-gray-600">
          {topics.length}件の特集が見つかりました
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
