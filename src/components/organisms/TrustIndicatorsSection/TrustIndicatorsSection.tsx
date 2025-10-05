import React from 'react';
import './index.css';

export interface TrustIndicator {
  value: string;
  label: string;
}

export interface TrustIndicatorsSectionProps {
  indicators: TrustIndicator[];
}

export default function TrustIndicatorsSection({ indicators }: TrustIndicatorsSectionProps) {
  return (
    <section className="trust-indicators-section">
      <div className="trust-indicators-container">
        <div className="indicators-grid">
          {indicators.map((indicator, index) => (
            <div key={index} className="indicator-item">
              <div className="indicator-value">{indicator.value}</div>
              <div className="indicator-label">{indicator.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
