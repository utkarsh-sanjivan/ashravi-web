'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';

import Carousel from '@/components/molecules/Carousel';
import CourseCard from '@/components/molecules/CourseCard';
import Button from '@/components/atoms/Button';
import SpinnerIcon from '@/components/icons/SpinnerIcon';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCourses } from '@/store/courses.slice';

import './index.css';

export default function PopularCoursesSection() {
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (courses.length === 0 && !loading) {
      dispatch(fetchCourses({ page: 1, limit: 6 }));
    }
  }, [dispatch, courses.length, loading]);

  const popularCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    return [...courses]
      .sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
      .slice(0, 6);
  }, [courses]);

  if (loading && courses.length === 0) {
    return (
      <section className="popular-courses-section">
        <div className="popular-courses-container">
          <div className="popular-courses-loading">
            <SpinnerIcon size={48} />
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
            <Button onClick={() => dispatch(fetchCourses({ page: 1, limit: 6 }))} variant="primary">
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
            <Carousel>
              {popularCourses.map((course) =>
                course && course.id ? (
                  <CourseCard key={course.id} {...course} />
                ) : null
              )}
            </Carousel>

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
