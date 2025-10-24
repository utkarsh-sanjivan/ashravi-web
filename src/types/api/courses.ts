import type { Course } from '@/types';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface CourseListRequest {
  page?: number;
  limit?: number;
  category?: string;
  level?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export interface CourseListResponse {
  data: Course[];
  pagination: Pagination;
}

export interface CourseDetailResponse {
  data: Course;
}
