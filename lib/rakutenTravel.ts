const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "";
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY || "";
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || "";
const RAKUTEN_SITE_URL =
  process.env.RAKUTEN_SITE_URL || "https://kodawari-topic.com";

const KEYWORD_SEARCH_API =
  "https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20260731";
const HOTEL_SEARCH_API =
  "https://openapi.rakuten.co.jp/engine/api/Travel/SimpleHotelSearch/20260731";

export interface TravelHotel {
  hotelNo: number;
  hotelName: string;
  hotelSpecial: string;
  /** affiliateId を渡すとアフィリエイトURLで返る */
  hotelInformationUrl: string;
  hotelImageUrl: string;
  /** 1室1泊あたりの最低料金目安（税・サービス料込） */
  hotelMinCharge: number | null;
  reviewAverage: number | null;
  reviewCount: number;
  address1: string;
  address2: string;
  access: string;
}

interface HotelBasicInfoWrapper {
  hotelBasicInfo?: TravelHotel;
}

interface TravelSearchResponse {
  hotels?: HotelBasicInfoWrapper[][];
  errors?: { errorCode: number; errorMessage: string };
}

/**
 * 楽天トラベルAPIは Referer / Origin ヘッダーがないと
 * 403 REQUEST_CONTEXT_BODY_HTTP_REFERRER_MISSING を返す。
 */
function requestHeaders(): HeadersInit {
  return {
    Referer: RAKUTEN_SITE_URL,
    Origin: RAKUTEN_SITE_URL,
  };
}

function baseParams(): URLSearchParams {
  return new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    formatVersion: "2",
  });
}

function extractHotels(data: TravelSearchResponse): TravelHotel[] {
  if (!data.hotels) return [];
  return data.hotels
    .map((entry) => entry.find((e) => e.hotelBasicInfo)?.hotelBasicInfo)
    .filter((h): h is TravelHotel => Boolean(h));
}

async function callTravelApi(url: string): Promise<TravelHotel[]> {
  const res = await fetch(url, { headers: requestHeaders() });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Rakuten Travel API error ${res.status}: ${body}`);
  }

  const data: TravelSearchResponse = await res.json();
  if (data.errors) {
    throw new Error(
      `Rakuten Travel API error ${data.errors.errorCode}: ${data.errors.errorMessage}`
    );
  }

  return extractHotels(data);
}

/** キーワードで施設を検索する */
export async function searchTravelHotels(
  keyword: string,
  hits: number = 5
): Promise<TravelHotel[]> {
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    console.warn("RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not set");
    return [];
  }

  const params = baseParams();
  params.set("keyword", keyword);
  params.set("hits", String(hits));

  return callTravelApi(`${KEYWORD_SEARCH_API}?${params}`);
}

/** 施設番号で1件取得する */
export async function getTravelHotel(
  hotelNo: number
): Promise<TravelHotel | null> {
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    console.warn("RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not set");
    return null;
  }

  const params = baseParams();
  params.set("hotelNo", String(hotelNo));

  const hotels = await callTravelApi(`${HOTEL_SEARCH_API}?${params}`);
  return hotels[0] ?? null;
}

/**
 * 任意の楽天URL（エリアページなど）をアフィリエイトリンクに変換する。
 * 施設単位のリンクはAPIの hotelInformationUrl をそのまま使えばよいが、
 * エリアページや特集ページはAPIから返らないためこちらで組み立てる。
 */
export function toTravelAffiliateUrl(url: string): string {
  if (!RAKUTEN_AFFILIATE_ID) return url;
  if (url.startsWith("https://hb.afl.rakuten.co.jp/")) return url;
  return `https://hb.afl.rakuten.co.jp/hgc/${RAKUTEN_AFFILIATE_ID}/?pc=${encodeURIComponent(
    url
  )}`;
}
