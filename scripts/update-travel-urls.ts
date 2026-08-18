/**
 * data/experiences/*.json の楽天トラベル情報を更新するスクリプト。
 *
 * 各 experiences[] の項目を、次の優先順位で処理する:
 *   1. hotelNo あり        -> 施設検索APIで価格・画像・評価・アフィリエイトURLを更新
 *   2. travelKeyword あり  -> キーワード検索APIで先頭1件を採用し、hotelNo を書き戻す
 *   3. どちらもなし        -> url を楽天アフィリエイトリンクに変換して affiliateUrl に入れる
 *                             （エリアページや特集ページ向け）
 *
 * name / description / pros / cons は編集済みの原稿なので上書きしない。
 *
 * 必要な環境変数:
 *   RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY / RAKUTEN_AFFILIATE_ID
 *   ※アプリのAPI Access Scopeに楽天トラベルAPIが含まれている必要がある
 *
 * 使い方:
 *   npm run update-travel
 */

import fs from "fs";
import path from "path";
import {
  getTravelHotel,
  searchTravelHotels,
  toTravelAffiliateUrl,
  TravelHotel,
} from "../lib/rakutenTravel";
import { ExperienceItem, ExperienceTopic } from "../lib/types";

const EXPERIENCES_DIR = path.join(process.cwd(), "data", "experiences");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** APIから取れた施設情報を項目に反映する。原稿部分は触らない */
function applyHotel(item: ExperienceItem, hotel: TravelHotel): string {
  item.hotelNo = hotel.hotelNo;
  item.url = `https://travel.rakuten.co.jp/HOTEL/${hotel.hotelNo}/${hotel.hotelNo}.html`;
  item.affiliateUrl = hotel.hotelInformationUrl;

  if (hotel.hotelImageUrl) item.imageUrl = hotel.hotelImageUrl;

  if (hotel.hotelMinCharge && hotel.hotelMinCharge > 0) {
    item.price = hotel.hotelMinCharge;
    if (!item.priceNote) item.priceNote = "1室1泊あたり最低料金の目安";
  }

  // レビュー件数が少ないと平均値が安定しないため3件以上のみ採用
  if (hotel.reviewAverage != null && hotel.reviewCount >= 3) {
    item.rating = hotel.reviewAverage;
  }

  if (!item.area && hotel.address1) {
    item.area = `${hotel.address1}${hotel.address2 ?? ""}`;
  }

  const price = hotel.hotelMinCharge ? `¥${hotel.hotelMinCharge}~` : "料金不明";
  const rating = hotel.reviewAverage
    ? `★${hotel.reviewAverage} (${hotel.reviewCount}件)`
    : "レビューなし";
  return `${hotel.hotelName} / ${price} / ${rating}`;
}

async function updateItem(item: ExperienceItem): Promise<string> {
  if (item.hotelNo) {
    const hotel = await getTravelHotel(item.hotelNo);
    await sleep(1000);
    if (!hotel) return `hotelNo=${item.hotelNo} が見つかりません、スキップ`;
    return applyHotel(item, hotel);
  }

  if (item.travelKeyword) {
    const hotels = await searchTravelHotels(item.travelKeyword, 1);
    await sleep(1000);
    if (hotels.length === 0) {
      return `「${item.travelKeyword}」がヒットせず、スキップ`;
    }
    return applyHotel(item, hotels[0]);
  }

  // エリアページなど。APIを使わずアフィリエイトリンクに変換するだけ
  if (!item.url) return "url がないためスキップ";
  if (!/^https:\/\/([a-z0-9.-]+\.)?rakuten\.co\.jp\//.test(item.url)) {
    return `楽天のURLではないためスキップ: ${item.url}`;
  }

  const affiliateUrl = toTravelAffiliateUrl(item.url);
  if (item.affiliateUrl === affiliateUrl) return "変更なし";
  item.affiliateUrl = affiliateUrl;
  return "アフィリエイトリンクを設定";
}

async function main() {
  if (
    !process.env.RAKUTEN_APP_ID ||
    !process.env.RAKUTEN_ACCESS_KEY ||
    !process.env.RAKUTEN_AFFILIATE_ID
  ) {
    console.error(
      "Error: RAKUTEN_APP_ID, RAKUTEN_ACCESS_KEY, and RAKUTEN_AFFILIATE_ID must be set"
    );
    process.exit(1);
  }

  if (!fs.existsSync(EXPERIENCES_DIR)) {
    console.log("data/experiences が存在しません");
    return;
  }

  const files = fs
    .readdirSync(EXPERIENCES_DIR)
    .filter((f) => f.endsWith(".json"));

  console.log(`Found ${files.length} experience topic(s)\n`);

  for (const file of files) {
    const filePath = path.join(EXPERIENCES_DIR, file);
    const topic = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    ) as ExperienceTopic;
    console.log(`[${topic.title}]`);

    for (const item of topic.experiences) {
      console.log(`  ${item.rank}. ${item.name}`);
      try {
        console.log(`    -> ${await updateItem(item)}`);
      } catch (e) {
        console.error(`    -> エラー: ${(e as Error).message}`);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + "\n");
    console.log(`  Saved\n`);
  }

  console.log("Done!");
}

main();
