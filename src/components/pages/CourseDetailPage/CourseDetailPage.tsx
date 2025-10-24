'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import PublicNavbar from '@/components/organisms/PublicNavbar';
import Footer from '@/components/organisms/Footer';
import Button from '@/components/atoms/Button';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import StarIcon from '@/components/icons/StarIcon';
import CheckmarkIcon from '@/components/icons/CheckmarkIcon';
import ClockIcon from '@/components/icons/ClockIcon';
import UserIcon from '@/components/icons/UserIcon';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useFeatureModules } from '@/hooks/useFeatureModule';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { FeatureModuleKey } from '@/store/modules/registry';
import { useCourseDetailQuery } from '@/store/api/courses.api';
import { selectMockCourses } from '@/store/selectors/mock.selectors';
import type { Course, Section } from '@/types';

import './index.css';

export interface CourseDetailPageProps {
  courseId: string;
}

const FALLBACK_IMAGE = '/images/course-placeholder.jpg';
const FALLBACK_LANGUAGE = 'English';

const formatCurrency = (amount?: number, currency = 'USD'): string => {
  if (!amount || amount <= 0) {
    return 'Free';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${amount.toFixed(2)}`;
  }
};

const formatDate = (isoDate?: string): string => {
  if (!isoDate) {
    return 'Recently updated';
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'Recently updated';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const formatDuration = (seconds?: number): string => {
  if (!seconds || !Number.isFinite(seconds)) {
    return 'Self-paced';
  }

  const totalMinutes = Math.max(0, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m total`;
  }

  if (hours < 10) {
    return `${hours}h ${minutes}m total`;
  }

  return `${hours}h total`;
};

const countSectionLessons = (section?: Section): number => {
  if (!section) {
    return 0;
  }

  const videoCount = Array.isArray(section.videos) ? section.videos.length : 0;
  const pdfCount = Array.isArray(section.pdfs) ? section.pdfs.length : 0;
  const testCount = section.test ? 1 : 0;

  return videoCount + pdfCount + testCount;
};

const renderStars = (rating: number, key: string) => {
  const normalized = Math.max(0, Math.min(5, rating));
  const stars = [];
  const fullStars = Math.floor(normalized);
  const hasHalfStar = normalized % 1 >= 0.5;

  for (let i = 0; i < 5; i += 1) {
    if (i < fullStars) {
      stars.push(<StarIcon key={`${key}-star-${i}`} type="filled" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<StarIcon key={`${key}-star-${i}`} type="half" id={`${key}-half`} />);
    } else {
      stars.push(<StarIcon key={`${key}-star-${i}`} type="empty" />);
    }
  }

  return stars;
};

