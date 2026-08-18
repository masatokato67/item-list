import { ExperienceItem } from "@/lib/types";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceRanking({
  items,
}: {
  items: ExperienceItem[];
}) {
  const sorted = [...items].sort((a, b) => a.rank - b.rank);
  return (
    <div className="space-y-6">
      {sorted.map((item) => (
        <ExperienceCard key={item.rank} item={item} />
      ))}
    </div>
  );
}
