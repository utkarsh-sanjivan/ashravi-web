'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/icons';
import { useLazyCoursesListQuery } from '@/store/api/courses.api';
import './index.css';

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = 'Search for courses...',
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [fetchSuggestions, { data: suggestionData, isFetching }] = useLazyCoursesListQuery();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);
    const debounceTimer = setTimeout(() => {
      fetchSuggestions({ search: trimmed, limit: 5 });
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    if (suggestionData?.data) {
      const mapped: SearchSuggestion[] = suggestionData.data.slice(0, 5).map((course) => ({
        id: course.id,
        title: course.title,
        category: course.category ?? 'Course',
      }));

      setSuggestions(mapped);
      setShowSuggestions(true);
    }

    if (!isFetching) {
      setIsLoading(false);
    }
  }, [suggestionData, isFetching]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/courses?q=${encodedQuery}&page=1&limit=20`);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-bar-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-bar-input"
        />
        <button
          type="submit"
          className="search-bar-button"
          aria-label="Search"
        >
          <SearchIcon className="search-icon" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <SearchIcon className="suggestion-icon" />
              <div className="suggestion-content">
                <span className="suggestion-title">{suggestion.title}</span>
                <span className="suggestion-category">{suggestion.category}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="search-suggestions">
          <div className="no-suggestions">No courses found</div>
        </div>
      )}
    </div>
  );
}
