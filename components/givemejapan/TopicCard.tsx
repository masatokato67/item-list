import Image from "next/image";
import Link from "next/link";
import { JapanTopic } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/japan-sections";

/** 一覧に並ぶ記事カード。ヒーロー画像があれば写真つきの編集カードになる */
export default function TopicCard({
  topic,
  featured = false,
}: {
  topic: JapanTopic;
  featured?: boolean;
}) {
  const href = `/givemejapan/${topic.slug}`;
  const image = topic.heroImageUrl || topic.places.find((p) => p.imageUrl)?.imageUrl;

  return (
    <article className="group">
      <Link href={href} className="block">
        {/* 画像がないトピックは写真枠を出さず、テキスト主体のカードにする。
            空の色ブロックが並ぶと未完成に見えるため。 */}
        {image ? (
          <div
            className={`relative overflow-hidden rounded-lg bg-gray-100 ${
              featured ? "aspect-[16/9]" : "aspect-[3/2]"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes={
                featured
                  ? "(max-width: 1024px) 100vw, 640px"
                  : "(max-width: 640px) 100vw, 400px"
              }
            />
            {topic.section && (
              <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-xs font-bold uppercase tracking-wide text-rose-700">
                {SECTION_LABELS[topic.section]}
              </span>
            )}
          </div>
        ) : (
          topic.section && (
            <span className="text-xs font-bold uppercase tracking-wide text-rose-700">
              {SECTION_LABELS[topic.section]}
            </span>
          )
        )}

        <h2
          className={`mt-2 font-bold leading-snug text-gray-900 transition group-hover:text-rose-700 ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {topic.title}
        </h2>
        <p
          className={`mt-2 leading-relaxed text-gray-600 ${
            featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
          }`}
        >
          {topic.description}
        </p>
      </Link>

      <p className="mt-2 text-xs text-gray-400">
        {topic.places.length} {topic.places.length === 1 ? "pick" : "picks"} ·
        Updated {topic.updatedAt}
      </p>
    </article>
  );
}
