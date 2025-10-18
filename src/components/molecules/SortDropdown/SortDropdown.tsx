'use client';

import { useState, useRef, useEffect } from 'react';

import type { SortOption } from '@/types';

import './index.css';

export interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical-asc', label: 'A - Z' },
  { value: 'alphabetical-desc', label: 'Z - A' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="sort-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sort-dropdown-button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Sort courses"
      >
        <span className="sort-dropdown-label">Sort:</span>
        <span className="sort-dropdown-value">{selectedOption?.label}</span>
        <svg
          className={`sort-dropdown-icon ${isOpen ? 'sort-dropdown-icon--open' : ''}`}
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

      {isOpen && (
        <div className="sort-dropdown-menu">
          <ul role="listbox" className="sort-dropdown-list">
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`sort-dropdown-option ${
                    option.value === value ? 'sort-dropdown-option--selected' : ''
                  }`}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
