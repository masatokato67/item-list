import Link from "next/link";
import { getTagsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体験のタグ一覧",
  description:
    "体験トピックのタグを一覧で表示。気になるタグを選んで、関連する旅行・おでかけの特集を探せます。",
  robots: { index: false, follow: true },
};

export default function ExperienceTagsPage() {
  const tags = getTagsByCategory("experience");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        体験のタグ一覧
      </h1>
      <p className="mt-3 text-gray-600">
        気になるタグを選んで、関連する旅行・おでかけの特集を探しましょう
      </p>
      <Link
        href="/tags"
        className="mt-3 inline-block text-sm text-blue-600 hover:underline"
      >
        商品のタグ一覧を見る →
      </Link>

      {tags.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-600">
            体験のトピックがまだないため、タグはありません。
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={tagHref(tag, "experience")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {tag}
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
