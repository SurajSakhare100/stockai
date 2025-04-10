
import React, { useState } from 'react';
import { useStockData } from '@/hooks/useStockData';
import StockChart from '@/components/StockChart';
import CompanyInfo from '@/components/CompanyInfo';
import PredictionSection from '@/components/PredictionSection';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import StockSearch from '@/components/StockSearch';
import { RefreshCw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [symbol, setSymbol] = useState<string>('AAPL');  // Default to Apple
  const { 
    stockData, 
    historicalData, 
    prediction, 
    sentiment,
    timeframe,
    updateTimeframe,
    isLoading
  } = useStockData(symbol);
  const { toast } = useToast();
  
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    toast({
      title: "Loading Stock Data",
      description: `Loading data for ${newSymbol}`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <span className="text-finance-secondary mr-2">StockAI</span>
                <span className="text-sm bg-finance-secondary/10 text-finance-secondary px-2 py-0.5 rounded-md">
                  Predictor
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">AI-Powered Stock Analysis & Prediction</p>
            </div>
            
            <div className="w-full md:w-auto">
              <StockSearch 
                onSelectStock={handleSymbolChange}
                currentSymbol={symbol}
              />
            </div>
            
            <button 
              className="hidden md:flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                // Re-fetch stock data
                handleSymbolChange(symbol);
              }}
            >
              <RefreshCw size={12} className="mr-1" />
              Refresh Data
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 flex items-start">
          <Info size={16} className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-xs text-yellow-800">
            <p className="font-medium">Demo Application Only</p>
            <p>This application uses simulated data and AI predictions for educational purposes. 
            It should not be used for actual investment decisions. Real market data and professional 
            financial advice should be consulted before making any investment.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Stock Chart */}
            <StockChart 
              data={historicalData} 
              prediction={prediction}
              timeframe={timeframe}
              onTimeframeChange={updateTimeframe}
              isLoading={isLoading}
            />
            
            {/* Company Info */}
            <CompanyInfo 
              stockData={stockData} 
              isLoading={isLoading} 
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Prediction */}
            <PredictionSection 
              prediction={prediction} 
              isLoading={isLoading} 
            />
            
            {/* Reddit Sentiment */}
            <SentimentAnalysis 
              sentiment={sentiment}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StockAI Predictor - Fictional Demo Application</p>
          <p className="text-xs mt-1">Built with React, TypeScript, Recharts and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
