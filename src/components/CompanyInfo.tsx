
import React from 'react';
import { StockData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, Briefcase, TrendingUp, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyInfoProps {
  stockData: StockData | null;
  isLoading: boolean;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ stockData, isLoading }) => {
  // Format large numbers like volume, market cap
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toString();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Company Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <>
            {stockData ? (
              <>
                <div className="flex items-start mb-4">
                  <div className="bg-muted rounded-full p-3 mr-3">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{stockData.companyName}</h3>
                    <p className="text-sm text-muted-foreground">{stockData.symbol} • Market Cap: ${formatNumber(stockData.marketCap)}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
                  <div className="text-3xl font-bold">${stockData.price.toFixed(2)}</div>
                  <div className={`flex items-center ${stockData.change >= 0 ? 'stock-up' : 'stock-down'}`}>
                    {stockData.change >= 0 ? (
                      <ArrowUpIcon size={16} className="mr-1" />
                    ) : (
                      <ArrowDownIcon size={16} className="mr-1" />
                    )}
                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <TrendingUp size={16} className="mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Trading Info</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Open</p>
                        <p className="font-medium">${stockData.open.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prev Close</p>
                        <p className="font-medium">${stockData.previousClose.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day High</p>
                        <p className="font-medium">${stockData.dayHigh.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Day Low</p>
                        <p className="font-medium">${stockData.dayLow.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <BarChart3 size={16} className="mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Key Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium">{formatNumber(stockData.volume)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Volume</p>
                        <p className="font-medium">{formatNumber(stockData.avgVolume)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">P/E Ratio</p>
                        <p className="font-medium">{stockData.peRatio ? stockData.peRatio.toFixed(2) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Cap</p>
                        <p className="font-medium">${formatNumber(stockData.marketCap)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No company data available.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
