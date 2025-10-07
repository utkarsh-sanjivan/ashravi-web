'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@/components/icons';
import './index.css';

export interface CarouselProps {
  children: React.ReactNode[];
  slidesToShow?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  gap?: number;
}

export default function Carousel({
  children,
  slidesToShow = { mobile: 1, tablet: 2, desktop: 3 },
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  gap = 24, // Reduced from 32 to 24
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(slidesToShow.desktop || 3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calculate total slides considering slides per view
  const totalSlides = children.length;
  const maxIndex = Math.max(0, totalSlides - slidesPerView);

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSlidesPerView(slidesToShow.mobile || 1);
      } else if (width < 1024) {
        setSlidesPerView(slidesToShow.tablet || 2);
      } else {
        setSlidesPerView(slidesToShow.desktop || 3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, maxIndex]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(Math.min(index, maxIndex));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Calculate slide width including gap
  const getSlideWidth = () => {
    if (!carouselRef.current) return 0;
    const containerWidth = carouselRef.current.offsetWidth;
    const totalGap = gap * (slidesPerView - 1);
    return (containerWidth - totalGap) / slidesPerView;
  };

  // Calculate transform
  const slideWidth = getSlideWidth();
  const transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;

  return (
    <div className="carousel-container">
      {/* Navigation Arrows */}
      {showArrows && totalSlides > slidesPerView && (
        <>
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <ChevronDownIcon className="arrow-icon arrow-icon-left" />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next slide"
          >
            <ChevronDownIcon className="arrow-icon arrow-icon-right" />
          </button>
        </>
      )}

      {/* Carousel Track */}
      <div className="carousel-wrapper" ref={carouselRef}>
        <div
          className="carousel-track"
          style={{
            transform,
            gap: `${gap}px`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="carousel-slide"
              style={{
                width: `${slideWidth}px`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {showDots && totalSlides > slidesPerView && (
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
