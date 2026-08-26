import { ImageResponse } from "next/og";

export const alt = "Give Me Japan";
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
          background: "linear-gradient(135deg, #9f1239 0%, #111827 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: "64px", fontWeight: "bold" }}>
          Give Me Japan
        </div>
        <div style={{ fontSize: "30px", opacity: 0.85, marginTop: "20px" }}>
          Your guide to Japan
        </div>
      </div>
    ),
    { ...size }
  );
}
