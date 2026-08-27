import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getJapanTopics, getTagsByCategory } from "@/lib/topics";
import { tagHref } from "@/lib/topic-utils";
import {
  SECTION_BLURBS,
  SECTION_LABELS,
  sectionHref,
  VISIBLE_SECTIONS,
} from "@/lib/japan-sections";
import { POSITIONING, THREADS_HANDLE, THREADS_URL } from "@/lib/givemejapan-site";
import { JapanSection } from "@/lib/types";
import TopicCard from "@/components/givemejapan/TopicCard";
import ThreadsIcon from "@/components/givemejapan/ThreadsIcon";

export const metadata: Metadata = {
  alternates: {
    canonical: "/givemejapan",
  },
};

const SECTIONS: JapanSection[] = VISIBLE_SECTIONS;

export default function GiveMeJapanPage() {
  // 新着順。同じ作成日のときは更新日→slug で決定的に並べる（/experiences と同じ方針）
  const topics = getJapanTopics().sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) ||
      b.updatedAt.localeCompare(a.updatedAt) ||
      b.slug.localeCompare(a.slug)
  );
  const [lead, ...rest] = topics;
  const popularTags = getTagsByCategory("japan").slice(0, 10);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-gray-900">
        <Image
          src="/givemejapan/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* 富士山と空を残したいので、暗くするのは文字が乗る下側だけにする */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-32">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Your guide to Japan
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-200">
            {POSITIONING}
          </p>
          <a
            href={THREADS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            <ThreadsIcon className="h-4 w-4" />
            {THREADS_HANDLE} on Threads
          </a>
          {popularTags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {popularTags.map(({ tag }) => (
                <Link
                  key={tag}
                  href={tagHref(tag, "japan")}
                  className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white transition hover:border-white hover:bg-white hover:text-gray-900"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14">
        {topics.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600">
              Guides are on the way. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-gray-500">
              Latest guides
            </h2>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TopicCard topic={lead} featured />
              </div>
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                  {rest.slice(0, 2).map((topic) => (
                    <TopicCard key={topic.slug} topic={topic} />
                  ))}
                </div>
              )}
            </div>

            {rest.length > 2 && (
              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(2).map((topic) => (
                  <TopicCard key={topic.slug} topic={topic} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Sections — 1つしか出していないときはヘッダーのナビと重複するので出さない */}
        {SECTIONS.length > 1 && (
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-wide text-gray-500">
            Browse by section
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SECTIONS.map((section) => (
              <Link
                key={section}
                href={sectionHref(section)}
                className="group rounded-lg border border-gray-200 p-6 transition hover:border-rose-300 hover:bg-rose-50/40"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-rose-700">
                  {SECTION_LABELS[section]}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {SECTION_BLURBS[section]}
                </p>
              </Link>
            ))}
          </div>
        </section>
        )}
      </div>
    </>
  );
}
