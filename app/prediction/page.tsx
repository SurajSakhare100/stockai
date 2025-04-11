"use client";
import { useState } from "react";
import { getPrediction } from "../actions/getPrediction";

export default function PredictionPage() {
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction("");

    try {
      const result = await getPrediction(symbol.toUpperCase());
      if (result.error) {
        setError(result.error || "Error getting prediction");
      } else {
        setPrediction(result.prediction || "");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 flex justify-center items-center flex-shrink-0">
      <div className="mx-auto mt-20 w-1/3">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Stock Price Predictor
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Get Prediction"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">
              Next Day Prediction
            </h2>
            <p className="text-2xl font-bold text-blue-400">
              {prediction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
