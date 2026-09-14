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
                className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 transition hover:bg-amber-100"
              >
                <span className="text-sm font-bold text-amber-800">
                  <span className="mr-2 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] align-middle text-white">
                    PR
                  </span>
                  {link.label}
                </span>
                <svg
                  className="h-4 w-4 shrink-0 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
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
