import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import SiteHeader from "@/components/givemejapan/SiteHeader";
import SiteFooter from "@/components/givemejapan/SiteFooter";
import {
  POSITIONING,
  POSITIONING_SHORT,
  SITE_NAME,
  TAGLINE,
} from "@/lib/givemejapan-site";

/**
 * /givemejapan は海外ユーザー向けの英語サイトとして、日本語サイトとは
 * 独立したルートレイアウトを持つ（lang="en"・専用のヘッダー/フッター）。
 * app/layout.tsx を置かず app/(ja) と app/givemejapan をそれぞれルートに
 * している。詳細は Next.js の Route Groups / 複数ルートレイアウトを参照。
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: POSITIONING,
  metadataBase: new URL("https://kodawari-topic.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: POSITIONING,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${TAGLINE}`,
    description: POSITIONING_SHORT,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export default function GiveMeJapanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
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
      <body className="min-h-full flex flex-col bg-white font-[family-name:var(--font-geist-sans)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
