import fs from "fs";
import path from "path";

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID || "";
const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY || "";
const RAKUTEN_AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID || "";
const RAKUTEN_SITE_URL = process.env.RAKUTEN_SITE_URL || "https://kodawari-topic.com";
const TOPICS_DIR = path.join(process.cwd(), "data", "topics");

const API_BASE =
  "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401";

interface RakutenItem {
  itemName: string;
  itemUrl: string;
  affiliateUrl: string;
  mediumImageUrls: string[];
  itemPrice: number;
  reviewAverage: number;
  reviewCount: number;
}

interface RakutenSearchResponse {
  Items: RakutenItem[];
}

async function searchRakuten(
  keyword: string,
  minPrice: number = 0
): Promise<RakutenItem | null> {
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    affiliateId: RAKUTEN_AFFILIATE_ID,
    keyword,
    hits: "3",
    formatVersion: "2",
  });
  if (minPrice > 0) {
    params.set("minPrice", String(minPrice));
  }

  const res = await fetch(`${API_BASE}?${params}`, {
    headers: {
      Referer: RAKUTEN_SITE_URL,
      Origin: RAKUTEN_SITE_URL,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`  API error ${res.status} for "${keyword}": ${body}`);
    return null;
  }

  const data: RakutenSearchResponse = await res.json();
  const items = data.Items ?? [];
  return items.find((i) => !/(ケース|フィルム|カバー|ストラップ|バッテリー|充電器|アダプタ|保護)/.test(i.itemName)) ?? items[0] ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY || !RAKUTEN_AFFILIATE_ID) {
    console.error(
      "Error: RAKUTEN_APP_ID, RAKUTEN_ACCESS_KEY, and RAKUTEN_AFFILIATE_ID must be set"
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".json"));

  console.log(`Found ${files.length} topic(s)\n`);

  for (const file of files) {
    const filePath = path.join(TOPICS_DIR, file);
    const topic = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`[${topic.title}]`);

    let updated = 0;

    for (const product of topic.products) {
      const minPrice = Math.floor(product.price * 0.3);
      console.log(`  Searching: ${product.name} (min ¥${minPrice})`);
      const item = await searchRakuten(product.name, minPrice);

      if (item) {
        const affiliateUrl = item.affiliateUrl || item.itemUrl;
        const imageUrl = item.mediumImageUrls?.[0]
          ? item.mediumImageUrls[0].replace(/\?_ex=\d+x\d+/, "?_ex=400x400")
          : null;

        product.rakutenUrl = item.itemUrl;
        product.rakutenAffiliateUrl = affiliateUrl;
        if (imageUrl) product.imageUrl = imageUrl;
        if (item.itemPrice >= 1000) product.price = item.itemPrice;
        if (item.reviewCount >= 3) product.rating = item.reviewAverage;

        updated++;
        console.log(`    -> ¥${item.itemPrice} / ★${item.reviewAverage} (${item.reviewCount}件)`);

      } else {
        console.log(`    -> Not found, skipped`);
      }

      // Rate limit: 1 request per second
      await sleep(1000);
    }

    if (updated > 0) {
      fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + "\n");
      console.log(`  Saved ${updated} update(s)\n`);
    } else {
      console.log(`  No updates needed\n`);
    }
  }

  console.log("Done!");
}

main();
