# 体験トピック（旅行など）の追加方法

このディレクトリに `<slug>.json` を置くと、`/experiences/<slug>` のページと
`/experiences`（体験タブ）の一覧、sitemap、OG画像が自動で生成されます。

商品トピックは `data/topics/` のまま。両者はトップページのタブで切り替わります。

## JSONの形

タグは商品側と分かれており、`/experiences/tags` が体験のタグ一覧になります。
そのため **slug に `tags` は使えません**（`/experiences/tags` とURLが衝突します）。

```jsonc
{
  "slug": "autumn-onsen-trip",      // ファイル名と揃える（"tags" は不可）
  "category": "experience",         // 固定
  "createdAt": "2026-08-18",
  "updatedAt": "2026-08-18",
  "viewCount": 0,                   // npm run update-views で自動更新
  "title": "秋の温泉旅行におすすめの温泉地",
  "description": "…",               // meta descriptionとカードの説明文
  "intro": "…",                     // 冒頭のリード文
  "listHeading": "秋におすすめの温泉エリア",  // 任意。既定は「おすすめの体験」
  "buyingGuide": [{ "title": "…", "body": "…" }],
  "faq": [{ "question": "…", "answer": "…" }],
  "keywords": ["旅行", "温泉"],      // タグ。商品トピックとタグ空間は共通
  "experiences": [
    {
      "rank": 1,                    // 表示順
      "name": "箱根温泉",
      "area": "神奈川県・箱根",       // 任意。名前の上に緑の小見出しで出る
      "description": "…",
      "pros": ["…"],
      "cons": ["…"],
      "url": "https://travel.rakuten.co.jp/yado/kanagawa/hakone.html",

      // 以下はすべて任意。多くは npm run update-travel が自動で埋める
      "hotelNo": 29488,             // 楽天トラベルの施設番号
      "travelKeyword": "草津温泉 湯畑", // hotelNo が不明なときの検索キーワード
      "affiliateUrl": "…",          // あればCTAはこちらを使う
      "ctaLabel": "楽天トラベルで見る", // 既定値も同じ
      "imageUrl": "https://…",      // 入れると商品カードと同じ横並びレイアウトに
      "price": 12000,
      "priceNote": "1室1泊あたり最低料金の目安",
      "rating": 4.5
    }
  ]
}
```

## 2つの書き方

`imageUrl` / `price` / `rating` は任意なので、同じ構造で2通り書けます。

- **記事型**: `name` + `description` + `url` だけ。エリアやテーマの紹介カードになる
- **ランキング型**: `hotelNo` か `travelKeyword` を書いて `npm run update-travel` を
  実行すると、画像・価格・評価・アフィリエイトURLがAPIから入り、商品ページと同じ
  画像付きランキングカードになる

## npm run update-travel

`data/experiences/*.json` を楽天トラベルAPIで更新します。項目ごとに次の順で処理:

1. `hotelNo` あり → 施設検索APIで価格・画像・評価・アフィリエイトURLを更新
2. `travelKeyword` あり → キーワード検索APIの先頭1件を採用し、`hotelNo` を書き戻す
   （2回目以降は同じ施設に固定される）
3. どちらもなし → `url` をアフィリエイトリンクに変換して `affiliateUrl` に入れる
   （エリアページ・特集ページ向け。APIは呼ばない）

`name` / `description` / `pros` / `cons` は原稿なので上書きされません。
何度実行しても安全です。

### 前提

`.env.local` の `RAKUTEN_APP_ID` / `RAKUTEN_ACCESS_KEY` / `RAKUTEN_AFFILIATE_ID` に加えて、
楽天ウェブサービスのアプリの **API Access Scope に楽天トラベルAPIが含まれている**必要が
あります。含まれていないと `403 REQUESTED_SCOPES_NOT_ALLOWED` が返ります。

## 注意

- `npm run update-urls`（楽天市場用）は `data/topics/` のみが対象です。体験側は
  `npm run update-travel` を使ってください。
- `npm run update-views` は `/topics/` と `/experiences/` の両方のPVを取得します。
- 宿の画像は楽天トラベルAPIが返す `hotelImageUrl` を使います。自前でアップロードした
  画像の使用は楽天アフィリエイトの規約上NGなので、APIの値をそのまま使ってください。
