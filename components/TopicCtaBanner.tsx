import { TopicCta } from "@/lib/types";

export default function TopicCtaBanner({ cta }: { cta: TopicCta }) {
  const href = cta.affiliateUrl || cta.url;

  return (
    <section className="mb-10 rounded-lg border-2 border-amber-300 bg-amber-50 p-5">
      <p className="text-xs font-bold text-amber-700">PR</p>
      <h2 className="mt-1 text-lg font-bold text-gray-900">{cta.heading}</h2>
      {cta.body && (
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{cta.body}</p>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
      >
        {cta.label}
        <svg
          className="h-4 w-4"
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
    </section>
  );
}
