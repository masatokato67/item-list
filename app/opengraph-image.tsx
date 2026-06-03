import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "こだわりおすすめナビ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 32 32">
            <circle cx="14" cy="13" r="6.5" fill="none" stroke="#fff" strokeWidth="2.2" />
            <line x1="19" y1="18" x2="25" y2="24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="14,8.5 15.2,11.2 18,11.5 16,13.3 16.5,16 14,14.5 11.5,16 12,13.3 10,11.5 12.8,11.2" fill="#fbbf24" />
          </svg>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          こだわりおすすめナビ
        </div>
        <div
          style={{
            fontSize: "24px",
            opacity: 0.9,
          }}
        >
          厳選アイテムをランキング形式でご紹介
        </div>
      </div>
    ),
    { ...size }
  );
}
