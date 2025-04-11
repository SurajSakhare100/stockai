import Hero from "./ui/hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  font-sans">
      <Hero />

     

      <section id="why-choose-us" className="my-32 w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          <span className="border-b-4 border-green-400 pb-2">Why Choose Our AI Chatbot?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Data-Driven Insights</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Leveraging vast amounts of historical stock data, our chatbot delivers data-driven predictions to guide your investment strategy.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Real-Time Predictions</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get instant predictions and market trends directly from our chatbot, allowing you to stay ahead of the curve.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">User-Friendly Interface</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Chat with our intuitive AI to receive easy-to-understand insights, whether you're a seasoned investor or just starting out.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Personalized Advice</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tailored recommendations based on your portfolio and investment goals.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="my-32 w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          <span className="border-b-4 border-green-400 pb-2">How It Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Connect",
              description: "Simply start a conversation with our chatbot and input the stocks you're interested in."
            },
            {
              step: "2",
              title: "Analyze",
              description: "Our AI analyzes the historical data and applies cutting-edge prediction models."
            },
            {
              step: "3",
              title: "Understand",
              description: "Receive easy-to-understand insights about market trends and potential movements."
            },
            {
              step: "4",
              title: "Predict",
              description: "Get real-time predictions and insights on stock performance to make informed decisions."
            }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="who-can-benefit" className="my-32 w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          <span className="border-b-4 border-green-400 pb-2">Who Can Benefit?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Individual Investors",
              description: "Whether you're new to investing or looking to optimize your strategy, our chatbot offers insights to help grow your portfolio."
            },
            {
              title: "Financial Advisors",
              description: "Enhance your advisory services with AI-driven predictions to provide better guidance to your clients."
            },
            {
              title: "Traders",
              description: "Stay ahead of market trends and make timely trades with our accurate stock predictions."
            }
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-32 text-center max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Start Predicting Your Success Today
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Don't let the market's unpredictability hold you back. Join
          countless others who trust our AI-powered chatbot to navigate the
          complexities of the stock market.
        </p>
        <a
          href="/prediction"
          className="inline-block px-8 py-4 text-lg font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
        >
          Start Chatting Now
        </a>
      </div>
    </main>
  );
}
