/**
 * Authentication API
 * All auth-related API calls
 */

import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  occupation?: string;
  city?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  
  // Handle multiple response structures
  if (response.data.accessToken) {
    return response.data;
  } else if ((response as any).accessToken) {
    return response as any;
  } else if ((response as any).token) {
    return {
      ...response.data,
      accessToken: (response as any).token,
      refreshToken: '',
    };
  }
  
  throw new Error('Invalid response structure from login API');
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  
  // Handle multiple response structures
  if (response.data.accessToken) {
    return response.data;
  } else if ((response as any).accessToken) {
    return response as any;
  } else if ((response as any).token) {
    return {
      ...response.data,
      accessToken: (response as any).token,
      refreshToken: '',
    };
  }
  
  throw new Error('Invalid response structure from register API');
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue even if logout API fails
    console.error('Logout API error:', error);
  }
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<AuthResponse['user']> {
  const response = await apiClient.get<{ user: AuthResponse['user'] }>('/auth/profile');
  return response.data.user;
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
  const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
  return response.data;
}
