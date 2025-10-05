import React from 'react';
import NextLink from 'next/link';
import './index.css';

export interface LinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  underline?: boolean;
  external?: boolean;
  className?: string;
}

export default function Link({
  href,
  children,
  variant = 'default',
  underline = false,
  external = false,
  className = '',
}: LinkProps) {
  const linkClassName = `link link-${variant} ${underline ? 'link-underline' : ''} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClassName}>
      {children}
    </NextLink>
  );
}
