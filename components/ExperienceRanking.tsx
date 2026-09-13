import { ExperienceItem } from "@/lib/types";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceRanking({
  items,
}: {
  items: ExperienceItem[];
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
      {groups.map((g) => (
        <section key={g.name}>
          <h2 className="mb-5 border-l-4 border-emerald-500 pl-3 text-lg font-bold text-gray-900 sm:text-xl">
            {g.name}
          </h2>
          <div className="space-y-6">
            {g.items.map((item) => (
              <ExperienceCard key={item.rank} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
