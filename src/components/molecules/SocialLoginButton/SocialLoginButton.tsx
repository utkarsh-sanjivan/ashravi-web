import React from 'react';
import { GoogleIcon, FacebookIcon, AppleIcon } from '@/components/icons';
import './index.css';

export interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick: () => void;
  disabled?: boolean;
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: GoogleIcon,
    bgColor: '#ffffff',
    textColor: '#000000',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    bgColor: '#1877F2',
    textColor: '#ffffff',
  },
  apple: {
    name: 'Apple',
    icon: AppleIcon,
    bgColor: '#000000',
    textColor: '#ffffff',
  },
};

export default function SocialLoginButton({
  provider,
  onClick,
  disabled = false,
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];
  const IconComponent = config.icon;

  return (
    <button
      type="button"
      className="social-login-button"
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      <span className="social-icon">
        <IconComponent width={20} height={20} />
      </span>
      <span className="social-text">Continue with {config.name}</span>
    </button>
  );
}
