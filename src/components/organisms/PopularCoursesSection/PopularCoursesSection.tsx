'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';

import CourseCard from '@/components/molecules/CourseCard';
import Button from '@/components/atoms/Button';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCourses } from '@/store/courses.slice';

import './index.css';

export default function PopularCoursesSection() {
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    // Fetch courses if not already loaded
    if (courses.length === 0 && !loading) {
      dispatch(fetchCourses({ page: 1, limit: 20 }));
    }
  }, [dispatch, courses.length, loading]);

  const popularCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    // Get courses sorted by rating and enrollment count
    return [...courses]
      .sort((a, b) => {
        const ratingDiff = Number(b.rating) - Number(a.rating);
        if (ratingDiff !== 0) return ratingDiff;
        return Number(b.enrollmentCount) - Number(a.enrollmentCount);
      })
      .slice(0, 8);
  }, [courses]);

  if (loading) {
    return (
      <section className="popular-courses-section">
        <div className="popular-courses-container">
          <div className="popular-courses-loading">
            <div className="popular-courses-spinner"></div>
            <p>Loading popular courses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="popular-courses-section">
        <div className="popular-courses-container">
          <div className="popular-courses-error">
            <p>Failed to load courses: {error}</p>
            <Button onClick={() => dispatch(fetchCourses({ page: 1, limit: 20 }))} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-courses-section">
      <div className="popular-courses-container">
        <div className="popular-courses-header">
          <h2 className="popular-courses-title">Popular Courses</h2>
          <p className="popular-courses-subtitle">
            Most loved courses by our community
          </p>
        </div>

        {popularCourses && popularCourses.length > 0 ? (
          <>
            <div className="popular-courses-grid">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>

            <div className="popular-courses-footer">
              <Link href="/courses">
                <Button variant="primary" size="lg">
                  View All Courses
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="popular-courses-empty">
            <p>No popular courses available at the moment.</p>
            <Link href="/courses">
              <Button variant="primary">Browse All Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
