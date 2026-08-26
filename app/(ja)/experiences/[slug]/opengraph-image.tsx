import { ImageResponse } from "next/og";
import { getExperienceBySlug, getSlugsByCategory } from "@/lib/topics";

export const alt = "こだわりおすすめナビ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSlugsByCategory("experience").map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getExperienceBySlug(slug);
  const title = topic ? topic.title : "こだわりおすすめナビ";
  const count = topic ? `${topic.experiences.length}件の体験を比較` : "";

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
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            opacity: 0.8,
            marginBottom: "20px",
          }}
        >
          こだわりおすすめナビ
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.3,
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
