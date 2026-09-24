import { notFound } from "next/navigation";
import Link from "next/link";
import { getExperienceBySlug, getSlugsByCategory } from "@/lib/topics";
import { tagHref, groupAnchorId } from "@/lib/topic-utils";
import ExperienceRanking from "@/components/ExperienceRanking";
import BuyingGuide from "@/components/BuyingGuide";
import StatusTable from "@/components/StatusTable";
import TopicCtaBanner from "@/components/TopicCtaBanner";
import FaqSection from "@/components/FaqSection";
import type { Metadata } from "next";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getSlugsByCategory("experience").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getExperienceBySlug(slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    alternates: {
      canonical: `/experiences/${topic.canonicalSlug ?? slug}`,
    },
    openGraph: {
      title: topic.title,
      description: topic.description,
    },
  };
}

export default async function ExperienceTopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const topic = getExperienceBySlug(slug);
  if (!topic) notFound();

  // グループ見出し（県・エリアなど）を初出順に。目次アンカーに使う
  const groupNames: string[] = [];
  for (const e of [...topic.experiences].sort((a, b) => a.rank - b.rank)) {
    if (e.group && !groupNames.includes(e.group)) groupNames.push(e.group);
  }

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.title,
    description: topic.description,
    numberOfItems: topic.experiences.length,
    itemListElement: topic.experiences.map((e) => ({
      "@type": "ListItem",
      position: e.rank,
      name: e.name,
      url: e.url,
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
          <Link
            href="/experiences"
            className="-mt-4 mb-4 inline-block text-sm text-emerald-700 hover:underline"
          >
            ← 体験の一覧に戻る
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {topic.keywords.map((kw) => (
              <Link
                key={kw}
                href={tagHref(kw, "experience")}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100 transition"
              >
                {kw}
              </Link>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {topic.title}
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {topic.description}
          </p>
          <p className="mt-2 text-xs text-gray-400">更新日: {topic.updatedAt}</p>
        </div>

        {/* Intro */}
        {topic.intro && (
          <div className="mb-10 rounded-lg bg-emerald-50 p-5 text-sm leading-relaxed text-gray-700">
            {topic.intro}
          </div>
        )}

        {/* キャンペーンなどのCTA */}
        {topic.cta && <TopicCtaBanner cta={topic.cta} />}

        {/* 県別などの予約開始状況の早見表 */}
        {topic.statusTable && <StatusTable data={topic.statusTable} />}

        {/* 選び方ガイド */}
        {topic.buyingGuide?.length > 0 && (
          <BuyingGuide items={topic.buyingGuide} />
        )}

        {/* 体験一覧 */}
        <section className="mb-10">
          {topic.experiences.some((e) => e.group) ? (
            // 県別などでグルーピングする場合は、各グループ側が h2 見出しになる
            topic.listHeading && (
              <p className="mb-6 text-sm font-semibold text-emerald-700">
                {topic.listHeading}
              </p>
            )
          ) : (
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              {topic.listHeading || "おすすめの体験"}
            </h2>
          )}
          {groupNames.length >= 2 && (
            <nav
              aria-label="セクションの目次"
              className="mb-8 flex flex-wrap gap-2"
            >
              {groupNames.map((name) => (
                <a
                  key={name}
                  href={`#${groupAnchorId(name)}`}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  {groupAnchorId(name)}
                </a>
              ))}
            </nav>
          )}
          <ExperienceRanking
            items={topic.experiences}
            groupLinks={topic.groupLinks}
          />
        </section>

        {/* FAQ */}
        {topic.faq?.length > 0 && <FaqSection items={topic.faq} />}
      </div>
    </>
  );
}
