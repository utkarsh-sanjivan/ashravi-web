import React from 'react';
import './index.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`card card-padding-${padding} ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
