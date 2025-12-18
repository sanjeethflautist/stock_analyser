"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  loading: boolean;
}

export default function StockSearch({ onSearch, loading }: StockSearchProps) {
  const [symbol, setSymbol] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    if (symbol.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(symbol)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      setShowResults(false);
      onSearch(symbol.trim().toUpperCase());
    }
  };

  const handleSelectResult = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
    setShowResults(false);
    onSearch(selectedSymbol);
  };

  const popularStocks = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA"];

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Enter company name or stock symbol (e.g., Apple, AAPL)"
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    type="button"
                    onMouseDown={() => handleSelectResult(result.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {result.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searching && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
          >
            Analyze
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Popular:</span>
        {popularStocks.map((stock) => (
          <button
            key={stock}
            onClick={() => {
              setSymbol(stock);
              onSearch(stock);
            }}
            disabled={loading}
            className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
          >
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
}
