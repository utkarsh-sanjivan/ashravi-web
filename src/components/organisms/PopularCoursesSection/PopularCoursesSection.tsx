'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPopularCourses } from '@/store/courses.slice';
import CourseCard from '@/components/molecules/CourseCard';
import Carousel from '@/components/molecules/Carousel';
import Spinner from '@/components/atoms/Spinner';
import './index.css';

export interface PopularCoursesSectionProps {
  title: string;
  subtitle: string;
  limit?: number;
  isAuthenticated?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function PopularCoursesSection({
  title,
  subtitle,
  limit = 6,
  isAuthenticated = false,
  ctaText,
  ctaHref,
}: PopularCoursesSectionProps) {
  const dispatch = useAppDispatch();
  const { popularCourses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchPopularCourses(limit));
  }, [dispatch, limit]);

  // ... loading and error states ...

  return (
    <section className="popular-courses-section">
      <div className="popular-courses-container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <Carousel
          slidesToShow={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
          }}
          autoPlay={true}
          autoPlayInterval={5000}
          showDots={true}
          showArrows={true}
          gap={24} // Changed from 32 to 24
        >
          {popularCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              {...course} 
              isAuthenticated={isAuthenticated} 
            />
          ))}
        </Carousel>

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

