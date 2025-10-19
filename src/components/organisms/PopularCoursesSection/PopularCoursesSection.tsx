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
    if (courses.length === 0 && !loading) {
      dispatch(fetchCourses({ page: 1, limit: 20 }));
    }
  }, [dispatch, courses.length, loading]);

  const popularCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    // Sort alphabetically and get first 6
    return [...courses]
      .sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
      .slice(0, 6);
  }, [courses]);

  if (loading && courses.length === 0) {
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
            <p>Failed to load courses</p>
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
                course && course.id ? (
                  <CourseCard key={course.id} {...course} />
                ) : null
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
