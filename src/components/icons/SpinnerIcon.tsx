import React from 'react';

export interface SpinnerIconProps {
  size?: number
}

export default function SpinnerIcon({ size = 24 }: SpinnerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path
        d="M12 2a10 10 0 0110 10"
        strokeLinecap="round"
      />
    </svg>
  );
}
