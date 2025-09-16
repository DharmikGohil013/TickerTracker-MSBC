import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons/Icons';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <div className="auth-gradient"></div>
          <div className="auth-pattern"></div>
        </div>
        
        <div className="auth-content">
          {/* Left Panel - Branding */}
          <div className="auth-branding">
            <div className="brand-content">
              <div className="brand-logo">
                <Icons.Logo />
                <h1 className="brand-title">TicketTracker</h1>
              </div>
              <p className="brand-subtitle">
                Professional Financial Market Analysis
              </p>
              
              <div className="brand-features">
                <div className="feature-item">
                  <Icons.TrendingUp />
                  <span>Real-time market data</span>
                </div>
                <div className="feature-item">
                  <Icons.Lock />
                  <span>Secure portfolio tracking</span>
                </div>
                <div className="feature-item">
                  <Icons.Chart />
                  <span>Advanced analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Success Message */}
          <div className="auth-form-panel">
            <div className="auth-form-container">
              <div className="form-header text-center">
                <div className="success-icon-circle">
                  <Icons.Email />
                </div>
                <h2 className="form-title">Check your email</h2>
                <p className="form-subtitle">
                  We've sent a password reset link to {email}
                </p>
              </div>

              <div className="form-footer">
                <Link to="/login" className="signup-link">
                  ← Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-content">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <Icons.Logo />
              <h1 className="brand-title">TicketTracker</h1>
            </div>
            <p className="brand-subtitle">
              Professional Financial Market Analysis
            </p>
            
            <div className="brand-features">
              <div className="feature-item">
                <Icons.TrendingUp />
                <span>Real-time market data</span>
              </div>
              <div className="feature-item">
                <Icons.Lock />
                <span>Secure portfolio tracking</span>
              </div>
              <div className="feature-item">
                <Icons.Chart />
                <span>Advanced analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div className="form-header">
              <h2 className="form-title">Reset Password</h2>
              <p className="form-subtitle">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Icons.Email />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                  />
                </div>
                {error && (
                  <div className="error-text">{error}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <Icons.LoadingSpinner />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    <Icons.Email />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="signup-prompt">
                Remember your password?{' '}
                <Link to="/login" className="signup-link">
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;