"use client";

import Link from "next/link";
import { Topic } from "@/lib/types";

function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      onClick={(e) => e.stopPropagation()}
      className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100 transition"
    >
      {tag}
    </Link>
  );
}

export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-300">
      <Link href={`/topics/${topic.slug}`}>
        <h2 className="text-lg font-bold text-gray-900">{topic.title}</h2>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {topic.description}
        </p>
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {topic.keywords.slice(0, 3).map((kw) => (
          <TagLink key={kw} tag={kw} />
        ))}
      </div>
      <Link href={`/topics/${topic.slug}`} className="mt-3 block text-xs text-gray-400">
        {topic.products.length}件の商品
      </Link>
    </div>
  );
}
