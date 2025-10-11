import { cookies } from 'next/headers';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Get current user from server-side
 * This function runs on the server and uses cookies to authenticate
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  
  if (!accessToken) {
    return null;
  }

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';
    
    // Call API to get user profile
    const response = await fetch(`${apiBase}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache auth requests
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      };
    }
    
    // If token is invalid, clear the cookie
    if (response.status === 401) {
      cookieStore.delete('accessToken');
    }
    
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

/**
 * Get user by ID (admin function)
 * This is for server-side user lookup
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    if (!accessToken) {
      return null;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1';

    const response = await fetch(`${apiBase}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

/**
 * Server-side logout helper
 * Clears the authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getUser();
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Get access token from cookies (server-side only)
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  return accessToken?.value || null;
}
