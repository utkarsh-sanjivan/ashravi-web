/**
 * Courses API
 * All course-related API calls
 */

import apiClient from './client';
import { transformCourses } from '@/adapters/courseAdapter';
import type { Course } from '@/types';
import { mockCourses } from '@/mock-data/courses';

export interface CoursesFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string[];
  search?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: string[];
  rating?: number;
  isFree?: boolean;
}

export interface CoursesResponse {
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Fetch courses with filters
 */
export async function getCourses(filters: CoursesFilters = {}): Promise<CoursesResponse> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.level?.length) queryParams.append('level', filters.level.join(','));
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.duration?.length) queryParams.append('duration', filters.duration.join(','));
    if (filters.rating !== undefined) queryParams.append('rating', filters.rating.toString());
    if (filters.isFree !== undefined) queryParams.append('isFree', filters.isFree.toString());

    const response = await apiClient.get<{ courses: any[]; pagination: any }>(
      `/courses?${queryParams.toString()}`
    );

    return {
      data: transformCourses(response.data.courses),
      pagination: response.data.pagination,
    };
  } catch (error) {
    // Fallback to mock data in development
    console.warn('API call failed, using mock data:', error);
    
    // Apply filters to mock data
    let filteredCourses = [...mockCourses];
    
    if (filters.search) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.category) {
      filteredCourses = filteredCourses.filter(course => course.category === filters.category);
    }
    
    if (filters.level?.length) {
      filteredCourses = filteredCourses.filter(course => filters.level!.includes(course.level));
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: transformCourses(filteredCourses.slice(startIndex, endIndex)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredCourses.length / limit),
        totalItems: filteredCourses.length,
        itemsPerPage: limit,
      },
    };
  }
}

/**
 * Fetch single course by ID
 */
export async function getCourse(id: string): Promise<Course> {
  try {
    const response = await apiClient.get<{ course: any }>(`/courses/${id}`);
    const transformed = transformCourses([response.data.course]);
    return transformed[0];
  } catch (error) {
    // Fallback to mock data
    const course = mockCourses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return transformCourses([course])[0];
  }
}

/**
 * Fetch featured courses
 */
export async function getFeaturedCourses(limit: number = 10): Promise<Course[]> {
  const response = await getCourses({ limit, sortBy: 'rating' });
  return response.data;
}

/**
 * Fetch popular courses
 */
export async function getPopularCourses(limit: number = 10): Promise<Course[]> {
  const response = await getCourses({ limit, sortBy: 'enrollmentCount' });
  return response.data;
}