export default function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const { isAuthenticated, isChecking } = useAuthGuard({ redirectTo: '/auth/login' });

  const requestedFeatures = useMemo<FeatureModuleKey[]>(
    () =>
      process.env.NODE_ENV !== 'production'
        ? (['courses', 'wishlist', 'mock'] as FeatureModuleKey[])
        : (['courses', 'wishlist'] as FeatureModuleKey[]),
    []
  );
  const featuresReady = useFeatureModules(requestedFeatures);

  const { data, isLoading, isFetching, error } = useCourseDetailQuery(courseId, {
    skip: !isAuthenticated,
  });
  const devMockCourses = useAppSelector(selectMockCourses);

  const fallbackCourse = useMemo(() => {
    const normalized = courseId.trim().toLowerCase();
    return devMockCourses.find((course: Course) => {
      const candidates = [
        course?.id,
        course?._id,
        typeof course?.slug === 'string' ? course.slug : undefined,
      ];

      return candidates.some(
        (candidate) => candidate && candidate.trim().toLowerCase() === normalized
      );
    });
  }, [devMockCourses, courseId]);

  const course = data?.data ?? fallbackCourse;

  const isLoadingState = isChecking || !featuresReady || ((isLoading || isFetching) && !course);

  if (isLoadingState) {
    return (
      <div className="course-detail-page">
        <PublicNavbar />
        <main className="course-detail-main">
          <div className="course-detail-container">
            <div className="course-detail-loading">
              <SpinnerIcon size={48} />
              <p>Loading course details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="course-detail-page">
        <PublicNavbar />
        <main className="course-detail-main">
          <div className="course-detail-container">
            <div className="course-detail-error">
              <h1>Course not found</h1>
              <p>We couldn&apos;t load this course right now. Please try again later.</p>
              <Link href="/courses">
                <Button variant="primary">Browse Courses</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const ratingAverage =
    typeof course.rating === 'object' && course.rating !== null
      ? Number(course.rating.average ?? 0)
      : 0;
  const ratingCount =
    typeof course.rating === 'object' && course.rating !== null
      ? Number(course.rating.count ?? 0)
      : 0;

  const enrollment = Number(course.enrollmentCount ?? 0);
  const totalDuration = course.metadata?.totalDuration ?? 0;
  const level =
    typeof course.level === 'string'
      ? `${course.level.charAt(0).toUpperCase()}${course.level.slice(1)}`
      : 'All levels';

  const language =
    typeof course.language === 'string' && course.language.length > 0
      ? course.language
      : FALLBACK_LANGUAGE;

  const thumbnail = course.coverImage ?? course.thumbnail ?? FALLBACK_IMAGE;

  const priceAmount =
    course.price?.discountedPrice ?? course.price?.amount ?? course.originalPrice ?? 0;
  const priceLabel = formatCurrency(priceAmount, course.price?.currency);
  const originalPrice =
    course.originalPrice !== undefined
      ? course.originalPrice
      : course.price?.amount && course.price.discountedPrice
      ? course.price.amount
      : undefined;

  const sections: Section[] = Array.isArray(course.sections)
    ? (course.sections as Section[])
    : [];
  const lessonsCount = sections.reduce<number>(
    (total, section) => total + countSectionLessons(section),
    0
  );

  const instructor =
    typeof course.instructor === 'object' && course.instructor !== null
      ? course.instructor
      : null;

  return (
    <div className="course-detail-page">
      <PublicNavbar />
      <main className="course-detail-main">
        <div className="course-detail-container">
          <nav className="course-detail-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="course-detail-breadcrumb-divider">/</span>
            <Link href="/courses">Courses</Link>
            <span className="course-detail-breadcrumb-divider">/</span>
            <span aria-current="page">{course.title ?? 'Course details'}</span>
          </nav>

          <section className="course-detail-hero">
            <div className="course-detail-hero-content">
              <div className="course-detail-badges">
                {Array.isArray(course.badges) &&
                  (course.badges as NonNullable<Course['badges']>)
                    .slice(0, 3)
                    .map((badge) => (
                      <span key={badge} className="course-detail-badge">
                        {badge}
                      </span>
                    ))}
              </div>
              <h1 className="course-detail-title">{course.title ?? 'Course details'}</h1>
              {course.shortDescription && (
                <p className="course-detail-subtitle">{course.shortDescription}</p>
              )}

              <div className="course-detail-metrics">
                <div className="course-detail-rating">
                  <div className="course-detail-stars">
                    {renderStars(ratingAverage, course.id)}
                  </div>
                  <span className="course-detail-rating-value">
                    {ratingAverage.toFixed(1)}
                  </span>
                  <span className="course-detail-rating-count">
                    ({ratingCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="course-detail-metric">
                  <UserIcon />
                  <span>{enrollment.toLocaleString()} enrolled</span>
                </div>
                <div className="course-detail-metric">
                  <ClockIcon />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="course-detail-metric">
                  <span className="course-detail-metric-dot" />
                  <span>{level}</span>
                </div>
              </div>

              <div className="course-detail-actions">
                <Button variant="primary" size="lg">
                  Start learning
                </Button>
                <Button variant="secondary" size="lg">
                  Add to wishlist
                </Button>
              </div>
            </div>
            <div className="course-detail-hero-media">
              <img src={thumbnail} alt={course.title ?? 'Course cover'} />
              <div className="course-detail-price-card">
                <span className="course-detail-price-current">{priceLabel}</span>
                {originalPrice && originalPrice > priceAmount && (
                  <span className="course-detail-price-original">
                    {formatCurrency(originalPrice, course.price?.currency)}
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="course-detail-grid">
            <div className="course-detail-main-column">
                {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
                <section className="course-detail-panel">
                  <h2>What you&apos;ll learn</h2>
                  <ul className="course-detail-learning-list">
                    {course.learningOutcomes.map((outcome: string) => (
                      <li key={outcome}>
                        <CheckmarkIcon className="course-detail-learning-icon" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="course-detail-panel">
                <h2>About this course</h2>
                {course.description && (
                  <p className="course-detail-description">{course.description}</p>
                )}
                {Array.isArray(course.prerequisites) && course.prerequisites.length > 0 && (
                  <div className="course-detail-stack">
                    <h3>Prerequisites</h3>
                    <ul className="course-detail-bullet-list">
                      {course.prerequisites.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(course.targetAudience) && course.targetAudience.length > 0 && (
                  <div className="course-detail-stack">
                    <h3>Who this course is for</h3>
                    <ul className="course-detail-bullet-list">
                      {course.targetAudience.map((item: string) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {sections.length > 0 && (
                <section className="course-detail-panel">
                  <div className="course-detail-panel-header">
                    <h2>Course curriculum</h2>
                    <span>
                      {sections.length} sections • {lessonsCount} lessons
                    </span>
                  </div>
                  <div className="course-detail-section-list">
                    {sections.map((section: Section) => (
                      <div key={section?._id ?? section?.title} className="course-detail-section-card">
                        <div>
                          <h3>{section?.title ?? 'Section'}</h3>
                          {section?.description && (
                            <p className="course-detail-section-description">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <span className="course-detail-section-meta">
                          {countSectionLessons(section)} lessons
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="course-detail-sidebar" aria-label="Course summary">
              <div className="course-detail-summary-card">
                <h2>Course details</h2>
                <ul>
                  <li>
                    <span className="course-detail-summary-label">Duration</span>
                    <span className="course-detail-summary-value">
                      {formatDuration(totalDuration)}
                    </span>
                  </li>
                  <li>
                    <span className="course-detail-summary-label">Last updated</span>
                    <span className="course-detail-summary-value">
                      {formatDate(course.metadata?.lastUpdated ?? course.updatedAt)}
                    </span>
                  </li>
                  <li>
                    <span className="course-detail-summary-label">Language</span>
                    <span className="course-detail-summary-value">{language}</span>
                  </li>
                  <li>
                    <span className="course-detail-summary-label">Level</span>
                    <span className="course-detail-summary-value">{level}</span>
                  </li>
                </ul>
              </div>

              {instructor && (
                <div className="course-detail-summary-card">
                  <h2>Your instructor</h2>
                  <div className="course-detail-instructor-info">
                    {instructor.avatar && (
                      <img
                        src={instructor.avatar}
                        alt={instructor.name ?? 'Instructor'}
                        className="course-detail-instructor-avatar"
                      />
                    )}
                    <div>
                      <p className="course-detail-instructor-name">
                        {instructor.name ?? 'Instructor'}
                      </p>
                      {instructor.credentials && (
                        <p className="course-detail-instructor-credentials">
                          {instructor.credentials}
                        </p>
                      )}
                    </div>
                  </div>
                  {instructor.bio && (
                    <p className="course-detail-instructor-bio">{instructor.bio}</p>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
