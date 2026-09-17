import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicBySlug, getAllSlugs } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
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
    alternates: {
      canonical: `/topics/${slug}`,
    },
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

  const sections = topic.sections?.map((section) => ({
    ...section,
    products: topic.products
      .filter((p) => p.section === section.id)
      .sort((a, b) => a.rank - b.rank),
  }));
  const listedProducts = sections
    ? sections.flatMap((s) => s.products)
    : topic.products;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.title,
    description: topic.description,
    numberOfItems: listedProducts.length,
    itemListElement: listedProducts.map((p, i) => ({
      "@type": "ListItem",
      position: sections ? i + 1 : p.rank,
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
                href={tagHref(kw, "product")}
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
        {sections ? (
          <>
            <nav className="mb-8 flex flex-wrap gap-2" aria-label="種類から探す">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {s.heading}
                  <span className="ml-1 text-xs text-gray-400">
                    {s.products.length}
                  </span>
                </a>
              ))}
            </nav>
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-12 scroll-mt-6">
                <h2 className="mb-2 border-l-4 border-blue-600 pl-3 text-xl font-bold text-gray-900">
                  {s.heading}
                </h2>
                {s.intro && (
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {s.intro}
                  </p>
                )}
                <ProductRanking products={s.products} />
              </section>
            ))}
          </>
        ) : topic.priceCategories ? (
          <>
            {/* Budget section first */}
            {(() => {
              const threshold = topic.priceCategories.threshold;
              const below = topic.products.filter((p) => p.price < threshold);
              const above = topic.products.filter((p) => p.price >= threshold);
              return (
                <>
                  {below.length > 0 && (
                    <section className="mb-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-sm text-green-700">
                          お手頃
                        </span>
                        {topic.priceCategories.belowLabel}
                      </h2>
                      {topic.priceCategories.belowIntro && (
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {topic.priceCategories.belowIntro}
                        </p>
                      )}
                      <ProductRanking products={below} />
                    </section>
                  )}
                  {above.length > 0 && (
                    <section className="mb-10">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-sm text-blue-700">
                          本格派
                        </span>
                        {topic.priceCategories.aboveLabel}
                      </h2>
                      {topic.priceCategories.aboveIntro && (
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                          {topic.priceCategories.aboveIntro}
                        </p>
                      )}
                      <ProductRanking products={above} />
                    </section>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <ProductRanking products={topic.products} />
        )}

        {/* FAQ */}
        {topic.faq?.length > 0 && (
          <FaqSection items={topic.faq} />
        )}
      </div>
    </>
  );
}
