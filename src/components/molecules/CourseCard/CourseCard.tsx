'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@/components/icons';
import PriceTag from '@/components/atoms/PriceTag';
import Button from '@/components/atoms/Button';
import './index.css';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor?: string;
  rating?: number;
  studentCount?: number;
  duration: number;
  category: string;
  price: number;
  originalPrice?: number;
  isAuthenticated?: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  thumbnail,
  instructor,
  rating,
  studentCount,
  duration,
  category,
  price,
  originalPrice,
  isAuthenticated = false,
}: CourseCardProps) {
  const handleEnroll = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="course-card">
      <Link href={`/courses/${id}`} className="course-card-link">
        <div className="course-thumbnail">
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={225}
            className="course-image"
          />
          <div className="course-category-badge">{category}</div>
        </div>

        <div className="course-content">
          <h3 className="course-title">{title}</h3>
          <p className="course-description">{description}</p>

          {instructor && (
            <p className="course-instructor">By {instructor}</p>
          )}

          <div className="course-meta">
            {rating && (
              <div className="course-rating">
                <StarIcon className="rating-star" />
                <span className="rating-value">{rating.toFixed(1)}</span>
              </div>
            )}

            {studentCount && (
              <span className="course-students">
                {studentCount.toLocaleString()} students
              </span>
            )}

            <span className="course-duration">{duration} mins</span>
          </div>
        </div>
      </Link>

      <div className="course-footer">
        <PriceTag
          currentPrice={price}
          originalPrice={originalPrice}
          size="md"
        />

        <Button
          variant="primary"
          size="sm"
          onClick={handleEnroll}
          className="course-enroll-btn"
        >
          {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
        </Button>
      </div>
    </div>
  );
}
