import React from 'react';
import WatchlistComponent from '../../components/Watchlist/Watchlist';
import TickerSearch from '../../components/TickerSearch/TickerSearch';

const WatchlistPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Watchlist</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Ticker</h2>
          <TickerSearch 
            placeholder="Search for stocks, ETFs, crypto to add to watchlist..."
            showAddToWatchlist={true}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tracked Tickers</h2>
          <WatchlistComponent showPrices={true} />
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;