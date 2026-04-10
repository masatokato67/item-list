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

export interface Topic {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  searchQuery: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}
