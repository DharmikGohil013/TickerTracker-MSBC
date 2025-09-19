import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons/Icons';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <div className="logo-icon">
              <img src="/Stock Scope.png" alt="Stock Scope Logo" className="w-8 h-8" />
            </div>
            <span className="logo-text" style={{ color: '#87CEEB' }}>Stock Scope</span>
          </div>

          {/* Auth Buttons */}
          <div className="nav-auth">
            <Link to="/login" className="nav-btn nav-btn-outline">
              Sign In
            </Link>
            <Link to="/register" className="nav-btn nav-btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Icons.TrendingUp />
              <span>AI-Powered Market Analysis</span>
            </div>
            <h1 className="hero-title">
              Master the Stock Market with
              <span className="hero-gradient-text"> AI Predictions</span>
            </h1>
            <p className="hero-description">
              Stock Scope uses advanced machine learning algorithms to analyze market trends, 
              predict stock movements, and help you make informed investment decisions. 
              Get real-time insights, comprehensive analytics, and personalized recommendations.
            </p>
            <div className="hero-buttons">
              <Link to="/free-trial" className="hero-btn hero-btn-primary">
                Start Free Trial
                <Icons.TrendingUp />
              </Link>
              <button className="hero-btn hero-btn-secondary">
                <Icons.Chart />
                Watch Demo
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">AAPL - Apple Inc.</div>
                <div className="chart-price">$175.43 <span className="price-change">+2.34%</span></div>
              </div>
              <div className="mock-chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10 150 L 50 140 L 90 160 L 130 120 L 170 110 L 210 130 L 250 100 L 290 90 L 330 80 L 370 70"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M 10 150 L 50 140 L 90 160 L 130 120 L 170 110 L 210 130 L 250 100 L 290 90 L 330 80 L 370 70 L 370 200 L 10 200 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
              </div>
              <div className="prediction-badge">
                <Icons.TrendingUp />
                <span>AI Prediction: +5.2% in 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">How Stock Scope Works</h2>
            <p className="section-description">
              Our platform combines cutting-edge AI technology with comprehensive market data 
              to provide you with actionable insights and predictions.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Icons.Search />
              </div>
              <h3 className="feature-title">Smart Stock Discovery</h3>
              <p className="feature-description">
                Discover trending stocks and hidden gems using our AI-powered screening tools. 
                Filter by sector, market cap, performance metrics, and more.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icons.Chart />
              </div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-description">
                Analyze stocks with comprehensive charts, technical indicators, and fundamental data. 
                Get insights into price patterns, volume analysis, and market sentiment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icons.TrendingUp />
              </div>
              <h3 className="feature-title">AI Predictions</h3>
              <p className="feature-description">
                Our machine learning models analyze historical data, news sentiment, and market indicators 
                to predict future price movements with high accuracy.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icons.Heart />
              </div>
              <h3 className="feature-title">Smart Watchlists</h3>
              <p className="feature-description">
                Create intelligent watchlists that automatically track your favorite stocks and 
                send alerts when our AI detects significant opportunities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icons.Portfolio />
              </div>
              <h3 className="feature-title">Portfolio Management</h3>
              <p className="feature-description">
                Track your investments with real-time portfolio analysis, performance metrics, 
                and personalized recommendations for optimization.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icons.News />
              </div>
              <h3 className="feature-title">Market Intelligence</h3>
              <p className="feature-description">
                Stay informed with curated market news, earnings reports, and analyst insights 
                that could impact your investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Showcase */}
      <section className="prediction-section">
        <div className="prediction-container">
          <div className="section-header">
            <h2 className="section-title">AI Prediction Examples</h2>
            <p className="section-description">
              See how our AI has successfully predicted market movements and helped investors 
              make profitable decisions.
            </p>
          </div>

          <div className="prediction-grid">
            <div className="prediction-card">
              <div className="prediction-header">
                <div className="stock-info">
                  <div className="stock-symbol">TSLA</div>
                  <div className="stock-name">Tesla Inc.</div>
                </div>
                <div className="prediction-result success">
                  <Icons.TrendingUp />
                  <span>+12.4% Achieved</span>
                </div>
              </div>
              <div className="prediction-chart">
                <svg viewBox="0 0 300 120" className="mini-chart">
                  <path
                    d="M 10 80 L 50 75 L 90 85 L 130 70 L 170 60 L 210 50 L 250 45 L 290 40"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="prediction-details">
                <div className="prediction-meta">
                  <span>Predicted: +10.5% in 14 days</span>
                  <span>Actual: +12.4% in 12 days</span>
                </div>
              </div>
            </div>

            <div className="prediction-card">
              <div className="prediction-header">
                <div className="stock-info">
                  <div className="stock-symbol">NVDA</div>
                  <div className="stock-name">NVIDIA Corp.</div>
                </div>
                <div className="prediction-result success">
                  <Icons.TrendingUp />
                  <span>+8.7% Achieved</span>
                </div>
              </div>
              <div className="prediction-chart">
                <svg viewBox="0 0 300 120" className="mini-chart">
                  <path
                    d="M 10 90 L 50 85 L 90 80 L 130 75 L 170 70 L 210 65 L 250 60 L 290 55"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="prediction-details">
                <div className="prediction-meta">
                  <span>Predicted: +7.2% in 21 days</span>
                  <span>Actual: +8.7% in 18 days</span>
                </div>
              </div>
            </div>

            <div className="prediction-card">
              <div className="prediction-header">
                <div className="stock-info">
                  <div className="stock-symbol">MSFT</div>
                  <div className="stock-name">Microsoft Corp.</div>
                </div>
                <div className="prediction-result success">
                  <Icons.TrendingUp />
                  <span>+6.3% Achieved</span>
                </div>
              </div>
              <div className="prediction-chart">
                <svg viewBox="0 0 300 120" className="mini-chart">
                  <path
                    d="M 10 85 L 50 82 L 90 78 L 130 75 L 170 72 L 210 68 L 250 65 L 290 62"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="prediction-details">
                <div className="prediction-meta">
                  <span>Predicted: +5.8% in 30 days</span>
                  <span>Actual: +6.3% in 28 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="accuracy-stats">
            <div className="stat-item">
              <div className="stat-number">92%</div>
              <div className="stat-label">Prediction Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Successful Predictions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$2.3M+</div>
              <div className="stat-label">User Profits Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Trading?</h2>
            <p className="cta-description">
              Join thousands of successful investors who use Stock Scope to make smarter, 
              data-driven investment decisions. Start your free trial today.
            </p>
            <div className="cta-buttons">
              <Link to="/free-trial" className="cta-btn cta-btn-primary">
                Start Free Trial
                <Icons.TrendingUp />
              </Link>
              <div className="cta-features">
                <div className="cta-feature">
                  <Icons.Check />
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <Icons.Check />
                  <span>14-day free trial</span>
                </div>
                <div className="cta-feature">
                  <Icons.Check />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">
                <img src="/Stock Scope.png" alt="Stock Scope Logo" />
              </div>
              <span className="logo-text">Stock Scope</span>
            </div>
            <p className="footer-description">
              Empowering investors with AI-driven market insights and predictions.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#api">API</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#disclaimer">Disclaimer</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Stock Scope. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;