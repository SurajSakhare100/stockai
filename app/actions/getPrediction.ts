"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchStock } from "./stocksActions";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface StockData {
  results: Array<{
    c: number;
    v: number;
  }>;
  error?: string;
}

export async function getPrediction(symbol: string) {
  try {
    if (!symbol) {
      throw new Error("Stock symbol is required");
    }

    // Fetch stock data
    const stockData = await fetchStock(symbol) as StockData;
    if (stockData.error) {
      throw new Error(stockData.error);
    }

    if (!stockData.results || stockData.results.length < 2) {
      throw new Error("Insufficient stock data for analysis");
    }

    const currentPrice = stockData.results[0].c;
    const previousPrice = stockData.results[1].c;
    const volume = stockData.results[0].v;
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

    // Get prediction from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const predictionPrompt = `Analyze the following stock data for ${symbol} and provide a detailed analysis:

Stock Data:
- Current Price: $${currentPrice}
- Previous Close: $${previousPrice}
- Price Change: ${priceChange.toFixed(2)}%
- Volume: ${volume}

Provide a detailed analysis with the following sections:
1. Current Trend: Describe the current trend and price movement
2. Price Prediction: Predict the likely price movement
3. Risk Assessment: Evaluate the risk level and factors
4. Volume Analysis: Analyze the trading volume significance
5. Confidence Level: State your confidence in this analysis

Format the response as a clear, readable text with numbered sections.`;

    const result = await model.generateContent(predictionPrompt);
    const response = await result.response;
    const analysisText = response.text();

    // Format the complete response as a single string
    const formattedResponse = `
Previous Price: $${previousPrice.toFixed(2)} \n
Current Price: $${currentPrice.toFixed(2)} \n
Price Change: ${priceChange.toFixed(2)}% \n
${analysisText}
`;

    return {
      success: true,
      prediction: formattedResponse
    };
  } catch (error) {
    console.error("Error in getPrediction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate prediction"
    };
  }
}
