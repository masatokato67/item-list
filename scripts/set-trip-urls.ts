/**
 * Trip.comの管理画面や検索画面からコピーしたURLを、givemejapanの記事JSONに
 * 掃除して書き込むスクリプト。
 *
 * 管理画面が出力するURLには、そのまま貼ると事故になるパラメータが含まれる:
 *   - checkIn / checkOut … コピーした日の固定日付。残すと日付が過ぎた時点で
 *                          全訪問者が「空室なし」の画面に飛ぶ
 *   - locale=ja-JP       … 英語読者に日本語UIを強制する
 *   - hoteluniquekey / masterhotelid_tracelogid / detailFilters など
 *                        … コピーした人のセッション固有の値で、他人には無意味
 *
 * このスクリプトは cityEnName / cityId / hotelId だけを残す。
 * Allianceid / SID / trip_sub1 はビルド時に lib/tripcom.ts が付けるので、
 * ここでは付けない（JSONにアフィリエイトIDを焼き込まないため）。
 *
 * Trip.comはrobots.txtで検索結果・API・hotelId付き詳細ページへの機械的アクセスを
 * 禁止しているため、URL自体の取得は自動化していない。人がブラウザで開いて
 * コピーしたURLを渡す前提。
 *
 * 使い方:
 *   npm run trip-urls -- data/givemejapan/atami-fireworks-hotels.json
 *   （URLを rank の順に1行ずつ貼り付け、最後に Ctrl-D）
 *
 * 行を空にすると、その rank はURLなし（CTAボタンを出さない記事型）のままになる。
 */

import fs from "fs";
import path from "path";

/** 残すパラメータ。これ以外はすべて捨てる */
const KEEP_PARAMS = ["cityEnName", "cityId", "hotelId"];

interface Place {
  rank: number;
  name: string;
  url?: string;
  [key: string]: unknown;
}

/** 管理画面のURLから、掲載に必要な最小限のURLを組み立てる */
function cleanTripUrl(raw: string): string {
  const url = new URL(raw.trim());

  if (!url.hostname.endsWith("trip.com")) {
    throw new Error(`Trip.comのURLではありません: ${url.hostname}`);
  }
  if (!url.searchParams.get("hotelId")) {
    throw new Error(
      "hotelId がありません。ホテル詳細ページのURLを貼ってください"
    );
  }

  // ホストは貼られたものを尊重する。www.trip.com（国際版・英語）と
  // jp.trip.com（日本版）で読者に出る画面が変わるため、勝手に寄せない。
  const cleaned = new URL(`https://${url.hostname}/hotels/detail/`);
  for (const key of KEEP_PARAMS) {
    const value = url.searchParams.get(key);
    if (value) cleaned.searchParams.set(key, value);
  }
  return cleaned.toString();
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error(
      "使い方: npm run trip-urls -- data/givemejapan/<slug>.json"
    );
    process.exit(1);
  }

  const filePath = path.resolve(target);
  if (!fs.existsSync(filePath)) {
    console.error(`ファイルが見つかりません: ${filePath}`);
    process.exit(1);
  }

  const topic = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const places: Place[] = topic.places ?? [];
  const ordered = [...places].sort((a, b) => a.rank - b.rank);

  console.error(`${path.basename(filePath)} の掲載順:`);
  for (const p of ordered) {
    console.error(`  ${p.rank}. ${p.name}`);
  }
  console.error(
    `\nこの順にURLを1行ずつ貼り付けて、最後に Ctrl-D を押してください。` +
      `\n（URLなしにしたい行は空行のままにする）\n`
  );

  const lines = (await readStdin()).split("\n").map((l) => l.trim());
  // 末尾の空行だけ落とす。途中の空行は「この宿はURLなし」の意味を持たせる
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();

  if (lines.length > ordered.length) {
    console.error(
      `URLが多すぎます: ${lines.length}行 / 掲載は${ordered.length}件`
    );
    process.exit(1);
  }

  let updated = 0;
  const seen = new Map<string, number>();

  ordered.forEach((place, i) => {
    const raw = lines[i];
    if (!raw) return;

    let cleaned: string;
    try {
      cleaned = cleanTripUrl(raw);
    } catch (e) {
      console.error(`  ${place.rank}. ${place.name} → ${(e as Error).message}`);
      process.exitCode = 1;
      return;
    }

    // 同じホテルを2件に貼ってしまう事故を検知する
    const hotelId = new URL(cleaned).searchParams.get("hotelId")!;
    const dupe = seen.get(hotelId);
    if (dupe) {
      console.error(
        `  ${place.rank}. ${place.name} → hotelId=${hotelId} は ${dupe}位と同じです`
      );
      process.exitCode = 1;
      return;
    }
    seen.set(hotelId, place.rank);

    place.url = cleaned;
    updated += 1;
    console.error(`  ${place.rank}. ${place.name} → ${cleaned}`);
  });

  if (process.exitCode === 1) {
    console.error("\nエラーがあるため書き込みを中止しました。");
    return;
  }

  // www.trip.com（国際版・英語）と jp.trip.com（日本版）が混ざると、
  // 同じ記事なのに宿ごとに違う言語の画面へ飛ぶことになる
  const hosts = new Set(
    ordered
      .filter((p) => p.url)
      .map((p) => new URL(p.url as string).hostname)
  );
  if (hosts.size > 1) {
    console.error(
      `\n警告: この記事のリンク先ホストが混在しています → ${[...hosts].join(", ")}` +
        `\n英語記事なら www.trip.com に揃えることを検討してください。`
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  topic.updatedAt = today;
  fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + "\n", "utf-8");
  console.error(`\n${updated}件を書き込みました（updatedAt: ${today}）`);
}

main();
