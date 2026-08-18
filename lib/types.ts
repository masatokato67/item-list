export type TopicCategory = "product" | "experience";

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

export type Topic = ProductTopic | ExperienceTopic;
