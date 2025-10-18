'use client';

import { useState } from 'react';

import type { FilterState } from '@/types';

import './index.css';

export interface CourseFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function CourseFilters({
  filters,
  onFilterChange,
}: CourseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (value: number) => {
    updateFilter('priceRange', [0, value] as [number, number]);
  };

  const handleDurationToggle = (duration: string) => {
    const newDuration = filters.duration.includes(duration)
      ? filters.duration.filter((d: any) => d !== duration)
      : [...filters.duration, duration];
    updateFilter('duration', newDuration);
  };

  const handleLevelToggle = (level: string) => {
    const newLevel = filters.level.includes(level)
      ? filters.level.filter((l: any) => l !== level)
      : [...filters.level, level];
    updateFilter('level', newLevel);
  };

  const sliderPercentage = (filters.priceRange[1] / 200) * 100;

  return (
    <div className="course-filters">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="course-filters-toggle"
        aria-expanded={isExpanded}
        aria-controls="filters-content"
      >
        <span className="course-filters-toggle-text">Filters</span>
        <svg
          className={`course-filters-toggle-icon ${isExpanded ? 'course-filters-toggle-icon--expanded' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filters Content */}
      <div
        id="filters-content"
        className={`course-filters-content ${isExpanded ? 'course-filters-content--expanded' : ''}`}
      >
        {/* Price Range */}
        <div className="course-filters-section">
          <h3 className="course-filters-heading">Price Range</h3>
          <div className="course-filters-options">
            <label className="course-filters-checkbox-label">
              <input
                type="checkbox"
                checked={filters.isFree}
                onChange={(e) => updateFilter('isFree', e.target.checked)}
                className="course-filters-checkbox"
              />
              <span className="course-filters-checkbox-text">Free Courses</span>
            </label>

            {!filters.isFree && (
              <div className="course-filters-slider-container">
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="course-filters-slider"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${sliderPercentage}%, var(--color-border) ${sliderPercentage}%, var(--color-border) 100%)`,
                  }}
                />
                <div className="course-filters-slider-labels">
                  <span className="course-filters-slider-label">0</span>
                  <span className="course-filters-slider-value">
                    {filters.priceRange[1]}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="course-filters-section">
          <h3 className="course-filters-heading">Duration</h3>
          <div className="course-filters-options">
            {[
              { value: 'under-2', label: 'Under 2 hours' },
              { value: '2-5', label: '2-5 hours' },
              { value: '5-plus', label: '5+ hours' },
            ].map((option) => (
              <label key={option.value} className="course-filters-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.duration.includes(option.value)}
                  onChange={() => handleDurationToggle(option.value)}
                  className="course-filters-checkbox"
                />
                <span className="course-filters-checkbox-text">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="course-filters-section">
          <h3 className="course-filters-heading">Level</h3>
          <div className="course-filters-options">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <label key={level} className="course-filters-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.level.includes(level)}
                  onChange={() => handleLevelToggle(level)}
                  className="course-filters-checkbox"
                />
                <span className="course-filters-checkbox-text course-filters-checkbox-text--capitalize">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="course-filters-section">
          <h3 className="course-filters-heading">Minimum Rating</h3>
          <div className="course-filters-options">
            {[
              { value: 4.5, label: '4.5+ Stars' },
              { value: 4.0, label: '4+ Stars' },
            ].map((option) => (
              <label key={option.value} className="course-filters-radio-label">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === option.value}
                  onChange={() => updateFilter('rating', option.value)}
                  className="course-filters-radio"
                />
                <span className="course-filters-radio-text">{option.label}</span>
              </label>
            ))}
            <label className="course-filters-radio-label">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === null}
                onChange={() => updateFilter('rating', null)}
                className="course-filters-radio"
              />
              <span className="course-filters-radio-text">All Ratings</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
