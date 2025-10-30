'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import HeartIcon from '@/components/icons/HeartIcon';
import StarIcon from '@/components/icons/StarIcon';
import ClockIcon from '@/components/icons/ClockIcon';
import UserIcon from '@/components/icons/UserIcon';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useFeatureModule } from '@/hooks/useFeatureModule';
import { selectIsAuthenticated, selectUserProfile } from '@/store/selectors/user.selectors';
import {
  makeSelectIsCourseWishlisted,
  makeSelectIsWishlistPending,
} from '@/store/selectors/wishlist.selectors';
import { coursesApi, useToggleWishlistMutation } from '@/store/api/courses.api';

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
  const makeWishlistedSelector = useMemo(makeSelectIsCourseWishlisted, []);
  const makePendingSelector = useMemo(makeSelectIsWishlistPending, []);
  const wishlistReady = useFeatureModule('wishlist');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUserProfile);
  const isWishlistedFromStore = useAppSelector((state) =>
    makeWishlistedSelector(state, props.id)
  );
  const isPendingFromStore = useAppSelector((state) =>
    makePendingSelector(state, props.id)
  );
  const [toggleWishlist, { isLoading: isMutating }] = useToggleWishlistMutation();
  const prefetchCourseDetail = coursesApi.usePrefetch('detail');
  const isWishlisted = wishlistReady
    ? isWishlistedFromStore
    : Boolean(props.isWishlisted);
  const isPending = wishlistReady ? isPendingFromStore : false;

  const parsePriceValue = (value: unknown): number | undefined => {
    if (value === null || value === undefined) {
      return undefined;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!wishlistReady || isPending || isMutating) {
      return;
    }

    const action = isWishlisted ? 'remove' : 'add';
    if (!user.id) {
      return;
    }
    toggleWishlist({ courseId: props.id, action, parentId: user.id }).catch((error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to toggle wishlist', error);
      }
    });
  };

  const formatPrice = (amount: number, currency?: string): string => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return 'Free';
    }

    const normalized = currency?.toUpperCase();
    const locale = normalized === 'INR' ? 'en-IN' : 'en-US';
    const resolvedCurrency = normalized ?? 'USD';

    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: resolvedCurrency,
        maximumFractionDigits: 2,
      });
      return formatter.format(amount);
    } catch (error) {
      const symbol = normalized === 'INR' ? '₹' : '$';
      return `${symbol}${amount.toFixed(2)}`;
    }
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

  const priceData =
    typeof props.price === 'object' && props.price !== null
      ? {
          amount: parsePriceValue(props.price.amount),
          discountedPrice: parsePriceValue(props.price.discountedPrice),
          currency: props.price.currency,
        }
      : null;
  const fallbackPriceValue = !priceData
    ? parsePriceValue(typeof props.price === 'number' ? props.price : props.originalPrice)
    : undefined;
  const priceCurrency = priceData?.currency;
  const primaryPriceValue = priceData?.amount ?? fallbackPriceValue ?? 0;
  const strikePriceValue =
    priceData?.discountedPrice ?? parsePriceValue(props.originalPrice);
  const duration = Number(props.duration) || 0;
  const enrollmentCount = Number(props.enrollmentCount) || 0;
  const badges = props.badges ?? [];

  const priceLabel = formatPrice(primaryPriceValue, priceCurrency);
  const hasStrikePrice =
    strikePriceValue !== undefined &&
    strikePriceValue !== null &&
    Number.isFinite(strikePriceValue) &&
    strikePriceValue > 0;
  const strikePriceLabel = hasStrikePrice
    ? formatPrice(strikePriceValue, priceCurrency)
    : null;
  const discountDifference =
    hasStrikePrice && Number.isFinite(primaryPriceValue)
      ? primaryPriceValue - strikePriceValue
      : undefined;
  const showDiscountAmount =
    discountDifference !== undefined && Number.isFinite(discountDifference) && discountDifference !== 0;
  const discountAmountLabel =
    showDiscountAmount && discountDifference !== undefined
      ? formatPrice(Math.abs(discountDifference), priceCurrency)
      : null;

  return (
    <Link
      href={`/course/${props.id}`}
      className="course-card"
      onMouseEnter={() => prefetchCourseDetail(props.id)}
      onFocus={() => prefetchCourseDetail(props.id)}
    >
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
          aria-pressed={isWishlisted}
          disabled={!wishlistReady || isPending || isMutating}
          aria-busy={!wishlistReady || isPending || isMutating}
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
            <span className="course-card-price">{priceLabel}</span>
            {strikePriceLabel && (
              <>
                <span className="course-card-original-price">{strikePriceLabel}</span>
                {discountAmountLabel && (
                  <span className="course-card-discount">Save {discountAmountLabel}</span>
                )}
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
