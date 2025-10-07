'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import SocialLoginButton from '@/components/molecules/SocialLoginButton';
import { 
  MailIcon, 
  PhoneIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon 
} from '@/components/icons';
import './index.css';

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 - Basic Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Step 1 Errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  // Step 2 - Parent Profile Data
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [economicStatus, setEconomicStatus] = useState('middle');

  // Step 2 Errors
  const [occupationError, setOccupationError] = useState('');
  const [cityError, setCityError] = useState('');
  const [economicStatusError, setEconomicStatusError] = useState('');

  // Step 3 - Verification
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Util function
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  // Effects for resend timer
  useEffect(() => {
    if (resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1 submit handler
  const handleStep1Submit = e => {
    e.preventDefault();
    setFullNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');

    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError('Full Name is required.');
      hasError = true;
    }

    if (!email || !validateEmail(email)) {
      setEmailError('Valid Email is required.');
      hasError = true;
    }

    if (!phone || phone.length < 10) {
      setPhoneError('Valid Phone number is required.');
      hasError = true;
    }

    if (password.length < 8) {
      setPasswordError('Password should be at least 8 characters.');
      hasError = true;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (!agreeTerms || !agreePrivacy) {
      setTermsError('You must agree to Terms and Privacy Policy.');
      hasError = true;
    }

    if (!hasError) {
      setCurrentStep(2);
    }
  };

  // Step 2 submit handler
  const handleStep2Submit = e => {
    e.preventDefault();
    setOccupationError('');
    setCityError('');
    setEconomicStatusError('');

    let hasError = false;

    if (!occupation.trim()) {
      setOccupationError('Occupation is required.');
      hasError = true;
    }

    if (!city.trim()) {
      setCityError('City is required.');
      hasError = true;
    }

    if (!economicStatus) {
      setEconomicStatusError('Please select your economic status.');
      hasError = true;
    }

    if (!hasError) {
      setCurrentStep(3);
      setResendTimer(30);
    }
  };

  // Step 3 submit handler (OTP verify)
  const handleOtpSubmit = e => {
    e.preventDefault();
    setOtpError('');

    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">

          {/* Ashravi Header and Description */}
          <section className="signup-header">
            <h1 className="signup-title">Ashravi</h1>
            <p className="signup-subtitle">
              Transform Your Parenting Journey with Evidence-Based Strategies
            </p>
            <p className="signup-description">
              Join thousands of parents to access courses, tracking, and expert guidance.
            </p>
          </section>

          {/* Stepper with step names */}
          <div className="signup-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-badge">1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="step-line" />
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-badge">2</div>
              <div className="step-label">Profile</div>
            </div>
            <div className="step-line" />
            <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-badge">3</div>
              <div className="step-label">Verify</div>
            </div>
          </div>

          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="signup-form">
              <Input
                id="fullName"
                label="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                error={fullNameError}
                required
                fullWidth
              />
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={emailError}
                required
                fullWidth
              />
              <div className="phone-group">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="select-field"
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>
                <Input
                  id="phone"
                  label="Phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  error={phoneError}
                  required
                  fullWidth
                />
              </div>
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={passwordError}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="password-toggle">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                required
                fullWidth
              />
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="password-toggle">
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
                required
                fullWidth
              />
              <div className="terms-group">
                <Checkbox
                  id="terms"
                  label={<span>I agree to the <Link href="/terms" target="_blank">Terms of Service</Link></span>}
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  required
                />
                <Checkbox
                  id="privacy"
                  label={<span>I agree to the <Link href="/privacy" target="_blank">Privacy Policy</Link></span>}
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                  required
                />
                {termsError && <div className="input-error">{termsError}</div>}
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="signup-form">
              <Input
                id="occupation"
                label="Occupation"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                error={occupationError}
                required
                fullWidth
              />
              <Input
                id="city"
                label="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                error={cityError}
                required
                fullWidth
              />
              <label htmlFor="economicStatus" className="select-label">Economic Status</label>
              <select
                id="economicStatus"
                value={economicStatus}
                onChange={e => setEconomicStatus(e.target.value)}
                className={`select-field ${economicStatusError ? 'error' : ''}`}
                required
              >
                <option value="">Select</option>
                <option value="lower">Lower</option>
                <option value="middle">Middle</option>
                <option value="upper middle">Upper Middle</option>
                <option value="upper">Upper</option>
              </select>
              {economicStatusError && <div className="input-error">{economicStatusError}</div>}

              <div className="form-actions">
                <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setCurrentStep(1)}>Back</Button>
                <Button type="submit" variant="primary" size="lg" className="w-full">Continue</Button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={handleOtpSubmit} className="signup-form">
              <Input
                id="otp"
                label="Verification Code"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                error={otpError}
                maxLength={6}
                required
                fullWidth
              />
              <div className="resend-group">
                {resendTimer > 0 ? (
                  <p>Resend code in {resendTimer} seconds</p>
                ) : (
                  <button type="button" className="resend-button" onClick={() => setResendTimer(30)}>Resend Code</button>
                )}
              </div>

              <div className="form-actions">
                <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setCurrentStep(2)}>Back</Button>
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Complete Signup'}
                </Button>
              </div>
            </form>
          )}

          {/* Social Signup at Step 1 only */}
          {currentStep === 1 && (
            <>
              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">OR SIGN UP WITH</span>
                <span className="divider-line" />
              </div>

              <div className="social-signup">
                <SocialLoginButton provider="google" onClick={() => {}} />
                <SocialLoginButton provider="facebook" onClick={() => {}} />
                <SocialLoginButton provider="apple" onClick={() => {}} />
              </div>

              <div className="signup-footer">
                <p className="footer-text">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="footer-link">Login</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
