import Image from "next/image";
import { JapanPlace } from "@/lib/types";
import { bookingHref } from "@/lib/tripcom";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "text-amber-400 fill-current"
              : "text-gray-200 fill-current"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    // 未知の通貨コードでもビルドを落とさない
    return `${currency} ${price.toLocaleString("en-US")}`;
  }
}

export default function PlaceCard({
  place,
  currency = "JPY",
  sourceId,
}: {
  place: JapanPlace;
  currency?: string;
  /** trip_sub1 に載せる識別子。Trip.comのレポートで流入元の記事・宿を判別する */
  sourceId?: string;
}) {
  const href = bookingHref(place, sourceId);
  const ctaLabel = place.ctaLabel || "Check availability";

  return (
    <article className="overflow-hidden border-b border-gray-200 pb-8 last:border-b-0">
      <div className="flex flex-col gap-5 sm:flex-row">
        {place.imageUrl && (
          <div className="relative w-full flex-shrink-0 sm:w-64">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-700 text-xs font-bold text-white">
              {place.rank}
            </span>
            <div className="flex-1">
              {place.area && (
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                  {place.area}
                </p>
              )}
              <h3 className="text-xl font-bold leading-snug text-gray-900">
                {place.name}
              </h3>
              {place.japaneseName && (
                <p lang="ja" className="mt-0.5 text-sm text-gray-400">
                  {place.japaneseName}
                </p>
              )}
            </div>
          </div>

          {(place.rating != null || place.price != null) && (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {place.rating != null && <StarRating rating={place.rating} />}
              {place.price != null && (
                <span className="text-base font-bold text-gray-900">
                  {formatPrice(place.price, currency)}
                  {place.priceNote && (
                    <span className="ml-1.5 text-xs font-normal text-gray-500">
                      {place.priceNote}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}

          <p className="mt-3 leading-relaxed text-gray-700">
            {place.description}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {place.pros.length > 0 && (
              <div>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  What makes it special
                </h4>
                <ul className="space-y-1">
                  {place.pros.map((pro) => (
                    <li
                      key={pro}
                      className="flex items-start gap-1.5 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-emerald-600">
                        +
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {place.cons.length > 0 && (
              <div>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Good to know
                </h4>
                <ul className="space-y-1">
                  {place.cons.map((con) => (
                    <li
                      key={con}
                      className="flex items-start gap-1.5 text-sm text-gray-600"
                    >
                      <span className="mt-0.5 flex-shrink-0 text-gray-400">
                        −
                      </span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {href && (
            <div className="mt-5">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-800"
              >
                {ctaLabel}
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
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
