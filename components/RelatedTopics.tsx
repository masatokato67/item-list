import Link from "next/link";
import { ProductTopic } from "@/lib/types";
import { topicItemCount } from "@/lib/topic-utils";

/** 導入文の下に出す1行の導線 */
export function RelatedTopicsInline({ topics }: { topics: ProductTopic[] }) {
  if (topics.length === 0) return null;
  return (
    <div className="mb-10 rounded-lg border border-blue-100 bg-white px-5 py-4">
      <p className="text-xs font-bold text-blue-700">別の切り口の特集もあります</p>
      <ul className="mt-2 space-y-1.5">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/topics/${t.slug}`}
              className="inline-flex items-start gap-1.5 text-sm font-medium text-gray-800 underline-offset-4 hover:text-blue-700 hover:underline"
            >
              <span aria-hidden="true" className="text-blue-400">
                →
              </span>
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 記事末尾に出すカード */
export default function RelatedTopics({ topics }: { topics: ProductTopic[] }) {
  if (topics.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-gray-900">あわせて読みたい</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/topics/${t.slug}`}
            className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <h3 className="text-base font-bold text-gray-900">{t.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">
              {t.description}
            </p>
            <span className="mt-3 flex items-center justify-between text-xs text-gray-400">
              {topicItemCount(t)}件の商品
              <span className="font-bold text-blue-600">この特集を見る →</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
