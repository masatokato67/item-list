import Image from "next/image";
import { Product } from "@/lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300 fill-current"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Rank Badge + Image */}
        <div className="relative flex-shrink-0 sm:w-56">
          <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow">
            {product.rank}
          </div>
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 224px"
              unoptimized
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>

          <div className="mt-1 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-lg font-bold text-red-600">
              &yen;{product.price.toLocaleString()}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Pros & Cons */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.pros.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-green-700 mb-1">
                  良い点
                </h4>
                <ul className="space-y-0.5">
                  {product.pros.map((pro) => (
                    <li
                      key={pro}
                      className="flex items-start gap-1 text-xs text-gray-600"
                    >
                      <span className="text-green-500 mt-0.5 flex-shrink-0">
                        +
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-red-700 mb-1">
                  気になる点
                </h4>
                <ul className="space-y-0.5">
                  {product.cons.map((con) => (
                    <li
                      key={con}
                      className="flex items-start gap-1 text-xs text-gray-600"
                    >
                      <span className="text-red-400 mt-0.5 flex-shrink-0">
                        -
                      </span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4">
            <a
              href={product.rakutenAffiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              楽天市場で見る
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
        </div>
      </div>
    </div>
  );
}
