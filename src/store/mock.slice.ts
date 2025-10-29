import { createAppSlice } from '@/store/utils/createAppSlice';

import { rawMockCourses } from '@/mock-data/courses';
import { transformCourses } from '@/lib/courseAdapter';
import type { Course } from '@/types';

const normalizedMockCourses: Course[] = transformCourses(
  rawMockCourses.map((course, index) => ({
    _id: course.id ?? String(index + 1),
    title: course.title ?? 'Sample Course',
    description: course.description ?? '',
    shortDescription: course.description ?? '',
    thumbnail: course.thumbnail ?? '/images/course-placeholder.jpg',
    category: course.category ?? 'General',
    level: (course.level ?? 'beginner').toLowerCase(),
    price: (() => {
      const originalPrice = typeof course.price === 'number' ? course.price : 0;
      const discountedPrice =
        originalPrice > 0 ? Math.max(Math.round(originalPrice * 0.8), 1) : 0;
      return {
        amount: originalPrice,
        currency: 'USD',
        discountedPrice: discountedPrice < originalPrice ? discountedPrice : undefined,
      };
    })(),
    instructor: course.instructor ?? { name: 'Unknown Instructor' },
    tags: course.tags ?? [],
    badges: course.badges ?? [],
    rating:
      typeof course.rating === 'number'
        ? { average: course.rating, count: course.reviewCount ?? 0 }
        : { average: 0, count: course.reviewCount ?? 0 },
    enrollmentCount: course.enrollmentCount ?? 0,
    metadata: {
      totalDuration: (course.duration ?? 0) * 3600,
      totalVideos: 0,
      totalTests: 0,
      lastUpdated: (course as { updatedAt?: string }).updatedAt,
    },
    isWishlisted: course.isWishlisted ?? false,
    createdAt: course.createdAt ?? new Date().toISOString(),
    updatedAt: (course as { updatedAt?: string }).updatedAt ?? course.createdAt ?? new Date().toISOString(),
    isPublished: true,
    isPurchased: false,
    sections: [],
    prerequisites: [],
    learningOutcomes: [],
    targetAudience: [],
  }))
);

export interface MockState {
  courses: Course[];
}

export const initialState: MockState = {
  courses: normalizedMockCourses,
};

const mockSlice = createAppSlice({
  name: 'mock',
  initialState,
  reducers: {},
});

export default mockSlice.reducer;
