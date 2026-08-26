import { BuyingGuideItem } from "@/lib/types";

/** 記事冒頭の「選び方」。英語サイトでは How to choose として出す */
export default function GuideSection({
  items,
  heading = "How to choose",
}: {
  items: BuyingGuideItem[];
  heading?: string;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">{heading}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 bg-white"
            open={i === 0}
          >
            <summary className="flex cursor-pointer select-none items-center gap-3 px-5 py-4 font-semibold text-gray-900">
              <span className="flex-1">{item.title}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 leading-relaxed text-gray-700">
              {item.body}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
