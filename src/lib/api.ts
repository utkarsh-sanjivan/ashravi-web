/**
 * API Client for Ashravi Web
 * 
 * This module provides a centralized API client for all HTTP requests.
 * Uses mock data until backend APIs are integrated.
 */

import { transformCourses, transformFiltersToQuery } from './courseAdapter';
import type { 
  Course, 
  PaginatedResponse 
} from '@/types';

import { mockCourses } from '@/mock-data/courses';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}

const api = new APIClient();
/**
 * Get courses with filters (uses adapter to transform backend data)
 */
export async function fetchCoursesFromAPI(filters: {
  search?: string;
  category?: string;
  level?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
}): Promise<{
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}> {
  try {
    const queryParams = transformFiltersToQuery(filters);
    const queryString = new URLSearchParams(queryParams).toString();
    
    const response = await api.get<{
      success: boolean;
      data: {
        courses: unknown[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      };
    }>(`/courses?${queryString}`);

    // Transform backend courses to frontend format
    const transformedCourses = transformCourses(response.data.courses as any[]);

    return {
      data: transformedCourses,
      pagination: {
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalItems: response.data.pagination.totalItems,
      },
    };
  } catch (error) {
    console.error('Error fetching courses from API:', error);
    // Fallback to mock data for now
    return {
      data: mockCourses,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: mockCourses.length,
      },
    };
  }
}

/**
 * Get courses (temporary - uses mock data)
 */
export function getCourses(): Course[] {
  try {
    return mockCourses || [];
  } catch (error) {
    console.error('Error getting courses:', error);
    return [];
  }
}

/**
 * Get course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const response = await api.get<{
      success: boolean;
      data: { course: unknown };
    }>(`/courses/${id}`);

    // Transform single course
    const backendCourse = response.data.course as any;
    return transformCourses([backendCourse])[0];
  } catch (error) {
    console.error('Error fetching course:', error);
    // Fallback to mock data
    return mockCourses.find((c) => c.id === id) || null;
  }
}

export default api;