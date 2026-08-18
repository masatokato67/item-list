import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 楽天トラベルの施設画像は原寸（数MB）で配信されるため、
    // Next.jsの画像最適化を通してリサイズ・WebP化する。
    remotePatterns: [new URL("https://img.travel.rakuten.co.jp/**")],
  },
};

export default nextConfig;
