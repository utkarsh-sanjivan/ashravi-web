export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseBadge = 'Bestseller' | 'New' | 'Updated' | 'Free';

export interface Instructor {
  name: string;
  credentials?: string;
  avatar?: string;
  bio?: string;
}

export interface Price {
  amount: number;
  currency: string;
  discountedPrice?: number;
}

export interface Rating {
  average: number;
  count: number;
}

export interface CourseMetadata {
  totalDuration: number;
  totalVideos: number;
  totalTests: number;
  lastUpdated?: string;
}

export interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  order: number;
  isFree: boolean;
  thumbnail?: string;
}

export interface Test {
  _id: string;
  title: string;
  description?: string;
  questions: string[]; // ObjectId references
  passingScore: number;
  duration: number;
  order: number;
}

export interface PDFMetadata {
  _id: string;
  filename: string;
  url: string;
  size: number;
  uploadedBy: string; // ObjectId reference
  uploadedAt: string;
}

export interface Section {
  _id: string;
  title: string;
  description?: string;
  order: number;
  videos: Video[];
  test?: Test;
  pdfs: PDFMetadata[];
  isLocked: boolean;
}

// Main Course Interface
export interface Course {
  _id: string;
  id: string; // For frontend compatibility
  title: string;
  slug: string;
  headline?: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  coverImage?: string;
  category: string;
  subCategory?: string;
  level: CourseLevel;
  language: string;
  price: Price;
  sections: Section[];
  instructor: string | Instructor; // Can be ObjectId or populated object
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  isPurchased: boolean;
  isPublished: boolean;
  publishedAt?: string;
  enrollmentCount: number;
  rating: Rating;
  metadata: CourseMetadata;
  
  // Frontend-specific fields
  badges?: CourseBadge[];
  isWishlisted?: boolean;
  duration?: number; 
  originalPrice?: number; // ADD THIS
  reviewCount?: number; // ADD THIS
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Simplified version for listing pages (what API returns)
export interface CourseListItem {
  _id: string;
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  level: CourseLevel;
  price: Price;
  instructor: Instructor; // Populated
  rating: Rating;
  enrollmentCount: number;
  metadata: Pick<CourseMetadata, 'totalDuration'>;
  badges?: CourseBadge[];
  isWishlisted?: boolean;
  duration?: number; 
  originalPrice?: number;
  reviewCount?: number; 
  createdAt: string;
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
