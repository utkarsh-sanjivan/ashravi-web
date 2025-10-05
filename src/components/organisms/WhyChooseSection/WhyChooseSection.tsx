import React from 'react';
import FeatureCard from '@/components/molecules/FeatureCard';
import './index.css';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface WhyChooseSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
  ctaText?: string;
  ctaHref?: string;
}

export default function WhyChooseSection({
  title,
  subtitle,
  features,
  ctaText,
  ctaHref,
}: WhyChooseSectionProps) {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {ctaText && ctaHref && (
          <div className="section-cta">
            <a href={ctaHref} className="inline-block">
              <button className="btn btn-primary btn-lg">
                {ctaText}
              </button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
