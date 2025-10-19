import type { Course } from '@/types';

/**
 * Backend Course Structure (what API returns)
 */
interface BackendCourse {
  _id: string;
  title: string;
  slug: string;
  headline?: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  coverImage?: string;
  category: string;
  subCategory?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: {
    amount: number;
    currency: string;
    discountedPrice?: number;
  };
  sections: unknown[];
  instructor: string | {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  isPurchased: boolean;
  isPublished: boolean;
  publishedAt?: string;
  enrollmentCount: number;
  rating: {
    average: number;
    count: number;
  };
  metadata: {
    totalDuration: number;
    totalVideos: number;
    totalTests: number;
    lastUpdated?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform backend course data to frontend Course type
 */
export function transformCourse(backendCourse: BackendCourse): Course {
  // Handle instructor - could be ObjectId string or populated object
  const instructor = typeof backendCourse.instructor === 'string'
    ? {
        name: 'Unknown Instructor',
        credentials: undefined,
        avatar: undefined,
      }
    : {
        name: backendCourse.instructor.name || 'Unknown Instructor',
        credentials: undefined, // Not in backend, can be added later
        avatar: backendCourse.instructor.avatar,
        bio: backendCourse.instructor.bio,
      };

  // Determine badges based on course properties
  const badges: Array<'Bestseller' | 'New' | 'Updated' | 'Free'> = [];
  
  if (backendCourse.price.amount === 0) {
    badges.push('Free');
  }
  
  if (backendCourse.rating.average >= 4.5 && backendCourse.rating.count >= 1000) {
    badges.push('Bestseller');
  }
  
  const createdDate = new Date(backendCourse.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (createdDate > thirtyDaysAgo) {
    badges.push('New');
  }
  
  if (backendCourse.metadata.lastUpdated) {
    const updatedDate = new Date(backendCourse.metadata.lastUpdated);
    if (updatedDate > thirtyDaysAgo) {
      badges.push('Updated');
    }
  }

  return {
    id: backendCourse._id,
    title: backendCourse.title,
    description: backendCourse.shortDescription || backendCourse.description,
    thumbnail: backendCourse.thumbnail,
    price: backendCourse.price.discountedPrice || backendCourse.price.amount,
    originalPrice: backendCourse.price.discountedPrice 
      ? backendCourse.price.amount 
      : undefined,
    rating: backendCourse.rating.average,
    reviewCount: backendCourse.rating.count,
    duration: Math.ceil(backendCourse.metadata.totalDuration / 60), // Convert minutes to hours
    level: backendCourse.level.charAt(0).toUpperCase() + backendCourse.level.slice(1) as 'Beginner' | 'Intermediate' | 'Advanced',
    instructor,
    badges,
    tags: backendCourse.tags,
    category: backendCourse.category,
    isWishlisted: false, // Will be determined by user's wishlist
    enrollmentCount: backendCourse.enrollmentCount,
    createdAt: backendCourse.createdAt,
    updatedAt: backendCourse.updatedAt,
  };
}

/**
 * Transform array of backend courses to frontend format
 */
export function transformCourses(backendCourses: BackendCourse[]): Course[] {
  return backendCourses.map(transformCourse);
}

/**
 * Transform frontend filter/search params to backend query params
 */
export function transformFiltersToQuery(filters: {
  search?: string;
  category?: string;
  level?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}): Record<string, string> {
  const queryParams: Record<string, string> = {};

  if (filters.search) {
    queryParams.search = filters.search;
  }

  if (filters.category) {
    queryParams.category = filters.category;
  }

  if (filters.level && filters.level.length > 0) {
    // Convert frontend levels to lowercase for backend
    queryParams.level = filters.level.map(l => l.toLowerCase()).join(',');
  }

  if (filters.minPrice !== undefined) {
    queryParams.minPrice = filters.minPrice.toString();
  }

  if (filters.maxPrice !== undefined) {
    queryParams.maxPrice = filters.maxPrice.toString();
  }

  if (filters.rating) {
    queryParams.minRating = filters.rating.toString();
  }

  if (filters.page) {
    queryParams.page = filters.page.toString();
  }

  if (filters.limit) {
    queryParams.limit = filters.limit.toString();
  }

  // Always fetch only published courses
  queryParams.isPublished = 'true';

  return queryParams;
}
