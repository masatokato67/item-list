import { RouteMap as RouteMapData } from "@/lib/types";

/**
 * アクセス図（路線図型）。地図画像やiframeは使わず、HTML+CSSで縦に描く。
 * 外部リクエストがなく、文字が本物のテキストなので検索にも読み上げにも対応できる。
 */
export default function RouteMap({ data }: { data: RouteMapData }) {
  return (
    <section className="mb-12">
      <h2 className="mb-3 text-xl font-bold text-gray-900">{data.heading}</h2>
      {data.intro && (
        <p className="mb-5 text-sm leading-relaxed text-gray-600">{data.intro}</p>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        {data.legs.map((leg, li) => {
          const color = leg.color || "#059669";
          return (
            <div key={leg.line} className={li > 0 ? "mt-6" : ""}>
              {/* 路線名と運賃・所要時間 */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-block rounded px-2.5 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {leg.line}
                </span>
                {leg.duration && (
                  <span className="text-xs font-medium text-gray-600">
                    {leg.duration}
                  </span>
                )}
                {leg.fare && (
                  <span className="text-xs font-medium text-gray-600">
                    運賃 {leg.fare}
                  </span>
                )}
              </div>

              {/* 駅の並び */}
              <ol className="relative">
                {leg.stops.map((stop, si) => {
                  const isLast = si === leg.stops.length - 1;
                  return (
                    <li key={stop.name} className="relative flex gap-3 pb-4 last:pb-0">
                      {/* 縦線 */}
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[7px] top-4 h-full w-0.5"
                          style={{
                            backgroundColor: color,
                            opacity: stop.omitted ? 0.35 : 1,
                          }}
                        />
                      )}
                      {/* 駅の点 */}
                      <span
                        aria-hidden="true"
                        className="relative z-10 mt-1 h-4 w-4 flex-shrink-0 rounded-full border-2 bg-white"
                        style={{
                          borderColor: color,
                          backgroundColor: stop.destination ? color : "#fff",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm ${
                              stop.destination
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-800"
                            }`}
                          >
                            {stop.name}
                          </span>
                          {stop.hasHotels && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                              このあたりに宿
                            </span>
                          )}
                          {stop.destination && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                              目的地
                            </span>
                          )}
                        </div>
                        {stop.note && (
                          <p className="mt-0.5 text-xs text-gray-500">{stop.note}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>

      {data.note && (
        <p className="mt-2 text-xs leading-relaxed text-gray-500">{data.note}</p>
      )}
    </section>
  );
}
