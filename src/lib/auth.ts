import { cookies } from 'next/headers';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  children: string[];
  enrolledCourses: string[];
  wishlist: string[];
  createdAt: string;
  lastLogin: string;
}

// Import mock user data
import usersData from '@/mock-data/users.json';

// Mock function - replace with actual auth logic
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  // FOR DEVELOPMENT: Return a mock user to test Homepage
  if (process.env.NODE_ENV === 'development') {
    // Return first user from mock data
    const mockUser = usersData[0] as User;
    return mockUser;
  }
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const userData = JSON.parse(sessionCookie.value);
    return userData;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

// Helper function to get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const user = usersData.find(u => u.id === userId);
  return user ? (user as User) : null;
}

// Helper function to switch mock user (for development)
export async function getMockUser(index: number = 0): Promise<User | null> {
  if (index >= 0 && index < usersData.length) {
    return usersData[index] as User;
  }
  return null;
}
