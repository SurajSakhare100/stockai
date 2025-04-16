"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PredictionResult } from "../types";

// Helper function to get yesterday's date string
function yesterdaysDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

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

// Mock function for stock data (replace with actual API call)
async function fetchStockData(symbol: string): Promise<StockData> {
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
    const response = await fetch(`/api/prediction?symbol=${symbol}`);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to get prediction"
      };
    }

    return {
      success: true,
      prediction: data.prediction
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to get prediction"
    };
  }
}
