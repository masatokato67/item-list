import {
  getProductTopics,
  getFeaturedTags,
  getPickupTopics,
} from "@/lib/topics";
import TopicCard from "@/components/TopicCard";
import TagBrowseSections from "@/components/TagBrowseSections";

// 作成日の新しい順（同日は更新日→slugで決定的に）
function newestFirst<T extends { createdAt: string; updatedAt: string; slug: string }>(
  a: T,
  b: T
) {
  return (
    b.createdAt.localeCompare(a.createdAt) ||
    b.updatedAt.localeCompare(a.updatedAt) ||
    b.slug.localeCompare(a.slug)
  );
}

export default function HomePage() {
  const all = getProductTopics().sort(newestFirst);

  // 注目のタグは data/featured-tags.json で手動運用（未設定なら自動）
  const featuredTags = getFeaturedTags("product");

  // 人気のトピックは data/pickups.json で手動選定（表示順もそこで指定）
  const pickups = getPickupTopics("product");
  const pickupSlugs = new Set(pickups.map((t) => t.slug));
  const rest = all.filter((t) => !pickupSlugs.has(t.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="relative mb-10 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
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

      <TagBrowseSections category="product" featuredTags={featuredTags} />

      {pickups.length > 0 && (
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">人気のトピック</h2>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">
              PICK UP
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pickups.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          すべてのトピック
          <span className="ml-2 text-sm font-normal text-gray-400">新着順</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {rest.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}
