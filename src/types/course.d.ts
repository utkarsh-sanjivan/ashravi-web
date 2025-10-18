export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseBadge = 'Bestseller' | 'New' | 'Updated' | 'Free';

export interface Instructor {
  name: string;
  credentials?: string;
  avatar?: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  duration: number;
  level: CourseLevel;
  instructor: Instructor;
  badges: CourseBadge[];
  tags: string[];
  category: string;
  isWishlisted: boolean;
  enrollmentCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FilterState {
  priceRange: [number, number];
  isFree: boolean;
  duration: string[];
  level: string[];
  rating: number | null;
}

export type SortOption =
  | 'newest'
  | 'alphabetical-asc'
  | 'alphabetical-desc'
  | 'rating'
  | 'price-low'
  | 'price-high';
