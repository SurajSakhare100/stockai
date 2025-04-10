
import React from 'react';
import { SentimentData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface SentimentAnalysisProps {
  sentiment: SentimentData | null;
  isLoading: boolean;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment, isLoading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getSentimentClass = (value: number) => {
    if (value > 0.3) return 'text-green-600';
    if (value > 0) return 'text-green-500';
    if (value > -0.3) return 'text-red-500';
    return 'text-red-600';
  };

  const getSentimentDescription = (value: number) => {
    if (value > 0.5) return 'Very Positive';
    if (value > 0.2) return 'Positive';
    if (value > -0.2) return 'Neutral';
    if (value > -0.5) return 'Negative';
    return 'Very Negative';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Reddit Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[200px]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-[72px] w-full" />
              <Skeleton className="h-[72px] w-full" />
              <Skeleton className="h-[72px] w-full" />
            </div>
          </div>
        ) : (
          <>
            {sentiment ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Overall Sentiment</span>
                    <span className={`text-sm font-medium ${getSentimentClass(sentiment.overallSentiment)}`}>
                      {getSentimentDescription(sentiment.overallSentiment)}
                    </span>
                  </div>
                  <div className="bg-muted h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sentiment.overallSentiment > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(sentiment.overallSentiment) * 100}%`, marginLeft: sentiment.overallSentiment < 0 ? 'auto' : '50%' }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-green-500">
                      <ThumbsUp size={14} className="mr-1" />
                      <span className="text-xs font-medium">Positive</span>
                    </div>
                    <Progress className="h-1.5 mt-1" value={sentiment.sentimentBreakdown.positive * 100} />
                    <span className="text-xs mt-1">{(sentiment.sentimentBreakdown.positive * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-gray-500">
                      <span className="text-xs font-medium">Neutral</span>
                    </div>
                    <Progress className="h-1.5 mt-1" value={sentiment.sentimentBreakdown.neutral * 100} />
                    <span className="text-xs mt-1">{(sentiment.sentimentBreakdown.neutral * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-red-500">
                      <ThumbsDown size={14} className="mr-1" />
                      <span className="text-xs font-medium">Negative</span>
                    </div>
                    <Progress className="h-1.5 mt-1" value={sentiment.sentimentBreakdown.negative * 100} />
                    <span className="text-xs mt-1">{(sentiment.sentimentBreakdown.negative * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium mb-1">Recent Reddit Posts</h4>
                  {sentiment.recentPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="bg-muted/30 p-3 rounded-md">
                      <div className="flex justify-between">
                        <h5 className="text-sm font-semibold line-clamp-1">{post.title}</h5>
                        <span className={`text-xs font-medium ${getSentimentClass(post.sentiment)}`}>
                          {getSentimentDescription(post.sentiment)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          r/{post.subreddit} • {formatDate(post.createdAt)}
                        </span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ThumbsUp size={10} className="mr-1" />
                          <span className="mr-2">{post.upvotes}</span>
                          <MessageSquare size={10} className="mr-1" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  Last updated: {formatDate(sentiment.lastUpdated)}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No sentiment data available.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
