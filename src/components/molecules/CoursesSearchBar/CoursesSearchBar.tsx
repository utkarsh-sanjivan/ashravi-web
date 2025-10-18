'use client';

import { useState, useEffect, useRef } from 'react';

import './index.css';

export interface CoursesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CoursesSearchBar({
  value,
  onChange,
  placeholder = 'Search...',
}: CoursesSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="courses-search-bar">
      <div className="courses-search-bar-icon-left">
        <svg
          className="courses-search-bar-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="courses-search-bar-input"
        aria-label="Search courses"
      />

      {localValue && (
        <button
          onClick={handleClear}
          className="courses-search-bar-clear"
          aria-label="Clear search"
        >
          <svg
            className="courses-search-bar-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
