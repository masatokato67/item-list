import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicBySlug, getAllSlugs } from "@/lib/topics";
import ProductRanking from "@/components/ProductRanking";
import BuyingGuide from "@/components/BuyingGuide";
import FaqSection from "@/components/FaqSection";
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

  const itemListLd = {
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
        brand: {
          "@type": "Brand",
          name: p.name.split(/\s/)[0],
        },
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "JPY",
          url: p.rakutenAffiliateUrl,
          availability: "https://schema.org/InStock",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "JP",
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "JP",
            returnPolicyCategory:
              "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
            returnMethod: "https://schema.org/ReturnByMail",
          },
        },
        ...(p.rating > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: p.rating,
                bestRating: 5,
                ratingCount: 1,
              },
            }
          : {}),
      },
    })),
  };

  const faqLd = topic.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: topic.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Topic Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {topic.keywords.map((kw) => (
              <Link
                key={kw}
                href={`/tags/${encodeURIComponent(kw)}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100 transition"
              >
                {kw}
              </Link>
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

        {/* Intro */}
        {topic.intro && (
          <div className="mb-10 rounded-lg bg-blue-50 p-5 text-sm leading-relaxed text-gray-700">
            {topic.intro}
          </div>
        )}

        {/* Buying Guide */}
        {topic.buyingGuide?.length > 0 && (
          <BuyingGuide items={topic.buyingGuide} />
        )}

        {/* Product Ranking */}
        <ProductRanking products={topic.products} />

        {/* FAQ */}
        {topic.faq?.length > 0 && (
          <FaqSection items={topic.faq} />
        )}
      </div>
    </>
  );
}
