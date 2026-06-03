import { FaqItem } from "@/lib/types";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-12 mb-4">
      <h2 className="mb-5 text-xl font-bold text-gray-900">
        よくある質問
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 bg-white"
          >
            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-semibold text-gray-800 select-none">
              <span className="shrink-0 text-blue-600 font-bold">Q.</span>
              <span className="flex-1">{item.question}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-4 pl-12 text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-500">A. </span>
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
