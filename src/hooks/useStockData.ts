
import { useState, useEffect } from 'react';
import { StockData, StockHistoricalData, StockPrediction, SentimentData } from '@/lib/types';
import { getStockData, getStockHistoricalData, getPrediction, getSentimentAnalysis } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useStockData(symbol: string) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>([]);
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!symbol) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [stockResult, historicalResult] = await Promise.all([
          getStockData(symbol),
          getStockHistoricalData(symbol, timeframe),
        ]);
        
        setStockData(stockResult);
        setHistoricalData(historicalResult);
        
        // Fetch prediction and sentiment analysis
        try {
          const predictionResult = await getPrediction(symbol);
          setPrediction(predictionResult);
        } catch (err) {
          console.error('Error fetching prediction:', err);
          toast({
            title: "Prediction Error",
            description: "Unable to generate prediction at this time.",
            variant: "destructive"
          });
        }
        
        try {
          const sentimentResult = await getSentimentAnalysis(symbol);
          setSentiment(sentimentResult);
        } catch (err) {
          console.error('Error fetching sentiment:', err);
          toast({
            title: "Sentiment Analysis Error",
            description: "Unable to analyze sentiment data at this time.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data. Please try again later.');
        toast({
          title: "Data Loading Error",
          description: "Could not load stock data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [symbol, timeframe, toast]);
  
  const updateTimeframe = (newTimeframe: 'day' | 'week' | 'month' | 'year') => {
    setTimeframe(newTimeframe);
  };
  
  return {
    stockData,
    historicalData,
    prediction,
    sentiment,
    timeframe,
    updateTimeframe,
    isLoading,
    error
  };
}
