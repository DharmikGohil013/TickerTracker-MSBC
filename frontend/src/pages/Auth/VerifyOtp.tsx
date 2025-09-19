import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../../components/Icons/Icons';
import './Auth.css';

interface VerifyOtpProps {
  email: string;
  onVerificationSuccess: (token: string) => void;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ email, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and redirect to dashboard
        if (data.token) {
          localStorage.setItem('token', data.token);
          onVerificationSuccess(data.token);
        }
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendTimer(60);
        setCanResend(false);
        setError('');
        setOtp(['', '', '', '', '', '']);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="auth-content">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <Icons.Logo />
              <h1 className="brand-title">Stock Scope</h1>
            </div>
            <p className="brand-subtitle">
              Verify your email to complete registration
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <Icons.Email />
                <span>Secure Email Verification</span>
              </div>
              <div className="feature-item">
                <Icons.Lock />
                <span>Account Protection</span>
              </div>
              <div className="feature-item">
                <Icons.Check />
                <span>Quick Setup Process</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - OTP Form */}
        <div className="auth-form-panel">
          <div className="auth-form-container">
            <div className="form-header">
              <h2 className="form-title">Verify Your Email</h2>
              <p className="form-subtitle">
                We've sent a 6-digit verification code to<br />
                <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="error-alert">
                <Icons.X />
                <span>{error}</span>
              </div>
            )}

            <div className="otp-container">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="otp-input"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={isVerifying || otp.some(digit => !digit)}
                className="submit-button"
              >
                {isVerifying ? (
                  <>
                    <Icons.Loading />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              <div className="resend-section">
                <p className="resend-text">
                  Didn't receive the code?{' '}
                  {canResend ? (
                    <button
                      onClick={resendOtp}
                      className="resend-button"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span className="resend-timer">
                      Resend in {resendTimer}s
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;