"use server"
import { restClient } from "@polygon.io/client-js";
import {
  yesterdaysDateString,
  getMonthsBackFromYesterday,
} from "../lib/dateHelpers";

if (!process.env.POLYGON_API_KEY) {
  throw new Error("POLYGON_API_KEY is not configured");
}

const rest = restClient(process.env.POLYGON_API_KEY);

const yesterday = yesterdaysDateString();
const monthsBack = getMonthsBackFromYesterday(1); // Get last month's data

interface StockDataResult {
  data?: Array<{ date: string; price: number }>;
  error?: string;
  ticker?: string;
}

interface ErrorType {
  message: string;
}

// Common stock symbols for reference
const COMMON_SYMBOLS = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'META': 'Meta Platforms Inc.',
  'TSLA': 'Tesla Inc.',
  'NVDA': 'NVIDIA Corporation',
  'JPM': 'JPMorgan Chase & Co.',
  'V': 'Visa Inc.',
  'WMT': 'Walmart Inc.'
} as const;

export async function fetchStock(symbol: string): Promise<StockDataResult> {
  try {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error(`Invalid stock symbol: ${symbol}`);
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    
    // Check if it's a common symbol with a typo
    if (cleanSymbol === 'APPL') {
      return fetchStock('AAPL'); // Auto-correct APPL to AAPL
    }

    const response = await rest.stocks.aggregates(
      cleanSymbol,
      1,
      "day",
      monthsBack,
      yesterday,
      { limit: 30 } // Get up to 30 days of data
    );

    if (!response || !response.results || response.results.length === 0) {
      // Check if it's a common symbol
      const companyName = COMMON_SYMBOLS[cleanSymbol as keyof typeof COMMON_SYMBOLS];
      const errorMessage = companyName 
        ? `No data available for ${cleanSymbol} (${companyName}). Please check the symbol.`
        : `No data available for ${cleanSymbol}. Please check the symbol.`;
      
      return {
        ticker: cleanSymbol,
        error: errorMessage
      };
    }

    // Format the data for the chart
    const formattedData = response.results
      .filter(result => result.t && result.c) // Ensure we have both timestamp and closing price
      .map(result => ({
        date: new Date(result.t!).toLocaleDateString(),
        price: result.c!
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (formattedData.length === 0) {
      return {
        ticker: cleanSymbol,
        error: "No valid data points found"
      };
    }

    return {
      ticker: cleanSymbol,
      data: formattedData
    };
  } catch (e: ErrorType) {
    console.error(`Error fetching data for ${symbol}:`, e);
    return {
      ticker: symbol,
      error: e.message || `Failed to fetch data for ${symbol}`
    };
  }
}

export async function fetchStocksData(symbols: string[]): Promise<StockDataResult[]> {
  try {
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error("Please provide at least one stock symbol");
    }

    // Validate and clean symbols
    const validSymbols = symbols
      .filter(symbol => symbol && typeof symbol === 'string')
      .map(symbol => symbol.trim().toUpperCase());

    if (validSymbols.length === 0) {
      throw new Error("No valid stock symbols provided");
    }

    const results = await Promise.allSettled(validSymbols.map(fetchStock));

    return results.map((promiseResult, index) => {
      if (promiseResult.status === "fulfilled") {
        return promiseResult.value;
      } else {
        console.error(`Error fetching data for ${validSymbols[index]}:`, promiseResult.reason);
        return {
          ticker: validSymbols[index],
          error: (promiseResult.reason as ErrorType)?.message || `Failed to fetch data for ${validSymbols[index]}`
        };
      }
    });
  } catch (e: ErrorType) {
    console.error("Unexpected error in fetchStocksData:", e);
    throw new Error(e.message || "Failed to fetch stocks data");
  }
}
