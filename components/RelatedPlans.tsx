import Link from "next/link";
import { RelatedPlans as RelatedPlansData } from "@/lib/types";

/**
 * 関連するモデルプラン記事へのカード導線（ハブ記事用）。
 * 自サイト内の記事なので next/link の内部遷移で描画し、
 * target="_blank" や rel="sponsored"（＝広告リンク宣言）は付けない。
 */
export default function RelatedPlans({ data }: { data: RelatedPlansData }) {
  return (
    <section className="mb-12">
      <h2 className="mb-3 text-xl font-bold text-gray-900">{data.heading}</h2>
      {data.intro && (
        <p className="mb-5 text-sm leading-relaxed text-gray-600">{data.intro}</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.plans.map((plan) => (
          <Link
            key={plan.slug}
            href={`/experiences/${plan.slug}`}
            className="group block rounded-lg border border-emerald-200 bg-emerald-50/40 p-5 transition hover:border-emerald-400 hover:bg-emerald-50"
          >
            {plan.badge && (
              <span className="mb-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                {plan.badge}
              </span>
            )}
            <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800">
              {plan.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {plan.blurb}
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-emerald-700">
              プランを見る →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
