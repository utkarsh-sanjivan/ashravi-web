'use client';

import Image from 'next/image';
import Link from 'next/link';
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
  price: number;
  category: string;
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
  price,
  category,
  isAuthenticated = false,
}: CourseCardProps) {
  const handleEnrollClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      // Trigger login modal or redirect
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="course-card">
      <div className="course-thumbnail">
        <Image
          src={thumbnail}
          alt={title}
          width={400}
          height={225}
          className="course-image"
        />
        <span className="course-category">{category}</span>
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
              <span className="rating-stars">⭐</span>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {studentCount && (
            <span className="course-students">{studentCount.toLocaleString()} students</span>
          )}
        </div>

        <div className="course-footer">
          <span className="course-price">${price.toFixed(2)}</span>
          {isAuthenticated ? (
            <Link href={`/learn/${id}`}>
              <Button variant="primary" size="sm">Enroll Now</Button>
            </Link>
          ) : (
            <Button variant="primary" size="sm" onClick={handleEnrollClick}>
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
