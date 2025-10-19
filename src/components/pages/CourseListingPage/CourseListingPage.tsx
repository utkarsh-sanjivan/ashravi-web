'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import PublicNavbar from '@/components/organisms/PublicNavbar';
import Footer from '@/components/organisms/Footer';
import CourseFilters from '@/components/organisms/CourseFilters';
import CourseGrid from '@/components/organisms/CourseGrid';
import CoursesSearchBar from '@/components/molecules/CoursesSearchBar';
import SortDropdown from '@/components/molecules/SortDropdown';
import Pagination from '@/components/molecules/Pagination';
import Button from '@/components/atoms/Button';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCourses, searchCourses, setCurrentPage } from '@/store/courses.slice';

import type { FilterState, SortOption } from '@/types';

import './index.css';

const ITEMS_PER_PAGE = 20;

export default function CourseListingPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { courses, loading, error, currentPage, totalPages, totalItems } = useAppSelector(
    (state) => state.courses
  );

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    isFree: false,
    duration: [],
    level: [],
    rating: null,
  });

  // Initial load or when search query changes from navbar
  useEffect(() => {
    if (initialQuery) {
      dispatch(searchCourses(initialQuery));
      setSearchQuery(initialQuery);
    } else {
      // Load courses in alphabetical order when coming from navbar
      dispatch(
        fetchCourses({
          page: 1,
          limit: ITEMS_PER_PAGE,
        })
      );
    }
  }, [initialQuery, dispatch]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Dispatch fetch with filters
    const level = newFilters.level.length > 0 ? newFilters.level.join(',') : undefined;
    
    dispatch(
      fetchCourses({
        page: 1,
        limit: ITEMS_PER_PAGE,
        level,
        search: searchQuery || undefined,
      })
    );
  }, [dispatch, searchQuery]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      
      if (query.trim()) {
        dispatch(searchCourses(query));
      } else {
        dispatch(
          fetchCourses({
            page: 1,
            limit: ITEMS_PER_PAGE,
          })
        );
      }
    },
    [dispatch]
  );

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    // Client-side sorting for now
    // TODO: Implement server-side sorting if API supports it
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
      dispatch(
        fetchCourses({
          page,
          limit: ITEMS_PER_PAGE,
          search: searchQuery || undefined,
        })
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [dispatch, searchQuery]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 200],
      isFree: false,
      duration: [],
      level: [],
      rating: null,
    });
    setSearchQuery('');
    
    dispatch(
      fetchCourses({
        page: 1,
        limit: ITEMS_PER_PAGE,
      })
    );
  }, [dispatch]);

  // Client-side sorting of courses
  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical-asc':
        return a.title.localeCompare(b.title);
      case 'alphabetical-desc':
        return b.title.localeCompare(a.title);
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="course-listing-page">
      <PublicNavbar />

      <main className="course-listing-main">
        <div className="course-listing-container">
          {/* Header */}
          <header className="course-listing-header">
            <h1 className="course-listing-title">Explore Courses</h1>
            <p className="course-listing-subtitle">
              Find the perfect course to enhance your parenting skills and knowledge
            </p>
          </header>

          {/* Search Bar */}
          <div className="course-listing-search">
            <CoursesSearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by title, instructor, or topic..."
            />
          </div>

          {/* Filters - Top of the page */}
          <div className="course-listing-filters-section">
            <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Results Header */}
          <div className="course-listing-results-header">
            <p className="course-listing-results-count">
              {totalItems} {totalItems === 1 ? 'course' : 'courses'} found
            </p>
            <SortDropdown value={sortBy} onChange={handleSortChange} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="course-listing-loading">
              <div className="course-listing-spinner"></div>
              <p>Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="course-listing-error">
              <p className="course-listing-error-text">{error}</p>
              <Button onClick={handleResetFilters} variant="primary">
                Try Again
              </Button>
            </div>
          )}

          {/* Course Grid */}
          {!loading && !error && sortedCourses.length > 0 && (
            <>
              <CourseGrid courses={sortedCourses} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="course-listing-pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && sortedCourses.length === 0 && (
            <div className="course-listing-empty">
              <div className="course-listing-empty-content">
                <h3 className="course-listing-empty-title">No courses found</h3>
                <p className="course-listing-empty-text">
                  We couldn't find any courses matching your criteria. Try adjusting
                  your filters or search query.
                </p>
                <Button onClick={handleResetFilters} variant="primary">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
