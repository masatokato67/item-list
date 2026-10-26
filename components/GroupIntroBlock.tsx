import { GroupIntro } from "@/lib/types";

/**
 * グループ見出し（h2）の直下に出す解説ブロック。
 * 花火大会の特徴など、宿を見る前に知っておきたい情報を置く。
 */
export default function GroupIntroBlock({
  intro,
  className = "",
}: {
  intro: GroupIntro;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-emerald-100 bg-emerald-50/60 p-4 ${className}`}
    >
      {intro.facts && intro.facts.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {intro.facts.map((f) => (
            <span
              key={f}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200"
            >
              {f}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm leading-relaxed text-gray-700">{intro.body}</p>
      {intro.link && (
        <a
          href={intro.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          {intro.link.label} →
        </a>
      )}
    </div>
  );
}
