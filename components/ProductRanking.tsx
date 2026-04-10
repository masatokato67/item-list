import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRanking({
  products,
}: {
  products: Product[];
}) {
  const sorted = [...products].sort((a, b) => a.rank - b.rank);
  return (
    <div className="space-y-6">
      {sorted.map((product) => (
        <ProductCard key={product.rank} product={product} />
      ))}
    </div>
  );
}
