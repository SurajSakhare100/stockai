"use client";
import { useState } from "react";
import { fetchStock } from "../actions/stocksActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StockData {
  date: string;
  price: number;
}

export default function StocksPage() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayPrice, setTodayPrice] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStock(symbol);
      if (result.error) {
        setError(result.error);
        setStockData([]);
        setTodayPrice(null);
      } else if (result.data && result.data.length > 0) {
        setStockData(result.data);
        setTodayPrice(result.data[result.data.length - 1].price);
      } else {
        setError("No data available for this symbol");
        setStockData([]);
        setTodayPrice(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stock data");
      setStockData([]);
      setTodayPrice(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen flex flex-col items-center justify-center  font-sans p-6">
      <div className=" p-6 rounded-lg shadow-lg w-1/2">
        <h1 className="text-3xl font-bold mb-6 text-white">Stock Market Analysis</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter stock symbol (e.g., AAPL)"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Get Stock Data"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
            {error}
          </div>
        )}

        {todayPrice && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">Today&apos;s Price</h2>
            <p className="text-2xl font-bold text-blue-400">${todayPrice.toFixed(2)}</p>
          </div>
        )}
      </div>

      {stockData.length > 0 && (
        <div className="bg-gray-900 p-6 w-1/2 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Price Chart</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                  activeDot={{ r: 8, fill: '#60A5FA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 