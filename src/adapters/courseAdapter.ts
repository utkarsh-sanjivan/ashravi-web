import type { Course, Section } from '@/types';

/**
 * API Course Structure (what API returns)
 */
interface APICourse {
  _id: string;
  title: string;
  slug?: string;
  headline?: string;
  description: string;
  shortDescription?: string;
  thumbnail: string;
  coverImage?: string;
  category: string;
  subCategory?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  price?: {
    amount?: number;
    currency?: string;
    discountedPrice?: number;
  };
  sections?: unknown[];
  instructor?: string | {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  targetAudience?: string[];
  isPurchased?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
  enrollmentCount?: number;
  rating?: {
    average?: number;
    count?: number;
  };
  metadata?: {
    totalDuration?: number;
    totalVideos?: number;
    totalTests?: number;
    lastUpdated?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

/**
 * Transform backend course data to frontend Course type
 */
export function transformCourse(backendCourse: APICourse): Course {
  // Handle instructor - could be ObjectId string or populated object
  const instructor = typeof backendCourse.instructor === 'string'
    ? {
        name: 'Unknown Instructor',
        credentials: undefined,
        avatar: undefined,
      }
    : backendCourse.instructor
    ? {
        name: backendCourse.instructor.name || 'Unknown Instructor',
        credentials: undefined,
        avatar: backendCourse.instructor.avatar,
        bio: backendCourse.instructor.bio,
      }
    : {
        name: 'Unknown Instructor',
        credentials: undefined,
        avatar: undefined,
      };

  // Extract price and rating values
  const priceAmount = backendCourse.price?.amount ?? 0;
  const discountedPrice = backendCourse.price?.discountedPrice;
  const currency = backendCourse.price?.currency ?? 'USD';
  const ratingAvg = backendCourse.rating?.average ?? 0;
  const ratingCount = backendCourse.rating?.count ?? 0;

  // Determine badges based on course properties
  const badges: Array<'Bestseller' | 'New' | 'Updated' | 'Free'> = [];
  
  if (discountedPrice !== undefined ? discountedPrice === 0 : priceAmount === 0) {
    badges.push('Free');
  }
  
  if (ratingAvg >= 4.5 && ratingCount >= 1000) {
    badges.push('Bestseller');
  }
  
  const createdDate = new Date(backendCourse.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (createdDate > thirtyDaysAgo) {
    badges.push('New');
  }
  
  if (backendCourse.metadata?.lastUpdated) {
    const updatedDate = new Date(backendCourse.metadata.lastUpdated);
    if (updatedDate > thirtyDaysAgo) {
      badges.push('Updated');
    }
  }

  // Calculate original price (only if discounted)
  const originalPrice = discountedPrice !== undefined ? priceAmount : undefined;

  // Level - lowercase
  const level: 'beginner' | 'intermediate' | 'advanced' = 
    backendCourse.level?.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' || 'beginner';

  // Return complete Course object with ALL required fields
  return {
    _id: backendCourse._id,
    id: backendCourse._id,
    title: backendCourse.title || 'Untitled Course',
    slug: backendCourse.slug || backendCourse._id,
    headline: backendCourse.headline,
    description: backendCourse.description || '',
    shortDescription: backendCourse.shortDescription || backendCourse.description || '',
    thumbnail: backendCourse.thumbnail || '',
    coverImage: backendCourse.coverImage,
    category: backendCourse.category || 'Uncategorized',
    subCategory: backendCourse.subCategory,
    level: level,
    language: backendCourse.language || 'English',
    price: {
      amount: discountedPrice ?? priceAmount,
      currency: currency,
      discountedPrice: discountedPrice,
    },
    sections: backendCourse.sections as Section[] || [],
    instructor: instructor,
    tags: backendCourse.tags ?? [],
    prerequisites: backendCourse.prerequisites ?? [],
    learningOutcomes: backendCourse.learningOutcomes ?? [],
    targetAudience: backendCourse.targetAudience ?? [],
    isPurchased: backendCourse.isPurchased ?? false,
    isPublished: backendCourse.isPublished ?? true,
    publishedAt: backendCourse.publishedAt,
    enrollmentCount: backendCourse.enrollmentCount ?? 0,
    rating: {
      average: ratingAvg,
      count: ratingCount,
    },
    metadata: {
      totalDuration: backendCourse.metadata?.totalDuration ?? 0,
      totalVideos: backendCourse.metadata?.totalVideos ?? 0,
      totalTests: backendCourse.metadata?.totalTests ?? 0,
      lastUpdated: backendCourse.metadata?.lastUpdated,
    },
    badges: badges,
    isWishlisted: false,
    duration: Math.ceil((backendCourse.metadata?.totalDuration ?? 0) / 3600),
    originalPrice: originalPrice,
    reviewCount: ratingCount,
    createdAt: backendCourse.createdAt,
    updatedAt: backendCourse.updatedAt ?? '',
  };
}


/**
 * Transform array of backend courses to frontend format
 * WITH NULL SAFETY
 */
export function transformCourses(backendCourses: unknown): Course[] {
  // Safety check - ensure it's an array
  if (!backendCourses || !Array.isArray(backendCourses)) {
    console.warn('transformCourses received invalid data:', backendCourses);
    return [];
  }

  return backendCourses
    .filter((course): course is APICourse => {
      return course != null && 
             typeof course === 'object' && 
             '_id' in course &&
             'title' in course;
    })
    .map(transformCourse);
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

  queryParams.isPublished = 'true';

  return queryParams;
}
