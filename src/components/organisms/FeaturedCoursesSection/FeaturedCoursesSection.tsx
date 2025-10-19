'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';

import CourseCard from '@/components/molecules/CourseCard';
import Button from '@/components/atoms/Button';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCourses } from '@/store/courses.slice';

import './index.css';

export default function FeaturedCoursesSection() {
  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (courses.length === 0 && !loading) {
      dispatch(fetchCourses({ page: 1, limit: 20 }));
    }
  }, [dispatch, courses.length, loading]);

  const featuredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    // Get first 6 courses alphabetically
    return [...courses]
      .sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
      .slice(0, 6);
  }, [courses]);

  if (loading && courses.length === 0) {
    return (
      <section className="featured-courses-section">
        <div className="featured-courses-container">
          <div className="popular-courses-loading">
            <div className="popular-courses-spinner"></div>
            <p>Loading featured courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-courses-section">
      <div className="featured-courses-container">
        <div className="featured-courses-header">
          <h2 className="featured-courses-title">Featured Courses</h2>
          <p className="featured-courses-subtitle">
            Discover our most popular courses chosen by parents like you
          </p>
        </div>

        {featuredCourses && featuredCourses.length > 0 ? (
          <>
            <div className="featured-courses-grid">
              {featuredCourses.map((course) => (
                course && course.id ? (
                  <CourseCard key={course.id} {...course} />
                ) : null
              ))}
            </div>

            <div className="featured-courses-footer">
              <Link href="/courses">
                <Button variant="primary" size="lg">
                  View All Courses
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="featured-courses-empty">
            <p>No featured courses available at the moment.</p>
            <Link href="/courses">
              <Button variant="primary">Browse All Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
