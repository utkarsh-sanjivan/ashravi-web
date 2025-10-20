import type { Course } from '@/types';

const API_BASE = '/api'; // Next.js API routes

interface CoursesResponse {
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface CourseFilters {
  search?: string;
  category?: string;
  level?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

class CourseService {
  /**
   * Fetch courses with filters
   */
  async getCourses(filters: CourseFilters = {}): Promise<CoursesResponse> {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.level && filters.level.length > 0) {
        params.append('level', filters.level.join(','));
      }
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.featured) params.append('featured', 'true');

      const queryString = params.toString();
      const url = `${API_BASE}/courses${queryString ? `?${queryString}` : ''}`;

      console.log('Fetching courses:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.statusText}`);
      }

      const data: CoursesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  /**
   * Fetch a single course by ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await fetch(`${API_BASE}/courses/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch course: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      return null;
    }
  }

  /**
   * Search courses
   */
  async searchCourses(query: string): Promise<CoursesResponse> {
    return this.getCourses({
      search: query,
      page: 1,
      limit: 20,
    });
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses(limit: number = 10): Promise<Course[]> {
    const response = await this.getCourses({
      featured: true,
      limit,
      page: 1,
    });
    return response.data;
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    const response = await this.getCourses({
      sortBy: 'popular',
      limit,
      page: 1,
    });
    return response.data;
  }
}

const courseService = new CourseService();
export default courseService;
