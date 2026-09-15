/*
 * data/topics/*.json の楽天市場アフィリリンクを、商品を固定したまま
 * アフィリエイトIDだけ新IDに差し替える。
 *   - 既存の affiliate URL(hgc/.../?pc=<商品URL>) から生の商品URL(pc)を取り出し、
 *     hgc/<新ID>/?pc=<同じ商品URL> に組み直す（API不要・商品入れ替えなし）。
 *   - rakutenUrl / rakutenAffiliateUrl の両方を更新。name/price/rating/image は不変。
 * 使い方: npx tsx scripts/migrate-market-affiliate-id.ts <新ID> [--apply]
 */
import fs from "fs";
import path from "path";

const NEW_ID = process.argv[2];
const APPLY = process.argv.includes("--apply");
if (!NEW_ID || NEW_ID.startsWith("-")) {
  console.error("新IDを指定してください: npx tsx scripts/migrate-market-affiliate-id.ts <新ID> [--apply]");
  process.exit(1);
}
const TOPICS_DIR = path.join(process.cwd(), "data", "topics");

// 保存済みURLから「生の楽天商品URL」を取り出す
function extractRawUrl(u: string): string | null {
  if (!u) return null;
  if (u.includes("hb.afl.rakuten.co.jp")) {
    try {
      const pc = new URL(u).searchParams.get("pc");
      if (pc) return pc;
    } catch { /* noop */ }
    return null;
  }
  // すでに生の商品URLならそのまま
  if (/^https?:\/\/(item|product|books|search)\.rakuten\.co\.jp/.test(u)) return u;
  return null;
}

function toNewAffiliate(rawUrl: string): string {
  return `https://hb.afl.rakuten.co.jp/hgc/${NEW_ID}/?pc=${encodeURIComponent(rawUrl)}`;
}

const files = fs.readdirSync(TOPICS_DIR).filter((f) => f.endsWith(".json"));
let filesChanged = 0, productsChanged = 0, skipped: string[] = [];

for (const f of files) {
  const p = path.join(TOPICS_DIR, f);
  const topic = JSON.parse(fs.readFileSync(p, "utf8"));
  let changed = false;
  for (const prod of topic.products || []) {
    for (const field of ["rakutenAffiliateUrl", "rakutenUrl"] as const) {
      const cur = prod[field];
      if (!cur) continue;
      if (cur.includes(`hgc/${NEW_ID}/`)) continue; // 既に新ID
      const raw = extractRawUrl(cur);
      if (!raw) { skipped.push(`${topic.slug} / ${prod.name} / ${field}`); continue; }
      const next = toNewAffiliate(raw);
      if (next !== cur) { prod[field] = next; changed = true; if (field === "rakutenAffiliateUrl") productsChanged++; }
    }
  }
  if (changed) {
    filesChanged++;
    if (APPLY) fs.writeFileSync(p, JSON.stringify(topic, null, 2) + "\n");
  }
}
console.log(`対象ファイル: ${files.length}`);
console.log(`変更ファイル: ${filesChanged} / 変更商品(affiliateUrl): ${productsChanged}`);
console.log(`スキップ(生URL抽出不可): ${skipped.length}`);
skipped.slice(0, 20).forEach((s) => console.log("  - " + s));
console.log(APPLY ? "\n[APPLY] 書き込み済み" : "\n[DRY-RUN] 書き込みなし");
