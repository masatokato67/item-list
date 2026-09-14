import { ExperienceItem, GroupLink } from "@/lib/types";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceRanking({
  items,
  groupLinks,
}: {
  items: ExperienceItem[];
  groupLinks?: GroupLink[];
}) {
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  const hasGroups = sorted.some((i) => i.group);

  if (!hasGroups) {
    return (
      <div className="space-y-6">
        {sorted.map((item) => (
          <ExperienceCard key={item.rank} item={item} />
        ))}
      </div>
    );
  }

  // group を初出順にまとめる（rank 順は維持）
  const groups: { name: string; items: ExperienceItem[] }[] = [];
  for (const item of sorted) {
    const name = item.group || "その他";
    let g = groups.find((x) => x.name === name);
    if (!g) {
      g = { name, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }

  return (
    <div className="space-y-12">
      {groups.map((g) => {
        // group 名の先頭一致で対応するリンクを探す（例:「熊本県」→「熊本県（…）」）
        const link = groupLinks?.find((l) => g.name.startsWith(l.group));
        return (
          <section key={g.name}>
            <h2 className="mb-5 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-900 sm:text-xl">
              {g.name}
            </h2>
            {link && (
              <a
                href={link.affiliateUrl || link.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group/coupon relative mb-5 flex items-stretch overflow-hidden rounded-xl border-2 border-dashed border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm transition hover:shadow-md"
              >
                {/* 左スタブ：割引バッジ */}
                <div className="flex flex-col items-center justify-center bg-amber-500 px-4 py-3 text-center text-white">
                  <span className="text-2xl leading-none" aria-hidden="true">
                    🎫
                  </span>
                  <span className="mt-1 whitespace-nowrap text-xs font-extrabold leading-none">
                    {link.badge || "クーポン"}
                  </span>
                </div>
                {/* 切り取り線（ノッチ＋破線） */}
                <div className="relative w-0">
                  <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-white" />
                  <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-white" />
                  <span className="absolute inset-y-2 left-0 border-l-2 border-dashed border-amber-300" />
                </div>
                {/* 本体 */}
                <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                      <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">
                        PR
                      </span>
                      楽天トラベルでクーポン配布中
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {link.label}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition group-hover/coupon:bg-amber-600">
                    獲得する
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            )}
            <div className="space-y-6">
              {g.items.map((item) => (
                <ExperienceCard key={item.rank} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
