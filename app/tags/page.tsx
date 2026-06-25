import Link from "next/link";
import { getAllTags } from "@/lib/topics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タグ一覧",
  description: "すべてのタグを一覧で表示。気になるタグを選んで、関連するおすすめランキングを探せます。",
  robots: { index: false, follow: true },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        タグ一覧
      </h1>
      <p className="mt-3 text-gray-600">
        気になるタグを選んで、関連するおすすめランキングを探しましょう
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {tag}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
