import { getAllTopics } from "@/lib/topics";
import TopicCard from "@/components/TopicCard";

export default function HomePage() {
  const topics = getAllTopics();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          おすすめナビ
        </h1>
        <p className="mt-3 text-gray-600">
          こだわりのトピックから、あなたにぴったりの商品を見つけよう
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  );
}
