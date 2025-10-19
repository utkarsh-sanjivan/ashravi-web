'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import './index.css';

// Make all properties optional for safety
export interface CourseCardProps {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  price?: { 
    amount?: number;
    currency?: string;
    discountedPrice?: number;
  } | number;
  originalPrice?: number;
  rating?: {
    average: number;
    count: number;
  } | number;
  reviewCount?: number;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string | {
    name?: string;
    credentials?: string;
    avatar?: string;
    bio?: string;
  };
  badges?: Array<'Bestseller' | 'New' | 'Updated' | 'Free'>;
  tags?: string[];
  category?: string;
  isWishlisted?: boolean;
  enrollmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function CourseCard(props: CourseCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(props.isWishlisted ?? false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = localStorage.getItem('user');

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    console.log(`Course ${props.id} wishlist toggled:`, !isWishlisted);
  };

  const formatPrice = (price: number): string => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="course-card-star course-card-star--filled"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="course-card-star course-card-star--half"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${props.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${props.id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="course-card-star course-card-star--empty"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      }
    }

    return stars;
  };

  // Safe value extraction with type guards
  const title = props.title ?? 'Untitled Course';
  const thumbnail = props.thumbnail ?? '/images/course-placeholder.jpg';
  const category = props.category;
  const description = props.description;

  // Handle instructor - check if it's an object or string
  const instructorData = typeof props.instructor === 'object' && props.instructor !== null
    ? props.instructor
    : undefined;

  // Handle rating - check if it's an object or number
  const rating = typeof props.rating === 'object' 
    ? Number(props.rating.average) || 0
    : Number(props.rating) || 0;

  const reviewCount = typeof props.rating === 'object'
    ? Number(props.rating.count) || 0
    : Number(props.reviewCount) || 0;

  // Handle price - check if it's an object or number
  const price = typeof props.price === 'object'
    ? Number(props.price.discountedPrice ?? props.price.amount) || 0
    : Number(props.price) || 0;

  const originalPrice = typeof props.price === 'object' && props.price.discountedPrice
    ? Number(props.price.amount)
    : props.originalPrice
    ? Number(props.originalPrice)
    : undefined;

  const duration = Number(props.duration) || 0;
  const enrollmentCount = Number(props.enrollmentCount) || 0;
  const badges = props.badges ?? [];

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/courses/${props.id}`} className="course-card">
      {/* Image Container with Badges and Wishlist */}
      <div className="course-card-image-container">
        <img
          src={thumbnail}
          alt={title}
          className="course-card-image"
        />

        {/* Badges - Top Left */}
        {badges.length > 0 && (
          <div className="course-card-badges">
            {badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className={`course-card-badge course-card-badge--${badge.toLowerCase()}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Heart - Top Right */}
        <button
          onClick={handleWishlistClick}
          className="course-card-wishlist"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="course-card-wishlist-icon"
            fill={isWishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="course-card-content">
        {/* Title */}
        <h3 className="course-card-title">{title}</h3>

        {/* Category */}
        {category && (
          <p className="course-card-category">{category}</p>
        )}

        {/* Description */}
        {description && (
          <p className="course-card-description">{description}</p>
        )}

        {/* Instructor */}
        {instructorData && (
          <div className="course-card-instructor">
            {instructorData.avatar && (
              <img
                src={instructorData.avatar}
                alt={instructorData.name ?? 'Instructor'}
                className="course-card-instructor-avatar"
              />
            )}
            <div className="course-card-instructor-info">
              <span className="course-card-instructor-name">
                {instructorData.name ?? 'Unknown Instructor'}
              </span>
              {instructorData.credentials && (
                <span className="course-card-instructor-credentials">
                  {instructorData.credentials}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="course-card-rating">
          <div className="course-card-stars">{renderStars(rating)}</div>
          <span className="course-card-rating-value">
            {rating.toFixed(1)}
          </span>
          <span className="course-card-rating-count">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Footer */}
        <div className="course-card-footer">
          {/* Price */}
          <div className="course-card-pricing">
            <span className="course-card-price">{formatPrice(price)}</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="course-card-original-price">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="course-card-discount">
                  {discountPercentage}% off
                </span>
              </>
            )}
          </div>

          {/* Meta Info */}
          <div className="course-card-meta">
            <span className="course-card-meta-item">
              <svg className="course-card-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}h
            </span>
            <span className="course-card-meta-item">
              <svg className="course-card-meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {enrollmentCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
