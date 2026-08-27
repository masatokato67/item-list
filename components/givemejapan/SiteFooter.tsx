import Link from "next/link";
import ThreadsIcon from "./ThreadsIcon";
import {
  POSITIONING_SHORT,
  TAGLINE,
  THREADS_HANDLE,
  THREADS_URL,
} from "@/lib/givemejapan-site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-bold tracking-tight text-gray-900">
            Give Me
          </span>
          <span className="text-base font-bold tracking-tight text-rose-700">
            Japan
          </span>
          <span className="text-sm text-gray-400">— {TAGLINE}</span>
        </div>

        <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">
          {POSITIONING_SHORT}
        </p>

        <a
          href={THREADS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
        >
          <ThreadsIcon className="h-4 w-4" />
          Follow {THREADS_HANDLE} on Threads
        </a>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-gray-500">
          Some links on this site are affiliate links. If you book through them,
          we may earn a commission at no extra cost to you. Prices and
          availability change — always confirm details on the booking site
          before you travel.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
          <Link href="/givemejapan" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/givemejapan/tags" className="hover:text-gray-900">
            All topics
          </Link>
          <Link href="/" className="hover:text-gray-900">
            日本語サイト（こだわりおすすめナビ）
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          &copy; 2026 こだわりおすすめナビ
        </p>
      </div>
    </footer>
  );
}
