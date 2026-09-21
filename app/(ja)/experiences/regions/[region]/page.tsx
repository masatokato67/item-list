import { notFound } from "next/navigation";
import Link from "next/link";
import { getExperiencesByRegion } from "@/lib/topics";
import { EXPERIENCE_REGIONS, experienceRegionHref } from "@/lib/topic-utils";
import TopicCard from "@/components/TopicCard";
import type { Metadata } from "next";

type Params = { region: string };

// region は固定の確定集合。未定義の値はオンデマンド生成せず 404。
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return EXPERIENCE_REGIONS.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { region } = await params;
  const decoded = decodeURIComponent(region);
  return {
    title: `${decoded}の体験・旅行特集`,
    description: `${decoded}の旅行・おでかけ特集の一覧です。`,
    robots: { index: false, follow: true },
  };
}

export default async function ExperienceRegionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { region } = await params;
  const decoded = decodeURIComponent(region);
  if (!EXPERIENCE_REGIONS.includes(decoded as (typeof EXPERIENCE_REGIONS)[number])) {
    notFound();
  }

  const topics = getExperiencesByRegion(decoded).sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) ||
      b.updatedAt.localeCompare(a.updatedAt) ||
      b.slug.localeCompare(a.slug)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/experiences"
          className="-mt-4 mb-4 inline-block text-sm text-emerald-700 hover:underline"
        >
          ← 体験のトップに戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {decoded}の体験・旅行特集
        </h1>
        <p className="mt-2 text-gray-600">{topics.length}件の特集</p>
      </div>

      {/* 地域タブ */}
      <div className="mb-8 flex flex-wrap gap-2">
        {EXPERIENCE_REGIONS.map((r) => {
          const active = r === decoded;
          return (
            <Link
              key={r}
              href={experienceRegionHref(r)}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {r}
            </Link>
          );
        })}
      </div>

      {topics.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-600">
            この地域の特集は準備中です。
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
