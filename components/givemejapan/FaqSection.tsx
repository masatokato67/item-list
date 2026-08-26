import { FaqItem } from "@/lib/types";

export default function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 bg-white"
          >
            <summary className="flex cursor-pointer select-none items-center gap-3 px-5 py-4 font-semibold text-gray-900">
              <span className="shrink-0 font-bold text-rose-700">Q.</span>
              <span className="flex-1">{item.question}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-5 pb-5 pl-12 leading-relaxed text-gray-700">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
