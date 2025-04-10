
// Stock data types
export interface StockData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number | null;
}

export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Prediction types
export interface StockPrediction {
  symbol: string;
  date: string;
  predictedPrice: number;
  predictedChange: number;
  predictedChangePercent: number;
  confidence: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  impact: number; // -1 to 1 where -1 is negative impact, 1 is positive
  description: string;
}

// Sentiment analysis types
export interface SentimentData {
  symbol: string;
  overallSentiment: number; // -1 to 1 where -1 is negative, 1 is positive
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentPosts: RedditPost[];
  lastUpdated: string;
}

export interface RedditPost {
  id: string;
  title: string;
  content: string;
  sentiment: number;
  upvotes: number;
  commentCount: number;
  url: string;
  createdAt: string;
  subreddit: string;
}
