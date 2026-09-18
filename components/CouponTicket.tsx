import { CouponLink } from "@/lib/types";

export default function CouponTicket({
  coupon,
  className = "",
}: {
  coupon: CouponLink;
  className?: string;
}) {
  return (
    <a
      href={coupon.affiliateUrl || coupon.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`group/coupon relative flex items-stretch overflow-hidden rounded-xl border-2 border-dashed border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm transition hover:shadow-md ${className}`}
    >
      {/* 左スタブ：割引バッジ */}
      <div className="flex flex-col items-center justify-center bg-amber-500 px-4 py-3 text-center text-white">
        <span className="text-2xl leading-none" aria-hidden="true">
          🎫
        </span>
        <span className="mt-1 whitespace-nowrap text-xs font-extrabold leading-none">
          {coupon.badge || "クーポン"}
        </span>
      </div>
      {/* 切り取り線（ノッチ＋破線） */}
      <div className="relative w-0">
        <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-white" />
        <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full bg-white" />
        <span className="absolute inset-y-2 left-0 border-l-2 border-dashed border-amber-300" />
      </div>
      {/* 本体 */}
      <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">
              PR
            </span>
            楽天トラベルでクーポン配布中
          </p>
          <p className="mt-1 text-sm font-bold text-gray-800">{coupon.label}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition group-hover/coupon:bg-amber-600">
          獲得する
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}
