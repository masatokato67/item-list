import Link from "next/link";
import type { Metadata } from "next";
import { getTagsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";

export const metadata: Metadata = {
  title: "All topics",
  description:
    "Browse every topic covered on Give Me Japan — regions, seasons, food, onsen and more.",
  robots: { index: false, follow: true },
};

export default function JapanTagsPage() {
  const tags = getTagsByCategory("japan");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">All topics</h1>
      <p className="mt-3 leading-relaxed text-gray-600">
        Pick a topic to find the guides that cover it.
      </p>

      {tags.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">
            No topics yet — guides are on the way.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={tagHref(tag, "japan")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
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
