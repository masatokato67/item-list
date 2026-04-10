import Link from "next/link";
import { Topic } from "@/lib/types";

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <h2 className="text-lg font-bold text-gray-900">{topic.title}</h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {topic.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {topic.keywords.slice(0, 3).map((kw) => (
          <span
            key={kw}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
          >
            {kw}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-400">
        {topic.products.length}件の商品
      </div>
    </Link>
  );
}
