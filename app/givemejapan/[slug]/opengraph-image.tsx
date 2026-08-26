import { ImageResponse } from "next/og";
import { getJapanTopicBySlug, getSlugsByCategory } from "@/lib/topics";

export const alt = "Give Me Japan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSlugsByCategory("japan").map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getJapanTopicBySlug(slug);
  const title = topic ? topic.title : "Give Me Japan";
  const count = topic
    ? `${topic.places.length} place${topic.places.length === 1 ? "" : "s"} compared`
    : "";

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
        <div style={{ fontSize: "28px", opacity: 0.8, marginBottom: "20px" }}>
          Give Me Japan
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: "24px",
          }}
        >
          {title}
        </div>
        {count && (
          <div
            style={{
              fontSize: "24px",
              opacity: 0.9,
              background: "rgba(255,255,255,0.15)",
              padding: "8px 24px",
              borderRadius: "24px",
            }}
          >
            {count}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
