/**
 * User API
 * All user-related API calls
 */

import apiClient from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  occupation?: string;
  city?: string;
  children: string[];
  enrolledCourses: string[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<User> {
  const response = await apiClient.get<{ user: User }>('/user/profile');
  return response.data.user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  const response = await apiClient.put<{ user: User }>('/user/profile', data);
  return response.data.user;
}

/**
 * Get user's enrolled courses
 */
export async function getEnrolledCourses(): Promise<string[]> {
  const response = await apiClient.get<{ courses: string[] }>('/user/enrolled-courses');
  return response.data.courses;
}

/**
 * Get user's wishlist
 */
export async function getWishlist(): Promise<string[]> {
  const response = await apiClient.get<{ wishlist: string[] }>('/user/wishlist');
  return response.data.wishlist;
}

/**
 * Add course to wishlist
 */
export async function addToWishlist(courseId: string): Promise<void> {
  await apiClient.post('/user/wishlist', { courseId });
}

/**
 * Remove course from wishlist
 */
export async function removeFromWishlist(courseId: string): Promise<void> {
  await apiClient.delete(`/user/wishlist/${courseId}`);
}
