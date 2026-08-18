"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopicCategory } from "@/lib/types";
import { categoryFromPathname } from "@/lib/topic-utils";

const TABS: { category: TopicCategory; label: string; href: string }[] = [
  { category: "product", label: "商品", href: "/" },
  { category: "experience", label: "体験", href: "/experiences" },
];

export default function CategoryTabs() {
  const active = categoryFromPathname(usePathname());

  return (
    <nav aria-label="カテゴリ切り替え" className="flex gap-6">
      {TABS.map((tab) => {
        const isActive = tab.category === active;
        return (
          <Link
            key={tab.category}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px border-b-2 px-1 py-3 text-sm font-bold transition ${
              isActive
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
