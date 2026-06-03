import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-gray-900">
          こだわりおすすめナビ
        </Link>
        <nav>
          <Link href="/tags" className="text-sm text-gray-600 hover:text-gray-900">
            タグ一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
