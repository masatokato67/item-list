import Link from "next/link";
import { getAllTopics, getAllTags } from "@/lib/topics";
import TopicCard from "@/components/TopicCard";

export default function HomePage() {
  const topics = getAllTopics().sort((a, b) =>
    (b.viewCount || 0) !== (a.viewCount || 0)
      ? (b.viewCount || 0) - (a.viewCount || 0)
      : b.updatedAt.localeCompare(a.updatedAt)
  );
  const popularTags = getAllTags().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          こだわりおすすめナビ
        </h1>
        <p className="mt-3 text-gray-600">
          こだわりのトピックから、あなたにぴったりの商品を見つけよう
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {popularTags.map(({ tag }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {tag}
          </Link>
        ))}
        <Link
          href="/tags"
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          すべてのタグ →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
