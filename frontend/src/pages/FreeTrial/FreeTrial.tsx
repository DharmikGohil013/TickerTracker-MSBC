import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../../components/Icons/Icons';
import './FreeTrial.css';

interface StockData {
  time: string;
  price: number;
  volume: number;
}

interface PredictionPoint {
  time: string;
  price: number;
  type: 'buy' | 'sell';
  confidence: number;
}

const FreeTrial: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(2850.50);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState<'buy' | 'sell' | null>(null);
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);
  const [lastPrediction, setLastPrediction] = useState<PredictionPoint | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Check if market is open (9:15 AM - 3:30 PM IST)
  const checkMarketHours = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    
    const currentTime = hours * 60 + minutes;
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM
    
    return currentTime >= marketOpen && currentTime <= marketClose;
  };

  // Generate fake live data
  const generateStockData = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN');
    
    // Simulate price movement
    const volatility = 0.002;
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    const newPrice = Math.max(currentPrice + change, 2800); // Min price 2800
    
    const newData: StockData = {
      time: timeString,
      price: Number(newPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 5000
    };

    setCurrentPrice(newPrice);
    setStockData(prev => [...prev.slice(-49), newData]); // Keep last 50 points
  };

  // Handle prediction
  const handlePrediction = async (type: 'buy' | 'sell') => {
    setPredictionLoading(type);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const confidence = Math.random() * 30 + 70; // 70-100% confidence
    const priceChange = type === 'buy' ? 
      Math.random() * 50 + 10 : // Buy: +10 to +60
      -(Math.random() * 40 + 15); // Sell: -15 to -55
    
    const prediction: PredictionPoint = {
      time: new Date().toLocaleTimeString('en-IN'),
      price: Number((currentPrice + priceChange).toFixed(2)),
      type,
      confidence: Number(confidence.toFixed(1))
    };

    setPredictions(prev => [...prev, prediction]);
    setLastPrediction(prediction);
    setPredictionLoading(null);
  };

  // Draw chart
  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas || stockData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Chart dimensions
    const padding = 60;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate price range
    const prices = stockData.map(d => d.price);
    const minPrice = Math.min(...prices) - 10;
    const maxPrice = Math.max(...prices) + 10;
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      
      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${price.toFixed(0)}`, padding - 10, y + 4);
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw price line
    if (stockData.length > 1) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();

      stockData.forEach((data, index) => {
        const x = padding + (chartWidth / (stockData.length - 1)) * index;
        const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw data points
      ctx.fillStyle = '#22c55e';
      stockData.forEach((data, index) => {
        const x = padding + (chartWidth / (stockData.length - 1)) * index;
        const y = padding + chartHeight - ((data.price - minPrice) / priceRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw prediction points
    predictions.forEach(prediction => {
      const x = padding + chartWidth - 20; // Near the end
      const y = padding + chartHeight - ((prediction.price - minPrice) / priceRange) * chartHeight;
      
      ctx.fillStyle = prediction.type === 'buy' ? '#22c55e' : '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add prediction label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${prediction.type.toUpperCase()} ₹${prediction.price}`, 
        x, 
        y - 15
      );
    });
  };

  useEffect(() => {
    setIsMarketOpen(checkMarketHours());
    
    // Initialize with some data
    const initialData: StockData[] = [];
    for (let i = 0; i < 20; i++) {
      const price = 2850 + (Math.random() - 0.5) * 40;
      initialData.push({
        time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString('en-IN'),
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 8000) + 4000
      });
    }
    setStockData(initialData);

    // Start live updates if market is open
    const interval = setInterval(() => {
      if (checkMarketHours()) {
        generateStockData();
      }
      setIsMarketOpen(checkMarketHours());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drawChart();
  }, [stockData, predictions]);

  const priceChange = stockData.length > 1 ? 
    currentPrice - stockData[stockData.length - 2].price : 0;
  const priceChangePercent = stockData.length > 1 ? 
    (priceChange / stockData[stockData.length - 2].price) * 100 : 0;

  return (
    <div className="free-trial-page">
      {/* Header */}
      <header className="trial-header">
        <div className="trial-nav">
          <div className="nav-logo">
            <img src="/Stock Scope.png" alt="Stock Scope Logo" className="logo-image" />
            <span className="logo-text">Stock Scope</span>
          </div>
          <div className="trial-status">
            <span className="trial-badge">Free Trial Active</span>
          </div>
        </div>
      </header>

      <div className="trial-container">
        {/* Stock Info */}
        <div className="stock-header">
          <div className="stock-info">
            <h1 className="stock-name">Reliance Industries Ltd.</h1>
            <p className="stock-symbol">BSE: RELIANCE</p>
          </div>
          <div className="stock-price">
            <div className="current-price">₹{currentPrice.toFixed(2)}</div>
            <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}₹{priceChange.toFixed(2)} 
              ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </div>
          </div>
          <div className="market-status">
            <div className={`status-indicator ${isMarketOpen ? 'open' : 'closed'}`}>
              {isMarketOpen ? 'Market Open' : 'Market Closed'}
            </div>
            <div className="market-time">BSE: 9:15 AM - 3:30 PM IST</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-header">
            <h2>Live Price Chart</h2>
            <div className="chart-controls">
              <button className="time-btn active">Live</button>
              <button className="time-btn">1D</button>
              <button className="time-btn">1W</button>
              <button className="time-btn">1M</button>
            </div>
          </div>
          <div className="chart-container">
            <canvas ref={chartRef} className="price-chart"></canvas>
          </div>
        </div>

        {/* Prediction Section */}
        <div className="prediction-section">
          <h2>AI Prediction Analysis</h2>
          <div className="prediction-buttons">
            <button 
              className="prediction-btn buy-btn"
              onClick={() => handlePrediction('buy')}
              disabled={predictionLoading !== null}
            >
              {predictionLoading === 'buy' ? (
                <div className="loading-spinner"></div>
              ) : (
                <Icons.TrendingUp />
              )}
              <span>Predict BUY Signal</span>
            </button>
            <button 
              className="prediction-btn sell-btn"
              onClick={() => handlePrediction('sell')}
              disabled={predictionLoading !== null}
            >
              {predictionLoading === 'sell' ? (
                <div className="loading-spinner"></div>
              ) : (
                <Icons.TrendingDown />
              )}
              <span>Predict SELL Signal</span>
            </button>
          </div>

          {lastPrediction && (
            <div className="prediction-result">
              <div className="result-header">
                <Icons.Target />
                <h3>Latest Prediction</h3>
              </div>
              <div className="result-content">
                <div className="prediction-type">
                  <span className={`type-badge ${lastPrediction.type}`}>
                    {lastPrediction.type.toUpperCase()}
                  </span>
                  <span className="prediction-price">₹{lastPrediction.price}</span>
                </div>
                <div className="confidence-meter">
                  <div className="confidence-label">Confidence</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${lastPrediction.confidence}%` }}
                    ></div>
                  </div>
                  <div className="confidence-value">{lastPrediction.confidence}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accuracy Section */}
        <div className="accuracy-section">
          <h2>Prediction Accuracy & Performance</h2>
          <div className="accuracy-grid">
            <div className="accuracy-card">
              <div className="accuracy-icon">
                <Icons.Target />
              </div>
              <div className="accuracy-content">
                <div className="accuracy-number">92.3%</div>
                <div className="accuracy-label">Overall Accuracy</div>
                <div className="accuracy-detail">Last 30 days</div>
              </div>
            </div>
            <div className="accuracy-card">
              <div className="accuracy-icon">
                <Icons.TrendingUp />
              </div>
              <div className="accuracy-content">
                <div className="accuracy-number">156</div>
                <div className="accuracy-label">Successful Predictions</div>
                <div className="accuracy-detail">This month</div>
              </div>
            </div>
            <div className="accuracy-card">
              <div className="accuracy-icon">
                <Icons.Chart />
              </div>
              <div className="accuracy-content">
                <div className="accuracy-number">₹2.4L</div>
                <div className="accuracy-label">Average Profit</div>
                <div className="accuracy-detail">Per prediction</div>
              </div>
            </div>
            <div className="accuracy-card">
              <div className="accuracy-icon">
                <Icons.Clock />
              </div>
              <div className="accuracy-content">
                <div className="accuracy-number">4.2 hrs</div>
                <div className="accuracy-label">Avg. Time to Target</div>
                <div className="accuracy-detail">Price achievement</div>
              </div>
            </div>
          </div>

          <div className="accuracy-details">
            <h3>Recent Prediction History</h3>
            <div className="prediction-history">
              {predictions.slice(-5).reverse().map((prediction, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">{prediction.time}</div>
                  <div className={`history-type ${prediction.type}`}>
                    {prediction.type.toUpperCase()}
                  </div>
                  <div className="history-price">₹{prediction.price}</div>
                  <div className="history-confidence">{prediction.confidence}%</div>
                  <div className="history-status success">
                    <Icons.Check />
                    Achieved
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrial;