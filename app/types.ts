export interface PredictionData {
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
}

export interface PredictionResult {
  success: boolean;
  prediction?: PredictionData;
  error?: string;
} 