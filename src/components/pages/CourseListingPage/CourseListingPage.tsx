'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import PublicNavbar from '@/components/organisms/PublicNavbar';
import Footer from '@/components/organisms/Footer';
import CourseFilters from '@/components/organisms/CourseFilters';
import CourseGrid from '@/components/organisms/CourseGrid';
import CoursesSearchBar from '@/components/molecules/CoursesSearchBar';
import SortDropdown from '@/components/molecules/SortDropdown';
import Pagination from '@/components/molecules/Pagination';
import Button from '@/components/atoms/Button';

import { getCourses } from '@/lib/api';

import type { Course, FilterState, SortOption } from '@/types';

import './index.css';

const ITEMS_PER_PAGE = 20;

export default function CourseListingPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    isFree: false,
    duration: [],
    level: [],
    rating: null,
  });

  const allCourses = useMemo(() => getCourses(), []);

  // Filter courses
  const filteredCourses = useMemo(() => {
    let filtered = [...allCourses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (filters.isFree) {
      filtered = filtered.filter((course) => course.price === 0);
    } else {
      filtered = filtered.filter(
        (course) =>
          course.price >= filters.priceRange[0] &&
          course.price <= filters.priceRange[1]
      );
    }

    // Duration filter
    if (filters.duration.length > 0) {
      filtered = filtered.filter((course) => {
        if (filters.duration.includes('under-2') && course.duration < 2) return true;
        if (
          filters.duration.includes('2-5') &&
          course.duration >= 2 &&
          course.duration <= 5
        )
          return true;
        if (filters.duration.includes('5-plus') && course.duration > 5) return true;
        return false;
      });
    }

    // Level filter
    if (filters.level.length > 0) {
      filtered = filtered.filter((course) =>
        filters.level.includes(course.level.toLowerCase())
      );
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter((course) => course.rating >= filters.rating!);
    }

    return filtered;
  }, [allCourses, searchQuery, filters]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses];

    switch (sortBy) {
      case 'alphabetical-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'alphabetical-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [filteredCourses, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedCourses, currentPage]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 200],
      isFree: false,
      duration: [],
      level: [],
      rating: null,
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

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
              {filteredCourses.length}{' '}
              {filteredCourses.length === 1 ? 'course' : 'courses'} found
            </p>
            <SortDropdown value={sortBy} onChange={handleSortChange} />
          </div>

          {/* Course Grid */}
          {paginatedCourses.length > 0 ? (
            <>
              <CourseGrid courses={paginatedCourses} />

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
          ) : (
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
