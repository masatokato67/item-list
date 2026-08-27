# Give Me Japan（英語トピック）の追加方法

このディレクトリに `<slug>.json` を置くと、`/givemejapan/<slug>` のページと
`/givemejapan` の一覧、セクション別ページ、タグページ、sitemap、OG画像が
自動で生成されます。`data/experiences/` と同じ運用方式です。

**本文はすべて英語で書きます。**海外ユーザー向けの独立サイトで、日本語サイト
（こだわりおすすめナビ）とはヘッダー・フッター・`lang` 属性が分かれています。

## ディレクトリと3つのカテゴリの関係

| データ | URL | 言語 |
| --- | --- | --- |
| `data/topics/` | `/topics/<slug>` | 日本語（商品） |
| `data/experiences/` | `/experiences/<slug>` | 日本語（体験・旅行） |
| `data/givemejapan/` | `/givemejapan/<slug>` | **英語（訪日旅行）** |

タグ空間はカテゴリごとに独立しています。英語タグが日本語サイトに出ることは
ありません。

## 予約済みのslug

`/givemejapan/tags` と `/givemejapan/sections/...` とURLが衝突するため、
**slug に `tags` と `sections` は使えません。**

## JSONの形

```jsonc
{
  "slug": "first-onsen-towns-near-tokyo", // ファイル名と揃える
  "category": "japan",                    // 固定
  "section": "destinations",              // ナビの区分（下記）
  "createdAt": "2026-08-26",
  "updatedAt": "2026-08-26",
  "viewCount": 0,
  "priceCurrency": "JPY",                 // 任意。既定は "JPY"
  "heroImageUrl": "https://…",            // 任意。記事上部の大きな写真
  "title": "Onsen Towns Near Tokyo",      // 英語
  "description": "…",                     // meta description兼カードの説明文
  "intro": "…",                           // 冒頭のリード文
  "listHeading": "Onsen towns within reach of Tokyo", // 任意。既定は "Where to go"
  "buyingGuide": [{ "title": "…", "body": "…" }],     // "How to choose" として出る
  "faq": [{ "question": "…", "answer": "…" }],
  "keywords": ["Onsen", "Near Tokyo"],    // 英語タグ
  "places": [
    {
      "rank": 1,
      "name": "Hakone",                   // 英語表記
      "japaneseName": "箱根",              // 任意。名前の下に小さく併記
      "area": "Kanagawa · about 1.5–2 hours from Tokyo", // 任意
      "description": "…",
      "pros": ["…"],                      // "What makes it special"
      "cons": ["…"],                      // "Good to know"

      // 以下すべて任意
      "url": "https://…",                 // Trip.com の予約URL
      "affiliateUrl": "https://…",        // あればCTAはこちらを優先
      "ctaLabel": "Check availability",   // 既定値も同じ
      "imageUrl": "https://…",
      "price": 18000,
      "priceNote": "per room, per night (from)",
      "rating": 4.5
    }
  ]
}
```

### section の値

ヘッダーのナビと `/givemejapan/sections/<section>` に対応します。
定義は `lib/japan-sections.ts`。

- `destinations` — Destinations（都市・エリア・日帰り）
- `stays` — Where to stay（旅館・温泉宿・ホテル）
- `interests` — Interests（食・祭り・自然・文化）
- `planning` — Plan a trip（季節・交通・予算・マナー）

## 2つの書き方

`url` / `imageUrl` / `price` / `rating` はすべて任意なので、体験トピックと同じく
2通りで書けます。

- **記事型**: `name` + `description` + `pros` / `cons` だけ。CTAボタンは出ず、
  純粋な読み物カードになる
- **ランキング型**: `url`（または `affiliateUrl`）と `imageUrl` / `price` /
  `rating` を入れると、写真・価格つきで予約ボタンのあるカードになる

まずは記事型で公開し、Trip.com のリンクが用意できてから `affiliateUrl` を
足していく運用ができます。

## Trip.com のアフィリエイトリンク

楽天トラベル（`npm run update-travel`）と違い、ビルド時にAPIを叩く仕組みは
まだありません。リンクは `lib/tripcom.ts` が次の優先順で決めます。

1. `affiliateUrl` があればそのまま使う ← **確実なのでこれを推奨**
   （Trip.com のパートナー管理画面で発行したリンクを貼る）
2. `url` があり、環境変数が設定されていればパラメータを付けて使う
3. `url` だけならそのまま使う
4. どちらもなければCTAボタンを出さない（記事型として表示）

`.env.local` に次を入れると 2. が有効になります。

```
NEXT_PUBLIC_TRIPCOM_ALLIANCE_ID=...
NEXT_PUBLIC_TRIPCOM_SID=...
```

⚠️ パラメータ名（`Allianceid` / `SID`）は Trip.com の管理画面で実際に発行される
リンクを見て確認してください。確認が取れるまでは `affiliateUrl` に発行済みリンクを
そのまま貼るのが安全です。将来 Booking.com を併用する場合も、同じ `affiliateUrl`
にリンクを入れれば動きます。

## 画像について

`next/image` で最適化するため、**画像のホストを `next.config.ts` の
`remotePatterns` に登録する必要があります。**未登録のホストを使うとビルドが
通りません。Trip.com のCDNは登録済みです。

楽天トラベルAPIが返す画像は楽天アフィリエイトの規約に紐づくため、Trip.com の
記事に流用しないでください。

## 年次更新が必要な記事

日付や年度が本文に入っている記事は、放置すると古い情報を出し続けます。
該当する記事と更新タイミングを、ここに残しておきます。

| slug | 更新するもの | 目安の時期 |
| --- | --- | --- |
| `atami-fireworks-hotels` | 熱海海上花火大会の開催日程（本文の `buyingGuide` とFAQに年間日程を記載） | 翌年分は毎年11月下旬ごろ発表される |

更新したら `updatedAt` も併せて直すこと。
