"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Sparkles } from "lucide-react";

interface AIAnalysisProps {
  stockSymbol: string;
  stockData: any;
}

export default function AIAnalysis({ stockSymbol, stockData }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stockSymbol && stockData) {
      fetchAnalysis();
    }
  }, [stockSymbol, stockData]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stockSymbol,
          currentPrice: stockData.currentPrice,
          historicalData: stockData.historicalData,
        }),
      });

      const data = await response.json();
      if (!data.error) {
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI Analysis</h3>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Analyzing stock data with AI...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const recommendationColors = {
    BUY: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300',
    HOLD: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300',
    SELL: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300',
  };

  const riskColors = {
    LOW: 'text-green-600 dark:text-green-400',
    MEDIUM: 'text-yellow-600 dark:text-yellow-400',
    HIGH: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI-Powered Analysis</h3>
      </div>

      {/* Recommendation Badge */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className={`px-6 py-3 rounded-lg border-2 ${recommendationColors[analysis.recommendation as keyof typeof recommendationColors]}`}>
          <div className="flex items-center gap-2">
            {analysis.recommendation === 'BUY' && <TrendingUp className="w-5 h-5" />}
            {analysis.recommendation === 'SELL' && <TrendingDown className="w-5 h-5" />}
            {analysis.recommendation === 'HOLD' && <AlertCircle className="w-5 h-5" />}
            <div>
              <p className="text-sm font-medium">Recommendation</p>
              <p className="text-xl font-bold">{analysis.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{analysis.confidence}%</p>
        </div>

        <div className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</p>
          <p className={`text-xl font-bold ${riskColors[analysis.riskLevel as keyof typeof riskColors]}`}>
            {analysis.riskLevel}
          </p>
        </div>
      </div>

      {/* Key Points */}
      {analysis.keyPoints && analysis.keyPoints.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Key Points</h4>
          <ul className="space-y-2">
            {analysis.keyPoints.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 mt-1">▪</span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Text */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Detailed Analysis</h4>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {analysis.analysis}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This AI-generated analysis is for educational and informational purposes only. 
          It should not be considered as financial advice. Always conduct your own research and consult with a 
          qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
