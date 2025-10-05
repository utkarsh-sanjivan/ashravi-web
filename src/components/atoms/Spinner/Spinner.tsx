import React from 'react';
import './index.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export default function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
