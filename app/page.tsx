import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className=" overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/80"></div>
        <div className="min-h-screen  flex flex-col items-center justify-center relative">
          <div className={`absolute inset-0 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]`}></div>
          <div className="relative mx-auto ">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                StockAI
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Your AI-Powered Stock Market Companion
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/stocks">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </button>
                </Link>
                <Link href="/sentiment-analysis">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Analyze Sentiment
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
              <h2 className="text-2xl font-bold mb-2">Real-time Analysis</h2>
              <p className="text-gray-400 mb-4">
                Get instant insights into stock performance and market trends
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  Track your favorite stocks with real-time data and AI-powered predictions
                </p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
              <h2 className="text-2xl font-bold mb-2">Smart Predictions</h2>
              <p className="text-gray-400 mb-4">
                Leverage AI to make informed investment decisions
              </p>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-300">
                  Our AI analyzes market data to provide you with accurate predictions
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                User-Friendly Interface
              </h2>
              <p className="text-gray-400 mb-4">
                Easy to navigate and understand
              </p>
              <p className="text-gray-300">
                Our platform is designed with you in mind. Whether you&apos;re a beginner or an expert, you&apos;ll find everything you need to make informed decisions.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                How It Works
              </h2>
              <p className="text-gray-400 mb-4">
                Simple three-step process
              </p>
              <p className="text-gray-300">
                1. Enter a stock symbol<br />
                2. Get real-time analysis<br />
                3. Make informed decisions
              </p>
            </div>

            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                Who Can Benefit?
              </h2>
              <p className="text-gray-400 mb-4">
                Perfect for all investors
              </p>
              <p className="text-gray-300">
                Whether you&apos;re a day trader, long-term investor, or just starting out, StockAI provides the tools you need to succeed in the market.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
