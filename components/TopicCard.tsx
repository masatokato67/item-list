"use client";

import Link from "next/link";
import { Topic, TopicCategory } from "@/lib/types";
import {
  isExperienceTopic,
  tagHref,
  topicHref,
  topicItemCount,
} from "@/lib/topic-utils";

function TagLink({ tag, category }: { tag: string; category: TopicCategory }) {
  const isExperience = category === "experience";
  return (
    <Link
      href={tagHref(tag, category)}
      onClick={(e) => e.stopPropagation()}
      className={`rounded-full px-3 py-1 text-xs transition ${
        isExperience
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      }`}
    >
      {tag}
    </Link>
  );
}

export default function TopicCard({ topic }: { topic: Topic }) {
  const isExperience = isExperienceTopic(topic);
  const href = topicHref(topic);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-gray-300">
      <Link href={href}>
        {isExperience && (
          <span className="mb-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            体験
          </span>
        )}
        <h2 className="text-lg font-bold text-gray-900">{topic.title}</h2>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {topic.description}
        </p>
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {topic.keywords.slice(0, 3).map((kw) => (
          <TagLink
            key={kw}
            tag={kw}
            category={isExperience ? "experience" : "product"}
          />
        ))}
      </div>
      <Link href={href} className="mt-3 block text-xs text-gray-400">
        {topicItemCount(topic)}件の{isExperience ? "体験" : "商品"}
      </Link>
    </div>
  );
}
