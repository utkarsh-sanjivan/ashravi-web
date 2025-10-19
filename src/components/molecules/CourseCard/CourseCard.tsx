'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import HeartIcon from '@/components/icons/HeartIcon';
import StarIcon from '@/components/icons/StarIcon';
import ClockIcon from '@/components/icons/ClockIcon';
import UserIcon from '@/components/icons/UserIcon';

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
        stars.push(<StarIcon key={i} type="filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} type="half" id={props.id} />);
      } else {
        stars.push(<StarIcon key={i} type="empty" />);
      }
    }

    return stars;
  };

  // Safe value extraction
  const title = props.title ?? 'Untitled Course';
  const thumbnail = props.thumbnail ?? '/images/course-placeholder.jpg';
  const category = props.category;
  const description = props.description;
  const instructorData = typeof props.instructor === 'object' && props.instructor !== null
    ? props.instructor
    : undefined;

  const rating = typeof props.rating === 'object' 
    ? Number(props.rating.average) || 0
    : Number(props.rating) || 0;

  const reviewCount = typeof props.rating === 'object'
    ? Number(props.rating.count) || 0
    : Number(props.reviewCount) || 0;

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

  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/courses/${props.id}`} className="course-card">
      <div className="course-card-image-container">
        <img src={thumbnail} alt={title} className="course-card-image" />

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

        <button
          onClick={handleWishlistClick}
          className="course-card-wishlist"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      <div className="course-card-content">
        <h3 className="course-card-title">{title}</h3>

        {category && <p className="course-card-category">{category}</p>}
        {description && <p className="course-card-description">{description}</p>}

        {/* Only show instructor if name is not 'Unknown Instructor' */}
        {instructorData && instructorData.name && instructorData.name !== 'Unknown Instructor' && (
          <div className="course-card-instructor">
            {instructorData.avatar && (
              <img
                src={instructorData.avatar}
                alt={instructorData.name}
                className="course-card-instructor-avatar"
              />
            )}
            <div className="course-card-instructor-info">
              <span className="course-card-instructor-name">{instructorData.name}</span>
              {instructorData.credentials && (
                <span className="course-card-instructor-credentials">
                  {instructorData.credentials}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="course-card-rating">
          <div className="course-card-stars">{renderStars(rating)}</div>
          <span className="course-card-rating-value">{rating.toFixed(1)}</span>
          <span className="course-card-rating-count">({reviewCount.toLocaleString()})</span>
        </div>

        <div className="course-card-footer">
          <div className="course-card-pricing">
            <span className="course-card-price">{formatPrice(price)}</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="course-card-original-price">${originalPrice.toFixed(2)}</span>
                <span className="course-card-discount">{discountPercentage}% off</span>
              </>
            )}
          </div>

          <div className="course-card-meta">
            <span className="course-card-meta-item">
              <ClockIcon />
              {duration}h
            </span>
            <span className="course-card-meta-item">
              <UserIcon />
              {enrollmentCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
