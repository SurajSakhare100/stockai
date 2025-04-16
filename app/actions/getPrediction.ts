"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";



// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface StockData {
  results: Array<{
    c: number;  // closing price
    v: number;  // volume
    h: number;  // high price
    l: number;  // low price
    o: number;  // open price
    t: number;  // timestamp
  }>;
  error?: string;
}

interface PredictionResult {
  success: boolean;
  prediction?: {
    currentPrice: number;
    previousPrice: number;
    priceChange: number;
    volume: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    analysis: string;
    confidence: number;
    recommendation: string;
  };
  error?: string;
}

// Mock function for stock data (replace with actual API call)
async function fetchStockData(): Promise<StockData> {
  // This is a mock implementation - replace with actual API call
  return {
    results: [
      {
        c: 150.25,  // current price
        v: 1000000, // volume
        h: 152.50,  // high
        l: 148.75,  // low
        o: 149.00,  // open
        t: Date.now() // timestamp
      },
      {
        c: 149.00,  // previous close
        v: 950000,
        h: 150.00,
        l: 148.00,
        o: 148.50,
        t: Date.now() - 86400000 // yesterday
      }
    ]
  };
}

export async function getPrediction(symbol: string): Promise<PredictionResult> {
  try {
    if (!symbol) {
      throw new Error("Stock symbol is required");
    }

    // Fetch stock data
    const stockData = await fetchStockData();

    if (stockData.error) {
      throw new Error(stockData.error);
    }

    if (!stockData.results || stockData.results.length < 2) {
      throw new Error("Insufficient data for prediction");
    }

    // Calculate price metrics
    const currentPrice = stockData.results[0].c;
    const previousPrice = stockData.results[1].c;
    const volume = stockData.results[0].v;
    const highPrice = stockData.results[0].h;
    const lowPrice = stockData.results[0].l;
    const openPrice = stockData.results[0].o;
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    const dayRange = ((highPrice - lowPrice) / lowPrice) * 100;
    const openToClose = ((currentPrice - openPrice) / openPrice) * 100;

    // Get prediction from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const predictionPrompt = `Analyze the following stock data for ${symbol} and provide a detailed analysis:

Stock Data:
- Current Price: $${currentPrice.toFixed(2)}
- Previous Close: $${previousPrice.toFixed(2)}
- Price Change: ${priceChange.toFixed(2)}%
- Volume: ${volume.toLocaleString()}
- Day's High: $${highPrice.toFixed(2)}
- Day's Low: $${lowPrice.toFixed(2)}
- Open Price: $${openPrice.toFixed(2)}
- Day Range: ${dayRange.toFixed(2)}%
- Open to Close: ${openToClose.toFixed(2)}%

Provide a detailed analysis with the following sections:
1. Price Action Analysis: Analyze the price movement, including the day's range and open-to-close movement
2. Volume Analysis: Evaluate the significance of the trading volume
3. Technical Indicators: Interpret the price patterns and potential support/resistance levels
4. Short-term Prediction: Predict the likely price movement for the next 24-48 hours
5. Risk Assessment: Evaluate the risk level and key factors to watch
6. Confidence Score: Rate your confidence in this analysis (0-100)
7. Trading Recommendation: Provide a clear buy/sell/hold recommendation with reasoning

Format the response as a clear, readable text with numbered sections. give me a detailed analysis of the stock data but in noraml text not markdown`;

    const result = await model.generateContent(predictionPrompt);
    const response = await result.response;
    const analysisText = response.text();

    // Extract confidence score from the analysis (assuming it's mentioned as a number)
    const confidenceMatch = analysisText.match(/confidence.*?(\d+)/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;

    // Extract recommendation
    const recommendationMatch = analysisText.match(/recommendation.*?(buy|sell|hold)/i);
    const recommendation = recommendationMatch ? recommendationMatch[1].toUpperCase() : "HOLD";

    return {
      success: true,
      prediction: {
        currentPrice,
        previousPrice,
        priceChange,
        volume,
        highPrice,
        lowPrice,
        openPrice,
        analysis: analysisText,
        confidence,
        recommendation
      }
    };
  } catch (error) {
    console.error("Error in getPrediction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate prediction"
    };
  }
}
