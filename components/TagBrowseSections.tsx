import Link from "next/link";
import { TopicCategory } from "@/lib/types";
import { tagHref, tagsIndexHref } from "@/lib/topic-utils";

const ACCENT: Record<string, string> = {
  experience:
    "border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
  product:
    "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
};

function Chips({
  tags,
  category,
}: {
  tags: string[];
  category: TopicCategory;
}) {
  const accent = ACCENT[category] ?? ACCENT.product;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={tagHref(tag, category)}
          className={`rounded-full border px-3 py-1 text-xs transition ${accent}`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

/**
 * トップページのタグ導線。
 * 地域から探す（体験のみ／地域タグがある場合）と、注目のタグの2段構成。
 */
export default function TagBrowseSections({
  category,
  regionTags,
  featuredTags,
}: {
  category: TopicCategory;
  regionTags: string[];
  featuredTags: string[];
}) {
  const allTagsLink = (
    <Link
      href={tagsIndexHref(category)}
      className="text-xs text-gray-400 transition hover:text-gray-700"
    >
      すべてのタグ →
    </Link>
  );

  return (
    <section className="mb-12 space-y-6">
      {regionTags.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-gray-900">地域から探す</h2>
          <Chips tags={regionTags} category={category} />
        </div>
      )}
      {featuredTags.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">注目のタグ</h2>
            {allTagsLink}
          </div>
          <Chips tags={featuredTags} category={category} />
        </div>
      )}
      {featuredTags.length === 0 && regionTags.length > 0 && (
        <div className="flex justify-end">{allTagsLink}</div>
      )}
    </section>
  );
}
