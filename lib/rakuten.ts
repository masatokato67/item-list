import { Product } from "./types";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "";
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || "";

interface RakutenItem {
  itemName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewAverage: number;
  itemCaption: string;
  affiliateUrl: string;
}

interface RakutenSearchResponse {
  Items: { Item: RakutenItem }[];
}

export async function searchRakutenProducts(
  query: string,
  hits: number = 10
): Promise<Product[]> {
  if (!RAKUTEN_APP_ID) {
    console.warn("RAKUTEN_APP_ID not set, returning empty results");
    return [];
  }

  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword: query,
    hits: String(hits),
    sort: "-reviewAverage",
    formatVersion: "2",
  });

  const res = await fetch(
    `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?${params}`
  );

  if (!res.ok) {
    throw new Error(`Rakuten API error: ${res.status}`);
  }

  const data: RakutenSearchResponse = await res.json();

  return data.Items.map((item, i) => ({
    rank: i + 1,
    name: item.Item.itemName,
    description: item.Item.itemCaption.slice(0, 200),
    imageUrl: item.Item.mediumImageUrls[0]?.imageUrl || "",
    price: item.Item.itemPrice,
    rating: item.Item.reviewAverage,
    pros: [],
    cons: [],
    rakutenUrl: item.Item.itemUrl,
    rakutenAffiliateUrl: item.Item.affiliateUrl || item.Item.itemUrl,
  }));
}

export function generateAffiliateUrl(
  itemUrl: string,
  affiliateId: string = RAKUTEN_AFFILIATE_ID
): string {
  if (!affiliateId) return itemUrl;
  return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(itemUrl)}`;
}
