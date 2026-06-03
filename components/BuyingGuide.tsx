import { BuyingGuideItem } from "@/lib/types";

export default function BuyingGuide({ items }: { items: BuyingGuideItem[] }) {
  return (
    <section className="mb-10">
      <h2 className="mb-5 text-xl font-bold text-gray-900">
        選び方のポイント
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 bg-white"
            open={i === 0}
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-gray-800 select-none">
              <span className="flex-1">{item.title}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
              {item.body}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
