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

export interface Topic {
  slug: string;
  title: string;
  description: string;
  intro: string;
  buyingGuide: BuyingGuideItem[];
  faq: FaqItem[];
  keywords: string[];
  searchQuery: string;
  products: Product[];
  priceCategories?: PriceCategory;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}
