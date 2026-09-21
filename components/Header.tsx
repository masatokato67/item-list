import Link from "next/link";
import CategoryTabs from "./CategoryTabs";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between pt-4">
          <Link href="/" className="text-sm font-bold text-gray-900">
            こだわりおすすめナビ
          </Link>
        </div>
        <CategoryTabs />
      </div>
    </header>
  );
}
