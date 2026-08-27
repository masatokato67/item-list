import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getJapanTopicBySlug, getSlugsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
import { trackingId } from "@/lib/tripcom";
import {
  isVisibleSection,
  SECTION_LABELS,
  sectionHref,
} from "@/lib/japan-sections";
import PlaceCard from "@/components/givemejapan/PlaceCard";
import GuideSection from "@/components/givemejapan/GuideSection";
import FaqSection from "@/components/givemejapan/FaqSection";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getSlugsByCategory("japan").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getJapanTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    alternates: {
      canonical: `/givemejapan/${slug}`,
    },
    openGraph: {
      title: topic.title,
      description: topic.description,
    },
  };
}

export default async function JapanTopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const topic = getJapanTopicBySlug(slug);
  if (!topic) notFound();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.title,
    description: topic.description,
    numberOfItems: topic.places.length,
    itemListElement: topic.places.map((place) => ({
      "@type": "ListItem",
      position: place.rank,
      name: place.name,
      // 構造化データにはアフィリエイトパラメータを付けない素のURLを載せる
      ...(place.url ? { url: place.url } : {}),
    })),
  };

  const faqLd = topic.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: topic.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const places = [...topic.places].sort((a, b) => a.rank - b.rank);

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

      {/* Hero */}
      {topic.heroImageUrl ? (
        <div className="relative h-[45vh] min-h-[320px] w-full">
          <Image
            src={topic.heroImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: topic.heroImagePosition ?? "center" }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-3xl px-4 pb-10">
              {topic.section &&
                (isVisibleSection(topic.section) ? (
                  <Link
                    href={sectionHref(topic.section)}
                    className="text-xs font-bold uppercase tracking-wide text-rose-300 hover:text-white"
                  >
                    {SECTION_LABELS[topic.section]}
                  </Link>
                ) : (
                  <span className="text-xs font-bold uppercase tracking-wide text-rose-300">
                    {SECTION_LABELS[topic.section]}
                  </span>
                ))}
              <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
                {topic.title}
              </h1>
            </div>
          </div>
        </div>
      ) : null}

      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/givemejapan"
            className="text-sm text-rose-700 hover:underline"
          >
            ← All guides
          </Link>
        </div>

        {!topic.heroImageUrl && (
          <>
            {topic.section &&
              (isVisibleSection(topic.section) ? (
                <Link
                  href={sectionHref(topic.section)}
                  className="block text-xs font-bold uppercase tracking-wide text-rose-700 hover:underline"
                >
                  {SECTION_LABELS[topic.section]}
                </Link>
              ) : (
                <span className="block text-xs font-bold uppercase tracking-wide text-rose-700">
                  {SECTION_LABELS[topic.section]}
                </span>
              ))}
            <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              {topic.title}
            </h1>
          </>
        )}

        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          {topic.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {topic.keywords.map((kw) => (
            <Link
              key={kw}
              href={tagHref(kw, "japan")}
              className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700 transition hover:bg-rose-100"
            >
              {kw}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">Updated {topic.updatedAt}</p>

        {topic.intro && (
          <div className="my-10 border-l-4 border-rose-700 bg-gray-50 p-6 leading-relaxed text-gray-700">
            {topic.intro}
          </div>
        )}

        {topic.buyingGuide?.length > 0 && (
          <GuideSection items={topic.buyingGuide} />
        )}

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {topic.listHeading || "Where to go"}
          </h2>
          <div className="space-y-8">
            {places.map((place) => (
              <PlaceCard
                key={place.rank}
                place={place}
                currency={topic.priceCurrency}
                sourceId={trackingId(topic.slug, place.rank)}
              />
            ))}
          </div>
        </section>

        {topic.faq?.length > 0 && <FaqSection items={topic.faq} />}
      </article>
    </>
  );
}
