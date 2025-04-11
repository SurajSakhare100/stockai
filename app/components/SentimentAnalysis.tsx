import { useState } from "react";
import { getSentiment } from "../actions/getSentiment";

interface SentimentAnalysisProps {
  symbol: string;
}

interface SentimentResult {
  mainSentiment: string;
  posts: Array<{
    title: string;
    sentiment: string;
  }>;
  sentimentCount: {
    positive: number;
    negative: number;
    neutral: number;
  };
  analysis: {
    keyTopics: string[];
    summary: string;
  };
}

export default function SentimentAnalysis({ symbol }: SentimentAnalysisProps) {
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const result = await getSentiment(symbol);
      setSentimentResult(result);
    } catch (error) {
      console.error("Error fetching sentiment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
      <h2 className="text-2xl font-bold mb-2 flex items-center">
        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        Sentiment Analysis
      </h2>
      <p className="text-gray-400 mb-4">
        Get insights into market sentiment for {symbol}
      </p>

      {!sentimentResult && !loading && (
        <button
          onClick={fetchSentiment}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Analyze Sentiment
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {sentimentResult && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Overall Sentiment{" "}
              <span className={getSentimentClass(sentimentResult.mainSentiment)}>
                {sentimentResult.mainSentiment.toUpperCase()}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-gray-800">
              <div className="text-green-500 font-bold">{sentimentResult.sentimentCount.positive}</div>
              <div className="text-sm text-gray-400">Positive</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-800">
              <div className="text-red-500 font-bold">{sentimentResult.sentimentCount.negative}</div>
              <div className="text-sm text-gray-400">Negative</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-800">
              <div className="text-gray-500 font-bold">{sentimentResult.sentimentCount.neutral}</div>
              <div className="text-sm text-gray-400">Neutral</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Recent Posts</h4>
            {sentimentResult.posts.length > 0 ? (
              sentimentResult.posts.map((post, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-gray-800">
                  <h5 className="font-medium">{post.title || "Untitled Post"}</h5>
                  <p className="text-sm">
                    Sentiment:{" "}
                    <span className={getSentimentClass(post.sentiment)}>
                      {post.sentiment}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No posts available for this ticker.</p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Analysis Summary</h4>
            <p className="text-gray-300">{sentimentResult.analysis.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
} 