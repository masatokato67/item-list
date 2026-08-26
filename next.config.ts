import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 楽天トラベルの施設画像は原寸（数MB）で配信されるため、
    // Next.jsの画像最適化を通してリサイズ・WebP化する。
    remotePatterns: [
      new URL("https://img.travel.rakuten.co.jp/**"),
      // Trip.com のCDN（/givemejapan の英語トピック用）。
      // 別ホストの画像を使うときはここに追加する。
      new URL("https://ak-d.tripcdn.com/**"),
      new URL("https://dimg04.c-ctrip.com/**"),
    ],
  },
};

export default nextConfig;
