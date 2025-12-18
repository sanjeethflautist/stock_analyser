"use client";

import { useState } from "react";
import StockSearch from "@/components/StockSearch";
import StockChart from "@/components/StockChart";
import AIAnalysis from "@/components/AIAnalysis";
import { TrendingUp } from "lucide-react";

export default function Home() {
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleStockSearch = async (symbol: string) => {
    setLoading(true);
    setStockSymbol(symbol);
    
    try {
      const response = await fetch(`/api/stock/${symbol}`);
      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
        setStockData(null);
      } else {
        setStockData(data);
      }
    } catch (error) {
      alert("Failed to fetch stock data");
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Stock Analyzer
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            AI-Powered Investment Insights & Predictions
          </p>
        </div>

        {/* Search Component */}
        <StockSearch onSearch={handleStockSearch} loading={loading} />

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading stock data...</p>
          </div>
        )}

        {stockData && !loading && (
          <div className="space-y-6">
            {/* Stock Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {stockSymbol.toUpperCase()}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stockData.companyName || "Stock Information"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    ${stockData.currentPrice?.toFixed(2) || "N/A"}
                  </p>
                  {stockData.change && (
                    <p className={`text-lg font-semibold ${
                      stockData.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {stockData.change >= 0 ? "+" : ""}
                      {stockData.change.toFixed(2)} ({stockData.changePercent?.toFixed(2)}%)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Chart */}
            <StockChart data={stockData.historicalData} symbol={stockSymbol} />

            {/* AI Analysis */}
            <AIAnalysis stockSymbol={stockSymbol} stockData={stockData} />
          </div>
        )}

        {/* Info Footer */}
        {!stockData && !loading && (
          <div className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Welcome to Stock Analyzer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Enter a stock symbol (e.g., AAPL, GOOGL, MSFT) to get:
              </p>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 max-w-md mx-auto">
                <li>✓ Real-time stock prices and historical data</li>
                <li>✓ Interactive price charts</li>
                <li>✓ AI-powered investment analysis</li>
                <li>✓ Risk assessment and predictions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
