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
            open
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-gray-800 select-none">
              <span className="flex-1">{item.title}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
              {item.body}
              {item.links && item.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition"
                    >
                      {link.label}
                      <span className="text-[10px]">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
