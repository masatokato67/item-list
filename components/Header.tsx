import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          おすすめナビ
        </Link>
        <nav className="flex gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            トピック一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
