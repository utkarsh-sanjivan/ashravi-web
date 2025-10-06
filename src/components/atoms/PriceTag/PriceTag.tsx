import React from 'react';
import './index.css';

export interface PriceTagProps {
  currentPrice: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscount?: boolean;
}

export default function PriceTag({
  currentPrice,
  originalPrice,
  currency = '₹',
  size = 'md',
  showDiscount = true,
}: PriceTagProps) {
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className={`price-tag price-tag-${size}`}>
      {hasDiscount && showDiscount && (
        <div className="price-discount-badge">
          {discountPercentage}% OFF
        </div>
      )}
      
      <div className="price-row">
        <span className="price-current">
          {currency}{currentPrice.toFixed(2)}
        </span>
        
        {hasDiscount && (
          <span className="price-original">
            {currency}{originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      {hasDiscount && (
        <div className="price-savings">
          Save {currency}{(originalPrice - currentPrice).toFixed(2)}
        </div>
      )}
    </div>
  );
}
