import { ItemVideo as ItemVideoData } from "@/lib/types";

/**
 * カード内の紹介動画。preload="none" なので、再生されるまで動画本体は読み込まれない。
 * 初期表示はポスター画像だけなので、一覧ページの表示速度に影響しない。
 */
export default function ItemVideo({
  video,
  className = "",
}: {
  video: ItemVideoData;
  className?: string;
}) {
  return (
    <figure className={className}>
      <video
        src={video.src}
        poster={video.poster}
        controls
        muted
        loop
        playsInline
        preload="none"
        className={`w-full rounded-lg bg-black ${
          video.vertical ? "max-w-[240px] aspect-[9/16]" : "aspect-video"
        }`}
      >
        お使いのブラウザでは動画を再生できません。
      </video>
      {video.caption && (
        <figcaption className="mt-1.5 text-xs text-gray-500">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
