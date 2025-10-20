/**
 * API Client for Ashravi Web
 * 
 * This module provides a centralized API client for all HTTP requests.
 * Uses mock data until backend APIs are integrated.
 */

import { transformCourses, transformFiltersToQuery } from '../adapters/courseAdapter';
import type { Course } from '@/types';

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
    
    console.log('Fetching courses with params:', queryString);
    
    const response = await api.get<any>(`/courses?${queryString}`);
    
    console.log('API Response:', response);

    // Handle different possible response structures
    let coursesArray: unknown[] = [];
    let paginationData = {
      currentPage: filters.page ?? 1,
      totalPages: 1,
      totalItems: 0,
    };

    // Check various possible response structures
    if (response?.data?.courses && Array.isArray(response.data.courses)) {
      coursesArray = response.data.courses;
      
      // Map API pagination fields to frontend format
      if (response.data.pagination) {
        paginationData = {
          currentPage: response.data.pagination.page ?? filters.page ?? 1,
          totalPages: response.data.pagination.pages ?? 1,
          totalItems: response.data.pagination.total ?? coursesArray.length,
        };
      }
    } else if (response?.courses && Array.isArray(response.courses)) {
      coursesArray = response.courses;
      
      // Map API pagination fields to frontend format
      if (response.pagination) {
        paginationData = {
          currentPage: response.pagination.page ?? filters.page ?? 1,
          totalPages: response.pagination.pages ?? 1,
          totalItems: response.pagination.total ?? coursesArray.length,
        };
      }
    } else if (response?.data && Array.isArray(response.data)) {
      coursesArray = response.data;
      
      // Check if pagination is at response level
      if (response.pagination) {
        paginationData = {
          currentPage: response.pagination.page ?? filters.page ?? 1,
          totalPages: response.pagination.pages ?? 1,
          totalItems: response.pagination.total ?? coursesArray.length,
        };
      } else {
        paginationData.totalItems = coursesArray.length;
        paginationData.totalPages = Math.ceil(coursesArray.length / (filters.limit ?? 20));
      }
    } else if (Array.isArray(response)) {
      coursesArray = response;
      paginationData.totalItems = coursesArray.length;
      paginationData.totalPages = Math.ceil(coursesArray.length / (filters.limit ?? 20));
    }

    console.log('Courses array to transform:', coursesArray);
    console.log('Pagination data:', paginationData);

    // Transform API courses to frontend format
    const transformedCourses = transformCourses(coursesArray);

    console.log('Transformed courses:', transformedCourses);

    return {
      data: transformedCourses,
      pagination: paginationData,
    };
  } catch (error) {
    console.error('Error fetching courses from API:', error);
    // Fallback to mock data
    const limit = filters.limit ?? 20;
    const page = filters.page ?? 1;
    const startIndex = (page - 1) * limit;
    const paginatedMockData = mockCourses.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedMockData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockCourses.length / limit),
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
    console.log('Fetching course by ID:', id);
    
    const response = await api.get<any>(`/courses/${id}`);
    
    console.log('Course API Response:', response);

    // Handle different possible response structures
    let courseData: unknown = null;

    if (response?.data?.course) {
      courseData = response.data.course;
    } else if (response?.course) {
      courseData = response.course;
    } else if (response?.data) {
      courseData = response.data;
    } else {
      courseData = response;
    }

    // Transform single course
    if (courseData) {
      const transformedCourses = transformCourses([courseData]);
      return transformedCourses[0] || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    // Fallback to mock data
    return mockCourses.find((c) => c.id === id) || null;
  }
}

/**
 * Search courses
 */
export async function searchCourses(query: string): Promise<{
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}> {
  return fetchCoursesFromAPI({
    search: query,
    page: 1,
    limit: 20,
  });
}

export default api;
