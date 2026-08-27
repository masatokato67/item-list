"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JapanSection } from "@/lib/types";
import {
  sectionHref,
  SECTION_LABELS,
  VISIBLE_SECTIONS,
} from "@/lib/japan-sections";
import { THREADS_HANDLE, THREADS_URL } from "@/lib/givemejapan-site";
import ThreadsIcon from "./ThreadsIcon";

const NAV: JapanSection[] = VISIBLE_SECTIONS;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4">
        <Link href="/givemejapan" className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Give Me
          </span>
          <span className="text-lg font-bold tracking-tight text-rose-700">
            Japan
          </span>
        </Link>

        <nav aria-label="Sections" className="hidden gap-6 sm:flex">
          {NAV.map((section) => {
            const href = sectionHref(section);
            const isActive = pathname === href;
            return (
              <Link
                key={section}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-rose-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {SECTION_LABELS[section]}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/givemejapan/tags"
            className="text-sm text-gray-500 transition hover:text-gray-900"
          >
            All topics
          </Link>
          <a
            href={THREADS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow ${THREADS_HANDLE} on Threads`}
            className="text-gray-400 transition hover:text-gray-900"
          >
            <ThreadsIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* 狭い画面ではナビを横スクロールで出す */}
      <nav
        aria-label="Sections"
        className="flex gap-5 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:hidden"
      >
        {NAV.map((section) => (
          <Link
            key={section}
            href={sectionHref(section)}
            className="whitespace-nowrap text-sm text-gray-600"
          >
            {SECTION_LABELS[section]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
