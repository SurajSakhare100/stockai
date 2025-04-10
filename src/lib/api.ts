
import { StockData, StockHistoricalData, StockPrediction, SentimentData } from './types';

// This is a mock API service for development
// In a real application, you'd connect to real financial APIs like Alpha Vantage, Yahoo Finance, etc.

// Demo stock symbols
const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
];

// Function to get a random price change (for demo)
const getRandomChange = () => {
  return (Math.random() * 10 - 5).toFixed(2);
};

// Function to get random historical data (for demo)
const generateHistoricalData = (symbol: string, days: number): StockHistoricalData[] => {
  const data: StockHistoricalData[] = [];
  const basePrice = Math.random() * 500 + 50; // Random base price between 50 and 550
  let currentPrice = basePrice;
  
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random price movements
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    currentPrice += change;
    
    // Ensure price doesn't go below 1
    currentPrice = Math.max(currentPrice, 1);
    
    const dayVariation = currentPrice * 0.02;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat((currentPrice - dayVariation * Math.random()).toFixed(2)),
      high: parseFloat((currentPrice + dayVariation).toFixed(2)),
      low: parseFloat((currentPrice - dayVariation).toFixed(2)),
      close: parseFloat(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  
  return data;
};

// Mock API functions (in a real app these would make actual API calls)
export async function getStockData(symbol: string): Promise<StockData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const stockInfo = AVAILABLE_STOCKS.find(stock => stock.symbol === symbol) || { 
    symbol, 
    name: `Unknown Company (${symbol})` 
  };
  
  const change = parseFloat(getRandomChange());
  const price = Math.random() * 500 + 50;
  const previousClose = price - change;
  
  return {
    symbol: stockInfo.symbol,
    companyName: stockInfo.name,
    price: parseFloat(price.toFixed(2)),
    change: change,
    changePercent: parseFloat((change / previousClose * 100).toFixed(2)),
    previousClose: parseFloat(previousClose.toFixed(2)),
    open: parseFloat((previousClose + (Math.random() - 0.5) * 2).toFixed(2)),
    dayHigh: parseFloat((price + Math.random() * 5).toFixed(2)),
    dayLow: parseFloat((price - Math.random() * 5).toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    avgVolume: Math.floor(Math.random() * 15000000) + 2000000,
    marketCap: Math.floor(Math.random() * 2000000000000) + 50000000000,
    peRatio: Math.random() > 0.1 ? parseFloat((Math.random() * 50 + 10).toFixed(2)) : null,
  };
}

export async function getStockHistoricalData(
  symbol: string, 
  timeframe: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<StockHistoricalData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const days = timeframe === 'day' ? 1 : 
               timeframe === 'week' ? 7 :
               timeframe === 'month' ? 30 : 365;
  
  return generateHistoricalData(symbol, days);
}

export async function searchStocks(query: string): Promise<Array<{ symbol: string, name: string }>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query) return AVAILABLE_STOCKS;
  
  query = query.toLowerCase();
  return AVAILABLE_STOCKS.filter(
    stock => stock.symbol.toLowerCase().includes(query) || 
             stock.name.toLowerCase().includes(query)
  );
}

export async function getPrediction(symbol: string): Promise<StockPrediction> {
  // Simulate API delay (longer for "AI prediction")
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const predictedChange = parseFloat((Math.random() * 10 - 5).toFixed(2));
  const currentStock = await getStockData(symbol);
  const predictedPrice = parseFloat((currentStock.price + predictedChange).toFixed(2));
  
  return {
    symbol,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    predictedPrice,
    predictedChange,
    predictedChangePercent: parseFloat((predictedChange / currentStock.price * 100).toFixed(2)),
    confidence: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)), // 0.6-1.0 confidence
    factors: [
      {
        name: 'Market Sentiment',
        impact: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        description: 'General market conditions and investor sentiment',
      },
      {
        name: 'Technical Analysis',
        impact: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        description: 'Based on historical price patterns and indicators',
      },
      {
        name: 'Reddit Sentiment',
        impact: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        description: 'Analysis of recent Reddit posts and comments',
      },
      {
        name: 'News Analysis',
        impact: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        description: 'Recent news articles and press releases',
      },
    ]
  };
}

export async function getSentimentAnalysis(symbol: string): Promise<SentimentData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const overallSentiment = parseFloat((Math.random() * 2 - 1).toFixed(2)); 
  const positive = parseFloat((Math.random() * 0.7 + 0.3).toFixed(2));
  const negative = parseFloat((Math.random() * 0.7).toFixed(2));
  const neutral = parseFloat((1 - positive - negative).toFixed(2));
  
  const subreddits = ['wallstreetbets', 'stocks', 'investing', 'StockMarket'];
  
  return {
    symbol,
    overallSentiment,
    sentimentBreakdown: {
      positive,
      neutral,
      negative
    },
    recentPosts: Array(5).fill(null).map((_, i) => ({
      id: `post-${i}-${symbol}`,
      title: `${randomPostTitle(symbol)}`,
      content: `${randomPostContent(symbol)}`,
      sentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      upvotes: Math.floor(Math.random() * 5000),
      commentCount: Math.floor(Math.random() * 1000),
      url: 'https://reddit.com/',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
      subreddit: subreddits[Math.floor(Math.random() * subreddits.length)]
    })),
    lastUpdated: new Date().toISOString()
  };
}

// Helper functions for generating mock Reddit posts
function randomPostTitle(symbol: string): string {
  const titles = [
    `${symbol} is looking good for next quarter!`,
    `Should I buy ${symbol} right now or wait?`,
    `${symbol} earnings report discussion thread`,
    `What do you think about ${symbol}'s new product announcement?`,
    `${symbol} technical analysis - possible breakout coming?`,
    `Just sold all my ${symbol} shares, here's why`,
    `${symbol} is undervalued - deep dive analysis`,
    `Is ${symbol} a good long-term investment?`,
    `${symbol} institutional ownership has increased by 15%`,
    `${symbol} CEO interview - key takeaways`
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}

function randomPostContent(symbol: string): string {
  const contents = [
    `I've been tracking ${symbol} for the past few months and the technicals are looking good.`,
    `Not financial advice, but I think ${symbol} is positioned well in this market.`,
    `Anyone else concerned about ${symbol}'s debt levels?`,
    `${symbol}'s new management team seems to be turning things around.`,
    `I compared ${symbol} to its competitors and it seems undervalued by about 15%.`
  ];
  
  return contents[Math.floor(Math.random() * contents.length)];
}
