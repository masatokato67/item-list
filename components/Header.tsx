"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryTabs from "./CategoryTabs";
import { categoryFromPathname, categoryHref } from "@/lib/topic-utils";

export default function Header() {
  // サイト名のリンク先は、今いるタブのトップ（商品なら /、体験なら /experiences）
  const home = categoryHref(categoryFromPathname(usePathname()));

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between pt-4">
          <Link href={home} className="text-sm font-bold text-gray-900">
            こだわりおすすめナビ
          </Link>
        </div>
        <CategoryTabs />
      </div>
    </header>
  );
}
