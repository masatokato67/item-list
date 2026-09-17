import Link from "next/link";
import { getProductTopics, getTagsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
import TopicCard from "@/components/TopicCard";

export default function HomePage() {
  const topics = getProductTopics().sort((a, b) =>
    (b.viewCount || 0) !== (a.viewCount || 0)
      ? (b.viewCount || 0) - (a.viewCount || 0)
      : b.updatedAt.localeCompare(a.updatedAt)
  );
  const popularTags = getTagsByCategory("product").slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="relative mb-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/products-hero-1920x800.svg"
          alt=""
          aria-hidden="true"
          className="h-[220px] w-full object-cover object-[70%_center] sm:h-[300px] md:h-[360px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm sm:text-4xl md:text-5xl">
            こだわりおすすめナビ
          </h1>
          <p className="mt-3 max-w-lg text-sm font-medium text-gray-700 sm:text-base">
            こだわりのトピックから、あなたにぴったりの商品を見つけよう
          </p>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {popularTags.map(({ tag }) => (
          <Link
            key={tag}
            href={tagHref(tag, "product")}
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
