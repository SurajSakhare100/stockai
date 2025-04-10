
import React from 'react';
import { StockPrediction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionSectionProps {
  prediction: StockPrediction | null;
  isLoading: boolean;
}

const PredictionSection: React.FC<PredictionSectionProps> = ({ prediction, isLoading }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'bg-green-500';
    if (confidence >= 0.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };
  
  const getImpactColor = (impact: number) => {
    if (impact > 0.3) return 'text-green-600';
    if (impact > 0) return 'text-green-500';
    if (impact > -0.3) return 'text-red-500';
    return 'text-red-600';
  };
  
  const getImpactIcon = (impact: number) => {
    if (impact > 0) {
      return <TrendingUp size={16} className="text-green-500" />;
    }
    return <TrendingDown size={16} className="text-red-500" />;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">AI Prediction</CardTitle>
          <div className="text-xs text-muted-foreground flex items-center">
            <AlertCircle size={12} className="mr-1" />
            For educational purposes only
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[280px]" />
            <Skeleton className="h-6 w-[220px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : (
          <>
            {prediction ? (
              <div className="space-y-4 animate-slide-in">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1">
                    Predicted for {formatDate(prediction.date)}:
                    <span className={prediction.predictedChange >= 0 ? 'stock-up' : 'stock-down'}>
                      {' '}${prediction.predictedPrice.toFixed(2)}
                    </span>
                  </h3>
                  
                  <div className={`flex items-center ${prediction.predictedChange >= 0 ? 'prediction-badge-up' : 'prediction-badge-down'}`}>
                    {prediction.predictedChange >= 0 ? (
                      <ArrowUpIcon size={14} className="mr-1" />
                    ) : (
                      <ArrowDownIcon size={14} className="mr-1" />
                    )}
                    <span>
                      {prediction.predictedChange >= 0 ? '+' : ''}
                      {prediction.predictedChange.toFixed(2)} ({prediction.predictedChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">AI Confidence</span>
                    <span className="text-sm font-medium">{(prediction.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={prediction.confidence * 100} className={`h-2 ${getConfidenceColor(prediction.confidence)}`} />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-2">Key Factors</h4>
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getImpactIcon(factor.impact)}
                          <span className="ml-2 font-medium text-sm">{factor.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${getImpactColor(factor.impact)}`}>
                          {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground mt-3">
                  This prediction is based on historical data analysis, market trends, sentiment analysis, and technical indicators.
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No prediction available at this time.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionSection;
