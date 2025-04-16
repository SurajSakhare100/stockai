"use client";
import { useState } from "react";
import { getPrediction } from "../actions/getPrediction";

export default function PredictionPage() {
  const [symbol, setSymbol] = useState("");
  const [predictionData, setPredictionData] = useState<{
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
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPredictionData(null);

    try {
      const result = await getPrediction(symbol.toUpperCase());
      if (result.error) {
        setError(result.error || "Error getting prediction");
      } else if (result.success && result.prediction) {
        setPredictionData(result.prediction);
      } else {
        setError("Failed to get prediction data");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex justify-center items-center p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Stock Price Predictor
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Get Prediction"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {predictionData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Price Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Current Price</p>
                    <p className="text-xl font-bold text-white">${predictionData.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Previous Price</p>
                    <p className="text-xl font-bold text-white">${predictionData.previousPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Price Change</p>
                    <p className={`text-xl font-bold ${predictionData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {predictionData.priceChange >= 0 ? '+' : ''}{predictionData.priceChange.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Volume</p>
                    <p className="text-xl font-bold text-white">{predictionData.volume.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Trading Range
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Day High</p>
                    <p className="text-xl font-bold text-white">${predictionData.highPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Day Low</p>
                    <p className="text-xl font-bold text-white">${predictionData.lowPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Open Price</p>
                    <p className="text-xl font-bold text-white">${predictionData.openPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                <h2 className="text-lg font-semibold text-white mb-3">
                Analysis & Recommendation
              </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Recommendation</p>
                      <p className={`text-xl font-bold ${
                        predictionData.recommendation === 'BUY' ? 'text-green-500' : 
                        predictionData.recommendation === 'SELL' ? 'text-red-500' : 
                        'text-yellow-500'
                      }`}>
                        {predictionData.recommendation}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Confidence Score</p>
                      <div className="w-1/2 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${predictionData.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{predictionData.confidence}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                    <h1 className="  mb-2 text-gray-400 text-md">Analysis</h1>
                  <div className="">
                    <div className="bg-gray-700 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                      <p className="text-white text-sm whitespace-pre-line">{predictionData.analysis}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
