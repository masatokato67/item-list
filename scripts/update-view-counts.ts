/**
 * Google Analytics 4 Data API からトピック別PVを取得し、
 * 各トピックJSONの viewCount を更新するスクリプト。
 *
 * 必要な環境変数:
 *   GA_PROPERTY_ID       - GA4プロパティID（数字のみ、例: 123456789）
 *   GOOGLE_CLIENT_EMAIL  - サービスアカウントのメールアドレス
 *   GOOGLE_PRIVATE_KEY   - サービスアカウントの秘密鍵（PEM形式）
 *
 * 使い方:
 *   npx tsx scripts/update-view-counts.ts
 */

import fs from "fs";
import path from "path";

const TOPICS_DIR = path.join(process.cwd(), "data", "topics");
const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID || "";
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      iss: GOOGLE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  // Sign JWT with private key
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(GOOGLE_PRIVATE_KEY, "base64url");

  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  return data.access_token;
}

async function fetchPageViews(
  accessToken: string
): Promise<Map<string, number>> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: {
              matchType: "BEGINS_WITH",
              value: "/topics/",
            },
          },
        },
        limit: 100,
      }),
    }
  );

  const data = await res.json();
  const pvMap = new Map<string, number>();

  if (data.rows) {
    for (const row of data.rows) {
      const pagePath: string = row.dimensionValues[0].value;
      const views = parseInt(row.metricValues[0].value, 10);
      // Extract slug from /topics/slug
      const match = pagePath.match(/^\/topics\/([^/]+)/);
      if (match) {
        const slug = match[1];
        pvMap.set(slug, (pvMap.get(slug) || 0) + views);
      }
    }
  }

  return pvMap;
}

async function main() {
  if (!GA_PROPERTY_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.log(
      "GA credentials not set. Setting all viewCount to 0 (sorted by createdAt)."
    );
    console.log(
      "To enable GA integration, set GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY in .env.local"
    );
    return;
  }

  console.log("Fetching access token...");
  const accessToken = await getAccessToken();

  console.log("Fetching page views (last 28 days)...");
  const pvMap = await fetchPageViews(accessToken);

  console.log(`\nResults:`);
  const files = fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(TOPICS_DIR, file);
    const topic = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const views = pvMap.get(topic.slug) || 0;
    topic.viewCount = views;
    fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + "\n");
    console.log(`  ${topic.slug}: ${views} views`);
  }

  console.log("\nDone! viewCount updated for all topics.");
}

main();
