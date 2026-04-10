import { notFound } from "next/navigation";
import { getTopicBySlug, getAllSlugs } from "@/lib/topics";
import ProductRanking from "@/components/ProductRanking";
import type { Metadata } from "next";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: `${topic.title} おすすめランキング`,
    description: topic.description,
    openGraph: {
      title: `${topic.title} おすすめランキング`,
      description: topic.description,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.title,
    description: topic.description,
    numberOfItems: topic.products.length,
    itemListElement: topic.products.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: p.imageUrl,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "JPY",
          url: p.rakutenAffiliateUrl,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: p.rating,
          bestRating: 5,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Topic Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {topic.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
              >
                {kw}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {topic.title} おすすめランキング
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {topic.description}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            更新日: {topic.updatedAt}
          </p>
        </div>

        {/* Product Ranking */}
        <ProductRanking products={topic.products} />
      </div>
    </>
  );
}
