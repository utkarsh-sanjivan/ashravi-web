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

export default function FeaturedCoursesSection() {
  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (courses.length === 0 && !loading) {
      dispatch(fetchCourses({ page: 1, limit: 6 }));
    }
  }, [dispatch, courses.length, loading]);

  const featuredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    return [...courses]
      .sort((a, b) => (a?.title || '').localeCompare(b?.title || ''))
      .slice(0, 6);
  }, [courses]);

  if (loading && courses.length === 0) {
    return (
      <section className="featured-courses-section">
        <div className="featured-courses-container">
          <div className="featured-courses-loading">
            <SpinnerIcon size={48} />
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
            <Carousel>
              {featuredCourses.map((course) =>
                course && course.id ? (
                  <CourseCard key={course.id} {...course} />
                ) : null
              )}
            </Carousel>

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
