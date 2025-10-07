'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import SocialLoginButton from '@/components/molecules/SocialLoginButton';
import { MailIcon, PhoneIcon, LockIcon, EyeIcon, EyeOffIcon } from '@/components/icons';
import './index.css';

type LoginMethod = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Phone state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    // Validation
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 'user1',
          name: 'Test User',
          email: email 
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setEmailError(data.error || 'Login failed');
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setPhoneError('');

    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return;
    }
    if (phoneNumber.length < 10) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOTP(true);
      setResendTimer(30);
      
      // Start countdown
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setPhoneError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/');
    } catch (error) {
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setIsLoading(true);
    try {
      // TODO: Implement OAuth flow
      console.log(`Login with ${provider}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Social login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <Link href="/" className="logo-link">
              <h1 className="login-logo">Ashravi</h1>
            </Link>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Login to continue your parenting journey</p>
          </div>

          {/* Method Toggle */}
          <div className="method-toggle">
            <button
              type="button"
              className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMethod('email')}
            >
              <MailIcon className="method-icon" />
              Email
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => setLoginMethod('phone')}
            >
              <PhoneIcon className="method-icon" />
              Phone
            </button>
          </div>

          {/* Email/Password Form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="login-form">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                leftIcon={<MailIcon style={{ width: 20, height: 20 }} />}
                required
                fullWidth
              />

              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                leftIcon={<LockIcon style={{ width: 20, height: 20 }} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeOffIcon style={{ width: 20, height: 20 }} />
                    ) : (
                      <EyeIcon style={{ width: 20, height: 20 }} />
                    )}
                  </button>
                }
                required
                fullWidth
              />

              <div className="form-options">
                <Checkbox
                  id="rememberMe"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Link href="/auth/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          )}

          {/* Phone/OTP Form */}
          {loginMethod === 'phone' && !showOTP && (
            <div className="login-form">
              <div className="phone-input-group">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code-select"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  error={phoneError}
                  fullWidth
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          )}

          {/* OTP Verification */}
          {loginMethod === 'phone' && showOTP && (
            <form onSubmit={handleVerifyOTP} className="login-form">
              <Input
                id="otp"
                type="text"
                label="Enter OTP"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={otpError}
                helperText={`OTP sent to ${countryCode} ${phoneNumber}`}
                maxLength={6}
                fullWidth
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {resendTimer > 0 ? (
                <p className="resend-timer">Resend code in {resendTimer} seconds</p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="resend-button"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              )}
            </form>
          )}

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">OR</span>
            <span className="divider-line" />
          </div>

          {/* Social Login */}
          <div className="social-login">
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="facebook"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="apple"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            />
          </div>

          {/* Footer Links */}
          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="footer-link">
                Sign up
              </Link>
            </p>
            <Link href="/" className="guest-link">
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
