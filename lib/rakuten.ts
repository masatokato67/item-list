import { Product } from "./types";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "";
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY || "";
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || "";
const RAKUTEN_SITE_URL =
  process.env.RAKUTEN_SITE_URL || "https://kodawari-topic.com";

const API_BASE =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401";

interface RakutenItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: string[];
  reviewAverage: number;
  itemCaption: string;
  affiliateUrl: string;
}

interface RakutenSearchResponse {
  Items: RakutenItem[];
}

export async function searchRakutenProducts(
  query: string,
  hits: number = 10
): Promise<Product[]> {
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    console.warn("RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY not set, returning empty results");
    return [];
  }

  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword: query,
    hits: String(hits),
    sort: "-reviewAverage",
    formatVersion: "2",
  });

  const res = await fetch(`${API_BASE}?${params}`, {
    headers: {
      Referer: RAKUTEN_SITE_URL,
      Origin: RAKUTEN_SITE_URL,
    },
  });

  if (!res.ok) {
    throw new Error(`Rakuten API error: ${res.status}`);
  }

  const data: RakutenSearchResponse = await res.json();

  return data.Items.map((item, i) => ({
    rank: i + 1,
    name: item.itemName,
    description: item.itemCaption.slice(0, 200),
    imageUrl: item.mediumImageUrls[0] || "",
    price: item.itemPrice,
    rating: item.reviewAverage,
    pros: [],
    cons: [],
    rakutenUrl: item.itemUrl,
    rakutenAffiliateUrl: item.affiliateUrl || item.itemUrl,
  }));
}
