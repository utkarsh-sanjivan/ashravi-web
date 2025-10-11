import React from 'react';
import './index.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'inherit';
}

export default function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`}>
      <div className="spinner-circle" />
    </div>
  );
}
