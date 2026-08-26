export type TopicCategory = "product" | "experience" | "japan";

export interface Product {
  rank: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  pros: string[];
  cons: string[];
  rakutenUrl: string;
  rakutenAffiliateUrl: string;
}

/**
 * 体験（旅行など）トピックの1項目。
 * ランキング型でも記事型でも書けるよう、価格・画像・評価は任意。
 * - ランキング型: imageUrl / price / rating を入れると商品と同じ見た目で並ぶ
 * - 記事型: name + description + url だけで、エリア紹介＋リンクのカードになる
 */
export interface ExperienceItem {
  rank: number;
  name: string;
  description: string;
  /** 「沖縄・恩納村」「神奈川県・箱根」など */
  area?: string;
  imageUrl?: string;
  price?: number;
  /** 価格の但し書き。例: 「1泊2食付き / 1名あたり目安」 */
  priceNote?: string;
  rating?: number;
  pros: string[];
  cons: string[];
  /** 楽天トラベルなどの通常URL */
  url: string;
  /** アフィリエイトURL。未設定なら url を使う。npm run update-travel で自動更新 */
  affiliateUrl?: string;
  /** 楽天トラベルの施設番号。設定すると価格・画像・評価をAPIから自動更新する */
  hotelNo?: number;
  /** hotelNo が不明なときの検索キーワード。初回実行時に hotelNo が書き込まれる */
  travelKeyword?: string;
  /** CTAボタンの文言。既定は「楽天トラベルで見る」 */
  ctaLabel?: string;
}

export interface BuyingGuideItem {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PriceCategory {
  threshold: number;
  belowLabel: string;
  aboveLabel: string;
  belowIntro?: string;
  aboveIntro?: string;
}

interface TopicBase {
  slug: string;
  title: string;
  description: string;
  intro: string;
  buyingGuide: BuyingGuideItem[];
  faq: FaqItem[];
  keywords: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

/** data/topics/*.json — 従来通りの商品トピック（/topics/[slug]） */
export interface ProductTopic extends TopicBase {
  category?: "product";
  searchQuery: string;
  products: Product[];
  priceCategories?: PriceCategory;
}

/** data/experiences/*.json — 旅行などの体験トピック（/experiences/[slug]） */
export interface ExperienceTopic extends TopicBase {
  category: "experience";
  experiences: ExperienceItem[];
  /** 一覧の見出し。既定は「おすすめの体験」 */
  listHeading?: string;
  searchQuery?: string;
}

/**
 * Give Me Japan（/givemejapan）の1項目。海外ユーザー向けなので本文はすべて英語。
 * 体験トピックと同じ「ランキング型／記事型」の書き分けができるよう、
 * 画像・価格・評価・予約リンクはすべて任意。
 */
export interface JapanPlace {
  rank: number;
  /** 英語表記の名前。例: "Hakone Onsen" */
  name: string;
  /** 日本語表記。カード上に小さく併記される。例: "箱根温泉" */
  japaneseName?: string;
  /** 場所。例: "Kanagawa, near Tokyo" */
  area?: string;
  description: string;
  imageUrl?: string;
  /** 価格。通貨は topic 側の priceCurrency に従う（既定はJPY） */
  price?: number;
  /** 価格の但し書き。例: "per room, per night (from)" */
  priceNote?: string;
  rating?: number;
  pros: string[];
  cons: string[];
  /** Trip.com などの予約URL。未設定ならCTAボタンは出ず、記事カードとして表示される */
  url?: string;
  /** アフィリエイトURL。未設定なら url に env のパラメータを付与して使う */
  affiliateUrl?: string;
  /** CTAボタンの文言。既定は「Check availability」 */
  ctaLabel?: string;
}

/** data/givemejapan/*.json — 海外ユーザー向けの英語トピック（/givemejapan/[slug]） */
export interface JapanTopic extends TopicBase {
  category: "japan";
  places: JapanPlace[];
  /** 一覧の見出し。既定は「Where to go」 */
  listHeading?: string;
  /** ヒーロー画像のURL。next.config.ts の remotePatterns に host の登録が必要 */
  heroImageUrl?: string;
  /** 記事の分類。ヘッダーのナビと一覧の絞り込みに使う */
  section?: JapanSection;
  /** price の通貨コード。既定は "JPY" */
  priceCurrency?: string;
}

/** /givemejapan のナビゲーション区分 */
export type JapanSection = "destinations" | "stays" | "interests" | "planning";

export type Topic = ProductTopic | ExperienceTopic | JapanTopic;
