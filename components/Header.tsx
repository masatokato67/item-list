"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryTabs from "./CategoryTabs";
import { categoryFromPathname, tagsIndexHref } from "@/lib/topic-utils";

export default function Header() {
  const category = categoryFromPathname(usePathname());

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between pt-4">
          <Link href="/" className="text-sm font-bold text-gray-900">
            こだわりおすすめナビ
          </Link>
          <Link
            href={tagsIndexHref(category)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {category === "experience" ? "体験のタグ" : "商品のタグ"}一覧
          </Link>
        </div>
        <CategoryTabs />
      </div>
    </header>
  );
}
