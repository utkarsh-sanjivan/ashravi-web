'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedCourses } from '@/store/courses.slice';
import CourseCard from '@/components/molecules/CourseCard';
import Spinner from '@/components/atoms/Spinner';
import './index.css';

export interface FeaturedCoursesSectionProps {
  title: string;
  subtitle: string;
  limit?: number;
  isAuthenticated?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function FeaturedCoursesSection({
  title,
  subtitle,
  limit = 6,
  isAuthenticated = false,
  ctaText,
  ctaHref,
}: FeaturedCoursesSectionProps) {
  const dispatch = useAppDispatch();
  const { featuredCourses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchFeaturedCourses(limit));
  }, [dispatch, limit]);

  if (loading) {
    return (
      <section className="featured-courses-section">
        <div className="featured-courses-container">
          <div className="loading-state">
            <Spinner size="lg" />
            <p>Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-courses-section">
        <div className="featured-courses-container">
          <div className="error-state">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-courses-section">
      <div className="featured-courses-container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <div className="courses-grid">
          {featuredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              {...course} 
              isAuthenticated={isAuthenticated} 
            />
          ))}
        </div>

        {ctaText && ctaHref && (
          <div className="section-cta">
            <a href={ctaHref} className="inline-block">
              <button className="btn btn-outline btn-lg">
                {ctaText}
              </button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
