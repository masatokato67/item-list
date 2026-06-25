import { notFound } from "next/navigation";
import { getAllTags, getTopicsByTag } from "@/lib/topics";
import TopicCard from "@/components/TopicCard";
import Link from "next/link";
import type { Metadata } from "next";

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `「${decoded}」のおすすめランキング`,
    description: `「${decoded}」に関連するおすすめ商品ランキングの一覧です。`,
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const topics = getTopicsByTag(decoded);
  if (topics.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/tags"
          className="-mt-4 mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← タグ一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          「{decoded}」のおすすめランキング
        </h1>
        <p className="mt-2 text-gray-600">
          {topics.length}件のランキングが見つかりました
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
