import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJapanTopics } from "@/lib/topics";
import {
  isJapanSection,
  isVisibleSection,
  SECTION_BLURBS,
  SECTION_LABELS,
  VISIBLE_SECTIONS,
} from "@/lib/japan-sections";
import TopicCard from "@/components/givemejapan/TopicCard";

type Params = { section: string };

/** VISIBLE_SECTIONS に無いセクションのURLは404にする（空ページを作らない） */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return VISIBLE_SECTIONS.map((section) => ({
    section,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { section } = await params;
  if (!isJapanSection(section)) return {};
  return {
    title: SECTION_LABELS[section],
    description: SECTION_BLURBS[section],
    alternates: { canonical: `/givemejapan/sections/${section}` },
  };
}

export default async function JapanSectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { section } = await params;
  if (!isJapanSection(section) || !isVisibleSection(section)) notFound();

  const topics = getJapanTopics()
    .filter((topic) => topic.section === section)
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) ||
        b.updatedAt.localeCompare(a.updatedAt) ||
        b.slug.localeCompare(a.slug)
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        {SECTION_LABELS[section]}
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">
        {SECTION_BLURBS[section]}
      </p>

      {topics.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">
            No guides in this section yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
