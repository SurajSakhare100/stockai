"use server";

import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// List of business-related subreddits to search in
const BUSINESS_SUBREDDITS = [
  'business',
  'smallbusiness',
  'entrepreneur',
  'startups',
  'BusinessHub',
  'marketing',
  'CustomerService',
  'BusinessIntelligence',
  'consulting',
  'Finance',
  'investing',
  'stocks',
  'wallstreetbets',
  'Economics',
  'BusinessStrategy',
  'BusinessNews'
];

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  created_utc: number;
  score: number;
  num_comments: number;
  url: string;
  subreddit: string;
}

interface Sentiment {
  title: string;
  score: number;
  num_comments: number;
  url: string;
  selftext: string;
  sentiment: 'positive' | 'negative';
}

export async function getSentiment(symbol: string) {
  try {
    
    // Ensure environment variables are set
    if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
      throw new Error('Reddit API credentials not configured');
    }

    // Get access token
    const authResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    if (!authResponse.data.access_token) {
      throw new Error('Failed to authenticate with Reddit API');
    }

    // Build search query for business-related content
    const searchQuery = encodeURIComponent(`title:"${symbol}" OR selftext:"${symbol}"`);
    const subredditQuery = BUSINESS_SUBREDDITS.map(sub => `subreddit:${sub}`).join(' OR ');
    const fullQuery = `(${searchQuery}) AND (${subredditQuery})`;

    // Search for posts
    const searchResponse = await axios.get(
      `https://oauth.reddit.com/search?q=${fullQuery}&sort=relevance&t=week&limit=10&restrict_sr=true`,
      {
        headers: {
          Authorization: `Bearer ${authResponse.data.access_token}`,
        },
      }
    );

    const posts = searchResponse.data.data.children
      .map((child: any) => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          selftext: post.selftext,
          created_utc: post.created_utc,
          score: post.score,
          num_comments: post.num_comments,
          url: `https://reddit.com${post.permalink}`,
          subreddit: post.subreddit,
        };
      })
      .filter((post: RedditPost) => {
        const hasContent = post.title || post.selftext;
        const symbolRegex = new RegExp(symbol, 'i');
        const mentionsSymbol = symbolRegex.test(post.title) || symbolRegex.test(post.selftext);
        return hasContent && mentionsSymbol;
      });


    if (!posts || posts.length === 0) {
      return {
        mainSentiment: 'neutral',
        posts: [],
        sentimentCount: {
          positive: 0,
          negative: 0,
          neutral: 0
        },
        analysis: {
          keyTopics: [],
          summary: "No recent discussions found"
        }
      };
    }

    // Extract sentiment from post titles and content
    const sentiments: Sentiment[] = posts.map((post: RedditPost) => ({
      title: post.title,
      score: post.score,
      num_comments: post.num_comments,
      url: post.url,
      selftext: post.selftext,
      sentiment: post.score > 0 ? 'positive' : 'negative'
    }));

    // Calculate overall sentiment
    const positiveCount = sentiments.filter((s: Sentiment) => s.sentiment === 'positive').length;
    const negativeCount = sentiments.filter((s: Sentiment) => s.sentiment === 'negative').length;
    const totalCount = sentiments.length;

    // Get Gemini's sentiment analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const sentimentPrompt = `Analyze the sentiment of these Reddit posts about ${symbol}:

${sentiments.map(s => `Post: "${s.title}"
Content: "${s.selftext}"
Score: ${s.score}
Comments: ${s.num_comments}
URL: ${s.url}`).join('\n\n')}

Please provide a detailed sentiment analysis in the following format:
{
  "overallSentiment": "Bullish/Bearish/Neutral",
  "sentimentScore": "percentage of positive sentiment (0-100)",
  "keyTopics": ["list of main topics discussed"],
  "confidence": "confidence level in the analysis",
  "summary": "brief summary of community sentiment"
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or additional text.`;

    const result = await model.generateContent(sentimentPrompt);
    const response = await result.response;
    let sentimentAnalysis;
    
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanResponse = response.text().trim();
      sentimentAnalysis = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw response:", response.text());
      sentimentAnalysis = {
        overallSentiment: "Neutral",
        sentimentScore: "50",
        keyTopics: [],
        confidence: "low",
        summary: "Unable to analyze sentiment due to parsing error"
      };
    }

    // Format posts for UI
    const formattedPosts = sentiments.map(s => ({
      title: s.title,
      content: s.selftext,
      sentiment: s.sentiment
    }));

    // Calculate sentiment counts
    const sentimentCount = {
      positive: positiveCount,
      negative: negativeCount,
      neutral: totalCount - (positiveCount + negativeCount)
    };

    // Determine main sentiment
    let mainSentiment = 'neutral';
    if (positiveCount > negativeCount) {
      mainSentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      mainSentiment = 'negative';
    }

    return {
      mainSentiment,
      posts: formattedPosts,
      sentimentCount,
      analysis: {
        keyTopics: sentimentAnalysis.keyTopics,
        summary: sentimentAnalysis.summary
      }
    };
  } catch (error) {
    console.error("Error fetching Reddit sentiment:", error);
    return {
      mainSentiment: 'neutral',
      posts: [],
      sentimentCount: {
        positive: 0,
        negative: 0,
        neutral: 0
      },
      analysis: {
        keyTopics: [],
        summary: "Unable to analyze sentiment"
      }
    };
  }
}
