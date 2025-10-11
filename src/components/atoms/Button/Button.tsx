import React, { ButtonHTMLAttributes } from 'react';
import Spinner from '@/components/atoms/Spinner';
import './index.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-loader">
          <Spinner size={size === 'lg' ? 'md' : 'sm'} color={variant === 'outline' ? 'inherit' : 'white'} />
        </span>
      )}
      <span className={loading ? 'btn-content-loading' : ''}>{children}</span>
    </button>
  );
}
