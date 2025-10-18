/**
 * API Client for Ashravi Web
 * 
 * This module provides a centralized API client for all HTTP requests.
 * Uses mock data until backend APIs are integrated.
 */

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
 * Get all courses (currently using mock data)
 * TODO: Replace with actual API call when backend is ready
 * Future implementation: return api.get<Course[]>('/courses');
 */
export function getCourses(): Course[] {
  return mockCourses;
}

/**
 * Get course by ID (currently using mock data)
 * TODO: Replace with actual API call
 * Future implementation: return api.get<Course>(`/courses/${id}`);
 */
export function getCourseById(id: string): Course | undefined {
  return mockCourses.find((course: any) => course.id === id);
}

/**
 * Search courses (currently using mock data)
 * TODO: Replace with actual API call
 * Future implementation: return api.get<Course[]>(`/courses/search?q=${query}`);
 */
export function searchCourses(query: string): Course[] {
  const searchQuery = query.toLowerCase();
  return mockCourses.filter(
    (course: any) =>
      course.title.toLowerCase().includes(searchQuery) ||
      course.description.toLowerCase().includes(searchQuery) ||
      course.instructor.name.toLowerCase().includes(searchQuery) ||
      course.tags.some((tag: any) => tag.toLowerCase().includes(searchQuery))
  );
}

/**
 * Get paginated courses (currently using mock data)
 * TODO: Replace with actual API call
 * Future implementation: return api.get<PaginatedResponse<Course>>(`/courses?page=${page}&limit=${limit}`);
 */
export function getPaginatedCourses(
  page: number = 1,
  limit: number = 20
): PaginatedResponse<Course> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockCourses.slice(startIndex, endIndex);
  const totalItems = mockCourses.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export default api;
