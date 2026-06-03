import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "こだわりおすすめナビ | 厳選アイテムランキング",
    template: "%s | こだわりおすすめナビ",
  },
  description:
    "トピックごとに厳選したおすすめ商品をランキング形式でご紹介。詳しいレビューと比較で、あなたにぴったりのアイテムが見つかります。",
  metadataBase: new URL("https://kodawari-topic.com"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "こだわりおすすめナビ",
    title: "こだわりおすすめナビ | 厳選アイテムランキング",
    description:
      "トピックごとに厳選したおすすめ商品をランキング形式でご紹介。詳しいレビューと比較で、あなたにぴったりのアイテムが見つかります。",
  },
  twitter: {
    card: "summary",
    title: "こだわりおすすめナビ | 厳選アイテムランキング",
    description:
      "トピックごとに厳選したおすすめ商品をランキング形式でご紹介。",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
  verification: {
    google: "DeJQPVHUOlVPW7SEghD1DMCovh48EwP_hQ8_6SHYUc0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D9PPE9456D"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D9PPE9456D');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 font-[family-name:var(--font-geist-sans)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
