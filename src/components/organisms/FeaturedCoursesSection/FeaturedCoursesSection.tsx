'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import CourseCard from '@/components/molecules/CourseCard';
import Button from '@/components/atoms/Button';

import { getCourses } from '@/lib/api';

import './index.css';

export default function FeaturedCoursesSection() {
  const featuredCourses = useMemo(() => {
    const allCourses = getCourses();
    // Add null check and ensure it's an array
    if (!allCourses || !Array.isArray(allCourses)) {
      return [];
    }
    // Get first 6 courses or courses with "Bestseller" badge
    return allCourses
      .filter((course) => course.badges?.includes('Bestseller'))
      .slice(0, 6);
  }, []);

  return (
    <section className="featured-courses-section">
      <div className="featured-courses-container">
        <div className="featured-courses-header">
          <h2 className="featured-courses-title">Featured Courses</h2>
          <p className="featured-courses-subtitle">
            Discover our most popular courses chosen by parents like you
          </p>
        </div>

        {/* Add conditional rendering */}
        {featuredCourses && featuredCourses.length > 0 ? (
          <>
            <div className="featured-courses-grid">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
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
