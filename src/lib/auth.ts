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
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const userData = JSON.parse(sessionCookie.value);
    
    // If we have a userId, get full user data from mock
    if (userData.id) {
      const fullUser = usersData.find(u => u.id === userData.id);
      if (fullUser) {
        return fullUser as User;
      }
    }
    
    // Otherwise return basic user data
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
