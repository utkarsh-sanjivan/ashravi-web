import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { ChevronDownIcon } from '@/components/icons';
import './index.css';

export interface HeroSectionProps {
  headline: string;
  subheadline: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  backgroundVideo?: string;
  backgroundImage?: string;
  backgroundImageTablet?: string;
  backgroundImageMobile?: string;
}

export default function HeroSection({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  backgroundVideo,
  backgroundImage,
  backgroundImageTablet,
  backgroundImageMobile,
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      {/* Background Video or Image */}
      {backgroundVideo && (
        <video
          className="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {!backgroundVideo && backgroundImage && (
        <>
          {/* Desktop Image - 16:9 aspect ratio */}
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet={backgroundImage}
            />
            <source
              media="(min-width: 768px)"
              srcSet={backgroundImageTablet || backgroundImage}
            />
            <source
              media="(max-width: 767px)"
              srcSet={backgroundImageMobile || backgroundImageTablet || backgroundImage}
            />
            <img
              src={backgroundImage}
              alt="Hero background"
              className="hero-background-image"
            />
          </picture>
        </>
      )}

      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-headline">
            {headline}
          </h1>
          <p className="hero-subheadline">
            {subheadline}
          </p>
          
          <div className="hero-cta-group">
            <Link href={primaryCTA.href}>
              <Button variant="primary" size="lg">
                {primaryCTA.text}
              </Button>
            </Link>
            <Link href={secondaryCTA.href}>
              <Button variant="outline" size="lg" className="hero-outline-btn">
                {secondaryCTA.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <ChevronDownIcon className="scroll-icon animate-bounce" />
      </div>
    </section>
  );
}
