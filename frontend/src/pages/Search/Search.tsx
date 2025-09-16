import React, { useState } from 'react';
import TickerSearch from '../../components/TickerSearch/TickerSearch';

interface TickerResult {
  symbol: string;
  name: string;
  type: string;
  market: string;
  currency: string;
  matchScore: number;
}

const Search: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<TickerResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<TickerResult[]>([]);

  const handleTickerSelect = (ticker: TickerResult) => {
    setSelectedTicker(ticker);
    
    // Add to recent searches (limit to 5)
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.symbol !== ticker.symbol);
      return [ticker, ...filtered].slice(0, 5);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Tickers</h1>
        
        <div className="mb-6">
          <TickerSearch
            onTickerSelect={handleTickerSelect}
            placeholder="Search stocks, ETFs, crypto..."
            showAddToWatchlist={true}
            className="w-full"
          />
        </div>

        {selectedTicker && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Selected Ticker</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-800">{selectedTicker.symbol}</div>
                <div className="text-sm text-blue-600">{selectedTicker.name}</div>
                <div className="text-xs text-blue-500">{selectedTicker.market} • {selectedTicker.type}</div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        )}

        {recentSearches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Searches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentSearches.map((ticker) => (
                <div
                  key={ticker.symbol}
                  className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedTicker(ticker)}
                >
                  <div className="font-semibold text-gray-800">{ticker.symbol}</div>
                  <div className="text-sm text-gray-600 truncate">{ticker.name}</div>
                  <div className="text-xs text-gray-500">{ticker.market}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;