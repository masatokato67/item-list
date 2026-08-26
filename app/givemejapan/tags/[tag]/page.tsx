import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTagsByCategory, getTopicsByTag } from "@/lib/topics";
import { JapanTopic } from "@/lib/types";
import TopicCard from "@/components/givemejapan/TopicCard";

type Params = { tag: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getTagsByCategory("japan").map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `${decoded} guides`,
    description: `Travel guides to Japan tagged “${decoded}”.`,
    robots: { index: false, follow: true },
  };
}

export default async function JapanTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const topics = getTopicsByTag(decoded, "japan") as JapanTopic[];
  if (topics.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/givemejapan/tags"
        className="mb-4 inline-block text-sm text-rose-700 hover:underline"
      >
        ← All topics
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{decoded}</h1>
      <p className="mt-2 text-gray-600">
        {topics.length} {topics.length === 1 ? "guide" : "guides"}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
